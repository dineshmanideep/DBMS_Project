import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

export const updateUser = async (req, res) => {
    try {
        console.log("updateUserhit")
        const { user_id } = req.params;
        const { username, email, full_name, password } = req.body;

        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare update object
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (full_name) updates.full_name = full_name;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        // Update user
        await User.update(updates, {
            where: { user_id },
            returning: true
        });

        // Get updated user (excluding password)
        const updatedUser = await User.findByPk(user_id, {
            attributes: ['user_id', 'username', 'email', 'full_name', 'registration_date']
        });

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            attributes: ['user_id', 'username', 'email', 'full_name', 'registration_date']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user (cascade will handle related records)
        await User.destroy({
            where: { user_id }
        });

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};