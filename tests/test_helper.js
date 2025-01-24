const Blog = require('../models/blog')

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

const blog = {
  title: 'Third Blog',
  author: 'Jack',
  url: 'http://jack.com',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blog, blogsInDb
}