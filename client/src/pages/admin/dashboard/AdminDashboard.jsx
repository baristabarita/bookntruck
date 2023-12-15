import React, { useEffect, useState } from "react";
import axios from 'axios';
import config from '../../../common/config';
import { BiSolidDashboard, BiSolidCheckSquare } from "react-icons/bi";
import { MdPayments, MdPendingActions } from "react-icons/md"
import { FaUserTie, FaUserFriends } from "react-icons/fa"
import UserLineChart from '../../../components/charts/admincharts/UserLineChart';
import UserPieChart from '../../../components/charts/admincharts/UserPieChart'


const AdminDashboard = () => {
    const adminID = Number(localStorage.getItem('adm_id'));

    const [userCount, setUserCount] = useState(0);
    const [truckerCount, setTruckerCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);

    useEffect(() => {
        // Fetch data for user log overview
        axios.get(`${config.API}/user/retrieve_twousers?col1=user_type&val1=client&col2=user_type&val2=trucker`)
            .then(response => {
                console.log(response.data)
                setAllUsers(response.data.records); // Assuming the API response is an array of user data
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch data for booking log overview
        axios.get(`${config.API}/booking/retrieve_all`)
            .then(response => {
                setAllBookings(response.data.records); // Assuming the API response is an array of booking data
            })
            .catch(error => {
                console.error('Error fetching booking data:', error);
            });
    }, []);

    const fetchCounts = async () => {
        try {
            const totalUsersCountResponse = await axios.get(
                `${config.API}/user/retrieve_totalcount`
            );
            const totalUsers = totalUsersCountResponse.data.totalCount;
            setUserCount(totalUsers);

            const totalManagersCountResponse = await axios.get(
                `${config.API}/user/retrieve_count?col=user_type&val=trucker`
            );
            const totalManagers = totalManagersCountResponse.data.totalCount;
            setTruckerCount(totalManagers);

            const totalActiveCountResponse = await axios.get(
                `${config.API}/user/retrieve_count?col=status&val=active`
            );
            const totalActiveUsers = totalActiveCountResponse.data.totalCount;
            setActiveCount(totalActiveUsers);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCounts();
        };
        fetchData();
    }, []);

    return (
        <div className="flex-col animate-fade-in mx-8">
            <div className="my-4 flex text-[2em] text-white font-bold items-center">
                <BiSolidDashboard className="mx-3" /> Admin Dashboard
            </div>
            {/* Top Section */}
            <div className="h-[30vh] flex overflow-y-auto overflow-x-hidden rounded-lg shadow-2xl">
                {/* Welcome Box */}
                <div className="w-[30%] p-[1%] text-center">
                    <div className="align-center text-center p-[3%] h-[100%] rounded-md shadow-2xl bg-[#BF458D]">
                        <h1 className="font-bold text-[1.8em] text-[#2EF6D6] xl:text-[1.5em] mt-3 text-shadow-lg">
                            Welcome, Admin!
                        </h1>
                        <p className="font-roboto text-[1.3em] text-[#2EF6D6] xl:text-[1em] mx-2 text-center">
                            <br />
                            Explore, manage, and stay updated with ease.
                        </p>
                    </div>
                </div>

                {/* Four Individual Count Boxes */}
                <div className="w-[70%] p-[1%] text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2">
                    {/* Box 1 */}
                    <div className="bg-[#30274B] h-[150px] rounded-2xl flex flex-row items-center p-4 mx-2">
                        <p className="text-[#F6AE2D] text-[5em] font-bold xl:text-[3em] ml-2 mr-4">
                            {userCount}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <FaUserFriends className="text-[#F6AE2D] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#F6AE2D] font-bold text-[1.2em] xl:text-[0.8em] mt-2">
                                USERS
                            </p>

                        </div>
                    </div>

                    {/* Box 2 */}
                    <div className="bg-[#30274B] h-[150px] rounded-2xl flex flex-row items-center p-4 mx-2">
                        <p className="text-[#37F9F6] text-[5em] font-bold xl:text-[3em] ml-2 mr-4">
                            {truckerCount}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <FaUserTie className="text-[#37F9F6] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#37F9F6] font-bold text-[1.2em] xl:text-[0.8em] mt-2">
                                TRUCKERS
                            </p>

                        </div>
                    </div>
                    {/* Box 3 */}
                    <div className="bg-[#30274B] h-[150px] rounded-2xl flex flex-row items-center p-4 mx-2">
                        <p className="text-[#45C69B] text-[5em] font-bold xl:text-[3em] ml-2 mr-4">
                            {activeCount}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <BiSolidCheckSquare className="text-[#45C69B] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#45C69B] font-bold text-[1.2em] xl:text-[0.8em] mt-2">
                                ACTIVE
                            </p>

                        </div>
                    </div>
                </div>
            </div>
            {/* Graphs */}
            {/* Bookings This month section */}
            <div className="flex flex-col-2">
                <div className="container mt-5 bg-[#30274B] rounded-md w-[55%] ">
                    <div className="flex items-center justify-between py-2 px-4 border-b-2 border-[#BF458D]">
                        <h2 className="text-[1.5em] font-bold text-[#BF458D]">Registrations This Month</h2>
                    </div>
                    <div className="h-[50vh] mx-10 pb-5">
                        <UserLineChart />
                    </div>
                </div>
                <div className="container mt-5 bg-[#30274B] rounded-md w-[40%] ml-[4%] ">
                    <div className="flex items-center justify-between py-2 px-4 border-b-2 border-[#BF458D]">
                        <h2 className="text-[1.5em] font-bold text-[#BF458D]">User Types Count</h2>
                    </div>
                    <div className="h-[50vh] mx-10 pb-5">
                        <UserPieChart />
                    </div>
                </div>

            </div>

            {/* Tables */}
            <div className=" h-[50vh] flex overflow-auto mt-5 rounded-lg shadow-2xl">
                <div className="w-[45%] m-[1%] text-center bg-[#30274B] rounded-1xl flex-col pt-0 p-[1%] overflow-auto">
                    <div className="text-left border-b-2 border-white my-2">
                        <p className="my-1 flex font-bold text-[#ea4ea9] text-[1.5em] xl:max-2xl:text-[1.2em]">
                            {" "}
                            User Log Overview<br />
                        </p>
                    </div>
                    <table className="flex-col w-[100%] text-left rounded-1xl overflow-auto xl:max-2xl:text-[0.8em]">
                        <tr className="text-[#F6AE2D]">
                            <th>ID</th>
                            <th>UserType</th>
                            <th>Date Registered</th>
                            <th>Last Logged</th>
                        </tr>
                        <tbody className="text-[#EF6837]">
                            {allUsers.map(user => (
                                <tr key={user.user_id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.user_type}</td>
                                    <td>{user.date_registered ? new Date(user.date_registered).toLocaleDateString() : 'N/A'}</td>
                                    <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-[55%] m-[1%] text-center bg-[#30274B] rounded-1xl flex-col pt-0 p-[1%] overflow-auto">
                    <div className="text-left border-b-2 border-white my-2">
                        <p className=" my-1 flex font-bold text-[#ea4ea9] text-[1.5em] xl:max-2xl:text-[1.2em]">
                            {" "}
                            Booking Log Overview <br />
                        </p>
                    </div>
                    <table className="flex-col w-[100%] text-left rounded-1xl overflow-auto xl:max-2xl:text-[0.8em]">
                        <tr className="text-[#F6AE2D]">
                            <th>Booking ID</th>
                            <th>Booked at</th>
                            <th>Status</th>
                        </tr>
                        <tbody className="text-[#EF6837]">
                            {allBookings.map(booking => (
                                <tr key={booking.booking_id}>
                                    <td>{booking.booking_id}</td>
                                    <td>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}</td>
                                    <td><p
                                        className={`font-bold text-center rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                                            ${booking.status == "Pending"
                                                ? "bg-[#f6b3b3] text-[#4f2417]"
                                                : booking.status == "Pullout Docs Required"
                                                    ? "bg-[#fec06f] text-[#6d4c20]"
                                                    : booking.status == "Reserved"
                                                        ? "bg-[#ffb998] text-[#531a1a]"
                                                        : booking.status == "Ongoing"
                                                            ? "bg-[#94cae9] text-[#1c4a64]"
                                                            : booking.status == "Completed"
                                                                ? "bg-[#8bdfa3] text-[#1a562b]"
                                                                : "bg-[#262626] text-[#afafaf]"
                                            }`}
                                    >
                                        {booking.status}
                                    </p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
