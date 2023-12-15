import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../navbars/AdminNavbar.jsx';
import AdminSide from '../sidebar/AdminSide.jsx';

const AdminLayout = () => {
  const isLoggedIn = localStorage.getItem('adminDetails');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/usrlogin" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <div className='flex flex-1 overflow-x-hidden overflow-y-auto bg-[#262335] transition-all duration-300 ease-in-out'>
        <AdminSide isSidebarOpen={isSidebarOpen} />
        <div className={`font-roboto flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[20%] mr-0 w-[80%]' : 'ml-[5%] mr-0 w-full'} `}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
