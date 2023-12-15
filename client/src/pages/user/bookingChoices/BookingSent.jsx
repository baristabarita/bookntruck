import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/web-logo-1.png'
import bookingchoiceimg from '../../../assets/bookingchoices-section-3.png'

const BookingSent = () => {


    return (
        <div className='animate-fade-in relative'>
            <div className='flex flex-row justify-even place-items-center bg-image bg-cover h-full' style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
                <div className='flex flex-col'>
                    <h1 className='mt-[10%] font-extrabold text-7xl ml-20 text-[#003249]'>Your booking has been sent!</h1>
                    <span className='font-semibold text-4xl ml-20 mt-[50px]'>To access and view your booking, <br/> please go to your profile page.</span>
                    <div className='flex mb-[5%]'>
                        <Link to={'/userprofile'} className='bg-[#007EA7] hover:bg-[#011627]  rounded-full text-center text-white text-2xl font-semibold py-3 px-6 mt-6 ml-20 m-[1rem] transition-colors delay-250 duration-[3000] ease-in'>Proceed to Profile Page</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingSent