const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const { title, author, likes } = blogs.reduce((prev, current) => 
    (prev.likes > current.likes) ? prev : current)

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null
  }

 const authors = groupBy(blogs, 'author')

 const authorsByBlogs = sortBy(Object.keys(authors), author => author.length)

 const author = authorsByBlogs[0]

 return { author, blogs: authors[author].length }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}