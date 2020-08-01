import React from 'react'
import Toggleable from './Toggleable'

const Blog = ({ blog, handleLike, handleDeletion }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p> {blog.title} </p>
      <Toggleable buttonLabel="view">
        <p> {blog.url} </p>
        <p>
          likes: {blog.likes}
          <button onClick={handleLike}> Like </button>
        </p>
        <p> {blog.author} </p>
        <p>
          <button onClick={handleDeletion}> Delete </button>
        </p>
      </Toggleable>
    </div>
  )
}

export default Blog
