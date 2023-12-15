const express = require('express');
const db = require('./db');
const hasCount = 10;
const bcrypt = require('bcrypt'); 

const updateDetails = async (req, res) => {
    try {
      const { clientID } = req.query;
      const clientUpdate = req.body.clients;
  
      if (!clientUpdate) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Bad Request. 'clients' property is missing in the request body."
        });
      }
  
      const cols = Object.keys(clientUpdate);
      const values = Object.values(clientUpdate);
  
      console.log('Received update request for clientID:', clientID);
      console.log('Updating client details:', clientUpdate);
  
      const setClause = cols.map((col) => `${col} = ?`).join(', ');
      const sql = `UPDATE client SET ${setClause} WHERE client_id = ?`;
  
      console.log('SQL Query:', sql);
  
      // First query to update client details
      db.query(sql, [...values, clientID], (err, results) => {
        if (err) {
          console.error('Error updating client details:', err);
          res.status(500).json({
            status: 500,
            success: false,
            message: "Account Update Unsuccessful.",
            error: err.message
          });
        } else {
          // Second query to update date_updated
          const dateUpdatedQuery = 'UPDATE client SET date_updated = CURRENT_TIMESTAMP() WHERE client_id = ?';
          const dateUpdatedData = [clientID];
  
          db.query(dateUpdatedQuery, dateUpdatedData, (dateUpdatedErr, dateUpdatedResult) => {
            if (dateUpdatedErr) {
              console.error('Error updating date_updated:', dateUpdatedErr);
              return res.status(500).json({ status: 500, success: false, error: 'Error updating date_updated' });
            }
  
            console.log('Client details updated successfully');
            res.status(200).json({
              status: 200,
              success: true,
              message: "Account Updated Successfully",
              data: results
            });
          });
        }
      });
    } catch (error) {
      console.error('Error in updateDetails:', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Database Error",
        error: error.message
      });
    }
  };
  
const retrieveAll = (req, res) => {
    try{
        const sql = "SELECT * FROM client";
        db.query(sql, (err, results) => {
            if(err){

                res.status(500).json({error: 'Internal server error'})
            }else{
                res.json({
                    success: true,
                    client: results,
                })
            }
        })
    } catch (error){
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByParams = (req, res) => {
    try{
        const {col, val} = req.query
        const sql = "SELECT * FROM client WHERE ?? = ?"
        db.query(sql,[col, val], (err, results) => {
            if(err){

                res.status(201).json({error: 'Account does not exist'})
            }else{
                res.status(200).json({
                    status: 200,
                    success: true,
                    clients: results
                })
            }
        })
    } catch (error){
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveCountByParams = (req, res) => {
    const { col, val } = req.query;
  
    const retrieveSpecific = 'SELECT COUNT(*) AS record_count FROM client WHERE ?? = ?';

    db.query(retrieveSpecific, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const recordCount = row[0].record_count;
  
            return res.status(200).json({
                status: 200,
                success: true,
                clientCount: recordCount,
            });
        }
    });
}

const retrieveClientCount = (req, res) => {
    const { year } = req.query

    const retrieveClientCount = 'SELECT YEAR(date_registered) AS reg_year , MONTH(date_registered) AS reg_month, COUNT(client_id) AS count_client FROM client WHERE YEAR(date_signedup) = ? AND client_status =  "active" GROUP BY MONTH(date_registered);'

    db.query(retrieveClientCount, [year], (err, clients) => {
        if (err) {
            console.error('Error retrieving clients:', err);
            return res.status(500).json({ 
                status: 500, 
                success: false, 
                error: 'Error retrieving clients' 
            });
        } else {
            const clientCount = clients;
  
            return res.status(200).json({
                status: 200,
                success: true,
                clientCount: clientCount,
            });
        }
    })
}

const deactivateClient = async (req, res) => {
    try {
        const { clientID } = req.query;

        if (!clientID) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request. Missing parameters.',
            });
        }

        // SQL query to update the user status and client date_updated
        let sql = `UPDATE user, client 
                   SET user.status = 'deactivated', 
                       client.date_updated = NOW() 
                   WHERE user.user_id = client.user_id 
                   AND client.client_id = ?`;

        // Execute the query
        db.query(sql, [clientID], (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Account update unsuccessful',
                    error: err.message,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Successfully deactivated client',
                    data: result,
                });
            }
        });
    } catch (error) {
        console.error('Error in deactivateClient:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { clientID } = req.query;

        if (!clientID) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request. Missing parameters.',
            });
        }

        // SQL query to update the user status and client date_updated
        let sql = `UPDATE user, client 
                   SET user.status = 'deleted', 
                       client.date_updated = NOW() 
                   WHERE user.user_id = client.user_id 
                   AND client.client_id = ?`;

        // Execute the query
        db.query(sql, [clientID], (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Account update unsuccessful',
                    error: err.message,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Successfully deleted client',
                    data: result,
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteClient:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const harddeleteDetails = (req, res) => {
    try {
        const { client_id } = req.query;
        const sql = 'DELETE FROM client WHERE client_id = ?';

        db.query(sql, [client_id], (err, results) => {
            if (err) {
                console.error('Error deleting client record:', err);
                res.status(200).json({
                    status: 500,
                    success: false,
                    message: 'Error deleting client record',
                    error: err.message,
                });
            } else {
                if (results.affectedRows === 0) {
                    res.status(200).json({
                        status: 404,
                        success: false,
                        message: 'Client Record not found',
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Client Record deleted successfully',
                    });
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Database Error',
            error: error.message,
        });
    }
};

module.exports = {
    updateDetails,
    retrieveAll,
    retrieveByParams,
    retrieveCountByParams,
    retrieveClientCount,
    deactivateClient,
    deleteClient,
    harddeleteDetails
}