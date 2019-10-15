const { red, blue, green, yellow, dim } = require('chalk')

function exitOnError (error) {
  if (error) {
    error(error)
    process.exit(1)
  }
}

function highlights (txt) {
  const rxUrl = /(http[s]?:\/\/[\w.\/]*)/g
  const rxParam = /`(.*)`/g
  return txt
    .replace(rxUrl, blue('$1'))
    .replace(rxParam, yellow('$1'))
}

function log (msg, example) {
  console.log([green('[egendata]'), highlights(msg)].join(' '))
  if (example) {
    console.log([green('[egendata]'), green('~$'), dim(highlights(example))].join(' '))
  }
}

function error (msg, example) {
  console.error([red('[egendata]'), highlights(msg)].join(' '))
  if (example) {
    console.error([red('[egendata]'), green('~$'), dim(highlights(example))].join(' '))
  }
}

module.exports = {
  log,
  error,
  exitOnError
}
