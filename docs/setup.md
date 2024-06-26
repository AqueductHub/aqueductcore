---
title: Setup Guide
summary: Aqueduct setup guide.
---

On this page we provide instructions for two ways to set up Aqueduct:
- [Using Production Docker Images](#using-production-docker-images)  
- [Installing from Source](#installing-from-source)  

## Using Production Docker Images
For the ease of deployment in production, Aqueduct is released as a production-ready container image. The docker image is available through Dockerhub, [`aqueducthub/aqueductcore`](https://hub.docker.com/r/aqueducthub/aqueductcore).

This example Docker compose `compose.yaml` file shows how you can use the Docker images:

```yaml
version: '3'
services:
  aqueduct:
    image: aqueducthub/aqueductcore:latest
    platform: linux/amd64
    restart: always
    depends_on:
      - postgres
    environment:
      EXPERIMENTS_DIR_PATH: /tmp/aqueduct_experiments
      EXTENSIONS_DIR_PATH: /workspace/external/extensions
      POSTGRES_USERNAME: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: aqueduct
    volumes:
      - /tmp/aqueduct_experiments:/tmp/aqueduct_experiments
      - type: bind
        # host folder for extensions
        source: /tmp/extensions
        target: /workspace/external/extensions
    ports:
      - 80:8000

  postgres:
    image: postgres:15-alpine
    platform: linux/amd64
    restart: unless-stopped
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=aqueduct
    expose:
      - 5432
    volumes:
      - /tmp/postgres_data:/var/lib/postgresql/data

```

In this example, the Aqueduct server will be running at [http://localhost](http://localhost). Please take care
of the following settings:

- `volumes` sections of both services point to source directories on your host operation system (before `:`). Please
  change these names if necessary.
- `ports` setting of the `aqueduct` service specifies the port of your host operating system (80), which will be
  occupied by the web interface. This port might be already in use, so you may want to change this number.
- in `aqueduct` service, extensions directory is bind-mounted to the container. Unlike volumes, this folder
  should exist before container is started.

To start a service, you may run:

```bash
# create extensions dir
mkdir -p /tmp/extensions
# run service containers, detach from terminal
docker compose -f compose.yaml up -d
```


!!! note
    
    If you are provided with a tar file to install Aqueduct, it already includes the docker image and related configurations. Please refer to the README.md file for further information.

### When this option works best

This installation method is useful if you are familiar with Docker containers and Docker compose. It allows you to run Aqueduct components in isolation from other software running on the same physical or virtual machine with easy maintenance of dependencies.

### Intended users

- Users who are familiar with containers and Docker, and understand how to build their own container images.
- Users who know how to create deployments using Docker by linking together multiple Docker containers and maintaining such deployments.
- Users who understand how to install providers and dependencies from PyPI with constraints, if they want to extend or customise the image.

### What are you expected to handle

- You are responsible for setting up database, creating and managing database schema with Aqueduct database commands, automated startup and recovery, maintenance, cleanup and upgrades of Aqueduct.
- You should choose the right deployment mechanism. There a number of available options of deployments of containers. You can use your own custom mechanism, custom Kubernetes deployments, custom Docker Compose, custom Helm charts etc., and you should choose it based on your experience and expectations.
- You need to setup monitoring of your system allowing you to observe resources and react to problems.
- You are expected to configure and manage appropriate resources for the installation (memory, CPU, etc) based on the monitoring of your installation and feedback loop.

## Installing from Source

1. Pre-requisites
    - Python installed on your system (version 3.8 or higher)
    - PostgreSQL installed and running
2. Clone the Repository
Clone the repository of your Python web application from the source repository using git or download the source code.

    ```sh
    git clone <repository_url>
    cd <project_directory>
    ```

3. Set up Virtual Environment (Optional but recommended)

    ```sh
    # Install virtualenv if you haven't already
    pip install virtualenv

    # Create a virtual environment (replace 'env_name' with your preferred name)
    virtualenv env_name

    source env_name/bin/activate
    ```

4. Install Aqueduct
    ```sh
    pip install <project_directory>
    ```

5. Set Environment Variables
Before running the application, you need to set the required environment variables. These variables are essential for connecting to the PostgreSQL database and other functionalities.

    ```sh
    # Set the required environment variables (replace with your actual values)
    export EXPERIMENTS_DIR_PATH=<your_experiment_directory_path>
    export POSTGRES_USERNAME=<your_postgres_username>
    export POSTGRES_PASSWORD=<your_postgres_password>
    export POSTGRES_HOST=<your_postgres_host>
    export POSTGRES_PORT=<your_postgres_port>
    export POSTGRES_DB=<your_postgres_database_name>
    export EXTENSIONS_DIR_PATH=<your_extensions_directory_path>
    ```

6. Configure PostgreSQL: Ensure that your PostgreSQL database is properly configured and accessible with the provided credentials.

7. Run the Application: Run the Python web application using the following command:
    ```sh
    python app.py
    ```
This command might differ based on how your application is structured and what file initializes your web server.

8. Access the Application: Once the application is running, open a web browser and navigate to http://localhost:<port_number> to access the application. Replace <port_number> with the port specified in your application setup.

## Additional Notes:
- Ensure the PostgreSQL server is running before starting the application.
- Make sure to keep sensitive information like passwords and usernames secure. Avoid hardcoding them in your code.
- Double-check the correctness of the environment variable values to avoid connection issues with the PostgreSQL database.
