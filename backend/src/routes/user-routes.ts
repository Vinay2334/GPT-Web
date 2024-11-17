import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginvalidator, signupvalidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/home",getAllUsers )
userRoutes.post("/signup" ,validate(signupvalidator), userSignup)
userRoutes.post("/login" ,validate(loginvalidator), userLogin)
userRoutes.get("/auth-status" ,verifyToken, verifyUser)
userRoutes.get("/logout" ,verifyToken, userLogout)

export default userRoutes;