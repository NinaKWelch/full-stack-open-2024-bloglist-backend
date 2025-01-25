const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id property', async () => {
    const res = await api.get('/api/blogs')
  
    res.body.forEach(blog => assert(blog.id))
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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
        .send(helper.blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      await api.get('/api/blogs')
    
      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.at(-1)
    
      assert.strictEqual(savedBlog.likes, 0)
    })  
    
    test('fails with status code 400 when title or url is missing', async () => {
      await api
      .post('/api/blogs')
      .send({ author: 'John' })
      .expect(400)
  
    await api
      .post('/api/blogs')
      .send({ title: 'First Blog' })
      .expect(400)
    })
  })

    describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart.at(0)

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.at(0)
      console.log(blogToDelete.id)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      assert(!blogsAtEnd.includes(blogToDelete))
    })
  })


})

after(async () => {
  await mongoose.connection.close()
})