// forgotPasswordController.js
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const db = require('./db');

// Function to generate a unique reset token/otp
const generateResetToken = () => {
    // Your logic to generate a unique token/otp goes here
    // For example, you can use a library like 'crypto' to generate a random token
    const token = require('crypto').randomBytes(20).toString('hex');
    return token;
};

// Function to send an email with the reset token/otp
const sendResetEmail = async (email, resetToken) => {
    // Your nodemailer configuration goes here
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_email_password',
        },
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Use this token to reset your password: ${resetToken}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send reset email');
    }
};

// Function to handle the forgot password request
const forgotPassword = async (req, res) => {
    try {
        const { email_address } = req.body;

        // Check if the email address exists in the database
        const userQuery = 'SELECT * FROM user WHERE email_address = ?';
        const userResult = await db.query(userQuery, [email_address]);

        if (userResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not found',
            });
        }

        const userId = userResult[0].user_id;

        // Generate and store a reset token in the database
        const resetToken = generateResetToken();
        const updateTokenQuery = 'UPDATE user SET reset_token = ? WHERE user_id = ?';
        await db.query(updateTokenQuery, [resetToken, userId]);

        // Send an email with the reset token
        await sendResetEmail(email_address, resetToken);

        res.status(200).json({
            success: true,
            message: 'Reset token sent successfully',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process forgot password request',
            error: error.message,
        });
    }
};

// Export the functions for use in routes
module.exports = {
    forgotPassword,
};
