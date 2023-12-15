const express = require('express');
const db = require('./db');
const hashCount = 10;
const bcrypt = require('bcrypt');

const createAdminAccount = async (req, res) => {
    try {
      const { email_address, password, user_type, admin_name } = req.body;
      const hashedPassword = await bcrypt.hash(password, hashCount);
  
      // Step 1: Insert into the user table
      const userInsertQuery = "INSERT INTO user (email_address, password, user_type) VALUES (?, ?, ?)";
      const userInsertValues = [email_address, hashedPassword, user_type];
  
      db.query(userInsertQuery, userInsertValues, (userInsertError, userInsertResults) => {
        if (userInsertError) {
          console.error("User insertion error:", userInsertError);
          return res.status(500).json({
            success: false,
            message: "User registration failed.",
            error: userInsertError.message,
          });
        }
  
        const userId = userInsertResults.insertId;
  
        // Step 2: Insert into the admin table
        const adminInsertQuery = "INSERT INTO admin (admin_name, user_id) VALUES (?, ?)";
        const adminInsertValues = [admin_name, userId];
  
        db.query(adminInsertQuery, adminInsertValues, (adminInsertError, adminInsertResults) => {
          if (adminInsertError) {
            console.error("Admin insertion error:", adminInsertError);
            return res.status(500).json({
              success: false,
              message: "Admin registration failed.",
              error: adminInsertError.message,
            });
          }
  
          res.status(200).json({
            success: true,
            message: "admin registered successfully!",
            data: {
              userId: userId,
              adminData: adminInsertResults,
            },
          });
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed.",
        error: error.message,
      });
    }
  };

  const adminUserLogin = (req, res) => {
    try {
      const { email_address, password, user_type } = req.body;
  
      // Use a parameterized query to prevent SQL injection
      const sql = `
          SELECT u.user_id, u.email_address, u.password, u.user_type, a.admin_id, a.admin_name
          FROM user u
          LEFT JOIN admin a ON u.user_id = a.user_id
          WHERE u.email_address = ?
      `;
      const values = [email_address];
  
      db.query(sql, values, async (err, dbresult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            error: "Database Error",
          });
        }
  
        if (dbresult.length === 1) {
          // Check if user_type matches
          if (user_type !== dbresult[0].user_type) {
            return res.status(200).json({
              success: false,
              error: "User Type Mismatch! Check if you are in the correct Login Page.",
            });
          }
  
          // Compare passwords
          const result = await bcrypt.compare(password, dbresult[0].password);
  
          if (result) {
            // Update last_login
            const updateLogin = "UPDATE user SET last_login = CURRENT_TIMESTAMP() WHERE user_id = ?";
            const userLogged = [dbresult[0].user_id];
  
            db.query(updateLogin, userLogged, (updateErr) => {
              if (updateErr) {
                console.error("Error updating last_login:", updateErr);
              }
  
              return res.status(201).json({
                success: true,
                message: "Retrieved",
                admin_info: {
                  adminID: dbresult[0].admin_id,
                  adminName: dbresult[0].admin_name,
                  email: dbresult[0].email_address,
                  type: dbresult[0].user_type,
                  userID: dbresult[0].user_id,
                },
              });
            });
          } else {
            return res.status(200).json({
              success: false,
              error: "Incorrect Email or Password.",
            });
          }
        } else {
          return res.status(200).json({
            success: false,
            error: "This account does not exist!",
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({
        success: false,
        error: "Unexpected Error",
      });
    }
  };

module.exports = {
    createAdminAccount,
    adminUserLogin
}