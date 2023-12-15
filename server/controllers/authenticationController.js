const express = require('express');
const db = require('./db');
const hashCount = 10;
const bcrypt = require('bcrypt');

const createClientAccount = async (req, res) => {
    try {
        const { email_address, password, user_type, client_name, contact_number } = req.body;
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

            // Step 2: Insert into the client table
            const clientInsertQuery = "INSERT INTO client (client_name, contact_number, user_id) VALUES (?, ?, ?)";
            const clientInsertValues = [client_name, contact_number, userId];

            db.query(clientInsertQuery, clientInsertValues, (clientInsertError, clientInsertResults) => {
                if (clientInsertError) {
                    console.error("Client insertion error:", clientInsertError);
                    return res.status(500).json({
                        success: false,
                        message: "Client registration failed.",
                        error: clientInsertError.message,
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Client registered successfully!",
                    data: {
                        userId: userId,
                        clientData: clientInsertResults,
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

const createTruckerAccount = async (req, res) => {
    try {
        const { email_address, password, user_type, business_name, trucker_name, contact_number, address, position } = req.body;
        const hashedPassword = await bcrypt.hash(password, hashCount);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Proof of employment file is required.'
            });
        }

        const emp_proof = req.file.path; // Get the file path from multer

        // Step 1: Insert into the user table
        const userInsertQuery = "INSERT INTO user (email_address, password, user_type) VALUES (?, ?, ?)";
        const userInsertValues = [email_address, hashedPassword, user_type];

        db.query(userInsertQuery, userInsertValues, (userInsertError, userInsertResults) => {
            if (userInsertError) {
                res.status(404).json({
                    success: false,
                    message: "Trucker registration failed.",
                });
            } else {
                const userId = userInsertResults.insertId;

                // Step 2: Insert into the trucker table
                const truckerInsertQuery = "INSERT INTO trucker (business_name, trucker_name, contact_number, address, position, emp_proof, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const truckerInsertValues = [business_name, trucker_name, contact_number, address, position, emp_proof, userId];

                db.query(truckerInsertQuery, truckerInsertValues, (truckerInsertError, truckerInsertResults) => {
                    if (truckerInsertError) {
                        res.status(404).json({
                            success: false,
                            message: "Trucker registration failed.",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: "Trucker registered successfully!",
                            data: {
                                userId: userId,
                                truckerData: truckerInsertResults,
                            },
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database Error",
            error: error.message,
        });
    }
};

const clientUserLogin = (req, res) => {
    try {
        const { email_address, password, user_type } = req.body;

        const sql = `
            SELECT u.user_id, u.email_address, u.password, u.user_type, u.status, c.client_id, c.client_name, u.last_login
            FROM user u
            LEFT JOIN client c ON u.user_id = c.user_id
            WHERE u.email_address = ?
        `;
        const values = [email_address];
        db.query(sql, values, (err, dbresult) => {
            if (!err && dbresult.length === 1) {
                if (user_type != dbresult[0].user_type) {
                    res.status(200).json({
                        success: false,
                        error: "User Type Mismatch! Check if you are in the correct Login Page."
                    });
                } else {
                    const userStatus = dbresult[0].status;
                    if(userStatus === 'deleted'){
                        res.status(200).json({
                            success: false,
                            error: "This account has been deleted. Unable to log in."
                        });
                    }else{
                        const hash = dbresult[0].password;
                        bcrypt.compare(password, hash).then(function (result) {
                            if (result == true) {
                                const updateLogin = "UPDATE user SET last_login = CURRENT_TIMESTAMP() WHERE user_id = ?";
                                const userLogged = [dbresult[0].user_id];

                                db.query(updateLogin, userLogged, (updateErr) => {
                                    if (updateErr) {
                                        console.error("Error updating last_login:", updateErr);
                                    } else {
                                        const updateStatus = "UPDATE user SET status = 'active' WHERE user_id = ?";
                                        db.query(updateStatus, userLogged, (statusErr) => {
                                            if (statusErr) {
                                                console.error("Error updating status:", statusErr);
                                            }
                                            // Set req.user with user information
                                            req.user = {
                                                user_id: dbresult[0].user_id,
                                                email_address: dbresult[0].email_address,
                                                user_type: dbresult[0].user_type,
                                                last_login: new Date().toISOString(),
                                                status: 'active',
                                            };
    
                                            res.status(201).json({
                                                success: true,
                                                message: "Retrieved",
                                                client_info: {
                                                    clientID: dbresult[0].client_id,
                                                    clientName: dbresult[0].client_name,
                                                    email: dbresult[0].email_address,
                                                    type: dbresult[0].user_type,
                                                    userID: dbresult[0].user_id,
                                                },
                                            });
                                        });
                                    }
                                });
                            } else {
                                res.status(200).json({
                                    success: false,
                                    error: "Incorrect Email or Password..",
                                });
                            }
                        });
                    }
                }
            } else {
                res.status(200).json({
                    success: false,
                    error: "This account does not exist!",
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database Error",
        });
    }
};
const truckerUserLogin = (req, res) => {
    try {
        const { email_address, password, user_type } = req.body;

        // Use a parameterized query to prevent SQL injection
        const sql = `
            SELECT u.user_id, u.email_address, u.password, u.user_type, u.status, tr.trucker_id, tr.trucker_name, tr.contact_number, tr.business_name, tr.position, tr.address, tr.description, tr.logo, tr.servCharge, tr.distCharge, tr.contrCharge, tr.trucker_status
            FROM user u
            LEFT JOIN trucker tr ON u.user_id = tr.user_id
            WHERE u.email_address = ?
        `;
        const values = [email_address];
        db.query(sql, values, (err, dbresult) => {
            if (!err && dbresult.length === 1) {
                if (user_type != dbresult[0].user_type) {
                    res.status(200).json({
                        success: false,
                        error: "User Type Mismatch! Check if you are in the correct Login Page."
                    });
                } else {
                    const userStatus = dbresult[0].status;
                    const truckerStatus = dbresult[0].trucker_status;
                    if(userStatus === 'deleted'){
                        res.status(200).json({
                            success: false,
                            error: "This account has been deleted. Unable to log in."
                        });
                    }else if (truckerStatus === 'Pending' || truckerStatus === 'Declined') {
                        res.status(200).json({
                            success: false,
                            error: "Trucker status is Pending or Declined. You are not allowed to log in."
                        });
                    } else {
                        const hash = dbresult[0].password;
                        bcrypt.compare(password, hash).then(function (result) {
                            if (result == true) {
                                const updateLogin = "UPDATE user SET last_login = CURRENT_TIMESTAMP() WHERE user_id = ?";
                                const userLogged = [dbresult[0].user_id];
        
                                db.query(updateLogin, userLogged, (updateErr) => {
                                    if (updateErr) {
                                        console.error("Error updating last_login:", updateErr);
                                    } else {
                                        const updateStatus = "UPDATE user SET status = 'active' WHERE user_id = ?";
                                        db.query(updateStatus, userLogged, (statusErr) => {
                                            if (statusErr) {
                                                console.error("Error updating status:", statusErr);
                                            }
                                            res.status(201).json({
                                                success: true,
                                                message: "Retrieved",
                                                trucker_info: {
                                                    truckerID: dbresult[0].trucker_id,
                                                    businessName: dbresult[0].business_name,
                                                    truckerOwner: dbresult[0].trucker_name,
                                                    email: dbresult[0].email_address,
                                                    contactNum: dbresult[0].contact_number,
                                                    position: dbresult[0].position,
                                                    address: dbresult[0].address,
                                                    description: dbresult[0].description,
                                                    logo: dbresult[0].logo,
                                                    servCharge: dbresult[0].servCharge,
                                                    distCharge: dbresult[0].distCharge,
                                                    contrCharge: dbresult[0].contrCharge,
                                                    type: dbresult[0].user_type,
                                                    userID: dbresult[0].user_id,
                                                },
                                            });
                                        });
                                    }
                                });
                            } else {
                                res.status(200).json({
                                    success: false,
                                    error: "Incorrect Email or Password.",
                                });
                            }
                        });
                    }
                }
            } else {
                res.status(200).json({
                    success: false,
                    error: "This account does not exist!",
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database Error",
        });
    }
}



module.exports = {
    createClientAccount,
    createTruckerAccount,
    clientUserLogin,
    truckerUserLogin
}