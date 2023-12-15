import React, { useState } from 'react';
import axios from 'axios';
import config from '../common/config'
import background from '../assets/login-back-pattern.png';
import logo from '../assets/web-logo-2.png';
import { FaEnvelope } from 'react-icons/fa';
import { IoMdLock } from 'react-icons/io'
import { Link } from 'react-router-dom';

const ForgotPass = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            // Use the email state to get the email value
            const response = await axios.get(`${config.API}/user/retrieve?col=email_address&val=${email}`);

            const records = response.data.records;

            if (records.length > 0) {
                setMessage({
                    text: 'Your email has been successfully submitted! Check your inbox for a password reset link.',
                    color: 'green',
                });
            } else {
                setMessage({
                    text: 'Email does not exist!',
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            setMessage({
                text: 'An error occurred while processing your request. Please try again.',
                color: 'red',
            });
        }
    };

    const handleCloseMessage = () => {
        setMessage('');
    };

    return (
        <div className='h-screen flex items-center justify-center overflow-hidden font-roboto'>
            {/* Background Picture */}
            <img className='absolute h-screen w-full object-cover' src={background} alt='background' />

            {message && (
                <div className='message-container absolute top-0 left-0 right-0 text-center p-4' style={{ backgroundColor: message.color }}>
                    <p className='text-[18px]'>{message.text}</p>
                    <button
                        className='text-[18px] cursor-pointer'
                        onClick={handleCloseMessage}
                    >
                        Close
                    </button>
                </div>
            )}

            <div className='relative flex flex-col md:flex-row max-w-3xl w-full bg-white shadow-[4px_15px_10px_4px_gray] rounded-[7px_7px_7px_7px]'>
                {/* Left Box */}
                <div className='leftBox flex flex-col items-center justify-center w-full md:w-1/2 bg-[#007EA7] p-10 rounded-[7px_0px_0px_7px]'>
                    <div className='imgBox mb-8'>
                        <img className='w-48' src={logo} alt='logo' />
                    </div>
                    <div className='text-center text-white'>
                        <h1 className='text-2xl font-m'>Forgot Password?</h1>
                        <div className="divider w-[100%] h-[2px] bg-white mb-8"></div>
                        <p className='text-sm font-light'>Enter your email address to change your password</p>
                    </div>
                    <div className='mt-7'>
                        <span className='text-sm text-white font-semibold'>Have an Account Ready?</span>
                        <Link
                            to='/usrlogin'
                            className='block bg-white text-[#007EA7] text-center py-2 px-4 rounded-full mt-2 hover:bg-[#003249] hover:text-white transition-colors delay-250 duration-3000 ease-in'>
                            Login Now
                        </Link>
                    </div>
                </div>
                {/* Right Box */}
                <div className='bg-[white] h-full pt-[10px] px-[70px] text-center rounded-[7px_7px_7px_7px]'>
                    <IoMdLock className='h-[100px] w-[120px] relative left-[7rem]' />
                    <h1 className='text-[30px] mt-[5px] mb-[15px] font-extrabold text-3xl'>Forgot Password?</h1>
                    <p className='text-center'>No worries! Enter your email, and we'll send a token to your inbox.</p>
                    <div className='flex items-center mt-[15px]'>
                        <FaEnvelope className='h-[20px] w-[20px]' />
                        <p className='ml-[5px]'>Email Address</p>
                    </div>
                    <input
                        type="email"
                        value={email}  // Use the email state as the value
                        onChange={(e) => setEmail(e.target.value)}  // Update the email state on change
                        className='w-full inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]'
                    />
                    <div className='buttons flex flex-col items-center space-y-5'>
                        <button
                            type='submit'
                            className='flex items-center justify-center button bg-[#007EA7] text-white p-[0.5em] w-[50%] rounded-full 
                                hover:bg-[#003249] font-bold transition-colors delay-250 duration-[3000] ease-in'
                            onClick={handleSubmit}
                        >
                            Submit Email
                        </button>
                        <div className='text-center text-sm'>
                            <span className='capitalize'>Dont Have a registered email? </span>
                            <Link to='/usregister' className='text-[#007EA7] font-bold hover:text-[#003249] transition-colors delay-250 duration-3000 ease-in'>Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
