"use strict";

const router = require('express').Router();
const loginController = new (require('../../controllers/login'))();

router.post("/", loginController.sayHello);

module.exports = router;