const { factory } = require('factory-girl')
const faker = require('faker')
const User = require('../src/app/models/User')
const Author = require('../src/app/models/Author')

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

factory.define('Author', Author, {
  name: faker.name.findName()
})

module.exports = factory
