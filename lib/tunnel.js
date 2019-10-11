const localtunnel = require('localtunnel')
const { spawn } = require('child_process')
const { exitOnError, log, error } = require('./common')

async function start ({ port, subdomain, ...cmd }) {
  if (!cmd || !Object.values(cmd).length) {
    error('Missing service start command', 'egendata tunnel [flags] [command]')
    process.exit(0)
  }
  try {
    const tunnel = await localtunnel({ port, subdomain })
    log(`Opening tunnel on ${tunnel.url}`)
    tunnel.on('error', (error) => console.log(error))

    const [command, ...args] = Object.values(cmd)
    const ls = spawn(command, args, {
      env: {
        ...process.env,
        NODE_ENV: 'development',
        CLIENT_ID: tunnel.url,
        OPERATOR_URL: 'https://operator-test.dev.services.jtech.se/api',
        PORT: port
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
