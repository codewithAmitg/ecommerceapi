const express = require('express');
const { createUser, loginUserCtrl, getallUser, getUser, deleteaUser, updateaUser, blockUser, unblockUser } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express();


router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUser);
router.get("/:id",authMiddleware, isAdmin, getUser);
router.delete("/:id",deleteaUser);
router.put("/edit-user",authMiddleware, updateaUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin, unblockUser);
module.exports =router;