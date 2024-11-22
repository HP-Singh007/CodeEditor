import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username,key}) => {
  return (
    <div id='clientComp'>
        <Avatar name={username} size={60} round="14px"/>
        <span id="clientUsername">{username}</span>
    </div>
  )
}

export default Client
