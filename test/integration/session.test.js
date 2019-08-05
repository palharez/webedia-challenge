const request = require('supertest')

const app = require('../../src/server')
const factory = require('../factories')

const { close, drop } = require('../utils/database')

describe('Authentication', () => {
  it('should not authenticate with invalid password', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const { status } = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      })

    expect(status).toBe(401)
  })

  it('should not authenticate with invalid user', async () => {
    const user = await factory.create('User')

    const { status } = await request(app)
      .post('/sessions')
      .send({
        email: 'palharez@email.com',
        password: user.password
      })

    expect(status).toBe(401)
  })

  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      email: 'eduardox@email.com',
      password: '123456'
    })

    const { status } = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(status).toBe(200)
  })

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const { body } = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(body).toHaveProperty('token')
  })

  beforeAll(async () => {
    await request(app)
  })

  afterEach(async () => {
    await drop()
  })

  afterAll(async done => {
    await drop()
    await close()
    done()
  })
})
