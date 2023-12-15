/* MODIFY THIS ENTIRE COMPONENT */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../common/config';

const EditAccountForm = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const clientID = Number(localStorage.getItem("clnt_id"));

  const [formData, setFormData] = useState({
    username: "",
    emailAdd: "",
    contactNumber: "",
  });

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem(`client_${clientID}_data`));
    if (localStorageData) {
      setFormData(localStorageData);
    }
    // Fetch data from the API
    axios.get(`${config.API}/client/retrieve`, { params: { col: 'client_id', val: clientID } })
      .then(response => {
        console.log('resp- ', response);
        const apiData = response.data.clients[0];
        setFormData(prevData => ({
          ...prevData,
          username: apiData.client_name,
          emailAdd: apiData.email_address,
          contactNumber: apiData.contact_number,
        }));
        setUserID(response.data.clients[0].user_id);
        // Fetch user data using user_id from the client table
        axios.get(`${config.API}/user/retrieve?col=user_id&val=${apiData.user_id}`)
          .then(userResponse => {
            const userData = userResponse.data.records[0];
            console.log(userData);
            setFormData(prevData => ({
              ...prevData,
              emailAdd: userData.email_address,
            }));
          })
          .catch(userError => {
            console.error("Error fetching user details:", userError);
          });
      })
      .catch(error => {
        console.error("Error fetching data from API", error);
      });
  }, [clientID]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the API
    const clientUpdateData = {
      clients: {
        client_name: formData.username,
        contact_number: formData.contactNumber,
      },
    };

    // Send a POST request to update client data
    axios.post(`${config.API}/client/update?clientID=${clientID}`, clientUpdateData)
      .then(clientResponse => {
        console.log("Client response:", clientResponse);

        // Check if the update was successful
        if (clientResponse.data.success) {

          // Prepare the data to be sent to the API for user update
          const userUpdateData = {
            email_address: formData.emailAdd,
          };

          // Send a POST request to update user data
          axios.post(`${config.API}/user/update?userID=${userID}`, userUpdateData)
            .then(userResponse => {
              console.log("User data updated successfully:", userResponse.data);
              // Handle success, show a success message, or perform additional actions if needed
              onClose(); // Close the form
              onSave(); // Notify the parent component about the changes
            })
            .catch(userError => {
              console.error("Error updating user data:", userError);
            });
        } else {
          console.error("Error updating client data:", clientResponse.data.message);
        }
      })
      .catch(clientError => {
        console.error("Error updating client data:", clientError);
      });

  };

  const handleDelete = () => {
    setShowConfirmationModal(true);
    setActionType("delete");
  };

  const handleDeactivate = () => {
    setShowConfirmationModal(true);
    setActionType("deactivate");
  };

  const handleConfirmation = () => {
    if (actionType === "delete") {
      axios.post(`${config.API}/client/delete?clientID=${clientID}`)
        .then((response) => {
          console.log("Account deletion successful:", response.data);
          localStorage.removeItem('clientDetails');
          navigate("/usrlogin");
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    } else if (actionType === "deactivate") {
      axios.post(`${config.API}/client/deactivate?clientID=${clientID}`)
        .then((response) => {
          console.log("Account deactivation successful:", response.data);
          localStorage.removeItem('clientDetails');
           navigate("/usrlogin");
        })
        .catch((error) => {
          console.error("Error deactivating account:", error);
        });
    }
  };
  const handleCancellation = () => {
    setShowConfirmationModal(false);
    // Additional actions upon cancellation (if needed)
  };
  return (
    <div className="bg-white rounded border shadow-lg drop-shadow-lg p-4 mb-4 max-w-2xl mx-auto transition-all duration-300 ease-in-out">
      <div className="grid grid-cols-2 gap-8">
        {/* First Column: Editable Account Details */}
        <form onSubmit={handleSubmit} className="col-span-1">
          <h2 className='font-bold mb-2'>Edit Account Details</h2>
          <hr className="my-4 border-gray-400" />
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="emailAdd"
              value={formData.emailAdd}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <button
            className="bg-blue-500 text-white font-bold px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button onClick={onClose} className="ml-[16%] bg-gray-600 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </form>

        {/* Second Column: Advanced Settings */}
        <div className="col-span-1">
          <h2 className="font-bold mb-2">Advanced Settings</h2>
          <hr className="my-4 border-gray-400" />
          <p className="text-sm text-gray-600 mb-4">
            You can permanently delete or temporarily deactivate your account.
          </p>
          <div className="flex space-x-4 text-[0.8em]">
            <button
              className="bg-red-500 text-white px-4 font-bold rounded"
              onClick={handleDelete}
            >
              Delete Account
            </button>
            <button
              className="bg-orange-500 text-white font-bold px-4 py-2 rounded"
              onClick={handleDeactivate}
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">Are you sure you want to {actionType === 'delete' ? 'delete' : 'deactivate'} your account?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleConfirmation}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={handleCancellation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAccountForm;
