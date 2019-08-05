const request = require('supertest')

const app = require('../../src/server')
const Article = require('../../src/app/models/Article')
const Author = require('../../src/app/models/Author')

const { close, drop } = require('../utils/database')

describe('Articles', () => {
  const defaultArticle = {
    title: 'Lorem',
    subtitle: 'Ipsum',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
  }

  const defaultAuthor = {
    name: 'Luna Palhares'
  }

  describe('GET /articles', () => {
    it('should response articles list', async () => {
      const { _id } = await Author.create(defaultAuthor)
      await Article.create({ ...defaultArticle, authors: [_id] })

      const {
        body: { articles }
      } = await request(app).get('/articles')

      expect(articles[0]).toMatchObject(defaultArticle)
    })

    it('should response 200', async () => {
      const { _id } = await Author.create(defaultAuthor)
      await Article.create({ ...defaultArticle, authors: [_id] })

      const { status } = await request(app).get('/articles')

      expect(status).toBe(200)
    })
  })

  describe('POST /articles', () => {
    it('should create an article with valid body', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { body } = await request(app)
        .post('/articles')
        .send({ ...defaultArticle, authors: [_id] })

      expect(body).toMatchObject(defaultArticle)
    })

    it('should response 201 when create an article', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { status } = await request(app)
        .post('/articles')
        .send({ ...defaultArticle, authors: [_id] })

      expect(status).toBe(201)
    })

    it('should response 400 with invalid body', async () => {
      const { status } = await request(app)
        .post('/articles')
        .send({})

      expect(status).toBe(400)
    })
  })

  describe('PUT /articles/:id', () => {
    it('should update an article', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: id } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const bodyReq = {
        ...defaultArticle,
        authors: [_id],
        title: 'Agnojd'
      }

      const { body } = await request(app)
        .put(`/articles/${id}`)
        .send(bodyReq)

      expect(body.title).toBe(body.title)
    })

    it('should response 400 with invalid id', async () => {
      const { status } = await request(app).put('/articles/1234')

      expect(status).toBe(400)
    })

    it('should response 400 with invalid body', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: id } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const body = {}

      const { status } = await request(app)
        .put(`/articles/${id}`)
        .send(body)

      expect(status).toBe(400)
    })
  })

  describe('DELETE /articles/:id', () => {
    it('should delete an article', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: id } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const { status } = await request(app).delete(`/articles/${id}`)
      expect(status).toBe(204)
    })

    it('should response 400 with invalid id', async () => {
      const { status } = await request(app).delete('/articles/1232')

      expect(status).toBe(400)
    })
  })

  describe('GET /articles/pl/:pl', () => {
    it('should response an article', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { permalink } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const { body } = await request(app).get(`/articles/pl/${permalink}`)
      expect(body).toMatchObject(defaultArticle)
    })

    it('should response null with invalid pl', async () => {
      const { body } = await request(app).get('/articles/pl/11')
      expect(body).toBe(null)
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
