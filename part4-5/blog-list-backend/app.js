const express = require('express')
const app = express()
const cors = require('cors')

const userRouter = require('./controllers/users')
const blogRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')


app.use(cors())
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)

module.exports = app