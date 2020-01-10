# Egendata CLI

A simple CLI for running and developing against the egendata stack

## Prerequisites

In order to run the cli, you need to install node.js and docker-compose.

[![node.js](assets/icon_nodejs.png)](https://nodejs.org/en/download/)

[![docker](assets/icon_docker.png)](https://www.docker.com/products/docker-desktop)

## Install and run or just run

You can either install the cli as a global package and use the command `egendata`

```bash
npm install -g @egendata/cli
egendata --help
```

...or run it immediately via `npx`

```bash
npx @egendata/cli --help
```

All the examples assume the cli is installed. If you choose not to install the
cli globally, just replace `egendata` with `npx @egendata/cli`.

## Tunneling a local service

**Command:** `egendata tunnel [flags] [start command]`

This will use `localtunnel.me` to expose your service on the interwebs

```bash
egendata tunnel --port=4000 --subdomain=fooservice npm start
```

This will open a tunnel on https://fooservice.localtunnel.me pointing to
http://localhost:4000. It will also call:

```bash
NODE_ENV=development CLIENT_ID=https://fooservice.localtunnel.me OPERATOR_URL=https://operator-test.dev.services.jtech.se/api PORT=4000 npm start
```

The Operator URL is that of the test Operator which can be used with the test build of the Egendata app.

### Unsafe tunneling

...is of course not recommended but it _is_ possible. Just add the `--unsafe` flag.

## Running Egendata infrastructure locally

**Commands:**

* `egendata infra start`

  This will spin up docker containers for:
  
  * **Operator DB:** `postgres://postgresuser:postgrespasword@localhost:5432/egendata`
  
  * **Operator:** `http://[your-ip]:3000`
  
  * **Logging:** [elasticsearch apm](https://www.elastic.co/products/apm)
  viewable on `http://localhost:5601`

* `egendata infra stop`

  This stops all docker containers started by `egendata infra start`

### Flags

* `--no-log` – No logging infrastructure

* `--no-operator` – No Operator started - only Operator DB

* `--example` – Starts the CV example site on `http://[your-ip]:4000`

* `--attach` – Runs the containers attached to the terminal
