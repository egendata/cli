#!/usr/bin/env node
const { spawn, exec } = require('child_process')
const { address } = require('ip')
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

  const stack = spawn(command, args, options)

  console.log(`stack pid: ${stack.pid}`)

  stack.stdout.on('data', (data) => process.stdout.write(data))
  stack.stderr.on('data', (data) => process.stderr.write(data))
  stack.on('close', (code) => console.log(`child process exited with code ${code}`))
  stack.on('error', (err) => {
    console.error(err)
    process.exit(1)
  })
}

function stop () {
  console.log('stop')
}

function help () {
  console.log('help')
}


