const express = require('express');
const db = require('./db');

const createPayment = (req, res)=>{
    const { service_charge, distance_charge, container_charge, total_balance} = req.body;
    
    const insertPay = 'INSERT INTO payment (service_charge, distance_charge, container_charge, total_balance, payment_status) VALUES (?, ?, ?, ?, ?)';
    const payment_status = 'Pending'

    const data = [service_charge, distance_charge, container_charge, total_balance, payment_status]
    db.query(insertPay, data, (err,result) => {
        if(err){
            console.error('Error inserting payment data:', err);
            return res.status(500).json({ status: 500, success:false,error: 'Error inserting payment data' });
        }
        if (result.affectedRows > 0) {
          const paymentId = result.insertId;
            return res.status(200).json({
              status: 200,
              success: true,
              data: { paymentId },
            });
          } else {
            return res.status(500).json({ status: 500, success: false, error: 'Payment Record insertion failed' });
          }
        });
}

const updatePayment = (req, res) => {
  const payment_id = req.body.payment_id;
  const updateData = { ...req.body };

  console.log("Update Payment Request Received:", updateData);

  // Prepare SQL query
  let updatePay = 'UPDATE payment SET ';
  let data = [];


  // Iterate over updateData object to construct SQL query
  for (let key in updateData) {
    if (updateData.hasOwnProperty(key) && updateData[key] !== null) {
      updatePay += `${key}=?, `;
      data.push(updateData[key]);
    }
  }

  // Remove trailing comma and space
  updatePay = updatePay.slice(0, -2);

  // Add WHERE clause
  updatePay += ' WHERE payment_id=?';
  data.push(payment_id);

  console.log("SQL: ", updatePay);
  console.log("PAY UPD DATA: ", data);

  // First query to update payment details
  db.query(updatePay, data, (err, result) => {
    if (err) {
      console.error('Error updating payment data:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error updating payment data' });
    }

    if (result.affectedRows > 0) {
      // Second query to update date_updated
      const dateUpdatedQuery = 'UPDATE payment SET date_updated = CURRENT_TIMESTAMP() WHERE payment_id = ?';
      const dateUpdatedData = [payment_id];

      db.query(dateUpdatedQuery, dateUpdatedData, (dateUpdatedErr, dateUpdatedResult) => {
        if (dateUpdatedErr) {
          console.error('Error updating date_updated:', dateUpdatedErr);
          return res.status(500).json({ status: 500, success: false, error: 'Error updating date_updated' });
        }

        return res.status(200).json({
          status: 200,
          success: true,
          data: result,
        });
      });
    } else {
      return res.status(500).json({ status: 500, success: false, error: 'Payment Record update failed' });
    }
  });
};


  const retrieveAll = (req,res)=>{
    const retrieveRecs = 'SELECT * FROM payment'
  
    db.query(retrieveRecs, (err, rows) => {
      if (err) {
        console.error('Error retrieving all payment records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving all payment records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          data: rows,
        });
      }
    });
  }
  
  const retrieveByParams = (req,res)=>{
    const { col, val } = req.query; 
  
    const retrieveSpecific = 'SELECT * FROM payment WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col,val],(err, row) => {
      if (err) {
        console.error('Error retrieving payment records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving payment records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          data: row,
        });
      }
    });
  }
  
  const retrieveCountByParams = (req, res) => {
    const { col, val } = req.query;
  
    const retrieveSpecific = 'SELECT COUNT(*) AS record_count FROM payment WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving payment records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const recordCount = row[0].record_count;
  
            return res.status(200).json({
                status: 200,
                success: true,
                payCount: recordCount,
            });
        }
    });
  };

  const deletePayment = (req,res)=>{
    const {pay_id} = req.body;
  
    const deleteQuery = 'DELETE FROM payment WHERE payment_id = ?';
  
    db.query(deleteQuery, pay_id,(err, result) => {
      if (err) {
        console.error('Error deleting payment record:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error deleting payment records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          data: result,
        });
      }
    });
  }


  module.exports = {
    createPayment,
    updatePayment,
    retrieveAll,
    retrieveByParams,
    deletePayment,
    retrieveCountByParams
}