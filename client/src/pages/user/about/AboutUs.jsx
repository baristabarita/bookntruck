import React from "react";
import background from '../../../assets/group-trucks-parked-row.jpg';

const AboutUs = () => {
    return (
        <div className="h-[90vh] animate-fade-in">
            <div className="font-roboto relative flex flex-row justify-between bg-black bg-opacity-40 z-0 h-[100%]">
                <img src={background} alt='About Us Background' className="h-full w-full bg-[100%] object-cover bg-no-repeat bg-cover absolute z-0" />
                <div className='h-full w-full bg-no-repeat bg-cover absolute z-1 bg-[rgba(0,0,0,0.60)]' />
                <div className="w-4/5 px-32 py-24 z-10">
                    <div className="border-b-4 pb-6">
                        <h1 className="font-extrabold text-white text-5xl pb-3">About Book-N-Truck</h1>
                    </div>
                    <div className='pt-8'>
                        <p className='text-white font-light text-justify text-2xl'>
                            Welcome to Book-N-Truck, your dedicated partner in efficient trucking management and streamlined bookkeeping solutions. Book-N-Truck was developed by a small group of college students determined to enhance their knowledge through collaborative efforts. At Book-N-Truck, we understand the complexities of the trucking industry and the challenges faced by managers and clients alike. That's why we've crafted a user-friendly platform that empowers trucking managers and their clients to take control of their operations seamlessly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
