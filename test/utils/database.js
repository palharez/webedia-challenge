const mongoose = require('mongoose')

const close = async () => {
  await mongoose.connection.close()
}

const drop = async () => {
  await mongoose.connection.db.dropDatabase()
}

module.exports = {
  close, drop
}
