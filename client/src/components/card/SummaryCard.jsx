// SummaryCard.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import config from '../../common/config';
import DocumentModal from '../modals/viewDocumentModal';
import {FaEye} from 'react-icons/fa'

const SummaryCard = ({ bookingData, containerDetails, paymentDetails }) => {
  const [pulloutDocUrl, setPulloutDocUrl] = useState(null);
  const [eirDocUrl, setEirDocUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(null);

  useEffect(() => {
    // Set the URLs for pullout_doc and eir_doc
    if (bookingData.pullout_doc) {
      setPulloutDocUrl(`${config.API}/${bookingData.pullout_doc}`);
    }
    if (bookingData.eir_doc) {
      setEirDocUrl(`${config.API}/${bookingData.eir_doc}`);
    }
  }, [bookingData]);

  const openDocumentModal = (documentUrl) => {
    setModalVisible(true);
    setSelectedDocumentUrl(documentUrl); // Update the selected document URL
  };

  const closeDocumentModal = () => {
    setModalVisible(false);
  };

  const renderBookingDocuments = () => {
    if (bookingData.status === "Completed") {
      return (
        <div>
          <h2 className="font-bold text-[1.3em] mr-2 mb-2">Uploaded Booking Documents</h2>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-[1em]">Pullout Documents:</p>
            <button
              className="flex itmes-center font-bold text-[0.8em] bg-[#007EA7] hover:bg-[#003249] text-white px-2 py-1 rounded"
              onClick={() => openDocumentModal(pulloutDocUrl)}
            >
              <FaEye className="mr-1 mt-1" />
              View Document
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-[1em]">Proof of Completion (EIR):</p>
            <button
              className="flex itmes-center font-bold text-[0.8em] bg-[#007EA7] hover:bg-[#003249] text-white px-2 py-1 rounded"
              onClick={() => openDocumentModal(eirDocUrl)}
            >
              <FaEye className="mr-1 mt-1" />
              View Document
            </button>
          </div>
        </div>

      );
    }
    if (bookingData.status === "Reserved" || bookingData.status === "Ongoing") {
      return (
        <div>
          <h2 className="font-bold text-[1.3em] mr-2 mb-2">Uploaded Booking Documents</h2>
          <div className="flex items-center mt-2">
            <p className="font-bold text-[1em] mr-2">Pullout Documents:</p>
            <button
              className="flex itmes-center font-bold text-[0.8em] bg-[#007EA7] hover:bg-[#003249] text-white px-2 py-1 rounded"
              onClick={() => openDocumentModal(pulloutDocUrl)}
            >
              <FaEye className="mr-1 mt-1" />
              View Document
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white col-span-2 md:col-span-2 border rounded p-4 shadow-lg drop-shadow-lg m-5 w-[55%]">
      <div className="mb-4">
        {bookingData.status === "Completed" ? (
          <h2 className="font-bold text-[1.5em]">Booking and Invoice Summary</h2>
        ) : (
          <h2 className="font-bold text-[1.5em]">Booking Summary</h2>
        )}
      </div>

      {/* First Row */}
      <div className="flex mb-2">
        {/* First Column */}
        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-bold mb-1 text-[1.3em] w-8 h-8 bg-[#16334b] rounded-lg text-[#fff] text-center">
              {containerDetails.quantity}
            </p>
            <div className="ml-3 text-[1.3em] font-medium">
              {containerDetails.container_type} ft. Containers
            </div>
          </div>
          <ul>
            <li className="ml-4 text-[0.7em]">
              {containerDetails.item_name}, {containerDetails.item_type}, {containerDetails.item_weight} kg
            </li>
          </ul>
        </div>

        {/* Second Column */}
        <div className="text-right">
          <div className="mt-2">
            <p className="font-bold">₱ {paymentDetails.container_charge}</p>
            <p className="font-normal">Total Charge-per-Container</p>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="my-4 border-t border-gray-600 opacity-75" />

      {/* Second Row */}
      <div className="flex justify-between mb-2">
        {/* First Column */}
        <div className="flex-1">
          <p>Service Charge</p>
          <p>Distance Charge</p>
          <p className="font-bold">TOTAL CHARGES</p>
        </div>

        {/* Second Column */}
        <div className="text-right">
          <p>₱ {paymentDetails.service_charge}</p>
          <p>₱ {paymentDetails.distance_charge}</p>
          <p className="font-bold">₱ {paymentDetails.total_balance}</p>
        </div>
      </div>
      <hr className="my-4 border-t border-gray-600 opacity-75" />

      {/* Booking Documents */}
      {renderBookingDocuments()}

      {/* Document Modal */}
      {modalVisible && (
        <DocumentModal
          documentUrl={selectedDocumentUrl}  // Use the selected document URL
          altText="Document"
          onClose={closeDocumentModal}
        />
      )}
    </div>
  );
};

export default SummaryCard;
