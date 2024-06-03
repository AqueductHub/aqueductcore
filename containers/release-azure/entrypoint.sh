#!/bin/sh
set -e
service ssh start
exec gunicorn -w 1 -k uvicorn.workers.UvicornWorker aqueductcore.backend.main:app --bind 0.0.0.0:8000 --timeout 60
