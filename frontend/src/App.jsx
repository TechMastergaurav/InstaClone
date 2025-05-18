import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import Home from './components/Home'

import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import UserProfile from './components/UserProfile'
import LandingPage from './components/LandingPage'
import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'

import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'

function App() {
  const {user}= useSelector(store=>store.auth)
  const {socket} = useSelector(store=>store.socketio)
  const dispatch = useDispatch();

  useEffect(()=>{
    if(user){
      const socketio = io('http://localhost:8000',{
        query:{
        userId:user?._id
        },
        trasnports:['websocket']
      })

      dispatch(setSocket(socketio))
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () =>{
        socketio.close();
        dispatch(setSocket(null));
      }
    }else if(socket){
      socket?.close();
      dispatch(setSocket(null))
    }
  },[user,dispatch])

  const browserRouter = createBrowserRouter([
    user ? {
      path:"/",
      element:<MainLayout/>,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/profile',
          element:<Profile/>
        },
        {
          path:'/profile/:id',
          element:<UserProfile/>
        },
        {
          path:'/chat',
          element:<ChatPage/>
        },
      ]
    } : {
      path: '/',
      element: <LandingPage />
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    }
  ])

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
