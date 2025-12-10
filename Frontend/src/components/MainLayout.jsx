import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e42bf]/5 to-[#d037a2]/5">
      <LeftSidebar />
      <div className="ml-[20%] p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout