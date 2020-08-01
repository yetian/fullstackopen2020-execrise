import React from 'react'

const blogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => (
  <form onSubmit={handleSubmit}>
    <h2>Add a new blog</h2>
    title:
    <input
      value={title}
      onChange={handleTitleChange}
    />
    <br/>
    author:
    <input
      value={author}
      onChange={handleAuthorChange}
    />
    <br/>
    url:
    <input
      value={url}
      onChange={handleUrlChange}
    />
    <br/>
    <button type="submit">create</button>
  </form>
)

export default blogForm