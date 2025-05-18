import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllpost from '@/hooks/useGetAllPost'


function Home() {
  useGetAllpost();
  return (
    <div className='flex'>
     <div className='flex-grow'>
       <Feed/>
       <Outlet/>
     </div>
     <RightSidebar/>
    </div>
  )
}

export default Home