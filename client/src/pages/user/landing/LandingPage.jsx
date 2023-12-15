import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { FaEnvelope, FaPhone } from 'react-icons/fa'
import headerbackgroundimage from '../../../assets/header-img.png'
import contactusbackgroundimage from '../../../assets/contactus-img.png'
import bookingmanagement from '../../../assets/project-management.png'
import assetmanagement from '../../../assets/delivery-truck.png'
import paymentmanagement from '../../../assets/payment.png'
import easybookings from '../../../assets/booking.png'
import transparentpricing from '../../../assets/online-shop.png'
import ratingsandreviews from '../../../assets/review.png'

const LandingPage = () => {
    const [selectedFeature, setSelectedFeature] = useState('managers');
    const storedAcc = localStorage.getItem('clientDetails')

    const featuresData = {
        managers: [
            {
                title: 'Booking Management',
                description: 'Efficiently manage and organize bookings from one centralized platform.',
                image: bookingmanagement,
            },
            {
                title: 'Asset Management',
                description: 'Be able to go over your existing assets and assign them to your respective bookings.',
                image: assetmanagement,
            },
            {
                title: 'Payment Management',
                description: 'View and manage payments from your bookings and clients.',
                image: paymentmanagement,
            },
        ],
        clients: [
            {
                title: 'Easy Bookings',
                description: 'Easily search and book trucking services that match your requirements.',
                image: easybookings,
            },
            {
                title: 'Transparent Pricing',
                description: 'View clear and complete pricing for different truckers.',
                image: transparentpricing,
            },
            {
                title: 'Ratings and Reviews',
                description: 'Read reviews and ratings to choose the right service provider.',
                image: ratingsandreviews,
            },
        ],
    };

    return (
        <div className='font-roboto animate-fade-in'>
            {/* Header Section  style={{ backgroundImage: `url(${headerbackgroundimage})`, marginTop: '6rem' }}*/ }
            <header className="bg-cover bg-center relative h-[30em] " style={{ backgroundImage: `url(${headerbackgroundimage})`, marginTop: '6rem' }}>
                <div className="container mx-auto flex justify-between items-center text-white p-8 relative z-0">
                    <div className="flex flex-col z-0 items-start max-w-[50%]">
                        <div className="my-20">
                            <h1 className="text-black text-5xl font-bold mb-2">Streamline your Bookings and Services</h1>
                            <p className="text-gray-800 text-[1em] my-8">
                                The booking and asset management system to effortlessly manage your trucking bookings and book reliable trucking services all in one place.
                            </p>
                            {!storedAcc ?
                                <Link to="/usregister">
                                    <button className="bg-[#007EA7] hover:bg-[#1f3d48] text-white py-2 px-6 rounded">Register Now</button>
                                </Link>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-gray-100 py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Features</h2>
                    <p className="text-lg mb-8">Check out the different features the website has to offer.</p>
                    <div className="mb-8">
                        <button
                            className={`bg-[#007EA7] hover:bg-[#1f3d48] text-white py-2 px-6 rounded mr-4 ${selectedFeature === 'managers' ? 'bg-[#1f3d48]' : ''}`}
                            onClick={() => setSelectedFeature('managers')}
                        >
                            For Managers
                        </button>
                        <button
                            className={`bg-[#007EA7] hover:bg-[#1f3d48] text-white py-2 px-6 rounded ${selectedFeature === 'clients' ? 'bg-[#1f3d48]' : ''}`}
                            onClick={() => setSelectedFeature('clients')}
                        >
                            For Clients
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {featuresData[selectedFeature].map((feature, index) => (
                            <div key={index} className="bg-white p-6 m-4 rounded-lg shadow-md w-72">
                                <img src={feature.image} alt={feature.title} className="w-16 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="bg-blue-200 h-[30em] py-12 text-center" style={{ backgroundImage: `url(${contactusbackgroundimage})`, backgroundSize: 'cover' }}>

  <div className="container mx-auto max-w-[45em] mt-[4em] py-10 text-center text-[#e4e4e4] bg-black bg-opacity-50">
    <h2 className="text-5xl font-bold mb-8">Contact Us</h2>
    <p className="text-md mb-5">
      Do you have any further questions or clarifications that require our input?<br /> Let us know or contact us through the following methods:
    </p>
    <div className="flex justify-center mb-8">
      <div className="mr-8 flex items-center">
        <FaPhone className="text-2xl mr-2" />
        <span>062-325-7890</span>
      </div>
      <div className="flex items-center">
        <FaEnvelope className="text-2xl mr-2" />
        <span>bookntruck@gmail.com</span>
      </div>
    </div>
  </div>

</section>
        </div>
    );
}

export default LandingPage