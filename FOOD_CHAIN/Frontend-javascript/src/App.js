import React from 'react'
import { Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import Navbar from './components/Navbar'
//import Home from './components/Home'
import Profile from './components/Profile'
import Post from './components/Post'
import Login from './components/Login'
import Register from './components/Register'
import ProducerHome from './components/ProducerHome'
import ConsumerHome from './components/ConsumerHome'
import RetailerHome from './components/RetailerHome'
import Prod from './components/Prod'





const App = () => {
  return (
    <>
      <div>
        <Navbar />


        <Route exact path='/'>
          <Prod />
        </Route>

        <Route path='/post'>
          <Post />
        </Route >

        <Route path='/contactus'>
          <Profile />
        </Route>

        <Route path='/login'>
          <Login />
        </Route>

        <Route path='/register'>
          <Register />
        </Route>

      </div>

    </>

  )
}

export default App
