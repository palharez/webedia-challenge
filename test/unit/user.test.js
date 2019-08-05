const bcrypt = require('bcryptjs')

const request = require('supertest')
const app = require('../../src/server')

const factory = require('../factories')
const { close, drop } = require('../utils/database')

describe('User', () => {
  it('should encrypt user password', async () => {
    const user = await factory.create('User', {
      password: '123456'
    })

    const compareHash = await bcrypt.compare('123456', user.password)

    expect(compareHash).toBe(true)
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
