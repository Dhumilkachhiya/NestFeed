import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />
      <div className="flex-1 max-w-5xl mx-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout