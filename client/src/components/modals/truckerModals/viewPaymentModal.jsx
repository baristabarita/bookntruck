import React, { useEffect, useState } from "react";
import axios from 'axios'
import config from '../../../common/config'
import { PiNotebookFill } from "react-icons/pi";
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";

const ViewPaymentModal = ({ payment, onClose }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentResponse = await axios.get(`${config.API}/payment/retrieve`, {
          params: {
            col: 'payment_id',
            val: payment.payment_id,
          }
        });
        setPaymentDetails(paymentResponse.data.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    if (payment) {
      fetchPayment();
    }
  }, [payment]);
  console.log("payment deets; ", paymentDetails);
  // Check if paymentDetails is null before accessing its properties
  const status = paymentDetails?.payment_status;
  const dueDate = paymentDetails?.due_date ? new Date(paymentDetails?.due_date).toLocaleDateString("en-US") : null;
  const invcDate = paymentDetails?.invoice_date ? new Date(paymentDetails?.invoice_date).toLocaleDateString("en-US") : null;
  const paymentDate = paymentDetails?.payment_date ? new Date(paymentDetails?.payment_date).toLocaleDateString("en-US") : null;
  const serviceCharge = paymentDetails?.service_charge;
  const distanceCharge = paymentDetails?.distance_charge;
  const containerCharge = paymentDetails?.container_charge;
  const totalBalance = paymentDetails?.total_balance;

  return (
    <div>
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="animate-slide-up font-roboto fixed top-[8%] left-[18%] right-0 bg-white z-50 bg-[rgba(0, 0, 0, 0.5)] w-[60%] p-4 overflow-x-hidden overflow-y-auto h-[60%] drop-shadow rounded-3xl">
        <div className="flex w-full h-[5vh]">
          <div className="flex items-center w-[96%] mt-[0.5%]">
            <PiNotebookFill className="text-[2.8em] ml-[1%] mr-[1%] xl:max-2xl:text-[2em]" />
            <div>
              <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                View Payment Details
              </h1>
              <p className="mt-[-1%] text-[1.2em] xl:max-2xl:text-[0.9em]">
                ID: {payment.payment_id}
              </p>
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

        <h1 className="font-bold uppercase text-[1.5em] ml-[2%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
          Status and Booking Client
        </h1>
        <h1 className="font-bold uppercase text-[1.5em] ml-[20%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
          Payment Related Dates
        </h1>
        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
          <div className="w-[50%]">
            <p className="my-[1%]">
              <span className="font-bold">Payment Status: </span>
              {status}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Booking ID: </span>
              {payment.booking_id}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Client Name: </span>
              {payment.clientName}
            </p>
          </div>
          <div className="w-[50%] ml-[10%]">
            <p className="my-[1%]">
              <span className="font-bold">Invoice Sent Date: </span>
              {invcDate}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Payment Due Date: </span>
              {dueDate}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Payment Completion Date: </span>
              {paymentDate}
            </p>
          </div>
        </div>

        <h1 className="font-bold uppercase text-[1.5em] ml-[2%] bg-[#003249] inline-block px-[1%] mt-[2%] text-white rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
          Charges and Balance
        </h1>
        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
          <div className="w-[33%]">
            <p className="my-[1%]">
              <span className="font-bold">Service Charge: $</span>
              {serviceCharge}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Distance Charge: $</span>
              {distanceCharge}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Containers Charge: $</span>
              {containerCharge}
            </p>
          </div>
          <div className="w-[33%]">
            <p className="my-[1%]">
              <span className="font-bold">Total Balance: $</span>
              {totalBalance}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Remaining Balance: $</span>
              {paymentDetails?.rem_balance}
            </p>
            <p className="my-[1%]">
              <span className="font-bold">Amount Paid: $</span>
              {paymentDetails?.paid_amount}
            </p>


          </div>

        </div>
        <div className="fixed bottom-[2%] ml-[-1%] w-[100%]">
          <hr className=" w-[100%] h-[1px] bg-black border-0" />
          <div className="flex justify-end mr-[3%] mt-[1%]">
            <button
              className="flex text-white text-[1.1em] bg-[#DD2803] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em]
                hover:bg-[#840705] transition-colors delay-450 duration-[3000] ease-in-out"
            >
              <AiFillDelete className="mt-[5%] pr-[5%] " />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentModal;
