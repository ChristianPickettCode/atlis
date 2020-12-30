import React from 'react'

import Atlis from 'atlis'
import 'atlis/dist/index.css'

const App = () => {

  return (
    <Atlis request={{
      data: ["email", "name"],
      appName: "Atlis Example App",
      appID: "87aec9be-bc7c-47c7-a0b8-c2b58ee576f8"
    }}>
      <Hi />
    </Atlis>
  )
}

const Hi = (props) => {
  return(
    <div style={{margin:"10%"}}>
      Atlis Example App
      { props.user ?
        <div>
          <p>{props.user.email}</p>
          <button onClick={props.logout}>logout</button>
        </div>
      : 
        <div>
          <button onClick={props.login}>login</button>
        </div>
      }
    </div>
  )
}

export default App
