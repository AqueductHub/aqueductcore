---
title: Extensions Setup Guide
summary: this document describes extension programming, installation, and setup process.
---

On this page we provide information related to extension development, deployment and setup:
- [What is Extension](#what-is-extension)  
- [Writing a Manifest File](#writing-a-manifest-file) 
- [Writing Extension Code](#writing-extension-code) 
- [Running an Extension Action](#running-an-extension-action)
- [Deploying an Extension](#deploying-an-extension)
- [Extension Setup](#extension-setup)

## What is Extension

Extension is a piece of software, which adds custom functionality to the server instance 
(`aqueductcore` or `aqueductpro`) without server update or restart.
One extension may include multiple actions, connected by common settings or area of responsibility.
For example, a set of graph plotting actions, integration with a 3rd-party service, or
a collection of quantum circuit simulation methods.

Extensions may be implemented in any programming language if this language interpreter 
or binary architecture is supported by the executing (virtual) machine.
In the current implementation of extensions, their code is run on the Aqueduct server machine 
(within server container, if you use containerised version). By default, `python3` and `bash` scripting  are supported.

Technically, extensions are folders with files which follow an extension convention.
This convention is described in the chapters below.

## Writing a Manifest File

Extension folder may have and arbitrary name. Each extension folder must contain a YAML file called `manifest.yml`. This file defines information about the extension and its actions. 
Minimal example of the extension with  two actions is given below:

```yaml
name: "Extension name"
description: >
  This is an extension from documentation. It supports 
  hyperlinks, e.g. https://riverlane.com
authors: ada.lovelace@gmail.com
aqueduct_url: http://localhost:8000/

# constants, common for all actions:
constants:
  common_shared_key: "common value"
  common_shared_key_2: some other common value

# list of actions and their definitions
actions:
  - 
    name: example python action
    description: runs a python script
    # use "$python" here to enable  
    # virtual environment. Writing "python"
    # without "$" will use the global python 
    # interpreter.
    script: >
      $python script.py

    # arguments of the action
    parameters:
      - 
        name: string_value
        description: some string value entered in a textbox.
        data_type: str
        default_value: default string
      -
        name: experiment
        description: extension works with the data from this experiment
        data_type: experiment
      - 
        name: input_filename
        description: file from the experiment to take as an input
        data_type: file
      - 
        name: output_filename
        description: file which will be created inside experiment
        data_type: str
  - 
    name: example bash action
    description: runs a bash script
    # this may include calling other binaries or
    # running other language interpreters
    script: >
      sh example.sh
    parameters:
      - 
        name: string_value
        description: some string value entered in a textbox.
        data_type: str
        default_value: default string
      -
        name: experiment
        description: extension works with the data from this experiment
        data_type: experiment
      - 
        name: input_filename
        description: file from the experiment to take as an input
        data_type: file
      - 
        name: output_filename
        description: file which will be created inside experiment
        data_type: str
```

Each manifest starts with a header with general extension information 
(`name`, `description`, `authors`). This information is used to generate 
the user interface. The `aqueduct_url` mandatory parameter is used to make 
the extension aware of the instance of Aqueduct it should interact with. 
In the current implementation, extensions are assumed to run on the same machine 
as the server application, so this address will be a `http://localhost:8000/` or similar.

Optional `params` section allows the definition key-value pairs for constants shared across
all extension action executions.  Examples of this may include third-party service credentials,
or a database connection string, which are shared among all service installation users.
If your users need to use such services with different credentials, we encourage you to
define a separate action parameter for this purpose.

The section `actions` defines a list of action an extension may perform. Each item starts with
name and description used to build user interface.

Then a `script` block defines a linux shell script which triggers execution of the action.
If python language is used to run an action, we recommend using `$python` placeholder: 
this will substitute an interpreter with the one from virtual environment created 
specifically for the extension. You may add `pyproject.toml` file and/or `requirements.txt`
file which define your dependencies, and they will be installed into a python virtual environment
at the first action call.

Then there is a list of `parameters`. Each item defines input values passed to the extension action. Each such parameter is defined with:
```yaml
      - 
        name: parameter_name
        description: text, used in the interface to explain the value
        # one of str|textarea|file|experiment|int|float|select|bool
        data_type: str
        # optional
        default_value: optional field, populates the field by default
        # optional, used with "select" type
        options: value 1, value 2, value 3, value 4
```

### Data Types

- `str` and `textarea` — arbitrary strings.
- `experiment` — string with an experiment ID (EID).
- `file` — string with a file name inside and experiment.
- `select` — string, one of the listed options.
- `float`, `int` — numerical types.
- `bool` — True or False. Passed to an extension fuction as `0` or `1`.

Please, note, that purpose of extensions is to interact with an experiment. They may generate, process or consume the data from the experiment, that is why each extension action must have a parameter of
`experiment` type.


## Writing Extension Code

Extension may be fully written inside the `script` section of the manifest. But it is convenient to 
separate its code into a dedicated file. Input values and constants are passed to this script file
using environment variables (strings). To access these strings in python this code snippet 
may be used:

```python
import os
from tempfile import TemporaryDirectory
from pyaqueduct import API

aq_url = os.environ.get("aqueduct_url", "")
value = os.environ.get("input_value", "")
input_file = os.environ.get("input_filename", "")
output_file = os.environ.get("output_filename", "")
experiment_id = os.environ.get("experiment", "")

api = API(aq_url)
api.get_experiment(experiment_id)
with TemporaryDirectory() as directory:
    experiment.download_file(
      file_name=input_file, 
      destination_dir=directory
    )
    ...
    filename = f"{directory}/{output_file}"
    with open(filename, "w") as file:
      file.write(value)
    experiment.upload_file(filename)
```

In a shell script:
```bash
# this will printed and reported into the log file
cat $input_filename | sort
# printing a variable
echo $string_value
curl "$aqueduct_url/aqd/experiments/$experiment"
...
```

## Running an Extension Action

Extension execution may be triggered in one of two ways:
1. User interface for extensions is present inside Experiment interface of web application.
2. User may call an extension action from `pyaqueduct` client API.

Extension execution flow in its current implementation is described below:

1. Extension manifest is parsed and methods are loaded into memory.
2. Conditional: If inside the extension folder python virtual environment is not present, it will be created.
   1. Conditional: If `requirements.txt` file is present, dependencies are installed in the new virtual environment.
   2. Conditional: If `pyproject.toml` file is present, folder content is installed as a python module in the new virtual environment together with its dependencies.
3. `script` section is executed. If `$python` variable is present, it is replaced with python executable of the virtual environment. Variables and constants are passed as environment variables of operating system.
4. Standard output, standard error, and process result code are written into a log file, which is saved inside the experiment.

### Extension Development in Progress

If you update code of extension actions, or its dependencies, delete `.aqueduct-extension-dev/` 
subfolder to force virtual environment re-creation.

## Deploying an Extension

Extensions are folders which could be distributed in the form of archives. When starting the server using Docker, 
bind mount a host folder to the Aqueduct container at `/workspace/extensions`.
Unpack an extension folder into the host folder, and the container will immediately see the changes.

For example, if you map host folder `/usr/data/extensions` to `/workspace/extensions`, 
then `/usr/data/extensions/dummy/manifest.yml` within will become available inside the container as `/workspace/extensions/dummy/manifest.yml`.

## Extension Setup

Extension may require final adjustment after deployment. Here are potential places for these:

* In the manifest file update the `aqueduct_url` field. By default your extension will access aqueduct
at the same machine on port `8000`, but if you decide to run server application in a different port,
or set it to use HTTPS, this should be reflected in the extension manifest.
* `constants` section, which defines constants for the whole extension, may hold customisable string, for example, access keys or remote service URLs. Define correct values for these constants.
* Action parameters are allowed to have `select` type. If necessary, update `options` list for such fields with respect to your configuration needs.