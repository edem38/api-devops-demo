const request = require('supertest')
const app = require('../src/app')

describe('Health endpoints', () => {
  test('GET /api/v1/health → 200', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.version).toBeDefined()
  })

  test('GET /api/v1/health/ready → 200', async () => {
    const res = await request(app).get('/api/v1/health/ready')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ready')
  })
})
