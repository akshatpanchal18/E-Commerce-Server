import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  createUser,
  getCurrentUser,
  userLogin,
  userLogout,
} from "../controller/user.controller.js";
import { verifyAdmin, verifyJwt } from "../middelware/auth.middelware.js";

const router = Router();

router.post("/register-user", createUser);
router.post("/login", userLogin);
router.post("/login-admin", adminLogin);

//secured routes
router.post("/logout", verifyJwt, userLogout);
router.post("/logout-admin", verifyAdmin, adminLogout);
router.get("/get-current-user", verifyJwt, getCurrentUser);

export default router;
