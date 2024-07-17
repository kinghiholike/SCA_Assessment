var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middleware/userAuth');
const { readUsersFromFile, writeUsersToFile } = require('../helpers/helpers');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET

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

module.exports = router;
