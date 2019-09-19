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

## Start

```bash
egendata start
```

This will spin up docker containers for the `Operator` on `http://[your-ip]:3000`

### Flags

* `--apm` – Performance and errors will be logged to **elasticsearch apm**. It can be viewed through **Kibana** on http://localhost:5601

* `--examples` – Starts the **CV** example site. It can be viewed on http://localhost:4000

* `--attach` – Runs the containers attached to the terminal

* `--pull` – Forces a pull of the latest Egendata images

## Stop

```bash
egendata stop
```

Stops all running Egendata services
