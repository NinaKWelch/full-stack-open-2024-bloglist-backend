const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const reverse = require('lodash/reverse');

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

 const authorsByBlogs = reverse(sortBy(Object.keys(authors), author => authors[author].length))

 const author = authorsByBlogs[0]

 return { author, blogs: authors[author].length }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const authors = groupBy(blogs, 'author')

  const authorsByLikes = reverse(sortBy(Object.keys(authors), author => totalLikes(authors[author])))
  
  const author = authorsByLikes[0]

  return { author, likes: totalLikes(authors[author]) }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}