import React, { useEffect, useState } from "react";
import axios from 'axios';
import config from '../../../common/config';
import { AiFillSave, AiFillCloseCircle, AiFillEdit } from "react-icons/ai";

const EditPaymentModal = ({ payment, onSave, onClose }) => {
    const [status, setStatus] = useState(payment ? payment.status : "Pending");
    const [invoiceDate, setInvoiceDate] = useState(payment ? payment.invoiceDate : "");
    const [dueDate, setDueDate] = useState(payment ? payment.dueDate : "");
    const [paymentDate, setPaymentDate] = useState(payment ? payment.paymentDate : "");
    const [amountPaid, setAmountPaid] = useState(payment ? payment.amountPaid : 0);

    const handleSave = async () => {
        try {
            const payment_id = payment.payment_id; // Get payment_id from payment prop

            // Fetch the full payment details
            const paymentDetailsResponse = await axios.get(`${config.API}/payment/retrieve`, {
                params: {
                    col: 'payment_id',
                    val: payment_id,
                }
            });

            const fullPaymentDetails = paymentDetailsResponse.data.data[0]; // Assuming the API response contains the payment details
            const remBalance = fullPaymentDetails.total_balance - amountPaid;

            // Set dates to null if not provided
            const formattedInvoiceDate = invoiceDate || null;
            const formattedDueDate = dueDate || null;
            const formattedPaymentDate = paymentDate || null;

            // Update the payment object with new data
            const updatedPayment = {
                payment_id: payment_id,
                payment_status: status,
                invoice_date: formattedInvoiceDate,
                due_date: formattedDueDate,
                payment_date: formattedPaymentDate,
                paid_amount: amountPaid,
                rem_balance: remBalance,

            };

            // Call the API to update the payment
            const updateResponse = await axios.post(`${config.API}/payment/update`, updatedPayment);

            if (updateResponse.status === 200) {
                console.log('Payment updated successfully:', updateResponse.data);

                // Call the onSave function with the updated payment object
                onSave(updatedPayment);

                window.location.reload();
                // Close the modal after saving
                onClose();
            } else {
                console.error('Error updating payment:', updateResponse.data);
            }
        } catch (error) {
            // Handle error here
            console.error('Error updating payment:', error);
        }
    };
    return (
        <div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="animate-slide-up font-roboto fixed top-[25%] left-[30%] right-0 bg-white z-50 bg-[rgba(0, 0, 0, 0.5)] w-[40%] p-4 overflow-x-hidden overflow-y-auto h-[50%] drop-shadow rounded-3xl">
                <div className="flex w-[95%] h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <div className="flex items-center w-[100%] ml-[1%]">
                            <AiFillEdit className="mr-[1%] text-[2em] xl:max-2xl:text-[1.3em]" />
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Update Payment Details
                            </h1>
                        </div>
                    </div>
                    <div className="mt-[0.5%]">
                        <AiFillCloseCircle
                            className="text-[2.5em] hover:cursor-pointer xl:max-2xl:text-[1.8em]"
                            onClick={onClose}
                        />
                    </div>
                </div>
                <hr className="h-[2px] w-full my-[1.2%] bg-gray-200 border-0" />

                {/* General Information */}
                <div className="flex items-center w-full">
                    <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                        Status and Payment Dates
                    </h1>
                    <h1 className="font-bold uppercase text-[1.5em] ml-[18%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                        Set or Edit Balances
                    </h1>
                </div>
                <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set New Status</p>
                            <select
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="status"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Edit Invoice Date</p>
                            <input
                                type="date"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="invoiceDate"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Edit Due Date</p>
                            <input
                                type="date"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Place Payment Date</p>
                            <input
                                type="date"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="paymentDate"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Amount Paid</p>
                            <input
                                type="text"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="amountPaid"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative bottom-[2%] top-[2%] mb-[2%] w-[100%]">
                    <hr className=" w-[99%] h-[1px] bg-black border-0" />
                    <div className="flex justify-end mr-[3%] mt-[1%]">
                        <button
                            className="flex text-white text-[1.1em] bg-[#17A200] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em] hover:bg-[#117600]"
                            onClick={handleSave}
                        >
                            <AiFillSave className="my-[2%]  text-[1.2em] mr-[1%]" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPaymentModal;