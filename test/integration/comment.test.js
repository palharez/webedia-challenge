const request = require('supertest')

const app = require('../../src/server')
const Article = require('../../src/app/models/Article')
const Author = require('../../src/app/models/Author')
const User = require('../../src/app/models/User')
const Comment = require('../../src/app/models/Comment')

const { close, drop } = require('../utils/database')

describe.only('Comment', () => {
  const defaultArticle = {
    title: 'Lorem',
    subtitle: 'Ipsum',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
  }

  const defaultAuthor = {
    name: 'Luna Palhares'
  }

  const defaultUser = {
    name: 'Eduardo Palhares',
    email: 'eduardo@email.com',
    password: '123456'
  }

  const defaultComment = {
    comment: 'Lorem ipsum dolor sit'
  }

  describe('GET /articles', () => {
    it('should response comments list', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })
      const { _id: idUser } = await User.create(defaultUser)

      const comment = {
        user: idUser,
        article: idArticle,
        ...defaultComment
      }

      await Comment.create(comment)

      const {
        body: { comments }
      } = await request(app).get('/comments')

      expect(comments[0]).toMatchObject(defaultComment)
    })

    it('should response 200', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })
      const { _id: idUser } = await User.create(defaultUser)

      const comment = {
        user: idUser,
        article: idArticle,
        ...defaultComment
      }

      await Comment.create(comment)

      const { status } = await request(app).get('/comments')

      expect(status).toBe(200)
    })
  })

  describe('POST /comments', () => {
    it('shuld create an comment', async () => {
      const user = await User.create(defaultUser)
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const comment = {
        article: idArticle,
        ...defaultComment
      }

      const { body } = await request(app)
        .post('/comments')
        .send(comment)
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(body).toMatchObject(defaultComment)
    })

    it('should response 201 when create an comment', async () => {
      const user = await User.create(defaultUser)
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const comment = {
        article: idArticle,
        ...defaultComment
      }

      const { status } = await request(app)
        .post('/comments')
        .send(comment)
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(status).toBe(201)
    })

    it('should response 400 with invalid body', async () => {
      const user = await User.create(defaultUser)
      const comment = {}

      const { status } = await request(app)
        .post('/comments')
        .send(comment)
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(status).toBe(400)
    })

    it('should response 401 when not authenticated', async () => {
      const { status } = await request(app).post('/comments/1234')
      expect(status).toBe(401)
    })
  })

  describe('PUT /comments/:id', () => {
    it('should update an comment', async () => {
      const user = await User.create(defaultUser)
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const comment = await Comment.create({
        user: user._id,
        article: idArticle,
        ...defaultComment
      })

      const bodyReq = {
        article: idArticle,
        comment: 'Aloha'
      }

      const { body } = await request(app)
        .put(`/comments/${comment._id}`)
        .send(bodyReq)
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(body).toMatchObject({ comment: 'Aloha' })
    })

    it('should response 400 with invalid id', async () => {
      const user = await User.create(defaultUser)
      const { status } = await request(app)
        .put('/comments/1234')
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(status).toBe(400)
    })

    it('should response 400 with invalid body', async () => {
      const user = await User.create(defaultUser)
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })

      const comment = await Comment.create({
        user: user._id,
        article: idArticle,
        ...defaultComment
      })

      const bodyReq = {}

      const { status } = await request(app)
        .put(`/comments/${comment._id}`)
        .send(bodyReq)
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(status).toBe(400)
    })

    it('should response 401 when not authenticated', async () => {
      const { status } = await request(app).put('/comments/1234')
      expect(status).toBe(401)
    })
  })

  describe('DELETE /comments/:id', () => {
    it('should delete an comment', async () => {
      const { _id } = await Author.create(defaultAuthor)
      const { _id: idArticle } = await Article.create({
        ...defaultArticle,
        authors: [_id]
      })
      const user = await User.create(defaultUser)

      const comment = await Comment.create({
        user: user._id,
        article: idArticle,
        ...defaultComment
      })

      const { status } = await request(app)
        .delete(`/comments/${comment._id}`)
        .set('authorization', `Bearer ${User.generateToken(user)}`)
      expect(status).toBe(204)
    })

    it('should response 400 with invalid id', async () => {
      const user = await User.create(defaultUser)

      const { status } = await request(app)
        .delete('/comments/1234')
        .set('authorization', `Bearer ${User.generateToken(user)}`)

      expect(status).toBe(400)
    })

    it('should response 401 when not authenticated', async () => {
      const { status } = await request(app).delete('/comments/1234')
      expect(status).toBe(401)
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
