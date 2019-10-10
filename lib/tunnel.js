const localtunnel = require('localtunnel')
const { spawn } = require('child_process')
const { exitOnError } = require('./common')

async function start ({ port, subdomain }) {
  console.log('tunnel start', port, subdomain)
  try {
    const tunnel = await localtunnel({ port, subdomain })

    console.log(`Opening tunnel on ${tunnel.url}`)

    // tunnel.on('request', (info) => console.log(info))
    tunnel.on('error', (error) => console.log(error))

    const ls = spawn('npm', ['run', 'dev'], {
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
