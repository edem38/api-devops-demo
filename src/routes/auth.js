const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')
const { logger } = require('../middleware/logger')

// Stockage en mémoire (en prod ce serait PostgreSQL)
const users = []

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'username, email et password sont requis'
      })
    }

    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email déjà utilisé'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    users.push(user)
    logger.info('Nouvel utilisateur créé', { userId: user.id, email })

    res.status(201).json({
      status: 'success',
      message: 'Compte créé avec succès',
      data: { id: user.id, username, email, createdAt: user.createdAt }
    })
  } catch (error) {
    logger.error('Erreur register', { error: error.message })
    res.status(500).json({ status: 'error', message: 'Erreur serveur' })
  }
})

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email et password sont requis'
      })
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    logger.info('Connexion réussie', { userId: user.id })

    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: { token, expiresIn: config.jwt.expiresIn }
    })
  } catch (error) {
    logger.error('Erreur login', { error: error.message })
    res.status(500).json({ status: 'error', message: 'Erreur serveur' })
  }
})

module.exports = router
