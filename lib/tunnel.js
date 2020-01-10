const localtunnel = require('localtunnel')
const { spawn } = require('child_process')
const { exitOnError, log, error } = require('./common')

async function start ({ port, subdomain, unsafe, ...cmd }) {
  if (!cmd || !Object.values(cmd).length) {
    error('Missing service start command', 'egendata tunnel [flags] [command]')
    process.exit(0)
  }
  try {
    const config = { port, subdomain }
    if (unsafe) {
      config.host = 'http://localtunnel.me'
      config.allow_invalid_cert = true
    }
    const tunnel = await localtunnel(config)
    if (unsafe) {
      tunnel.url = tunnel.url.replace('https://', 'http://')
    }
    log(`Opening tunnel on ${tunnel.url}`)
    tunnel.on('error', (error) => console.log(error))

    const [command, ...args] = Object.values(cmd)
    const env = {
      NODE_ENV: 'development',
      CLIENT_ID: tunnel.url,
      OPERATOR_URL: 'https://operator-test.dev.services.jtech.se',
      PORT: port
    }
    const spawnCommand = Object
      .entries(env)
      .map(([prop, val]) => `${prop}=${val}`)
      .concat([command])
      .concat(args)
      .join(' ')
    log(spawnCommand)
    const ls = spawn(command, args, {
      env: {
        ...process.env,
        ...env
      },
      stdio: 'pipe'
    })
    ls.stdout.on('data', (data) => process.stdout.write(data))
    ls.stderr.on('data', (data) => process.stderr.write(data))
    ls.on('error', exitOnError)
    ls.on('close', () => process.stdout.write('\n'))
  } catch (error) {
    exitOnError(error)
  }
}

module.exports = {
  start
}
