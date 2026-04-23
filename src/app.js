const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const config = require('./config')
const { requestLogger, logger } = require('./middleware/logger')

const healthRoutes = require('./routes/health')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')

const app = express()

// Sécurité
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Rate limiting — 100 requêtes par 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'Trop de requêtes, réessaie plus tard' }
})
app.use(limiter)

// Routes
app.use(`${config.api.prefix}/health`, healthRoutes)
app.use(`${config.api.prefix}/auth`, authRoutes)
app.use(`${config.api.prefix}/users`, usersRoutes)

// Route 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} introuvable`
  })
})

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée', { error: err.message })
  res.status(500).json({ status: 'error', message: 'Erreur interne serveur' })
})

// Démarrage
if (require.main === module) {
  app.listen(config.port, () => {
    logger.info(`API démarrée`, {
      port: config.port,
      env: config.nodeEnv,
      version: require('../package.json').version
    })
  })
}

module.exports = app
