const express = require('express');
const db = require('./db');
const hashCount = 10;
const bcrypt = require('bcrypt');

const updateUser = async (req,res)=>{
    try {
        const { userID } = req.query
        const userUpdate = req.body

        const cols = Object.keys(userUpdate)
        const values = Object.values(userUpdate);

        if (userUpdate.password) {
          const hashedpassword = await bcrypt.hash(userUpdate.password, hashCount);
          const passwordIndex = cols.indexOf("password");
    
          if (passwordIndex !== -1) {
            values[passwordIndex] = hashedpassword;
          }
        }

      const setClause = cols.map((col) => `${col} = ?`).join(', ')

      const sql = `UPDATE user SET ${setClause} WHERE user_id = ?`

        db.query(sql,[...values,userID],(err,results) =>{
            if(err){
                console.error('Error Getting data:', err)
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Account update unsuccessful",
                    error: err.message
                })
            } else{
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Successfully updated account",
                    data: results
                })
            }
        })        
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
            error: error.message
        });
    }
}

const retrieveAll = (req,res)=>{
    try {
        const sql = "SELECT * FROM user";
        db.query(sql, (err, results) => {
            if(err){

                res.status(500).json({error: 'Internal server error'})
            }else{
                res.json({
                    success: true,
                    user: results,
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByParams = (req,res)=>{
    try {
        const {col, val} = req.query
        const sql = "SELECT * FROM user WHERE ?? = ?"
        db.query(sql,[col, val], (err, results) => {
            if(err){

                res.status(201).json({error: 'User does not exist'})
            }else{
                res.status(200).json({
                    status: 200,
                    success: true,
                    records: results
                })
            }
        })
    }catch(error){
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByTwoParams = (req, res) => {
    const { col1, val1, col2, val2, orderVal, order } = req.query;
  
    const orderValue = orderVal ? orderVal : col1;
    const orderBy = order ? order : 'ASC';
  
    const retrieveSpecific = `SELECT * FROM user WHERE ?? = ? AND ?? = ? ORDER BY ${orderValue} ${orderBy}`;
  
    db.query(retrieveSpecific, [col1, val1, col2, val2], (err, row) => {
  
      if (err) {
        console.error('Error retrieving records:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          records: row,
        });
      }
    });
  }

  const retrieveClientTruckers = (req, res) => {
    const { col1, val1, col2, val2} = req.query;
  
    const retrieveSpecific = `SELECT * FROM user WHERE ?? = ? OR ?? = ?`;
  
    db.query(retrieveSpecific, [col1, val1, col2, val2], (err, row) => {
  
      if (err) {
        console.error('Error retrieving records:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          records: row,
        });
      }
    });
  }
  const retrieveTotalCount = (req, res) => {
    const retrieveSpecific = 'SELECT COUNT(*) AS user_count FROM user';
  
    db.query(retrieveSpecific, (err, row) => {
      if (err) {
        console.error('Error retrieving records:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
      } else {
        const userCount = row[0].user_count; // Change record_count to user_count
  
        return res.status(200).json({
          status: 200,
          success: true,
          totalCount: userCount, // Change count to totalCount
        });
      }
    });
  };
const retrieveCountByParams = (req, res) => {
    const { col, val } = req.query;
  
    const retrieveSpecific = 'SELECT COUNT(*) AS user_count FROM user WHERE ?? = ?';
  
    db.query(retrieveSpecific, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const userCount = row[0].user_count;
  
            return res.status(200).json({
                status: 200,
                success: true,
                totalCount: userCount,
            });
        }
    });
  };

  const retrieveCountByUserType = (req, res) => {

    const retrieveUserCount = 'SELECT COUNT(*) AS user_count FROM user WHERE ?? = ? AND ?? = ?'

    db.query(retrieveUserCount, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).json({ 
                status: 500, 
                success: false, 
                error: 'Error retrieving users' 
            });
        } else {
            const recordCount = row[0].record_count;
  
            return res.status(200).json({
                status: 200,
                success: true,
                userCount: recordCount,
            });
        }
    })
}
const retrieveRegistersThisMonth = (req, res) => {
    const retrieveRecs = `
      SELECT DATE(date_registered) as date, COUNT(*) as count
      FROM user
      WHERE MONTH(date_registered) = MONTH(CURRENT_DATE())
      AND YEAR(date_registered) = YEAR(CURRENT_DATE())
      GROUP BY DATE(date_registered)
      ORDER BY DATE(date_registered)`;
  
    db.query(retrieveRecs, (err, rows) => {
      if (err) {
        console.error('Error retrieving all records:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error retrieving all records' });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          records: rows,
        });
      }
    });
  }
  
const deleteRecord = (req, res) => {

    try {
      const { user_id } = req.query;
        const sql = 'DELETE FROM user WHERE user_id = ?';

        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.error('Error deleting record:', err);
                res.status(200).json({
                    status: 500,
                    success: false,
                    message: 'Error deleting record',
                    error: err.message,
                });
            } else {
                if (results.affectedRows === 0) {
                    res.status(200).json({
                        status: 404,
                        success: false,
                        message: 'Record not found',
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Record deleted successfully',
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
    updateUser,
    retrieveAll,
    retrieveByParams,
    retrieveByTwoParams,
    retrieveClientTruckers,
    retrieveTotalCount,
    retrieveCountByParams,
    retrieveCountByUserType,
    retrieveRegistersThisMonth,
    deleteRecord
}