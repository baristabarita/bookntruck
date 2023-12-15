const express = require('express');
const db = require('./db');

const createReview = (req, res) => {
  //const { client_id } = req.query;
  const { client_id, trucker_id, rating, comment } = req.body;

  const insertQuery = 'INSERT INTO review (rating, comment, date_submitted, client_id, trucker_id) VALUES (?, ?, NOW(), ?, ?)';
  const data = [rating, comment, client_id, trucker_id, ];
  console.log(data);
  db.query(insertQuery, data, (err, result) => {
    if (err) {
      console.error('Error inserting review data:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error inserting data' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        data: result,
      });
    } else {
      return res.status(500).json({ status: 500, success: false, error: 'Review Record insertion failed' });
    }
  });
};

const retrieveAll = (req,res)=>{   
    const retrieveRecs = 'SELECT * FROM review'
  
    db.query(retrieveRecs, (err, rows) => {
      if (err) {
        console.error('Error retrieving all review records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving all review records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          records: rows,
        });
      }
    });
}

const retrieveByParams = (req,res)=>{
    const { col, val } = req.query; 
  
    const retrieveSpecific = 'SELECT * FROM review WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col,val],(err, row) => {
      if (err) {
        console.error('Error retrieving review records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving review records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          records: row,
        });
      }
    });
  }
  const retrieveCountByParams = (req, res) => {
    const { col, val } = req.query;
  
    const retrieveSpecific = 'SELECT COUNT(*) AS record_count FROM review WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const recordCount = row[0].record_count;
  
            return res.status(200).json({
                status: 200,
                success: true,
                ratingCount: recordCount,
            });
        }
    });
  };
  
  const retrieveAverage = (req,res)=>{
    const { trucker_id } = req.query; 
  
    const retrieveSpecific = 'SELECT AVG(rating) AS average_rating FROM review WHERE trucker_id = ?';
  
    db.query(retrieveSpecific, [trucker_id],(err, result) => {
      if (err) {
        console.error('Error retrieving average rating:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving review records' });
      }else{
        const avg = result[0].average_rating;
        
        return res.status(200).json({
          status: 200,
          success: true,
          average: avg,
        });
      }
    });
  }

  module.exports = {
    createReview,
    retrieveAll,
    retrieveByParams,
    retrieveCountByParams,
    retrieveAverage
  }