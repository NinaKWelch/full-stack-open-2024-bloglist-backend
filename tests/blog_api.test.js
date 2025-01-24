const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  await api.get('/api/blogs')

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blogs have an id property', async () => {
  await api.get('/api/blogs')

  const blogsAtEnd = await helper.blogsInDb()

  blogsAtEnd.forEach(blog => assert(blog.id))
})

test('a valid blog can be added ', async () => {
  const newBlog = { ...helper.blog, likes: 0 }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api.get('/api/blogs')

  const blogsAtEnd = await helper.blogsInDb()
  const savedBlog = blogsAtEnd.at(-1)

  newBlog.id = savedBlog.id

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert.deepStrictEqual(savedBlog, newBlog)
})

test('likes default to 0', async () => {
  await api
    .post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api.get('/api/blogs')

  const blogsAtEnd = await helper.blogsInDb()
  const savedBlog = blogsAtEnd.at(-1)

  assert.strictEqual(savedBlog.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})