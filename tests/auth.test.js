const request = require('supertest')
const app = require('../src/app')

describe('Auth endpoints', () => {
  test('POST /register → 201', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'testuser', email: 'test@test.com', password: 'Test123!' })
    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBe('success')
    expect(res.body.data.id).toBeDefined()
  })

  test('POST /register champs manquants → 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@test.com' })
    expect(res.statusCode).toBe(400)
  })

  test('POST /login → 200 + token', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'loginuser', email: 'login@test.com', password: 'Test123!' })

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'Test123!' })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })

  test('POST /login mauvais password → 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'mauvais' })
    expect(res.statusCode).toBe(401)
  })

  test('GET /users sans token → 401', async () => {
    const res = await request(app).get('/api/v1/users')
    expect(res.statusCode).toBe(401)
  })
})
