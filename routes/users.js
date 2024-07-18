var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/userAuth');
const { readUsersFromFile, writeUsersToFile } = require('../helpers/helpers');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || '0987654321';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/*Get loginpage*/
router.get('getLoginPage', (req,res)  => {
    res.render('login');
});
/* Get signup page*/
router.get('getSignupPage',(req,res) => {
    res.render('signup');
});


// Register endpoint
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({ message: 'All User credentials are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const users = readUsersFromFile();

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ firstName, lastName, email, password: hashedPassword });

    writeUsersToFile(users);

    res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsersFromFile();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
});

// Get logged-in user data endpoint
router.get('/getUser', authenticateUser, (req, res) => {
    const users = readUsersFromFile();
    const user = users.find(u => u.email === req.user.email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
});


// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const users = await readUsersFromFile();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ email: user.email }, RESET_TOKEN_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:4000/users/reset-password?token=${resetToken}`;

    // Send the reset link via email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email' });
        }
        res.json({ message: 'Reset link sent to your email' });
    });
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
        const users = await readUsersFromFile();
        const user = users.find(u => u.email === decoded.email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await writeUsersToFile(users);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});
module.exports = router;
