# Database Migration Guide

After any change to the structure of the relations of the database, a new migration script should be created using Alembic. This script will be used as the reference for external users to upgrade their database after updating their version of Aqueduct.

## Steps

The following steps should be followed in the Python environment configured for Aqueduct:

> **NOTE:** Always assume the database is populated with existing data!

1. Make sure the environment variables with the database connection details are loaded into the environment. If you are using Azure instance, you will additionally need to make sure it's using the same environment variables to be connected to the database on Azure, as that's in the current state and does not require changes, but to make sure about that, we need to do the next step check.

These are the variables that you need to change:
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`

2. As an initial check, make sure the database is up to date with the head of changes. (If it is not, this step tries to run the migration one by one):

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

