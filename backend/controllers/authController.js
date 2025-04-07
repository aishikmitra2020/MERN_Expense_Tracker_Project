const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body; // Destructuring the req body

    // Validation: Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Create a new user
        const user = await User.create({ fullName, email, password, profileImageUrl });

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
           .status(500)
           .json({ message: 'Error registering user', error: err.message });
    };
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // Destructuring the req body

    if (!email || !password){
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
           .status(500)
           .json({ message: 'Error logging in', error: err.message });
    };
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try{
        // '.select('-password') is used to exclude the password field from being returned.
        // and if - is not present before the field name like 'email password' then it will include that field. Note: we can exclude and include as many fields as we want.
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch(err){
        res
        .status(500)
        .json({ message: "Error fetching user info", error: err.message });
    }
};