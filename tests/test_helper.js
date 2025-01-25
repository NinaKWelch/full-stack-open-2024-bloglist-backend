const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John',
    url: 'http://john.com',
    likes: 0,
  },
  {
    title: 'Second Blog',
    author: 'Jill',
    url: 'http://jill.com',
    likes: 0,
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

const nonExistingId = async () => {
  const newBlog = new Blog(blog)
  await newBlog.save()
  await newBlog.deleteOne()

  return newBlog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs,
  blog,
  blogsInDb,
  nonExistingId,
  usersInDb
}