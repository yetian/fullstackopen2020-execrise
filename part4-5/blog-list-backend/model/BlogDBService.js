const mongoose = require('mongoose')

let db_url = process.env.MONGODB_URL

if (process.env.NODE_ENV === 'test') {
  db_url = process.env.MONGODB_URL_TEST
}

console.log('using', db_url)

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)