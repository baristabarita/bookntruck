const express = require('express');
const db = require('./db');

const createContainer = (req, res)=>{
    const{
        container_type,
        weight,
        quantity,
        pickup_location,
        item_name,
        item_type,
        item_weight,
        item_quantity
    } = req.body;

    const insertContainer = 'INSERT INTO container (container_type, weight, quantity, pickup_location, item_name, item_type, item_weight, item_quantity) VALUES (?,?,?,?,?,?,?,?)';
    const data = [container_type, weight, quantity, pickup_location, item_name, item_type, item_weight, item_quantity];
    db.query(insertContainer, data, (err, result) => {
      if (err) {
        return res.status(500).json({ status: 500, success: false, error: 'Error inserting container data' });
      }
      if (result.affectedRows > 0) {
        const containerId = result.insertId; // Get the generated container_id
        return res.status(200).json({
          status: 200,
          success: true,
          data: { containerId }, // Include containerId in the response
        });
      } else {
        return res.status(500).json({ status: 500, success: false, error: 'Container Record insertion failed' });
      }
    });
}

const updateContainer = (req, res)=>{
    const {
        container_id,
        container_type,
        weight,
        quantity,
        pickup_location,
        item_name,
        item_type,
        item_weight,
        item_quantity
    } = req.body;

    const update = 'UPDATE SET container_type=?, weight=?, quantity=?, pickup_location=?, item_name=?, item_type=?, item_weight=?, item_quantity=? WHERE container_id=?'
    const data = [container_type, weight, quantity, pickup_location, item_name, item_type, item_weight, item_quantity,container_id]
    db.query(update, data, (err, result)=>{
        if(err){
            console.error('Error updating container data:', err);
            return res.status(500).json({ status: 500, sucess: false, error: 'Error updating container data'});
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({
              status: 200,
              success: true,
              data: result,
            });
          } else {
            return res.status(500).json({ status: 500, success: false, error: 'Record update failed' });
          }
    });
}

const retrieveAll = (req,res)=>{
    const retrieveRecs = 'SELECT * FROM container'

    db.query(retrieveRecs, (err, rows) => {
      if (err) {
        console.error('Error retrieving all container records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving all container records' });
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

    const retrieveSpecific = 'SELECT * FROM container WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col,val],(err, row) => {
      if (err) {
        console.error('Error retrieving container records:', err);
        return res.status(500).json({ status: 500, success:false,error: 'Error retrieving container records' });
      }else{
        return res.status(200).json({
          status: 200,
          success: true,
          data: row,
        });
      }
    });
}

const retrieveByTwoParams = (req,res)=>{
  const { col1, val1, col2, val2, order_param} = req.query; 
  var orderByClause = ''; // Initialize the ORDER BY clause

  if (order_param) {
    // If an order_param is provided, add the ORDER BY clause
    orderByClause = ` ORDER BY ${order_param} ASC`; // You can change ASC to DESC if needed
  }

  const retrieveSpecific = `SELECT * FROM package WHERE ?? = ? AND ?? = ?${orderByClause}`;

  db.query(retrieveSpecific, [col1,val1, col2, val2],(err, rows)  =>  {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success:false,error: 'Error retrieving records' });
    }else{
      return res.status(200).json({
        status: 200,
        success: true,
        data: rows,
      });
      
    }
  });
}

const deleteContainer = (req, res) => {
    const { container_id } = req.body;
  
    const deleteQuery = 'DELETE FROM container WHERE container_id = ?';
  
    db.query(deleteQuery, container_id, (err, result) => {
        if (err) {
            console.error('Error deleting container record:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error deleting container record' });
        } else {
            if (result.affectedRows > 0) {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Container deleted successfully',
                });
            } else {
                return res.status(500).json({ status: 500, success: false, error: 'Container not found or could not be deleted' });
            }
        }
    });
  };

  module.exports = {
    createContainer,
    updateContainer,
    retrieveAll,
    retrieveByParams,
    retrieveByTwoParams,
    deleteContainer,
  }