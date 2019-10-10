function exitOnError (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = {
  exitOnError
}
