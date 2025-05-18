import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }

        // Verify and decode the token
        const decoded =   jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }

        // Attach user ID from token to the request object
        req.id = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
    }
};
export default isAuthenticated




