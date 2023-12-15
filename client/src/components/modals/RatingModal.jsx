import React, { useState } from 'react';
import axios from 'axios'
import config from '../../common/config'
import { FaTimes } from 'react-icons/fa';

const RatingModal = ({ truckerDetails, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const storedAcc = localStorage.getItem('clientDetails');
  const clientID = Number(localStorage.getItem('clnt_id'));
  console.log(clientID);
  const parsedAcc = JSON.parse(storedAcc);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    try {

        const response = await axios.post(`${config.API}/review/create`, {
          client_id: clientID,
          trucker_id: truckerDetails.trucker_id,
          rating: rating,
          comment: review,
        });
        console.log('Review submitted successfully:', response.data);
        // You can add additional logic here if needed
  
        // After submission, close the modal
        onClose();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error as needed
    }
  };

  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div className="modal-container bg-white rounded-lg p-8 z-50 relative w-[75vh]">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating: (1 - 5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={handleRatingChange}
            className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review:</label>
          <textarea
            value={review}
            onChange={handleReviewChange}
            className="w-full h-32 py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Write your review here..."
          ></textarea>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default RatingModal;
