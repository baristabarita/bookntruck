import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../common/config';
import { MdReviews } from 'react-icons/md'
import Rating from "@mui/material/Rating";




const ViewRatings = () => {
  const truckerID = Number(localStorage.getItem('trkr_id'));
  const [review, setReview] = useState([]);

  const fetchReviews = () => {
    const col = 'trucker_id';
    const val = truckerID;

    axios.get(`${config.API}/review/retrieve?col=${col}&val=${val}`)
    .then((response)=>{
      const reviewData = response.data.records;

      //if reviewData is an array
      if(Array.isArray(reviewData)){
        Promise.all(
          reviewData.map((review) => {
            const clientVal = review.client_id;

            return axios.get(`${config.API}/client/retrieve?col=client_id&val=${clientVal}`)
            .then((clientResponse) => {
              if(Array.isArray(clientResponse.data.clients) && clientResponse.data.clients.length > 0){
                review.client_name = clientResponse.data.clients[0].client_name;
              }else{
                console.error("Invalid or empty clients array in API response");
              }
              return review;
            })
            .catch((error)=>{
              console.error("Error fetching client details: ", error);
              return review;
            })
          })
        ).then((reviewWithClientName) => {
          setReview(reviewWithClientName);
        })
        .catch((error)=>{
          console.error("Error fetching client details");
        });
      } else {
        console.error("Invalid data format for reviews: ", reviewData);
      }
    })
    .catch((error)=>{
      console.error("Error fetching reviews: ", error);
    });
  }

  useEffect(()=>{
    fetchReviews();
  })

  return (
    <div className="animate-fade-in p-8">
      <div className="my-4 mx-5 flex text-[2em] font-bold items-center">
      <p className="flex text-[0.8em]">
          <MdReviews className="mr-2" /> View your Ratings
        </p>
        
      </div>

      {/* MODIFY THIS ENTIRE SECTION!! */}
      {review.map((review, index) => (
      <div key={index} className="bg-white rounded p-4 mb-4 shadow-md">
        <div className="font-bold mb-2">{review.client_name}</div>
        <div className="mb-2">
          <div className="flex items-center">
            <span className="font-bold">Review Rating: {review.rating}</span>
            <Rating
              className='ml-2'
              value={review.rating}
              precision={0.5}
              readOnly
              style={{ color: review.rating >= 3 ? '#F6AE2D' : 'red' }}
            />
          </div>
        </div>
        <div>{review.comment}</div>
      </div>
    ))}

    </div>
  );
};

export default ViewRatings;
