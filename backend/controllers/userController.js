const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { readUsersFromFile, writeUsersToFile } = require('../helpers/helpers');

const JWT_SECRET = process.env.JWT_SECRET || '1234567890';
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || '123456789';


//Register Controller

const validateEmail = (email) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({ message: 'All user credentials are required' });
    }

    // Validate email syntax
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const users = await readUsersFromFile();
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password and add the user to the list
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ firstName, lastName, email, password: hashedPassword });

    // Save users to file
    await writeUsersToFile(users);

    // Respond with success
    res.status(201).json({ message: 'User registered successfully' });
};


//Logic contoler
const login = async (req, res) => {
    const { email, password } = req.body;


    //Check if all inputs are provided.
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }


     //Find the user by email from the list.
    const users = await readUsersFromFile();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Compare the provided password against the stored by hashing it.
    const isPasswordValid = await bcrypt.compare(password, user.password);

      // If passwords do not match, return an error.
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
  // Store user credentials in the token.
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
// Return the token.
    res.status(200).json({ token });
};


  // Get user controller.
const getUser = async (req, res) => {
    const users = await readUsersFromFile();
    const user = users.find(u => u.email === req.user.email);

     // If user is not found, return an error.
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
  // Send user data.
    res.status(200).json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
};


 // Forgot password controller.
const forgotPassword = async (req, res) => {

    // Get the email from the request body.
    const { email } = req.body;

    // Check if email exists in the users list.
    const users = await readUsersFromFile();
    const user = users.find(u => u.email === email);
   // Return error if user is not found.
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Set the link.
    const resetToken = jwt.sign({ email: user.email }, RESET_TOKEN_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:4000/users/reset-password?token=${resetToken}`;

      // Send the email with the reset link.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email', error });
        }
        res.status(200).json({ message: 'Reset link sent to your email' });
    });
};


 // Reset password controller.  This controller expects a token in the request body,
 // verifies it, and then hashes the new password before updating the user's password in the users list.
const resetPassword = async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;
// verify the new password
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
// Verify token.
    try {
        const decoded = jwt.verify(token, RESET_TOKEN_SECRET);

        // Find user 
        const users = await readUsersFromFile();
        const user = users.find(u => u.email === decoded.email);

        // If user is not found, return error. 404 status code. 404 means not found. 403 means forbidden. 400 means bad request. 500 means server error. 200 means OK. 201 means created. 202 means accepted. 204 means no content. 206 means partial content. 301 means moved permanently. 304 means not
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
       // Hash the new password and update the user's password in the list.
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await writeUsersToFile(users);

        // Send a message if rest password is sucessfull.

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        // Else return error. 404 status code.
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};


// Export the controllers.
module.exports = {
    register,
    login,
    getUser,
    forgotPassword,
    resetPassword
};
