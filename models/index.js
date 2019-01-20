"use strict";
let modelScenario = new(require('./models.scenario'))(),
modelTask = new(require('./models.task'))(),
scenarioValidator = require('./validator.scenario');

let models = {
    scenarios : modelScenario,
    tasks: modelTask,
    validator:{
        scenario: scenarioValidator
    }
};

module.exports = models;