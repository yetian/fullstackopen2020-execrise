import React from 'react'
import Toggleable from './Toggleable'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p> {blog.title} 
        <Toggleable buttonLabel="view">
          <p> {blog.url} </p>
          <p> likes: {blog.likes} </p> 
          <p> {blog.author} </p>
        </Toggleable> 
      </p>
    </div>
  )
}

export default Blog
