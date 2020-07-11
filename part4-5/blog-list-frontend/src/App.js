import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({
    message: undefined, state: undefined
  })
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notificationHelper = (notification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification({
        message: undefined, state: undefined
      })
    }, 5000)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationHelper({
        message: 'Wrong credentials',
        state: 'error'
      })
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    let blogCopy = [...blogs]
    try {
      let response = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl
      })
      blogCopy.push(response)
      setBlogs(blogCopy)
      notificationHelper({
        message: `Blog added`,
        state: 'success'
      })
    } catch (error) {
      notificationHelper({
        message: 'Failed to add a blog',
        state: 'error'
      })
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">log in</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>Add a new blog</h2>
      title:
      <input
        value={newTitle}
        onChange={handleTitleChange}
      />
      <br/>
      author:
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      <br/>
      url:
      <input
        value={newUrl}
        onChange={handleUrlChange}
      />
      <br/>
      <button type="submit">create</button>
    </form>  
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification.message} state={notification.state} />

      { 
        user === null ? 
          loginForm() : 
          <div>
            <p>
              {user.name} logged-in <button onClick={handleLogout}> log out</button>
            </p>
            { blogForm() }
          </div>
      }

      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App