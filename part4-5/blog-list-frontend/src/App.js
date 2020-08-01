import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/Login'
import NewBlogForm from './components/NewBlog'
import Toggleable from './components/Toggleable'
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
        message: 'Blog added',
        state: 'success'
      })
    } catch (error) {
      notificationHelper({
        message: 'Failed to add a blog',
        state: 'error'
      })
    }
  }

  const updateLike = async (blog) => {
    let blogCopy = [...blogs]
    let existBlog = blogCopy.find(b => b.id === blog.id)
    if (existBlog) {
      existBlog.likes ++
      try {
        await blogService.update(blog.id, existBlog)
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
        notificationHelper({
          message: `The blog ${blog.title} was liked successfully.`,
          state: 'success'
        })
      } catch (err) {
        notificationHelper({
          message: `Failed to update the like of the blog ${blog.title}`,
          state: 'error'
        })
      }
    }
  }

  const handleDeletion = async (blog) => {
    if (window.confirm(`Delete ${blog.title}?`)) {
      try {
        await blogService.deleteItem(blog.id)
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
        notificationHelper({
          message: `The blog ${blog.title} was deleted successfully.`,
          state: 'success'
        })
      } catch (err) {
        notificationHelper({
          message: `Failed to delete the blog ${blog.title}`,
          state: 'error'
        })
      }
    }
  }

  const loginForm = () => {
    return (
      <Toggleable buttonLabel="log in">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Toggleable>
    )
  }

  const newBlogForm = () => {
    return (
      <Toggleable buttonLabel="new blog">
        <NewBlogForm
          handleSubmit={addBlog}
          handleTitleChange={handleTitleChange}
          handleAuthorChange={handleAuthorChange}
          handleUrlChange={handleUrlChange}
          title={newTitle}
          author={newAuthor}
          url={newUrl}
        />
      </Toggleable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification.message} state={notification.state} />

      {
        user === null ?
          loginForm()
          :
          <div>
            <p>
              {user.name} logged-in <button onClick={handleLogout}> log out</button>
            </p>
            { newBlogForm() }
          </div>
      }

      <h2>Blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={() => updateLike(blog)} handleDeletion={() => handleDeletion(blog)}/>
      )}
    </div>
  )
}

export default App