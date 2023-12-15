import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/web-logo-1.png'


const LogoutPage = () => {

    useEffect(() => {
        localStorage.removeItem('clientDetails');
        localStorage.removeItem('truckerDetails');
        localStorage.removeItem('adminDetails');
      });

    return (
        <div className='animate-fade-in relative'>
            <div className='h-[10vh] w-full border-b-8 border-[#007EA7]'>
                <img className='max-w-[9%] h-auto ml-[7vh] mt-[1.5vh] pt-[10px]' src={logo} />
            </div>
            <div className='flex flex-row justify-even place-items-center bg-logout'>
                <div className='flex flex-col'>
                    <h1 className='font-extrabold text-7xl ml-20 text-[#003249]'>You have been logged out.</h1>
                    <span className='font-semibold text-4xl ml-20 mt-[1em]'>Thank you for using Book-n-Truck.<br />If you wish to return to the previous page,<br/> please log in again.</span>
                    <div className='flex'>
                        <Link to={'/usrlogin'} className='bg-[#007EA7] rounded-full text-center text-white text-3xl font-semibold py-3 px-6 mt-6 ml-20 m-[1rem] hover:bg-[#1babff] transition-colors delay-250 duration-[3000] ease-in shadow-lg drop-shadow-lg'>Return to Login Page</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogoutPage