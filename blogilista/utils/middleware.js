const logger = require('./logger')
const morgan = require('morgan')

morgan.token('blog', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

const requestLogger = (morgan(':method :url :status :res[content-length] - :response-time ms :blog'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {

  logger.error(err)

  let errorMessage = err.message

  try {
    errorMessage = err.errors[Object.keys(err.errors)[0]].properties.message
  // eslint-disable-next-line no-empty
  } catch { }

  if(err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {

    if (err.message.includes('User validation failed')) {
      return res.status(400).send({ error: 'User data invalid' })
    }
    return res.status(400).send({ error: errorMessage })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}