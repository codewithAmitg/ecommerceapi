const express = require('express');
const { createUser, loginUserCtrl, getallUser, getUser, deleteaUser, updateaUser } = require('../controller/userCtrl');
const router = express();


router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUser);
router.get("/:id",getUser);
router.delete("/:id",deleteaUser);
router.put("/:id",updateaUser);
module.exports =router;