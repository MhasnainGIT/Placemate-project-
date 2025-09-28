import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        // Load user and attach role for RBAC
        const user = await User.findById(req.id).select("role email fullName fullname profile");
        if (user) {
            req.user = user;
            // support both fullName and legacy fullname
            req.userName = user.fullName || user.fullname;
            req.userRole = user.role;
        }
        next();
    } catch (error) {
        console.log("Auth error:", error?.message || error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
}
export default isAuthenticated;