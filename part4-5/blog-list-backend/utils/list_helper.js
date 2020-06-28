const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length
}

const favoriteBlog = (blogs) => {
  let maxLike = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLike)
}

const mostBlogs = (blogs) => {
  let authors = blogs.map(blog => blog.author).map(author => {
    return {
      author: author,
      blogs: blogs.filter(blog => blog.author === author).length
    }
  })
  let maxBlogNumber = Math.max(...authors.map(author => author.blogs))
  return authors.find(author => author.blogs === maxBlogNumber)
}

const mostLikes = (blogs) => {
  let authors = blogs.map(blog => blog.author).map(author => {
    return {
      author: author,
      likes: blogs.filter(blog => blog.author === author).map(blog => blog.likes).reduce((acc, cur) => acc + cur)
    }
  })
  let maxLikesAuthor = Math.max(...authors.map(author => author.likes))
  return authors.find(author => author.likes === maxLikesAuthor)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}