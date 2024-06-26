#!/bin/sh
set -e
service ssh start

# Save all environment variables to /etc/environment for later use via SSH
env | grep _ >> /etc/environment

exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker aqueductcore.backend.main:app --bind 0.0.0.0:8000 --timeout 60
