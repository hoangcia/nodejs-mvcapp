"use strict";

const router = require('express').Router();
const scenarioController = new (require('../../controllers/scenario'))();

router.get('/getAll', scenarioController.getAll);
router.get('/get/:id', scenarioController.get);
router.delete('/delete/:id', scenarioController.delete);
router.post('/add', scenarioController.add);
router.post('/addTasks', scenarioController.addTasks);
router.get('/search', scenarioController.search);
router.get('/sort', scenarioController.sort);

module.exports = router;