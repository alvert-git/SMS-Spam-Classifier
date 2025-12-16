
import React, { Children } from 'react'
import Sidebar from '../common/Sidebar'
import { Outlet } from 'react-router-dom'
import DynamicBackground from '../common/DynamicBackground'

const DashboardLayout = () => {
  return (
    <div className='min-h-screen relative bg-white dark:bg-black'>
        <DynamicBackground /> 
        <Sidebar/>
        <div className="ml-64 relative z-1"> 
            <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout