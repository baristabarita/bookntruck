import React, { useState } from "react";
import {BiSolidUserPin} from 'react-icons/bi'
import GeneralSettings from "../../../components/settings/GeneralSettings.jsx";
import ViewabilitySettings from "../../../components/settings/ViewabilitySettings.jsx";
import AdvancedSettings from "../../../components/settings/AdvancedSettings";

const TruckerSettings = () => {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="h-full font-roboto overflow-y-auto ovoverflow-x-hidden animate-fade-in">
            <div className="w-full">
            <div className="mt-5 mx-9 flex text-[2em] font-bold items-center">
                <BiSolidUserPin className="mr-2" /> Account Settings
            </div>
                <div className="h-[175vh] xl:max-2xl:h-[245vh]">
                    <div className="flex ml-10 mr-10 text-xl">
                        <div className="container mx-auto py-2">
                            <div className="flex mb-8 h-[10vh] p-8 xl:max-2xl:p-4">
                                <div className={`cursor-pointer mr-4 ${activeTab === "general" ? "font-bold border-b-[3px] pb-3 border-[#37acff] xl:max-2xl:pb-1" : "hover:text-[#37acff] transition-colors delay-450 duration-[3000] ease-in-out"
                                    }`}
                                    onClick={() => setActiveTab("general")}
                                >
                                    General Settings
                                </div>
                                <div className={`cursor-pointer mr-4 ${activeTab === "viewability" ? "font-bold border-b-[3px] pb-3 border-[#37acff] xl:max-2xl:pb-1" : "hover:text-[#37acff] transition-colors delay-450 duration-[3000] ease-in-out"
                                    }`}
                                    onClick={() => setActiveTab("viewability")}
                                >
                                    Viewability Settings
                                </div>
                                <div className={`cursor-pointer ${activeTab === "advanced" ? "font-bold border-b-[3px] pb-3 border-[#37acff] xl:max-2xl:pb-1" : "hover:text-[#37acff] transition-colors delay-450 duration-[3000] ease-in-out"
                                    }`}
                                    onClick={() => setActiveTab("advanced")}
                                >
                                    Advanced Settings
                                </div>
                            </div>
                            <div>
                                {activeTab === "general" && <GeneralSettings />}
                                {activeTab === "viewability" && <ViewabilitySettings />}
                                {activeTab === "advanced" && <AdvancedSettings />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TruckerSettings;
