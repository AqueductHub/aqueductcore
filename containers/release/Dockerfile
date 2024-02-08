FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ADD dist ./dist

ADD frontend_build ./frontend_build

RUN pip install --upgrade pip && \
    pip install --no-cache-dir $(ls dist/*)

CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "aqueductcore.backend.main:app", "--bind", "0.0.0.0:8000", "--timeout", "60"]
