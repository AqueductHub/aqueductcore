FROM python:3.10-slim-buster

WORKDIR /app

# expects docker build to be run from the root of the repository
COPY containers/release-azure/entrypoint.sh ./
COPY containers/release-azure/sshd_config /etc/ssh/

COPY dist ./dist
COPY frontend_build ./frontend_build

# Start and enable SSH
RUN apt-get update && \
    apt-get install -y --no-install-recommends dialog wget \
    openssh-server && \
    rm -rf /var/lib/apt/lists/* && \
    echo "root:Docker!" | chpasswd && \
    chmod u+x ./entrypoint.sh

RUN pip install --upgrade pip && \
    pip install --no-cache-dir $(ls dist/*.whl)

EXPOSE 8000 2222

ENTRYPOINT [ "./entrypoint.sh" ] 
