const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { logger } = require('../middleware/logger')

// Stockage en mémoire partagé avec auth.js
const getUsers = () => require('./auth').users || []

// GET /api/v1/users — protégé JWT
router.get('/', authenticateToken, (req, res) => {
  try {
    const users = getUsers()
    const safeUsers = users.map(({ password, ...user }) => user)

    logger.info('Liste users consultée', { requestedBy: req.user.email })

    res.status(200).json({
      status: 'success',
      data: {
        total: safeUsers.length,
        users: safeUsers
      }
    })
  } catch (error) {
    logger.error('Erreur get users', { error: error.message })
    res.status(500).json({ status: 'error', message: 'Erreur serveur' })
  }
})

// GET /api/v1/users/:id — protégé JWT
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const users = getUsers()
    const user = users.find(u => u.id === req.params.id)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé'
      })
    }

    const { password, ...safeUser } = user

    res.status(200).json({
      status: 'success',
      data: safeUser
    })
  } catch (error) {
    logger.error('Erreur get user', { error: error.message })
    res.status(500).json({ status: 'error', message: 'Erreur serveur' })
  }
})

module.exports = router
