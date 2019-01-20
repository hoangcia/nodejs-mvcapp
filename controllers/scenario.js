"use strict";
const models = require('../models'),
expressionBuilder = require('../utilities/expressionBuilder'),
httpStatus = require('../config/constants').httpStatus;


class Scenario{
    constructor(){
        
    }
    getAll(req,res,next){        
        let scenarios = models.scenarios.getAll();        
        return res.status(httpStatus.OK).json(scenarios);
    }

    delete(req,res,next){
        let id = req.params.id;
        let success = models.scenarios.delete(id);
        let allScenarios = models.scenarios.getAll();

        return res.status(httpStatus.OK).json(allScenarios);            
    }

    get(req,res,next){
        let scenarioId = req.params.id;
        let scenario = models.scenarios.get(scenarioId);

        return res.status(httpStatus.OK).json(scenario);
    }
    add(req,res,next){
        let scenario = req.body;        
        //validate a new scenario
        let validateMsg = models.validator.scenario.validate(scenario);
        if(validateMsg.length === 1 && validateMsg[0].key === "ValidScenario"){
            scenario.tasks.forEach((t,index) => t.position = index + 1);
            if(scenario.tasks.length > 0) {
                scenario.id = scenario.tasks[0].scenario;
            }
            else{
                //generate scenario id
                let now = new Date();
                scenario.id = `scenario_${now.getFullYear()}${now.getMonth()+1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;                
            }
            //check existing scenario Id
            let existingScenario = models.scenarios.get(scenario.id);
            if(existingScenario) return res.status(httpStatus.OK).json({key:"ExistingScenario", value:`The scenario id "${scenario.id}" is existing.`});

            let addedScenario = models.scenarios.add(scenario);
            
            let allScenarios = models.scenarios.getAll();

            return res.status(httpStatus.OK).json(allScenarios);
        }
        else{
            return res.status(httpStatus.OK).json(validateMsg);
        }
    }
    addTasks(req,res,next){
        let body = req.body;        

        let existingScenario = models.scenarios.getOne(body.scenario);
        
        if(!existingScenario)return res.status(httpStatus.OK).json({"Message": "The scenario is not existing"});
        
        let startPosition = existingScenario.tasks.length + 1;
        
        body.tasks.forEach(t => {t.scenario = body.scenario; t.position = startPosition++;});        

        let validateMsg = models.validator.scenario.validateAddTasks(existingScenario);
        if(validateMsg.length === 0){
            let scenario = existingScenario;
            scenario.tasks = scenario.tasks.concat(body.tasks);

            validateMsg = models.validator.scenario.validate(scenario);
        }
        if(validateMsg.length === 1 && validateMsg[0].key === "ValidScenario") {

            models.tasks.addTasks(body.tasks);
            
            let allScenarios = models.scenarios.getAll();

            return res.status(httpStatus.OK).json(allScenarios);
        }
        else
        {
            return res.status(httpStatus.OK).json(validateMsg);
        }
    }
    search(req,res,next){
        let result = [],
        searchString = req.query.searchString;
        let tokenSearch = expressionBuilder.tokenize(searchString);
        if(tokenSearch.filter(t => t.type === "keyword").length > 3) return res.status(httpStatus.OK).json({
            "Message": "Maximum is 3 conditions"
        });
        let allScenarios = models.scenarios.getAllArray();
        allScenarios.forEach(s => {
            let tasks = s.tasks;
            tasks.forEach(t => {
                let temp = Object.assign({},t);
                delete(temp.position);
                let expression = expressionBuilder.buildExpression(searchString,temp,"task");                
                let executeSearch = new Function(expression);                
                if(executeSearch()) {result.push(s)};
            });
        });
        let objectResult = {};
        result.forEach(s=> objectResult[s.id]={
            name: s.id,
            tasks: s.tasks
        });
        return res.status(httpStatus.OK).json(objectResult);
    }
    sort(req,res,next){
        let ordering = req.query.ordering || "asc";
        ordering = ordering.toLowerCase();

        let result = models.scenarios.getSortedScenarios(ordering);

        return res.status(httpStatus.OK).json(result);
    }
}
module.exports = Scenario;
