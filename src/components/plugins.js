import React from 'react'

const Qplugin = ({ qplugins }) => {
  return (
    <div>
      <center><h1>Contact List</h1></center>
      {qplugins.map((contact) => (
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{contact.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{contact.description}</h6>
            <p class="card-text">{contact.preview}</p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Qplugin