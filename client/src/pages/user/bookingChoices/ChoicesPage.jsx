import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../common/config';
import LoadingBar from '../../../components/loaders/LoadingBar.jsx';
import LoadingTrucker from '../../../components/loaders/LoadingTruckerCard.jsx'
import TruckerCard from '../../../components/card/TruckerCard.jsx';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import bookingchoiceimg from '../../../assets/bookingchoices-section-2.png'

const ChoicesPage = () => {
    const [truckerData, setTruckerData] = useState([]);
    const [truckerCount, setTruckerCount] = useState(0);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true); // Add loading state variable
    const storedAcc = localStorage.getItem('clientDetails'); // for the logged-in user

    /* Retrieve Trucker data here */
    const retrieveTruckers = () => {
        axios
            .get(`${config.API}/trucker/retrievetwo?col1=trucker_status&val1=Approved&col2=is_viewable&val2=1`)
            .then((res) => {
                setTruckerData(res.data.trucker);
                setLoading(false); // Set loading to false after data fetching is successful
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    };
    const fetchCounts = async () => {
        try {
            const totalTruckersResponse = await axios.get(`${config.API}/trucker/retrieve_counttwo?col1=trucker_status&val1=Approved&col2=is_viewable&val2=1`);
            const totalTruckers = totalTruckersResponse.data.truckerCount;
            setTruckerCount(totalTruckers);
        } catch (error) {
            console.error("Error fetching counts: ", error);
        }
    }
    useEffect(() => {
        retrieveTruckers();
        fetchCounts();

    }, []);

    const handleSort = (order) => {
        const sortedData = [...truckerData];
        sortedData.sort((a, b) => {
            const priceA = a.servCharge;
            const priceB = b.servCharge;

            if (order === 'asc') {
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });

        setTruckerData(sortedData);
        setSortOrder(order);
    };

    return (

        <div className="flex-grow min-h-screen bg-image bg-cover h-full" style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
            {/* Top Title, Description, and sorting section */}
            <div className="mb-4 text-center bg-[#fefefe] py-4 rounded-lg">
                <h1 className="font-bold text-5xl text-[#363636] mt-4 mb-5">Choose the Trucking Service that Fits Your Needs</h1>

                <p className="text-[#363636] text-xl mb-5">
                    We offer a wide variety of trucking services to meet your needs, from local moves to long-haul shipments.
                </p>
            </div>
            {loading ? (
                <>
                    <LoadingBar />
                    <LoadingTrucker />
                </>
            ) : (
                <div className='mx-5'>
                    <div className="flex flex-wrap justify-between items-center p-2">
                        {/* Showing Businesses Section */}
                        <div>
                            <span className="font-bold text-[#363636] text-xl">Showing {truckerCount} Available Services</span>
                        </div>

                        {/* Sorting Section */}
                        <div className="flex justify-end items-center">
                            <h1 className="font-bold text-[#363636] text-xl mr-5">Sort by:</h1>
                            <div className="flex space-x-2 rounded-full p-2 bg-white border-slate-950 border-2">
                            <button
                                    className={`rounded-md px-4 p-2 bg-transparent text-[#2e2e2e] ${sortOrder === 'desc' ? 'font-bold' : ''}`}
                                    onClick={() => handleSort('desc')}
                                >
                                    <FaSortAlphaUp className="inline mr-1" /> Highest Price First
                                </button>
                                <button
                                    className={`rounded-md px-4 p-2 bg-transparent text-[#2e2e2e] ${sortOrder === 'asc' ? 'font-bold' : ''}`}
                                    onClick={() => handleSort('asc')}
                                >
                                    <FaSortAlphaDown className="inline mr-1" /> Lowest Price First
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center mt-4">
                        {truckerData.map((business, index) => (
                            <TruckerCard key={index} business={business} />
                        ))}
                    </div>
                </div>
            )}
        </div>


    );
};

export default ChoicesPage;
