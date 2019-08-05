const request = require('supertest')

const app = require('../../src/server')
const Author = require('../../src/app/models/Author')

const { close, drop } = require('../utils/database')

describe('Authors', () => {
  const defaultAuthor = {
    name: 'Luna Palhares'
  }

  describe('GET /authors', () => {
    it('should response authors list', async () => {
      await Author.create(defaultAuthor)

      const {
        body: { authors }
      } = await request(app).get('/authors')

      expect(authors[0]).toMatchObject(defaultAuthor)
    })

    it('should response 200', async () => {
      await Author.create(defaultAuthor)

      const { status } = await request(app).get('/authors')

      expect(status).toBe(200)
    })
  })

  describe('POST /authors', () => {
    it('should create an author with valid body', async () => {
      const { body } = await request(app)
        .post('/authors')
        .send(defaultAuthor)

      expect(body).toMatchObject(defaultAuthor)
    })

    it('should response 201 when create an author', async () => {
      const { status } = await request(app)
        .post('/authors')
        .send(defaultAuthor)

      expect(status).toBe(201)
    })

    it('should response 400 with invalid body', async () => {
      const { status } = await request(app)
        .post('/authors')
        .send({})

      expect(status).toBe(400)
    })
  })

  describe('PUT /authors/:id', () => {
    it('should update an author with valid body', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const bodyReq = {
        name: 'Eduardo Palhares'
      }

      const { body } = await request(app)
        .put(`/authors/${_id}`)
        .send(bodyReq)

      expect(body).toMatchObject(body)
    })

    it('should response 400 when update with invalid id', async () => {
      const { status } = await request(app).put('/authors/1234')

      expect(status).toBe(400)
    })

    it('should response 400 with invalid body', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const body = {
        namex: 'Eduardo Palhares'
      }

      const { status } = await request(app)
        .put(`/authors/${_id}`)
        .send(body)

      expect(status).toBe(400)
    })
  })

  describe('DELETE /authors/:id', () => {
    it('should delete an author with valid id', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { status } = await request(app).delete(`/authors/${_id}`)

      expect(status).toBe(204)
    })

    it('should response 400 with invalid id', async () => {
      const { status } = await request(app).delete('/authors/2000')

      expect(status).toBe(400)
    })
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
