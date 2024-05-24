# Aqueduct

Aqueduct is the open platform that simplifies quantum experiment management.

Intuitive automation and administration features enable you to
focus on consistently running and scaling up your experiments.
Powerful APIs and a flexible plugin SDK allow you to easily
integrate with Aqueduct and streamline your workflow.

This project uses the following main software stack and technologies:

- Frontend (GUI): **React**, **TypeScript**
- Backend (Server): **Python**, **FastAPI**
- Database: **PostgreSQL**

### Table of contents

- [Usage](#usage)
- [Installation](#installation)
  - [Install AqueductCore](#Install-AqueductCore)
  - [Install PyAqueduct](#Install-PyAqueduct)
- [Developers Setup Guide](#developers-setup-guide)
- [Contributing](#contributing)
- [License](#license)

## Installation

To use Aqueduct, you need to install this repo
[aqueductcore](https://github.com/AqueductHub/aqueductcore),
and the
[pyaqueduct](https://github.com/AqueductHub/pyaqueduct) one too.

### Install AqueductCore

Aqueduct --- this repo --- is the server software that hosts the main application,
the web interface and handles data storage.

To install Aqueduct, you need to have docker and docker-compose installed on your machine.
[See here](https://docs.docker.com/compose/gettingstarted) for docker install instructions.
Ensure that docker is running on your machine.

1. Copy the below configuration to a file (call it `docker-compose.yaml`, e.g.).
   (This file also exists as `aqueductcore/scripts/release/docker-compose.yaml`.
   You can just copy it to the dir where you will work from.)

```yaml
version: "3"
services:
  aqueduct:
    image: aqueducthub/aqueductcore:latest
    restart: always
    depends_on:
      - postgres
    environment:
      EXPERIMENTS_DIR_PATH: /tmp/aqueduct_experiments
      PLUGINS_DIR_PATH: /workspace/plugins
      POSTGRES_USERNAME: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: aqueduct
    volumes:
      - /tmp/aqueduct_experiments:/tmp/aqueduct_experiments
      - type: bind
        # define your host folder with plugins
        source: /aqueductcore/plugins
        target: /workspace/plugins
    ports:
      - 80:8000

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=aqueduct
    expose:
      - 5432
```

You can find `docker-compose.yaml` file under `aqueductcore/scripts/release` directory.

2. If you now run `docker compose -f docker-compose.yaml up -d` in the directory where the file is,
   docker will use the yaml file to pull Aqueduct's docker image, set local environment variables, and
   start the server.

3. Start your browser and point it to `https://localhost`.

For more information please check the [documentation](https://aqueducthub.github.io/aqueductcore/).

#### Development Docker Images

You can find development docker images from the head of the main branch on DockerHub, `aqueducthub/aqueductcore-dev:latest`. The images are built after each commit or pull request merge to the `main` branch.

### Install PyAqueduct

[PyAqueduct](https://github.com/AqueductHub/pyaqueduct) allows easy programmatic manipulation of experiment objects.

```bash
pip install pyaqueduct
```

You can find more information about how to use PyAqueduct [here](https://aqueducthub.github.io/pyaqueduct/) in the docs.

## Developers Setup Guide

Read this section if you want to set up the project as a contributor.

0. Prerequisites

- Python (version 3.8 or higher) installed on your system
- PostgreSQL (version 15 or higher) installed and running
- Node.js (v20.11.1 or higher) installed

1. Clone the repository and change the directory into the root of the project.
2. We recommend [VSCode](https://code.visualstudio.com) as the dev environment. If you start VS Code in the repo root, it will start up dev docker container. Have a look [here](https://code.visualstudio.com/docs/devcontainers/containers#_getting-started) for more information on developing using VS Code.
3. Run the Server

   1. Navigate to the project's root folder.
   2. `poetry install`.
   3. `python scripts/start_aqueduct_core.py`.
   4. The server should be up and running on `localhost:8000`.

4. Run the GUI
   1. `cd aqueductcore/frontend`.
   2. `yarn install`.
   3. Create `.env` file under `aqueductcore/frontend` directory and add API URL.
   - For instance:
     ```
     REACT_APP_API_DEV_ORIGIN=http://0.0.0.0:8000
     ```
   4. `yarn start`.
   5. The UI should be up and running on `localhost:3000`.

You can use this script to install all the required packages:

```bash
bash scripts/install_packages.sh
```

After executing the script, proceed with the instructions from Step 3.

## Contributing

Aqueduct is an open-source project, and we greatly value all contributions. Contributions are not limited to coding; you can also help by filing issues to report bugs, enhancing our documentation, or requesting new features. We strongly recommend using the templates provided for each of these tasks. If you’re interested in contributing, please refer to our [contribution guide](/CONTRIBUTING.md) for more information. We really appreciate your consideration for contributing to Aqueduct.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file.
