// BookingDetails.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import config from '../../../common/config';
import TrackingDetailsCard from "../../../components/card/TrackingDetailsCard.jsx";
import SummaryCard from "../../../components/card/SummaryCard.jsx";
import RatingModal from "../../../components/modals/RatingModal.jsx";
import DocumentModal from '../../../components/modals/viewDocumentModal.jsx';
import bookingchoiceimg from '../../../assets/bookingchoices-section-2.png'
import LoadingDetails from "../../../components/loaders/LoadingDetails.jsx";
import { FaRegStar } from "react-icons/fa";

const BookedServiceDetails = () => {
  const location = useLocation();

  const [bookingDetails, setBookingDetails] = useState({});
  const [truckerDetails, setTruckerDetails] = useState({});
  const [containerDetails, setContainerDetails] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
  const { booking_id, trucker_id, container_id } = bookingDetails;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state) {
          const bookingResponse = await axios.get(`${config.API}/booking/retrieve`, {
            params: {
              col: 'booking_id',
              val: location.state.booking_id,
            },
          });
          setBookingDetails(bookingResponse.data);

          const truckerResponse = await axios.get(`${config.API}/trucker/retrieve`, {
            params: {
              col: 'trucker_id',
              val: location.state.trucker_id,
            },
          });
          setTruckerDetails(truckerResponse.data);

          const containerResponse = await axios.get(`${config.API}/container/retrieve`, {
            params: {
              col: 'container_id',
              val: location.state.container_id,
            },
          });
          setContainerDetails(containerResponse.data);

          const paymentResponse = await axios.get(`${config.API}/payment/retrieve`, {
            params: {
              col: 'payment_id',
              val: location.state.payment_id,
            },
          });
          setPaymentDetails(paymentResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state]);

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleOpenDocumentModal = (url, alt) => {
    setDocumentUrl(url);
    setAltText(alt);
    setIsDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setDocumentUrl('');
    setAltText('');
    setIsDocumentModalOpen(false);
  };

  const handleOpenCancelConfirmation = () => {
    setIsCancelConfirmationOpen(true);
  };

  const handleCloseCancelConfirmation = () => {
    setIsCancelConfirmationOpen(false);
  };

  const handleConfirmCancel = async () => {
    try {
      // Call the API to update the booking status to "Cancelled"
      await axios.post(`${config.API}/booking/update`, {
        booking_id: location.state.booking_id,
        status: 'Cancelled',
      });
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      handleCloseCancelConfirmation();
    }
  };


  return (
    <div className="animate-fade-in min-h-screen bg-image bg-cover h-full" style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
      <div className="container mx-auto my-auto flex flex-col items-center">
        {(bookingDetails.records && bookingDetails.records.length > 0)
          && (truckerDetails.trucker && truckerDetails.trucker.length > 0)
          && (containerDetails.data && containerDetails.data.length > 0) ? (
          <TrackingDetailsCard bookingData={bookingDetails.records[0]} truckerDetails={truckerDetails.trucker[0]} containerDetails={containerDetails.data[0]} />
        ) : (

          <LoadingDetails />

        )}
        {(bookingDetails.records && bookingDetails.records.length > 0)
          && (paymentDetails.data && paymentDetails.data.length > 0)
          && (containerDetails.data && containerDetails.data.length > 0) ? (
          <SummaryCard
            bookingData={bookingDetails.records[0]}
            paymentDetails={paymentDetails.data[0]}
            containerDetails={containerDetails.data[0]}
            openDocumentModal={handleOpenDocumentModal}
          />
        ) : (
          <LoadingDetails />
        )}

        {/* Cancellation Button */}
        {bookingDetails.records && bookingDetails.records.length > 0 && bookingDetails.records[0].status === "Pending" && (
          <button
            className="bg-red-500 hover:bg-red-600 font-bold text-white text-[1.5em] py-2 px-4 rounded mt-4 mb-4"
            onClick={handleOpenCancelConfirmation}
          >
            Cancel Booking
          </button>
        )}

        {/* Rating Service Button */}
        {bookingDetails.records && bookingDetails.records.length > 0 && bookingDetails.records[0].status === "Completed" && (
          <button
            className="flex items-center bg-[#007EA7] hover:bg-[#003249] font-bold text-white text-[1.5em] py-2 px-4 rounded mt-4 mb-4 shadow-lg drop-shadow-lg"
            onClick={handleOpenRatingModal}
          >
            <FaRegStar className="mr-2" />
            Rate Booking Service
          </button>
        )}

        {(truckerDetails.trucker && truckerDetails.trucker.length > 0) ? (
          <RatingModal truckerDetails={truckerDetails.trucker[0]} isOpen={isRatingModalOpen} onClose={handleCloseRatingModal} />
        ) : (
          <p>Loading...</p>
        )}

        {isDocumentModalOpen && (
          <DocumentModal
            closeModal={handleCloseDocumentModal}
            documentUrl={documentUrl}
            altText={altText}
          />
        )}

        {/* Confirmation Popup for Cancellation */}
        {isCancelConfirmationOpen && (
          <>
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
            <div className="bg-white p-4 rounded shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <p>Are you sure you want to cancel the booking?</p>
              <div className="flex justify-end mt-4">
                <button className="bg-red-500 text-white px-4 py-2 mr-2" onClick={handleConfirmCancel}>
                  Confirm
                </button>
                <button className="bg-gray-300 px-4 py-2" onClick={handleCloseCancelConfirmation}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookedServiceDetails;
