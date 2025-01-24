const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John',
    url: 'http://john.com',
  },
  {
    title: 'Second Blog',
    author: 'Jill',
    url: 'http://jill.com',
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, 2)
})

test('blog has an id property', async () => {
  const response = await api.get('/api/blogs')
  
  assert(response.body[0].id)
})

after(async () => {
  await mongoose.connection.close()
})