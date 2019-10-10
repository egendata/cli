const { spawn, exec } = require('child_process')
const { address } = require('ip')
const cc = require('camelcase')
const { exitOnError } = require('./common')

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

const rxCliContainer = /cli_/
function start ({ attach }) {
  const command = `docker-compose`
  const args = ['up']

  if (!attach) { args.push('-d') }

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

module.exports = {
  start,
  stop
}
