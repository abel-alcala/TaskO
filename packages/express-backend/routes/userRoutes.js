import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const existingEmail = await User.findOne({email: req.body.email});
        if (existingEmail) {
            return res.status(400).json({
                message: 'A user with this email already exists'
            });
        }

        const existingUsername = await User.findOne({userName: req.body.userName});
        if (existingUsername) {
            return res.status(400).json({
                message: 'This username is already taken'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: messages.join(', ')});
        }

        console.error('User creation error:', error);
        res.status(500).json({
            message: 'An error occurred while creating the user'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password
            .populate('lists');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Error fetching users'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('lists');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(user);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid user ID format'
            });
        }
        console.error('Error fetching user:', error);
        res.status(500).json({
            message: 'Error fetching user details'
        });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        if (req.body.password) {
            delete req.body.password;
        }

        if (req.body.email) {
            const existingEmail = await User.findOne({
                email: req.body.email,
                _id: {$ne: req.params.id}
            });
            if (existingEmail) {
                return res.status(400).json({
                    message: 'This email is already in use'
                });
            }
        }

        if (req.body.userName) {
            const existingUsername = await User.findOne({
                userName: req.body.userName,
                _id: {$ne: req.params.id}
            });
            if (existingUsername) {
                return res.status(400).json({
                    message: 'This username is taken'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators: true}
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: messages.join(', ')});
        }

        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Error updating user'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid user ID format'
            });
        }
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Error deleting user'
        });
    }
});

export default router;