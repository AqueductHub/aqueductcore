# Aqueduct

Aqueduct is a versatile experiment management system designed to streamline and simplify quantum system administration.
We are building Aqueduct to be a user-friendly, reliable, and well-supported solution for quantum experiment management. While quantum computing labs and companies focus on building better qubits, Aqueduct is here to assist with the bring-up, automation, maintenance, and operation of quantum computers.

This project uses the following main software stack and technologies:
- Frontend (GUI): **React**, **TypeScript**
- Backend (Server): **Python**, **FastAPI**
- Database: **PostgreSQL**

### Table of contents

- [Usage](#usage)
- [Installation](#installation)
  * [Developers Setup Guide](#developers-setup-guide)
  * [PyAqueduct](#pyaqueduct)
  * [Database Migration Guide](#database-migration-guide)
    + [Steps](#steps)
- [Contributing](#contributing)
- [License](#license)

## Usage

Aqueduct contains data management tools that augment a lab’s existing data storage systems by tracking critical settings, raw data and processed data from experiments, keeping them organised and readily accessible. Through convenient features such as tagging, favouriting, archiving, and annotation of experimental data, we facilitate a smoother data workflow for all labs. Aqueduct’s software APIs make it possible to retrofit existing experiment scripts so that all the lab’s data can be saved and accessed in a single, centralized location.

This functionality is facilitated through 2 components:
- [aqueductcore](/aqueductcore) is the server software that hosts the main application, and web interface and handles data storage.
- [pyaqueduct](/pyaqueduct) is our Python Library which allows easy creation of experiments and upload of data and metadata for them.
  

## Installation

If you want to set up the project as a contributor, please continue to [this section](#setup-guide).

To install Aqueduct, you need to have docker and docker-compose installed on your machine, please [see here](https://docs.docker.com/compose/gettingstarted) for docker install instructions.

Then all you need to do is
1) Copy the below configuration in a file, you can name it `docker-compose.yaml`, and it will pull the docker image and set the environment variables.

```yaml
version: '3'
services:
  aqueduct:
    image: aqueductcore/release:latest
    restart: always
    depends_on:
      - postgres
    environment:
      EXPERIMENTS_DIR_PATH: /tmp/aqueduct_experiments
      POSTGRES_USERNAME: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: aqueduct
    volumes:
      - /tmp/aqueduct_experiments:/tmp/aqueduct_experiments
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
2) Then you can make it up and running: `docker compose -f docker-compose.yaml up -d`
3) Check the GUI on your browser using `localhost`.

You can find `docker-compose.yaml` file under `aqueductcore/scripts/release` directory. for more information please check the [documentation](https://black-sand-0b0e2a903.3.azurestaticapps.net/main/setup).

### Developers Setup Guide
0. Prerequisites
- Python installed on your system (version 3.8 or higher)
- PostgreSQL installed and running (version 15 or higher)
- Node.js installed (v16.16 or higher)

1. Clone the repository and change the directory into the root of the project.
2. Open the project (Optional: but in recommended Environment)
   1. If you're using [VSCode](https://code.visualstudio.com), which is recommended to use, you can open up the project in the VSCode dev container, if you're not familiar with what that is, just have a look [here](https://code.visualstudio.com/docs/devcontainers/containers#_getting-started).
3. Run the Server
    1. Navigate to the project's root folder.
    2. `poetry install`.
    3. `python scripts/start_ecs_service.py`.
    4. It's up and running on `localhost:8000`.
  
4. Run the GUI
    1. `cd aqueductcore/frontend`.
    2. `yarn install`.
    3. `yarn start`.
    4. It's up and running on `localhost:3000`.

Also to install all required packages this script can be used

```bash
bash scripts/install_packages.sh
```

After executing the script, proceed with the instructions from Step 3.
    
### PyAqueduct

Although [PyAqueduct](https://github.com/AqueductHub/pyaqueduct) ---the Python Library--- is a separate project, you need to have that installed to pipe your experiment data in the system, as the GUI doesn't support experiment data upload but will do soon. You can find more information about how to use it [here](https://black-sand-0b0e2a903.3.azurestaticapps.net/main/getting-started) in the docs.

```bash
pip install pyaqueduct
```

### Database Migration Guide
After any change to the structure of the relations of the database, a new migration script should be created using Alembic. This script will be used as the reference for external users to upgrade their database after updating their version of Aqueduct.

#### Steps
The following steps should be followed in the Python environment configured for Aqueduct:

> **NOTE:**  Always assume the database is populated with existing data!

1. Make sure the environment variables with the database connection details are loaded into the environment.

2. Make sure the database is up to date with the head of changes. (If it is not this step tries to run the migration one by one):

    ```sh
    alembic upgrade head
    ```

3. Create a new revision (Don't forget to update the message)

    ```sh
    alembic revision --autogenerate -m "PLACE HOLDER FOR MESSAGE"
    ```

4. Open the generated migration script under `alembic/versions` and adjust it accordingly by implementing the upgrade function with Alembic operations. `downgrade` function could be left untouched as we don't support downgrade at this time.

5. Update the database with a head of changes. Alemtic automatically picks up the new migration script and executes it.

    ```sh
    alembic upgrade head
    ```

## Contributing

Aqueduct is an open-source project, and we greatly value all contributions. Contributions are not limited to coding; you can also help by filing issues to report bugs, enhancing our documentation, or requesting new features. We strongly recommend using the templates provided for each of these tasks. If you’re interested in contributing, please refer to our [contribution guide](/CONTRIBUTING.md) for more information. We really appreciate your consideration for contributing to Aqueduct.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file.