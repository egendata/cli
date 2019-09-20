#!/usr/bin/env node
const { spawn, exec } = require('child_process')
const { address } = require('ip')
const cc = require('camelcase')
const argv = require('minimist')(process.argv.slice(2))

const main = argv._[0]

switch (main) {
  case 'start':
    start()
    break
  case 'stop':
    stop()
    break
  default:
    help()
    break
}

function start () {
  const command = `docker-compose`
  const args = ['up']

  if (!argv.attach) { args.push('-d') }

  const HOST_IP = address()
  const options = {
    env: { HOST_IP, ...process.env },
    stdio: 'pipe',
    cwd: __dirname,
    detached: true
  }

  const pcs = spawn(command, args, options)

  pcs.stdout.on('data', (data) => process.stdout.write(data))
  pcs.stderr.on('data', (data) => process.stderr.write(data))
  pcs.on('close', (code) => process.exit(code))
  pcs.on('error', exitOnError)
}

const rxCliContainer = /cli_/

function stop () {
  exec('docker ps', (error, stdout, stderr) => {
    exitOnError(error)

    const containers = parseDockerPs(stdout)
    const cliContainers = containers
      .filter(c => rxCliContainer.test(c.names))

    if (cliContainers.length === 0) {
      console.log('No Egendata containers running')
      process.exit(0)
    }

    
    console.log(cliContainers.map(c => 'Stopping ' + c.names).join('\n'))
    const args = ['stop'].concat(cliContainers.map(c => c.containerId))
    const options = {
      env: { ...process.env },
      stdio: 'pipe',
      cwd: __dirname,
      detached: true
    }
    const pcs = spawn('docker', args, options)

    pcs.stdout.on('data', (data) => process.stdout.write(data))
    pcs.stderr.on('data', (data) => process.stderr.write(data))
    pcs.on('close', (code) => process.exit(code))
    pcs.on('error', exitOnError)
  })
}

function help () {
  console.log('help')
}

function parseDockerPs (table) {
  const rows = table
    .split('\n')
    .map((line) =>
      line.split('  ').map(w => w.trim()).filter(w => w))
    .filter((row) => row && row.length)
    .map((row) =>
      row.map(word => word.trim())
    )
  const names = rows.shift().map((word) => cc(word))
  return rows.map((values) =>
    values.reduce((res, val, ix) => ({
      ...res,
      [names[ix]]: val
    }), {}))
}

function exitOnError (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
}
