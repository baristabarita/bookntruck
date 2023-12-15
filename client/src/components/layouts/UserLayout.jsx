import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import UserHeader from '../navbars/UserNavbar.jsx';
import Footer from '../footer/Footer.jsx';
import { setLogoutTimer } from '../../utils/authUtils.jsx'; // Update the path accordingly

const UserLayout = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('clientDetails');

    useEffect(() => {
        // Check if user is logged in before starting the logout timer
        if (isLoggedIn) {
            const logoutTimeout = setLogoutTimer(60, () => {
                localStorage.removeItem('clientDetails');
                // You may want to navigate to a logout page or handle it as needed
                navigate('/logout');
            });

            // Cleanup the timeout to avoid memory leaks
            return () => clearTimeout(logoutTimeout);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <div className='animate-fade-in'>
                        <UserHeader />
                        <div className='font-roboto w-full mt-[6em]'>
                            <Outlet />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <div className='flex-grow'>
                <div className='animate-fade-in'>
                    <UserHeader />
                    <div className='font-roboto w-full mt-[6em]'>
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserLayout;
