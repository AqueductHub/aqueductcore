---
title: Command Line Interface (CLI)
summary: Aqueduct CLI for importing and exporting experiments.
---

Aqueduct provides its Command Line Interface (CLI), `aqueduct`, with two main commands: `export` and `import`. These commands are used to export experiments data and files from the current Aqueduct instance into a `.tar.gz` file. This file can be later imported. This document provides a brief overview of how to use the Aqueduct CLI. For each command, it lists the usage, arguments, and options.

## Global Options

- `--help`: Show the help message and exit.

## Commands

### Export

The `export` command is used to export Aqueduct experiments' data into a GZIP compressed tar archive.

#### Usage

```sh
aqueduct export [OPTIONS] [PATH]
```

##### Arguments

- `PATH`: [Optional] File path for the exported archive. Default is `/workspace/aqueduct_data_[YYYY_MM_DD].tar.gz`.

Note:

1. If the provided file path doesn't have a `.tar.gz` suffix, a warning message will be printed, but the file will be created with gzipped compressed tarball content.

##### Options

- `--experiment-files` (`-e`): Include experiments' files in the archive.
- `--help`: Show the help message and exit.

### Import

The `import` command is used to import Aqueduct experiments' data from a GZIP compressed tar archive.

#### Usage

```sh
aqueduct import [OPTIONS] FILE
```

##### Arguments

- `FILE`: [Required] Tar file path of the archive to import. This argument is required.

##### Options

- `--help`: Show the help message and exit.

## Notes

1. Aqueduct CLI is installed alongside the web application. When using the official docker image of Aqueduct, the CLI is available inside the container and can be executed via `docker exec` command. For example:

   ```sh
   docker exec <container_name> aqueduct export [OPTIONS] [ARCHIVE_PATH]
   ```

   To download the archive from the container, you can use `docker cp` command. For example:

   ```sh
   docker cp <container_name>:[ARCHIVE_PATH] ./
   ```

   downloads the file to the current working directory.
