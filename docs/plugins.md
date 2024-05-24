---
title: Plugins Setup Guide
summary: this document describes plugin programming, installation, and setup process.
---

On this page we provide information related to plugin development, deployment and setup:
- [What is Plugin](#what-is-plugin)  
- [Writing a Manifest File](#writing-a-manifest-file) 
- [Writing Plugin Code](#writing-plugin-code) 
- [Running a Plugin Function](#running-a-plugin-function)
- [Deploying a Plugin](#deploying-a-plugin)
- [Plugin Setup](#plugin-setup)

## What is Plugin

Plugin is a piece of software, which adds custom functionality to the server instance 
(`aqueductcore` or `aqueductpro`) without server update or restart.
One plugin may include multiple functions, connected by common settings or area of responsibility.
For example, a set of graph plotting functions, integration with a 3rd-party service, or
a collection of quantum circuit simulation methods.

Plugins may be implemented in any programming language if this language interpreter 
or binary architecture is supported by an executing machine.
Current implementation of plugins run their code at the aqueduct server machine 
(within server container, if you use containerised version). By default, `python3` and `bash` scripting  are supported.

Technically, plugins are folders with files, which follow a plugin convention.
This convention is described in the chapters below.

## Writing a Manifest File

Plugin folder may have and arbitrary name. Each plugin folder must contain a YAML file called `manifest.yml`. This file defines information about the plugin and its functions. 
Minimal example of the plugin with  two functions is given below:

```yaml
name: "Plugin name"
description: >
  This is a plugin from documentation. It supports 
  hyperlinks, e.g. https://riverlane.com
authors: ada.lovelace@gmail.com
aqueduct_url: http://localhost:8000/

# constants, common for all functions:
params:
  common_shared_key: "common value"
  common_shared_key_2: some other common value

# list of functions and their definitions
functions:
  - 
    name: example python function
    description: runs a python script
    # use "$python" here to enable  
    # virtual environment. Writing "python"
    # without "$" will use the global python 
    # interpreter.
    script: >
      $python script.py

    # arguments of the function
    parameters:
      - 
        name: string_value
        description: some string value entered in a textbox.
        data_type: str
        default_value: default string
      -
        name: experiment
        description: plugin works with the data from this experiment
        data_type: experiment
      - 
        name: input_filename
        description: file from the experiment to take as an input
        data_type: file
  - 
    name: example bash function
    description: runs a bash script
    # this may include calling other binaries or
    # running other language interpreters
    script: >
      sh example.sh
    parameters:
      -
        name: experiment
        description: plugin works with the data from this experiment
        data_type: experiment
```

Each manifest starts with a header with general plugin information (`name`, `description`,
`authors`). This information is used to generate user interface.
`aqueduct_url` mandatory parameter is used to make plugin aware about the instance of Aqueduct
it should interact with. In current implementation plugins assumed to run at the same machine 
as the server application, so this address will be a `http://localhost:8000/` or similar.

Optional `params` section allows to define key-value pairs for constants, shared across 
all plugin function executions. Good example for this may be a third party service 
credentials, or a database connection string,
which are shared among all service installation users. If your users need to use such services
with different credentials, we encourage you you define a separate function parameter for 
this purpose.

The section `functions` defines a list of function a plugin may perform. Each item starts with
name and description used to build user interface.

Then a `script` block defines a linux shell script which triggers execution of the function.
If python language is used to run a function, we recommend using `$python` placeholder: 
this will substitute an interpreter with the one from virtual environment created 
specifically for the plugin. You may add `pyproject.toml` file and/or `requirements.txt`
file which define your dependencies, and they will be installed into a python virtual environment
at the first function call.

Then there is a list of `parameters`. Each item defines input values passed to the plugin function. Each such parameter is defined with:
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
- `bool` — True or False. Passed to a plugin fuction as `0` or `1`.

Please, note, that purpose of plugins is to interact with an experiment. They may generate, process or consume the data from the experiment, that is why each plugin function must have a parameter of
`experiment` type.


## Writing Plugin Code

Plugin may be fully written inside the `script` section of the manifest. But it is convenient to 
separate its code into a dedicated file. Input values and constants are passed to this script file
using environment variables (strings). To access these strings in python this code snippet may be used:

```python
import os

aq_url = os.environ.get("aqueduct_url", "")
aq_key = os.environ.get("aqueduct_key", "")
experiment_alias = os.environ.get("experiment", "")
```

In a shell script:
```bash
echo $aqueduct_url > url.txt
ping $remote_service
```

## Running a Plugin Function

Plugin execution may be triggered in one of two ways:
1. User interface for plugins is present inside Experiment interface of web application.
2. User may call a plugin function from `pyaqueduct` client API.

Plugin execution flow in its current implementation is described below:

1. Plugin manifest is parsed and methods are loaded into memory.
2. Conditional: If inside the plugin folder python virtual environment is not present, it will be created.
   1. Conditional: If `requirements.txt` file is present, dependencies are installed in the new virtual environment.
   2. Conditional: If `pyproject.toml` file is present, folder content is installed as a python module in the new virtual environment together with its dependencies.
3. `script` section is executed. If `$python` variable is present, it is replaced with python executable of the virtual environment. Variables and constants are passed as environment variables of operating system.
4. Standard output, standard error, and process result code are written into a log file, which is saved inside the experiment.

### Plugin Development in Progress

If you update code of plugin functions, or its dependencies, delete `.aqueduct-plugin-dev/` 
subfolder to enforce virtual environment re-creation.

## Deploying a Plugin

Plugins are folders, distributed in a form or archives. At the start of the server, 
bind mount host folder to a container, it should point to `/workspace/plugins` inside a container.
Unpack a plugin folder into a host folder, and the container will immediately see the changes.

For examples, you map host folder `/usr/data/plugins` to `/workspace/plugins`, and then `/usr/data/plugins/dummy/manifest.yml` with become available inside a container as `/workspace/plugins/dummy/manifest.yml`.

## Plugin Setup

Plugin may require final adjustment after deployment. Here are potential places for these:

* In the manifest file update the `aqueduct_url` field. By default your plugin will access aqueduct
at the same machine on port `8000`, but if you decide to run server application in a different port,
or set it to use HTTPS, this should be reflected in the plugin manifest.
* `params` section, which defines constants for the whole plugin, may hold customisable string, for example, access keys or remote service URLs. Define correct values for these constants.
* Function parameters are allowed to have `select` type. If necessary, update `options` list for such fields with respect configuration needs.