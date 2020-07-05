/* eslint-disable no-undef */
require('dotenv').config()
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../model/BlogDBService')
const User = require('../model/UserDBService')
const api = supertest(app)

const blogs = [
  { _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0 },
  { _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5, __v: 0 },
  { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 },
  { _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10, __v: 0 },
  { _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0, __v: 0 },
  { _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2, __v: 0 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  let blogObject = new Blog(blogs[0])
  await blogObject.save()
  blogObject = new Blog(blogs[1])
  await blogObject.save()
  await api.post('/api/users').send({
    'username': 'yt',
    'name': 'Ye Tian',
    'password': 'abc123'
  })
})

const getAuthToken = async () => {
  const loginData = {
    'username': 'yt',
    'password': 'abc123'
  }
  const loginResponse = await api.post('/api/login').send(loginData)
  expect(loginResponse.status).toBe(200)
  const login = loginResponse.body
  expect(login.token).toBeDefined()
  expect(login.username).toBe('yt')
  return login.token
}

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('blog _id is defined as id', async () => {
  const response = await api.get('/api/blogs')
  const first = response.body[0]
  expect(first.id).toBeDefined()
  expect(first._id).toBe(undefined)
})

test('add a new blog', async () => {
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 10
  }
  const token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  expect(response.status).toBe(201)
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('add a new blog without like', async () => {
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'url'
  }
  const token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  expect(response.status).toBe(201)
  expect(response.body.likes).toBe(0)
})

test('add a new blog without title', async () => {
  const newBlog = {
    author: 'author',
    url: 'url'
  }
  const token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  expect(response.status).toBe(400)
})

test('add a new blog without url', async () => {
  const newBlog = {
    title: 'title',
    author: 'author'
  }
  const token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  expect(response.status).toBe(400)
})

test('update a blog', async () => {
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 10
  }
  let token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)

  const id = response.body.id
  let updatedBlog = JSON.parse(JSON.stringify(response.body))
  updatedBlog.title = 'title1'
  updatedBlog.url = 'url1'
  token = await getAuthToken()
  response = await api.put(`/api/blogs/${id}`)
    .set('Authorization', `bearer ${token}`)
    .send(updatedBlog)
  expect(response.status).toBe(200)
  expect(response.body).toBeDefined()
  expect(response.body.id).toBe(id)
  expect(response.body.title).toBe(updatedBlog.title)
  expect(response.body.url).toBe(updatedBlog.url)
})

test('delete a blog', async () => {
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 10
  }
  let token = await getAuthToken()
  let response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
  const id = response.body.id
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
  token = await getAuthToken()
  response = await api.delete(`/api/blogs/${id}`)
    .set('Authorization', `bearer ${token}`)
  expect(response.status).toBe(204)
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('this is a test', () => {
  expect(true)
})

afterAll(() => {
  mongoose.connection.close()
})
