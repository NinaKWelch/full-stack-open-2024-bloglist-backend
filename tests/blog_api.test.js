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
  const res = await api.get('/api/blogs')
  
  assert.strictEqual(res.body.length, 2)
})

test('blog has an id property', async () => {
  const res = await api.get('/api/blogs')
  
  assert(res.body[0].id)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Third Blog',
    author: 'Jack',
    url: 'http://jack.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')

  const blogs = res.body
  const savedBlog = blogs.find(blog => blog.title === 'Third Blog')

  newBlog.id = savedBlog.id

  assert.strictEqual(blogs.length, initialBlogs.length + 1)
  assert.deepStrictEqual(savedBlog, newBlog)
})


after(async () => {
  await mongoose.connection.close()
})