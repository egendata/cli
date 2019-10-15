const { spawn, exec } = require('child_process')
const { resolve } = require('path')
const { address } = require('ip')
const cc = require('camelcase')
const { exitOnError, log, error } = require('./common')

const projectname = 'egendata_infra'

function addFile (args, filename) {
  args.push('-f')
  args.push(resolve(__dirname, '../docker-compose/', `${filename}.yml`))
}

function start({ attach, 'no-operator': nooperator, example, 'no-log': nolog, 'no-pull': nopull }) {
  const command = `docker-compose`
  const args = ['-p', projectname]
  const env = {
    ...process.env,
    HOST_IP: address(),
    APM_SERVER: (nolog) ? '' : 'http://apm-server:8200',
    APM_TOKEN: (nolog) ? '' : 'abc'
  }

  if (!nolog) addFile(args, 'logging')
  addFile(args, 'operator-db')
  if (!nooperator) addFile(args, 'operator')
  if (example) addFile(args, 'example')
  if (!nopull) {
    args.push(...['pull', ' && ', command, ...args])
  }

  args.push('up')
  if (!attach) args.push('-d')

  const options = {
    env,
    stdio: 'pipe',
    detached: true,
    shell: true
  }
  
  const pcs = spawn(command, args, options)

  pcs.stdout.on('data', (data) => process.stdout.write(data))
  pcs.stderr.on('data', (data) => process.stderr.write(data))
  pcs.on('close', (code) => process.exit(code))
  pcs.on('error', exitOnError)
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

const rxCliContainer = new RegExp(`^${projectname}_`)
function stop () {
  exec('docker ps', (err, stdout, stderr) => {
    exitOnError(err)

    const containers = parseDockerPs(stdout)
    const cliContainers = containers
      .filter(c => rxCliContainer.test(c.names))

    if (cliContainers.length === 0) {
      error('No Egendata containers running')
      process.exit(0)
    }


    cliContainers
      .map(c => 'Stopping `' + c.names + '`')
      .forEach(msg => log(msg))
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
