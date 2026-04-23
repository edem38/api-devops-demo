const jwt = require('jsonwebtoken')
const config = require('../config')
const { logger } = require('./logger')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token manquant'
    })
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      logger.warn('Token invalide', { error: err.message })
      return res.status(403).json({
        status: 'error',
        message: 'Token invalide ou expiré'
      })
    }
    req.user = user
    next()
  })
}

module.exports = { authenticateToken }
