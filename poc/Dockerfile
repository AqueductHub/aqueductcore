# WE WILL PROBABLY ALSO NEED A REDIS FOR TASK HISTORY PERSISTENCE
# https://docs.celeryq.dev/en/main/getting-started/backends-and-brokers/index.html
FROM rabbitmq:latest

WORKDIR /celery

COPY tasks.py .

RUN     apt-get update

# clean installation to be smaller with --no-install-recommends
# but this may lead to a problem https://askubuntu.com/q/65081
RUN     apt-get install -y python3.10
# probably needed for pip installaton
RUN     apt-get install -y gcc
RUN     apt-get install -y python3-pip
RUN     python3 -m pip install celery==5.4.0 flower==2.0.1

EXPOSE  5555

CMD     rabbitmq-server & \
            python3 -m celery --broker=amqp://guest:guest@localhost:5672// -A tasks worker --loglevel=INFO & \
            python3 -m celery --broker=amqp://guest:guest@localhost:5672// flower --port=5555