const request = require('supertest')
const app = require('../src/app')

describe('Users endpoints', () => {
  let token

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'usertest', email: 'users@test.com', password: 'Test123!' })

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'users@test.com', password: 'Test123!' })

    token = res.body.data.token
  })

  test('GET /users avec token valide → 200', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('success')
    expect(res.body.data.total).toBeDefined()
  })

  test('GET /users sans token → 401', async () => {
    const res = await request(app).get('/api/v1/users')
    expect(res.statusCode).toBe(401)
  })

  test('GET /users token invalide → 403', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer tokeninvalide')
    expect(res.statusCode).toBe(403)
  })

  test('GET /users/:id inexistant → 404', async () => {
    const res = await request(app)
      .get('/api/v1/users/id-qui-nexiste-pas')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(404)
  })
})
