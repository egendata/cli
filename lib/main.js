#!/usr/bin/env node
const sc = require('subcommander')
const pkg = require(`${__dirname}/../package.json`)
const tunnel = require('./tunnel')
const infra = require('./infra')

sc
  .command('tunnel', {
    desc: 'expose local egendataserver to operator',
    callback: tunnel.start
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
sc
  .command('infra', { desc: 'manage local egendata infrastructure' })
    .command('start', {
      desc: 'start local infrastructure for egendata',
      callback: infra.start
    })
    .option('attach', {
      flag: true
    })
    .end()
    .command('stop', {
      desc: 'stop all running local egendata infrastructure',
      callback: infra.stop
    })
    .end()

sc.parse()
