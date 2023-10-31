import express from "express";
import UsersApi from "../api/users-api.js";
const router = express.Router();
const usersApi = UsersApi();

router.post("/signup", usersApi.userSignup);
router.post("/login", usersApi.userLogin);

export default router;
