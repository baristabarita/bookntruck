import React, { useEffect, useState } from "react";
import axios from 'axios';
import config from '../../../common/config';
import { MdPayments, MdEditSquare } from "react-icons/md";
import ViewPaymentModal from "../../../components/modals/truckerModals/viewPaymentModal.jsx";
import EditPaymentModal from "../../../components/modals/truckerModals/editPaymentModal.jsx";
import SetChargesModal from "../../../components/modals/truckerModals/setChargesModal.jsx";
import LoadingBar from "../../../components/loaders/LoadingBar.jsx";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isChargesModalOpen, setChargesModalOpen] = useState(false);
  const truckerID = Number(localStorage.getItem("trkr_id"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResponse = await axios.get(`${config.API}/booking/retrieve`, {
          params: {
            col: 'trucker_id',
            val: truckerID,
          }
        });

        const bookings = bookingResponse.data.records || [];
        console.log(bookings);
        const combinedData = [];
        for (const booking of bookings) {
          const clientResponse = await axios.get(`${config.API}/client/retrieve`, {
            params: {
              col: 'client_id',
              val: booking.client_id,
            }
          });

          const paymentResponse = await axios.get(`${config.API}/payment/retrieve`, {
            params: {
              col: 'payment_id',
              val: booking.payment_id,
            }
          });


          const clientData = clientResponse.data.clients?.[0];
          const paymentData = paymentResponse.data.data?.[0];

          if (clientData && paymentData) {
            //const invDate = new Date(paymentData.invoice_date).toISOString().split('T')[0];
            const data = {
              payment_id: paymentData.payment_id,
              booking_id: booking.booking_id,
              clientName: clientData.client_name,
              invoiceDate: new Date(paymentData.invoice_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
              remainingBalance: paymentData.rem_balance,
              totalBalance: paymentData.total_balance,
              amountPaid: paymentData.paid_amount,
              status: paymentData.payment_status,
            };

            combinedData.push(data);
          }
        }

        setPayments(combinedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [truckerID]);

  const statusOptions = ["All", "Pending", "Paid", "Cancelled"];

  // Function to filter bookings based on status
  const filteredPayments = payments.filter((payment) => {
    if (filter === "All") {
      return true;
    }
    return payment.status === filter;
  });

  const handleTabClick = (status) => {
    setFilter(status);
  };

  const handleChargesModalOpen = () => {
    setChargesModalOpen(true);
  };

  const handleChargesModalClose = () => {
    setChargesModalOpen(false);
  };

  const handleViewModalOpen = (payment) => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  const handleEditModalOpen = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleEditModalSave = (updatedData) => {
    // Find the index of the edited payment in the payments array
    const editedPaymentIndex = payments.findIndex(payment => payment.payment_id === updatedData.payment_id);

    // Update the payments array with the edited payment data
    const updatedPayments = [...payments];
    updatedPayments[editedPaymentIndex] = {
      ...updatedPayments[editedPaymentIndex],
      ...updatedData
    };

    // Update the state with the edited payments data
    setPayments(updatedPayments);

    // Close the modal after saving
    setEditModalOpen(false);
  };
  return (
    <div className="animate-fade-in">
      <div className="my-4 mx-8 flex text-[2em] font-bold items-center">
        <p className="flex text-[1em]">
          <MdPayments className="mr-2" /> Payment Overview
        </p>
      </div>
      <div className="flex items-center overflow-y-auto overflow-x-hidden">
        <div className="w-[97%] py-[1%] pl-[2%]">
          {/* Buttons for filtering payments */}
          <div className="flex flex-row justify-between ml-6">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`text-[1.1em] font-bold xl:max-2xl:text-[0.8em] py-2 px-4 cursor-pointer focus:outline-none ${filter === status
                  ? "bg-[#003249] text-white font-bold border-b-[4px] border-solid border-[#007bff]"
                  : "text-[#003249] border-b-5 border-[#132c47] border-solid"
                  }`}
                onClick={() => handleTabClick(status)}
              >
                {status}
              </button>
            ))}
            <button
              className="flex ml-auto items-center bg-[#153e5f] text-white text-[1em] font-bold px-4 py-3 rounded"
              onClick={handleChargesModalOpen}
            >
              <MdEditSquare className="mt-[5%] mr-2" />
              Set Charges
            </button>
          </div>

        </div>
      </div>
      <div className="h-[82.5vh] overflow-y-auto">
        <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
          <div className="px-[1%] bg-white rounded-lg drop-shadow-lg shadow-lg opacity-1">
            {/* Table to display bookings */}
            <table className="w-[100%] mt-[0.8%]">
              <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                <tr>
                  <th className="py-[0.7%]">Client Name</th>
                  <th>Invoice Sent Date</th>
                  <th>Total Balance</th>
                  <th>Remaining Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
                <tr>
                  <th
                    colSpan={6}
                    className="border-b-[1px] border-slate-500"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {/* Display filtered payments */}
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr className="text-center xl:max-2xl:text-[0.8em]" key={payment.payment_id}>
                      <td className="py-[1%]">{payment.clientName}</td>
                      <td>{payment.invoiceDate}</td>
                      <td>{payment.totalBalance}</td>
                      <td className="py-2 px-4">
                        {(payment.remainingBalance === null) ? (
                          payment.totalBalance ) : 
                          (payment.remainingBalance
                        )}
                        </td>
                      <td className="flex justify-center">
                        <p className={`font-bold rounded-full mt-1 py-[2%] w-[70%] xl:max-2xl:text-[0.9em] 
                          ${payment.status === "Pending" ? "bg-[#f6c3b3] text-[#4f2417]" :
                            payment.status === "Paid" ? "bg-[#8bdfa3] text-[#1a562b]" :
                              "bg-[#262626] text-[#afafaf]"}`}
                        >
                          {payment.status}
                        </p>
                      </td>
                      <td className="py-2 px-4">
                        {/* Buttons for View and Edit actions */}
                        <button onClick={() => handleViewModalOpen(payment)} className="bg-[#011627] text-white px-2 py-1 rounded mr-2">View</button>
                        {(payment.status === 'Paid') || (payment.status === 'Cancelled') ? (
                        <button
                        className="bg-[#ce3636] text-[#ffffff] px-2 py-1 rounded mr-2"
                    >
                        Delete
                    </button>
                        ) : (
                        <button onClick={() => handleEditModalOpen(payment)} className="bg-[#ff9736] text-[#1b1b1b] px-2 py-1 rounded">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))) : (
                    <td colSpan="7" className="text-center text-gray-500 py-4">No Payments Available</td>
                    
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SetChargesModal isOpen={isChargesModalOpen} onClose={handleChargesModalClose} />

      {/* View Booking Modal */}
      {isViewModalOpen && (
        <ViewPaymentModal
          payment={selectedPayment}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {/* Edit Booking Modal */}
      {isEditModalOpen && (
        <EditPaymentModal
          payment={selectedPayment}
          onSave={handleEditModalSave}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PaymentList;
