"use strict";

const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/scenario', require('./scenario'));

module.exports = router;
