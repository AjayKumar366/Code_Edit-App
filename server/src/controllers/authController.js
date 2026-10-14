import user from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const userExists = await user.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await user.create({
            username: username.trim(),
            email: normalizedEmail,
            password: password,
        });

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const foundUser = await user.findOne({ email: normalizedEmail });
        if (foundUser && (await foundUser.matchPassword(password))) {
            return res.json({
                _id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                token: generateToken(foundUser._id),
            });
        }
        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const foundUser = await user.findById(req.user._id).select('-password');
        if(!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(foundUser);
    }catch (error) {
        console.error("Get User error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export { registerUser, loginUser  };