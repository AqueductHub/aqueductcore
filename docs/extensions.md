---
title: Extensions Setup Guide
summary: this document describes extension programming, installation, and setup process.
---

On this page we provide information related to extension development, deployment and setup:

- [What is an Extension](#what-is-an-extension)
- [Writing an Extension](#writing-an-extension)
- [Writing a Manifest File](#writing-a-manifest-file)
- [Deploying an Extension](#deploying-an-extension)
- [Extension Setup](#extension-setup)

## What is an Extension

Extension is a piece of software, which adds custom functionality to the server instance 
(`aqueductcore` or `aqueductpro`) without server update or restart.
One extension may include multiple actions, connected by common settings or area of responsibility.
For example, a set of graph plotting actions, integration with a 3rd-party service, or
a collection of quantum circuit simulation methods.

Extensions may be implemented in any programming language if this language interpreter 
or binary architecture is supported by the executing (virtual) environment.
In the current implementation of extensions, their code is run on the Aqueduct server machine 
(within server container, if you use containerised version). By default, `python3.10` and `bash` scripting  are supported.

Extension execution may be triggered in one of two ways:

1. Dropdown for extension choice is present inside the Experiment interface of the web application.
2. User may call an extension action from `pyaqueduct` client API.

### What is an Extension Technically

Technically, extensions are directories with files which follow an extension convention.
This convention is described in the chapters below.

When server executes an extension action, the following steps are followed:

1. Server application (`aqueductcore` or `aqueductpro`) checks the correctness of the extension definition (see chapter on [Writing a Manifest File](#writing-a-manifest-file)).
2. Then it checks the existence of the python virtual environment inside the extension's directory. If there is no virtual environment inside, it gets created and the extension's dependencies are installed. You may control which packages are installed by adding `requirements.txt` and/or `pyproject.toml` files to the extension's directory. These dependencies are shared by all actions of the extension and installed once.
3. Based on the manifest file and user input, parameters and constants are initialised as environment variables.
4. `script` section of the action definition is executed. This may call arbitrary code: scripts or programs located in the directory. If `$python` variable is used inside this section, it is replaced with the python executable of the virtual environment. Read more about writing the code in [Writing an Extension](#writing-an-extension) section. We expect that these programs read the data and persist the results inside the aqueduct experiment.
5. Execution output (standard input stream, standard error stream, process result code) is recorded in a log file which gets saved alongside the experiment's files.

## Writing an Extension

Extension may be fully written inside the `script` section of the manifest. But it is convenient to 
separate its code into a dedicated file. Input values and constants are passed to this script file
using environment variables (strings).
To access these strings in python this code snippet may be used:

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

In a shell script variables start with `$` sign:
```bash
# this will be printed to standard output 
# and saved in the log file of the experiment
cat $input_filename | sort
# printing a variable
echo $string_value
curl "$aqueduct_url/aqd/experiments/$experiment"
...
```

### Writing and Debugging a New Python Extension

Start it simple. First, create three files on your local files system where `python` is installed, not necessarily the same machine as Aqueduct server.

1. An extension action script, e.g. `action.py` with the following content:
    ```python
    import os
    import requests


    if __name__ == "__main__":
        aqueduct_url = os.environ.get("aqueduct_url", "")
        aqueduct_key = os.environ.get("aqueduct_key", "")
        var = os.environ.get("varname", "")
        print(f"varname = {var}")
        response = requests.get(aqueduct_url + "api/graphql", timeout=3)
        print(f"URL: {aqueduct_url}, ok: {response.ok}")
    ```
2. A `requirements.txt` file, where you will collect your dependencies:
    ```
    requests>=2.0.0
    ```
3. A `test.sh` with the following content:
    ```sh
    venv=.aqueduct-extension-dev
    # recreate and populate a clean virtual env
    # comment these 3 lines if requirements are stable
    rm -r $venv
    python -m venv $venv
    $venv/bin/pip install -r requirements.txt

    export aqueduct_url="http://localhost:8000/"
    export aqueduct_key=""
    # TODO: add your parameters and constants below
    export varname=123

    # run
    $venv/bin/python action.py
    echo "Result code: $?"
    ```

Now, you may run and test your extension action as `sh test.sh`. Do changes of variables and constants by adding them to the `test.sh` file, and reading them with `os.environ.get("name", "")` in python.

If you update code of extension actions, or its dependencies, deleting `.aqueduct-extension-dev/` 
will force virtual environment re-creation. If your dependencies are already stable, you may keep virtual environment directory to accelerate test runs.

After you have finished development of the extension action code, copy `action.py` and `requirements.txt` files to the extension directory, and add `$python action.py` line to the `script` section in you manifest file (see details in [Writing a Manifest File](#writing-a-manifest-file) section). Then transfer constants and variables from `test.sh` to corresponding sections of `manifest.yml`. Note, that `aqueduct_url` string
is always defined in the header of the file and shared among the actions. `aqueduct_key` variables is set by the Aqueduct server, you don't have to specify it.

## Writing a Manifest File

After development is finished, you may prepare your new extension for deployment. First, create a directory for it.
Extension directory may have and arbitrary name.
Each extension directory must contain a YAML file called `manifest.yml`.
This file defines information about the extension and its actions. 
The example of the extension with two actions is given below:

```yaml
name: "Extension name"
description: >
  This is an extension from documentation.
  Its descriptions supports 
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
        description: some string value entered in a textbox
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
    # running other language interpreters.
    # Note, we use `sh` here to run a shell script.
    # If you want to call it as `./example.sh`, you
    # should give the file rights to execute: 
    # `chmod +x example.sh`.
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
as the server application, so this address will be a `http://localhost:8000/` or similar. Port `8000` is the default port in the container that the Aqueduct server listens to.

Optional `constants` section allows to define key-value pairs for constants shared across
all extension action executions.
Examples of this may include third-party service credentials,
or a database connection string, which are shared among all service installation users.
If users need to use such services with different credentials, we encourage you to
define a separate action parameter for this purpose.

The `actions` section defines a list of actions an extension may perform.
Each item starts with a name and a description used to build user interface.

Then a `script` block defines a linux shell script which triggers execution of the action.
If python language is used to run an action, we recommend using `$python` placeholder: 
this will substitute an interpreter with the one from virtual environment created 
specifically for this extension. You may add `pyproject.toml` file and/or `requirements.txt`
file to define your dependencies, 
and they will be installed into a python virtual environment at the first action call.

Then there is a list of `parameters`. Each item defines input values passed to the extension action. Each such parameter is defined with:


| name          | type   |  comment  |
| -----         | ------ | --------- |
| `name`        | text   | parameter name |
| `description` | text   | used in the interface to explain the value |
| `data_type`   | {`str`, `textarea`, `file`, <br/> `experiment`, `int`, `float`, <br/> `select`, `bool`} | one of supported data types |
| `default_value` (optional) | of `data_type` | default value, populates the interface field by default |
| `options` (optional) | `array` | collection of optiions. Used with `select` data type

### Data Types

Here is the list of available data types:

| type               | values |
| ----               | -------------- |
| `str`, `textarea`  | arbitrary string |
| `experiment`       | string with an experiment ID (EID) | 
| `file`             | string with a file name inside and experiment |
| `select`           | string, one of the listed options |
| `float`, `int`     | numerical types |
| `bool`             | True or False. Passed to an extension action as 0 or 1 |

Please, note, that purpose of extensions is to interact with an experiment. They may generate, process or consume the data from the experiment, that is why each extension action MUST have at least one parameter of `experiment` type.

## Deploying an Extension

Extensions are directories which could be distributed in the form of archives. When starting the server using Docker, 
bind mount a host directory to the Aqueduct container. Suggested location is `/workspace/external/extensions`. This location should be provided in `EXTENSIONS_DIR_PATH` environment variable.
Unpack an extension directory into the host directory, and the container will immediately see the changes.

For example, if you map host directory `/usr/data/extensions` to `/workspace/external/extensions`, 
then `/usr/data/extensions/dummy/manifest.yml` within will become available inside the container as `/workspace/external/extensions/dummy/manifest.yml`.

## Extension Setup

Extension may require final adjustment after deployment. Here are potential places for these:

* In the manifest file update the `aqueduct_url` field. By default your extension will access aqueduct
at the same machine on port `8000`, but if you decide to run server application in a different port,
or set it to use HTTPS, this should be reflected in the extension manifest.
* `constants` section, which defines constants for the whole extension, may hold customisable string, for example, access keys or remote service URLs. Define correct values for these constants.
* Action parameters are allowed to have `select` type. If necessary, update `options` list for such fields with respect to your configuration needs.