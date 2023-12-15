import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../common/config";
import { BiSolidBookBookmark } from "react-icons/bi";
import TruckerCard from "../../../components/card/adminCards/TruckerCard"; 
import ManageTruckerModal from "../../../components/modals/adminModals/ManageTruckerModal"; 

const TruckerList = () => {
    const [truckers, setTruckers] = useState([]);
    const [activeTab, setActiveTab] = useState("Pending");
    const [selectedTrucker, setSelectedTrucker] = useState(null);
    const [pendings, setPendings] = useState(0);
    const [approved, setApproved] = useState(0);
    const [declined, setDeclined] = useState(0);
    const [unavailable, setUnavailable] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API}/trucker/retrieve_all`);
                setTruckers(response.data.trucker || []);
            } catch (error) {
                console.error("Error fetching trucker data:", error);
                setTruckers([]);
            }
        };

        fetchData();
    }, []);

    const fetchCounts = async() => {
        try {
          const pendingCountResponse = await axios.get(
            `${config.API}/trucker/retrieve_count?col=trucker_status&val=Pending`
          );
          const totalPendings = pendingCountResponse.data.truckerCount;
          setPendings(totalPendings);
    
          const approvedCountResponse = await axios.get(
            `${config.API}/trucker/retrieve_count?col=trucker_status&val=Approved`
          );
          const totalApproved = approvedCountResponse.data.truckerCount;
          setApproved(totalApproved);
    
          const declinedCountResponse = await axios.get(
            `${config.API}/trucker/retrieve_count?col=trucker_status&val=Declined`
          );
          const totalDeclined = declinedCountResponse.data.truckerCount;
          setDeclined(totalDeclined);
    
          const unavailableCountResponse = await axios.get(
            `${config.API}/trucker/retrieve_count?col=trucker_status&val=Unavailable`
          );
          const totalUnavailable = unavailableCountResponse.data.truckerCount;
          setUnavailable(totalUnavailable);
        } catch (error){
          console.error("Error fetching counts: ", error);
        }
      }
    
      useEffect(() => {
        const fetchData = async () => {
            await fetchCounts();
        };
        fetchData();
    }, []);

    const handleViewMoreClick = (trucker) => {
        setSelectedTrucker(trucker);
    };

    const handleUpdateTruckers = (updatedTruckers) => {
        setTruckers(updatedTruckers);
    };

    const handleStatusUpdate = async (truckerID, newStatus) => {
        try {
          await axios.post(`${config.API}/trucker/update?truckerID=${truckerID}`, {
            trucker: {
              trucker_status: newStatus,
            },
          });
    
          console.log("Successfully updated trucker status");
    
          // Directly modify the selected trucker's status without refetching all data
          setTruckers(prevTruckers => {
            const updatedTruckers = [...prevTruckers];
            const updatedTruckerIndex = updatedTruckers.findIndex(trucker => trucker.trucker_id === truckerID);
    
            if (updatedTruckerIndex !== -1) {
              updatedTruckers[updatedTruckerIndex].trucker_status = newStatus;
            }
    
            return updatedTruckers;
          });
        } catch (error) {
          console.error("Error updating trucker status:", error);
        }
      };
    

    const filteredTruckers = truckers.filter((trucker) => trucker.trucker_status === activeTab);

    const tabs = ["Pending", "Approved", "Declined", "Unavailable"];
    const getTabCount = (tab) => {
        switch (tab) {
            case "Pending":
                return pendings;
            case "Approved":
                return approved;
            case "Declined":
                return declined;
            case "Unavailable":
                return unavailable;
            default:
                return 0;
        }
    };
    const renderNoTruckersMessage = () => {
        return <div className="text-lg text-gray-500">No truckers currently.</div>;
    };

    return (
        <div className="animate-fade-in">
            <div className="my-4 mx-8 flex text-[2em] text-white font-bold items-center">
                <BiSolidBookBookmark className="mr-2" /> Trucker Management
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
            <div className="flex flex-wrap justify-around">
                   {filteredTruckers.length > 0 ? (
                    filteredTruckers.map((trucker) => (
                        <TruckerCard
                            key={trucker.trucker_id}
                            trucker={trucker}
                            onViewMore={() => handleViewMoreClick(trucker)}
                        />
                    ))
                ) : (
                    renderNoTruckersMessage()
                )}
            </div>
            <ManageTruckerModal
                isOpen={selectedTrucker !== null}
                onClose={() => setSelectedTrucker(null)}
                selectedTrucker={selectedTrucker}
                onUpdateTruckers={handleUpdateTruckers}
                onUpdateStatus={handleStatusUpdate}
            />

        </div>
    );
};

export default TruckerList;
