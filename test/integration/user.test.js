const request = require('supertest')

const app = require('../../src/server')

const { close, drop } = require('../utils/database')

describe('User', () => {
  const defaultUser = {
    name: 'Eduardo Palhares',
    email: 'eduardo@email.com',
    password: '123456'
  }

  describe('create() user', () => {
    it('should create an user with valid entries', async () => {
      const { status, body } = await request(app)
        .post('/users')
        .send(defaultUser)

      const { name, email } = defaultUser

      const defaultUserResponse = {
        name,
        email
      }

      expect(status).toBe(201)
      expect(body).toMatchObject(defaultUserResponse)
    })

    it('should response 400 with invalid entries', async () => {
      const { name, email } = defaultUser
      const { status } = await request(app)
        .post('/users')
        .send({ name, email })

      expect(status).toBe(400)
    })

    it('should should response 400 when the user already exists', async () => {
      await request(app)
        .post('/users')
        .send(defaultUser)

      const { status } = await request(app)
        .post('/users')
        .send(defaultUser)

      expect(status).toBe(400)
    })
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
