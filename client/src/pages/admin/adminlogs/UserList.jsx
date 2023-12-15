import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../common/config";
import { BiSolidBookBookmark } from "react-icons/bi";
import ViewClientUserModal from "../../../components/modals/adminModals/viewClientUserModal";
import ViewTruckerUserModal from "../../../components/modals/adminModals/viewTruckerUserModal";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("All Users");
    const [allCount, setAllCount] = useState(0);
    const [clientCount, setClientCount] = useState(0);
    const [truckerCount, setTruckerCount] = useState(0);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isClientUserModalOpen, setClientUserModalOpen] = useState(false);
    const [isTruckerUserModalOpen, setTruckerUserModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl;
                if (activeTab === "All Users") {
                    apiUrl = `${config.API}/user/retrieve_twousers?col1=user_type&val1=client&col2=user_type&val2=trucker`;
                } else if (activeTab === "Client Users") {
                    apiUrl = `${config.API}/user/retrieve?col=user_type&val=client`;
                } else if (activeTab === "Trucker Users") {
                    apiUrl = `${config.API}/user/retrieve?col=user_type&val=trucker`;
                }

                const response = await axios.get(apiUrl);
               
                setUsers(response.data.records || []); // Ensure users is an array
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUsers([]); // Set an empty array if there's an error
            }
        };

        fetchData();
    }, [activeTab]);

    const fetchCounts = async () => {
        try{
            const allCountResponse = await axios.get(
                `${config.API}/user/retrieve_totalcount`
            );
            const allUsers = allCountResponse.data.totalCount;
            setAllCount(allUsers);

            const clientCountResponse = await axios.get(
                `${config.API}/user/retrieve_count?col=user_type&val=client`
            );
            const totalClients = clientCountResponse.data.totalCount;
            setClientCount(totalClients);

            const totalManagersCountResponse = await axios.get(
                `${config.API}/user/retrieve_count?col=user_type&val=trucker`
            );
            const totalManagers = totalManagersCountResponse.data.totalCount;
            setTruckerCount(totalManagers);

        } catch (error) {
            console.error("Error fetching counts: ", error);
        }
    }

    const tabs = ["All Users", "Client Users", "Trucker Users"];
    const getTabCount = (tab) => {
        switch (tab) {
            case "All Users":
                return allCount;
            case "Client Users":
                return clientCount;
            case "Trucker Users":
                return truckerCount;
            default:
                return 0;
        }
    };

    const showViewButtonsColumn = activeTab !== "All Users";

    const openClientUserModal = (userId) => {
        setSelectedUserId(userId);
        setClientUserModalOpen(true);
    };

    const openTruckerUserModal = (userId) => {
        setSelectedUserId(userId);
        setTruckerUserModalOpen(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchCounts();
        };
        fetchData();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="my-4 mx-8 flex text-[2em] text-white font-bold items-center">
                <BiSolidBookBookmark className="mr-2" /> Accounts List
            </div>
            <div className="flex justify-center mb-4">
                <div className="flex">
                    {tabs.map((tab) => (
                        <div
                            key={tab}
                            className={`cursor-pointer mx-4 py-2 text-lg font-semibold ${activeTab === tab
                                ? "border-b-2 border-[#ea4ea9] text-[#ea4ea9]"
                                : "text-[#F6AE2D]"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab} ({getTabCount(tab)})
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[82.5vh] overflow-y-auto">
                <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
                    <div className="px-[1%] bg-[#30274B] rounded-md drop-shadow shadow-4x1 opacity-1">
                        <table className="w-[100%] mt-[0.8%]">
                            <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                                <tr className="text-[#F6AE2D]">
                                    <th className="py-[0.7%]">Account ID</th>
                                    <th>Email Address</th>
                                    <th>Type</th>
                                    <th>Registration Date</th>
                                    <th>Last Logged In</th>
                                    <th>Status</th>
                                    {/* Conditionally show the Actions column based on the active tab */}
                                    {showViewButtonsColumn && <th>Actions</th>}
                                </tr>
                                <tr>
                                    <th
                                        colSpan={7}
                                        className="border-b-[1px] border-[white]"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) && users.length > 0 ? (
                                    users.map((user) => (
                                        <tr
                                            className="text-center text-[#EF6837] xl:max-2xl:text-[0.8em]"
                                            key={user.user_id}
                                        >
                                            <td className="py-[1%]">{user.user_id}</td>
                                            <td>{user.email_address}</td>
                                            <td>{user.user_type}</td>
                                            <td>
                                                {user.date_registered
                                                    ? new Date(user.date_registered).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {user.last_login
                                                    ? new Date(user.last_login).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td className="flex justify-center">
                                                <p
                                                    className={`font-bold rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                        ${user.status === "deleted"
                                                            ? "bg-[#f6c3b3] text-[#4f2417]"
                                                            : user.status === "deactivated"
                                                                ? "bg-[#f1cc9d] text-[#6d4c20]"
                                                                : "bg-[#8bdfa3] text-[#1a562b]"
                                                        }`}
                                                >
                                                    {user.status}
                                                </p>
                                            </td>
                                            {/* Conditionally render the View button based on the active tab */}
                                            {showViewButtonsColumn && (
                                                <td className="py-2 px-4">
                                                    <button
                                                        className="bg-[#ea4ea9] text-[#37F9F6] px-2 py-1 rounded mr-2"
                                                        onClick={() =>
                                                            activeTab === "Client Users"
                                                                ? openClientUserModal(user.user_id)
                                                                : openTruckerUserModal(user.user_id)
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showViewButtonsColumn ? 7 : 6} className="text-white text-center py-4">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            {/* Conditionally render the client user modal */}
            {isClientUserModalOpen && (
                <ViewClientUserModal userId={selectedUserId} onClose={() => setClientUserModalOpen(false)} />
            )}

            {/* Conditionally render the trucker user modal */}
            {isTruckerUserModalOpen && (
                <ViewTruckerUserModal userId={selectedUserId} onClose={() => setTruckerUserModalOpen(false)} />
            )}
        </div>
    );
};

export default UserList;
