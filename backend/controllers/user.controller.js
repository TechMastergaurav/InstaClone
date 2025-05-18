import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use. Try another email",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        const populatedPosts = await Promise.all(
            (user.posts || []).map(async (postId) => {
                const post = await Post.findById(postId);
                if (post && post.author && post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        ).then((posts) => posts.filter(Boolean));

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        };

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Logout a user
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.error("Error in getProfile:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Edit user profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePicture = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in editProfile:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Get suggested users
export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");

        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(400).json({
                message: "No users available",
                success: false,
            });
        }

        return res.status(200).json({
            users: suggestedUsers,
            success: true,
        });
    } catch (error) {
        console.error("Error in getSuggestedUser:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Follow or unfollow a user
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // Self (user performing the action)
        const jiskoFollowKrunga = req.params.id; // Target user

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false,
            });
        }

        const user = await User.findById(followKrneWala); // Self
        const targetUser = await User.findById(jiskoFollowKrunga); // Target

        if (!user || !targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);

            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);

            return res.status(200).json({
                message: "Followed successfully",
                success: true,
            });
        }
    } catch (error) {
        console.error("Error in followOrUnfollow:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
