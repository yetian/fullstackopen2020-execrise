import React from 'react'
import '.././index.css'

const Notification = ({ message, state }) => {
  if (message && state) {
    return (
      <div className={state}>
        {message}
      </div>
    )
  }
  return null
}

export default Notification