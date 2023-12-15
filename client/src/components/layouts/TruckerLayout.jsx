import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TruckerNavbar from '../navbars/TruckerNavbar.jsx';
import TruckerSide from '../sidebar/TruckerSide.jsx';

const TruckerLayout = () => {
  const isLoggedIn = localStorage.getItem('truckerDetails');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/trkrlogin" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <TruckerNavbar toggleSidebar={toggleSidebar} />
      <div className='flex flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 transition-all duration-300 ease-in-out'>
        <TruckerSide isSidebarOpen={isSidebarOpen} />
        <div
          className={`font-roboto flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20%] mr-0 w-[80%]' : 'ml-[5%] mr-0 w-full'} `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TruckerLayout;
