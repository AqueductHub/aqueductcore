# WE WILL PROBABLY ALSO NEED A REDIS FOR TASK HISTORY PERSISTENCE
# https://docs.celeryq.dev/en/main/getting-started/backends-and-brokers/index.html
FROM rabbitmq:3.12

WORKDIR /celery

RUN     mkdir -p /celery/aqueductcore/backend/services
COPY    aqueductcore/backend/services/task_executor.py /celery/aqueductcore/backend/services

RUN     apt-get update

# clean installation to be smaller with --no-install-recommends
# but this may lead to a problem https://askubuntu.com/q/65081
RUN     apt-get install -y python3.10
# probably needed for pip installaton
RUN     apt-get install -y gcc
RUN     apt-get install -y python3-pip
RUN     python3 -m pip install celery==5.4.0 flower==2.0.1

EXPOSE  5555

ENV     HOST=${HOST:-host.docker.internal}

CMD     rabbitmq-server -detached ; \
            sleep 5; python3 -m celery --broker=amqp://guest:guest@${HOST}:5672// flower --port=5555 & \
            sleep 5; python3 -m celery --broker=amqp://guest:guest@${HOST}:5672// -A aqueductcore.backend.services.task_executor worker --loglevel=INFO
