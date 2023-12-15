import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from '../../../common/config'
import { FaUser } from "react-icons/fa";
import BookingCard from "../../../components/card/BookingCard.jsx";
import EditAccountForm from "../../../components/forms/EditAccountForm.jsx";
import bookingchoiceimg from '../../../assets/bookingchoices-section-2.png'

const UserProfile = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [allCount, setAllCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const clientID = Number(localStorage.getItem("clnt_id"));

  const fetchTruckerDetails = async (fetchedBookings) => {
    const updatedBookings = [];

    for (const booking of fetchedBookings) {
      const truckerVal = booking.trucker_id;
      try {
        const truckerResponse = await axios.get(`${config.API}/trucker/retrieve?col=trucker_id&val=${truckerVal}`);
        const businessName = truckerResponse.data.trucker[0].business_name;
        updatedBookings.push({
          ...booking,
          businessName,
        });
      } catch (truckerError) {
        console.error("Error fetching trucker details:", truckerError);
        updatedBookings.push(booking);
      }
    }

    setBookings(updatedBookings);
  };

  useEffect(() => {
    axios.get(`${config.API}/client/retrieve?col=client_id&val=${clientID}`)
      .then(response => {
        const user = response.data.clients[0];
        console.log(user);
        // Fetch user data using user_id from the client table
        axios.get(`${config.API}/user/retrieve?col=user_id&val=${user.user_id}`)
          .then(userResponse => {
            const userData = userResponse.data.records[0];
            console.log(userData);
            setUserData({
              username: user.client_name,
              email: userData.email_address,
              contactNumber: user.contact_number,
            });
          })
          .catch(userError => {
            console.error("Error fetching user details:", userError);
          });
      })
      .catch(clientError => {
        console.error("Error fetching client details:", clientError);
      });

    const col = "client_id";
    const val = clientID;
    const orderCol = "booking_date";
    const order = "DESC";

    axios.get(`${config.API}/booking/retrieve?col=${col}&val=${val}&orderVal=${orderCol}&order=${order}`)
      .then(response => {
        const fetchedBookings = response.data.records || [];
        fetchTruckerDetails(fetchedBookings);
      })
      .catch(error => {
        console.error("Error fetching bookings:", error);
      });
  }, [clientID]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const fetchCounts = async () => {
    try {
      const allResponse = await axios.get(`${config.API}/booking/retrievecount_two?col1=client_id&val1=${clientID}&col2=is_visible&val2=1`);
      setAllCount(allResponse.data.count);
      // Fetch pendingCount
      const pendingResponse = await axios.get(`${config.API}/booking/retrievecount_three?col1=client_id&val1=${clientID}&col2=status&val2=Pending&col3=is_visible&val3=1`);
      setPendingCount(pendingResponse.data.count);

      // Fetch currentCount from three different APIs and calculate the sum
      const reservedResponse = await axios.get(`${config.API}/booking/retrievecount_three?col1=client_id&val1=${clientID}&col2=status&val2=Reserved&col3=is_visible&val3=1`);
      const ongoingResponse = await axios.get(`${config.API}/booking/retrievecount_three?col1=client_id&val1=${clientID}&col2=status&val2=Ongoing&col3=is_visible&val3=1`);
      const pulloutResponse = await axios.get(`${config.API}/booking/retrievecount_three?col1=client_id&val1=${clientID}&col2=status&val2=Pullout Docs Required&col3=is_visible&val3=1`);

      const currentCountSum = reservedResponse.data.count + ongoingResponse.data.count + pulloutResponse.data.count;
      setCurrentCount(currentCountSum);

      // Fetch completedCount
      const completedResponse = await axios.get(`${config.API}/booking/retrievecount_three?col1=client_id&val1=${clientID}&col2=status&val2=Completed&col3=is_visible&val3=1`);
      setCompletedCount(completedResponse.data.count);

    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchCounts();
    };
    fetchData();
  }, []);

  /* MODIFY handleSaveChanges */
  const handleSaveChanges = () => {
    axios.get(`${config.API}/client/retrieve?col=client_id&val=${clientID}`)
      .then(response => {
        const user = response.data.clients[0];
        // Fetch user data using user_id from the client table
        axios.get(`${config.API}/user/retrieve?col=user_id&val=${user.user_id}`)
          .then(userResponse => {
            const userData = userResponse.data.records[0];
            setUserData({
              username: user.client_name,
              email: userData.email_address,
              contactNumber: user.contact_number,
            });
          })
          .catch(userError => {
            console.error("Error fetching user details:", userError);
          });
      })
      .catch(error => {
        console.error("Error fetching user details:", error);
      });
  };

  const renderBookings = (bookings) => {
    const estfindate = bookings[0]?.est_finish_date ? new Date(bookings[0]?.est_finish_date).toISOString().split('T')[0] : null;
    return bookings.map((booking) => (
      <BookingCard
        key={booking.booking_id}
        status={booking.status}
        bookingId={`Booking ID: ${booking.booking_id}`}
        businessName={booking.businessName}
        deliveryAddress={`Delivery Address: ${booking.delivery_address}`}
        estFinishDate={`Estimated Finish Date: ${booking.est_finish_date}`}
        handleDetailsClick={() => handleDetailsClick(booking)}
      />
    ));
  };

  const handleDetailsClick = (booking) => {
    if (booking) {
      navigate(`/bookingchoices/servicedetails`, {
        state: {
          ...booking,
        },
      });
    }
  };

  const allBookings = bookings.filter(
    (booking) => booking.is_visible === 1
  );


  const currentBookings = bookings.filter(
    (booking) => (booking.status === "Reserved" || booking.status === "Ongoing" || booking.status === "Pullout Docs Required") && booking.is_visible === 1
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending" && booking.is_visible === 1
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed" && booking.is_visible === 1
  );

  const filteredBookings = tab === "pending" ? pendingBookings : tab === "completed" ? completedBookings : tab === "current" ? currentBookings : allBookings;

  return (
    <div className="flex-grow min-h-screen bg-image bg-cover h-full" style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
      <div className="container mx-auto p-8 flex flex-col items-center">

        {/* Profile Section */}
        <div className="border rounded p-4 mb-8 text-lg bg-white shadow-lg drop-shadow-lg w-full md:w-3/4 lg:w-1/2">
          <div className="flex justify-between">
            <div className="rounded-full w-48 h-48 bg-white border p-4 shadow-lg">
              <div className="flex items-center justify-center h-full">
                <FaUser size={100} />
              </div>
            </div>

            <div className="font-roboto bg-white rounded border  p-4 shadow-lg ml-2 flex-grow">
              <div className="mb-4">
                <div className="flex mb-2">
                  <div className="font-bold text-left">
                    <h1>Name: </h1>
                  </div>
                  <div className="flex-grow text-right">
                    <h1>{userData.username}</h1>
                  </div>
                </div>

                <div className="flex mb-2">
                  <div className="font-bold text-left">
                    <p><strong>Email: </strong></p>
                  </div>
                  <div className="flex-grow text-right">
                    <p>{userData.email}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="font-bold text-left">
                    <p><strong>Contact Number: </strong></p>
                  </div>
                  <div className="flex-grow text-right">
                    <p>{userData.contactNumber}</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleEditClick}
                  className="bg-[#007EA7] hover:bg-[#011627]  text-white text-[0.8em] rounded self-start w-[30%] h-[25%]"
                >
                  Edit Account
                </button>

              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="p-4 mb-8 text-xl transition-all duration-300 ease-in-out">
            <EditAccountForm onClose={() => setIsEditing(false)} onSave={handleSaveChanges} />
          </div>
        )}


        {/* Bookings Section */}
        <div className="mb-8">
          <div className="mb-8 font-roboto">
            <button
              className={`ml-4 mr-2 font-bold border-b-4 ${tab === "all" ? "border-blue-500 bg-gray-400" : "border-gray-300"}`}
              onClick={() => setTab("all")}
            >
              All Bookings ({allCount})
            </button>
            <button
              className={`mr-2 font-bold border-b-4 ${tab === "pending" ? "border-blue-500 bg-gray-400" : "border-gray-300"}`}
              onClick={() => setTab("pending")}
            >
              Pending Bookings ({pendingCount})
            </button>

            <button
              className={`mr-2 font-bold border-b-4 ${tab === "current" ? "border-blue-500 bg-gray-400" : "border-gray-300"}`}
              onClick={() => setTab("current")}
            >
              Current Bookings ({currentCount})
            </button>

            <button
              className={`font-bold border-b-4 ${tab === "completed" ? "border-blue-500 bg-gray-400" : "border-gray-300"}`}
              onClick={() => setTab("completed")}
            >
              Completed Bookings ({completedCount})
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center mt-4 font-bold">No Bookings on Record</div>
          ) : (
            <div>{renderBookings(filteredBookings)}</div>
          )}
          </div>


      </div>

    </div>
  );
};

export default UserProfile;
