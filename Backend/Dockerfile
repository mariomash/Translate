FROM python:3.9-slim

ENV PYTHONUNBUFFERED 1

EXPOSE 8000
WORKDIR /backend

RUN apt-get update && \
    apt-get install -y --no-install-recommends netcat && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY poetry.lock pyproject.toml ./
RUN pip install poetry==1.1 && \
    poetry config virtualenvs.in-project true && \
    poetry install --no-dev

COPY . ./

# CMD poetry run uvicorn --host=0.0.0.0 backend.main:app --ssl-keyfile=./localhost+2-key.pem --ssl-certfile=./localhost+2.pem

CMD poetry run uvicorn --host=0.0.0.0 backend.main:app