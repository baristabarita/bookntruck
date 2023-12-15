import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../common/config";
import { BiSolidBookBookmark } from "react-icons/bi";
import ViewBookingModal from "../../../components/modals/adminModals/viewBookingModal";

const BookingLogs = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API}/booking/retrieve_all`);
        setBookings(response.data.records || []);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setBookings([]);
      }
    }

    fetchData();
  })

  const handleViewModalOpen = (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="my-4 mx-8 flex text-[2em] text-white font-bold items-center">
        <BiSolidBookBookmark className="mr-2" /> Booking Logs
      </div>
      <div className="h-[82.5vh] overflow-y-auto">
        <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
          <div className="px-[1%] bg-[#30274B] rounded-md drop-shadow shadow-4x1 opacity-1">
            <table className="w-[100%] mt-[0.8%]">
              <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                <tr className="text-[#F6AE2D]">
                  <th className="py-[0.7%]">Booking ID</th>
                  <th>Booking Date</th>
                  <th>Delivery Address</th>
                  <th>Est. Finish Date</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
                <tr>
                  <th
                    colSpan={8}
                    className="border-b-[1px] border-[white]"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(bookings) && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      className="text-center text-[#EF6837] xl:max-2xl:text-[0.8em]"
                      key={booking.booking_id}
                    >
                      <td className="py-[1%]">{booking.booking_id}</td>
                      <td>
                        {booking.est_finish_date
                          ? new Date(booking.booking_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{booking.delivery_address}</td>
                      <td>
                        {booking.est_finish_date
                          ? new Date(booking.est_finish_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {booking.date_updated
                          ? new Date(booking.date_updated).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="flex justify-center">
                        <p
                          className={`font-bold rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                                            ${booking.status == "Pending"
                              ? "bg-[#f6c3b3] text-[#4f2417]"
                              : booking.status ==
                                "Pullout Docs Required"
                                ? "bg-[#f1cc9d] text-[#6d4c20]"
                                : booking.status == "Reserved"
                                  ? "bg-[#e39797] text-[#531a1a]"
                                  : booking.status == "Ongoing"
                                    ? "bg-[#94cae9] text-[#1c4a64]"
                                    : "bg-[#8bdfa3] text-[#1a562b]"
                            }`}
                        >
                          {booking.status}
                        </p>
                      </td>
                      <td>{(booking.is_visible === 1) ? ("Visible") : ("Not Visible")}</td>
                      <td className="py-2 px-2">
                        <button
                          className="bg-[#011627] text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleViewModalOpen(booking)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-white text-center py-4">No Bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isViewModalOpen && (
        <ViewBookingModal
          booking={selectedBooking}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingLogs;
