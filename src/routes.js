const express = require('express')
const validate = require('express-validation')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const UserController = require('./app/controllers/UserController')
const UserValidator = require('./app/validators/User')

const SessionController = require('./app/controllers/SessionController')
const SessionValidator = require('./app/validators/Session')

const AuthorController = require('./app/controllers/AuthorController')
const AuthorValidator = require('./app/validators/Author')

const ArticlesController = require('./app/controllers/ArticleController')
const ArticleValidator = require('./app/validators/Article')

const CommentController = require('./app/controllers/CommentController')
const CommentValidator = require('./app/validators/Comment')

routes.post('/users', validate(UserValidator), UserController.store)

routes.post('/sessions', validate(SessionValidator), SessionController.store)

/**
 * Authors
 */
routes.get('/authors', AuthorController.index)
routes.post('/authors', validate(AuthorValidator), AuthorController.store)
routes.put('/authors/:id', validate(AuthorValidator), AuthorController.update)
routes.delete('/authors/:id', AuthorController.destroy)

/**
 * Articles
 */
routes.get('/articles', ArticlesController.index)
routes.get('/articles/:id', ArticlesController.show)
routes.get('/articles/pl/:pl', ArticlesController.showPl)
routes.post('/articles', validate(ArticleValidator), ArticlesController.store)
routes.put(
  '/articles/:id',
  validate(ArticleValidator),
  ArticlesController.update
)
routes.delete('/articles/:id', ArticlesController.destroy)

/**
 * Comments
 */
routes.get('/comments', CommentController.index)
routes.get('/comments/article/:id', CommentController.show)
routes.use(authMiddleware)
routes.post('/comments', validate(CommentValidator), CommentController.store)
routes.put(
  '/comments/:id',
  validate(CommentValidator),
  CommentController.update
)
routes.delete('/comments/:id', CommentController.destroy)

module.exports = routes
