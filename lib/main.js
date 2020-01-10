#!/usr/bin/env node
const sc = require('subcommander')
const pkg = require(`${process.cwd()}/package.json`)
const tunnel = require('./tunnel')
const infra = require('./infra')

// Create tunnel for local service
sc
  .command('tunnel', {
    desc: 'expose local egendataserver to operator\n' +
      '\tUsage: egendata tunnel [flags] [service start command]\n' +
      '\tExample: egendata tunnel --subdomain=foobar npm start\n',
    callback: (args) => tunnel.start(args)
  })
  .option('port', {
    abbr: 'p',
    description: 'local port',
    default: '4000'
  })
  .option('subdomain', {
    description: 'requested subdomain of localtunnel.me',
    default: pkg.name.replace(/[-_\@\/]/g, '')
  })
  .option('unsafe', {
    description: 'use http instead of https',
    flag: true,
    default: false
  })

// Start infrastructure for local development
sc
  .command('infra', { desc: 'manage local egendata infrastructure' })
    .command('start', {
      desc: 'start local infrastructure for egendata',
      callback: (args) => infra.start(args)
    })
    .option('no-pull', {
      desc: 'do not pull latest egendata images',
      flag: true,
      default: false
    })
    .option('no-log', {
      desc: 'start apm service for logging',
      abbr: 'l',
      flag: true
    })
    .option('no-operator', {
      desc: 'do not start operator from image',
      abbr: 'o',
      flag: true
    })
    .option('example', {
      desc: 'run example from image',
      abbr: 'e',
      flag: true
    })
    .option('attach', {
      desc: 'attach to docker-compose process',
      flag: true
    })
    .end()
    .command('stop', {
      desc: 'stop all running local egendata infrastructure',
      callback: (args) => infra.stop(args)
    })
    .end()

sc.parse()
