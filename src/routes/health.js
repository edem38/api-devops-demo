const express = require('express')
const router = express.Router()
const { version } = require('../../package.json')

// Liveness probe - Kubernetes vérifie que l'app est vivante
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development'
  })
})

// Readiness probe - Kubernetes vérifie que l'app est prête à recevoir du trafic
router.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  })
})

module.exports = router
