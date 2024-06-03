FROM python:3.8-slim-buster

# expects docker build to be run from the root of the repository
COPY containers/release/entrypoint.sh ./
COPY dist ./dist
COPY frontend_build ./frontend_build
COPY sshd_config /etc/ssh/

# Start and enable SSH
RUN apt-get update && \
    apt-get install -y --no-install-recommends dialog wget \
    openssh-server && \
    rm -rf /var/lib/apt/lists/* && \
    echo "root:Docker!" | chpasswd && \
    chmod u+x ./entrypoint.sh

WORKDIR /app

RUN pip install --upgrade pip && \
    pip install --no-cache-dir $(ls dist/*.whl)

EXPOSE 8000 2222

ENTRYPOINT [ "./entrypoint.sh" ] 
