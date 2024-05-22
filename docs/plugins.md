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

Plugin is a piece of software, which adds functionality to the server instance 
(`aqueductcore` or `aqueductpro`) without server update or restart.
One plugin may include multiple functions, connected by presets and area of responsibility.
For example, a set of graph plotting functions, integration with a 3rd-party service, or
a collection of quantum circuit simulation methods.

Plugins may be implemented in any language if this language or binary architecture is supported
by an executing machine.
Current implementation of plugins run their code at the aqueduct server machine 
(within container, if you use containerised version). By default `python3` and `bash` scripting 
are supported.

From the technical point of view, plugins are folders with files, which follow a plugin convenition.
This convention is described in the chapters below.

## Writing a Manifest File

Each plugin folder must contain a YAML file `manifest.yml`. This file defines information about the plugin 
and its functions. Minimal example of the plugin with two functions is given below:

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

# list of fuctions and their definitions
functions:
  - 
    name: example python function
    description: runs a python script
    # we use "$python" here to enable usage of 
    # virtual environments. Writing "python"
    # without "$" will use the global python interpreter.
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
dedicate it's code into a separate file. Input values and constants are passed to this script file
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


## Deploying a Plugin


## Plugin Setup