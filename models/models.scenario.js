"use strict";
const fs = require('fs');
const taskModelContext = new(require('./models.task'))();

let filePath = `${__dirname}/data/scenario.json`;
let _getRawJson;

class Scenario{
    constructor(){
        _getRawJson = ()=>{            
            return JSON.parse(fs.readFileSync(filePath));        
        };
    }

    getAll(){        
        let result = {};
        let rawScenarios = _getRawJson();
        let allTasks = taskModelContext.getAll();

        rawScenarios.forEach(s => {            
            let scenarioTasks = allTasks.filter(t => t.scenario === s.id);
            //order tasks by position
            scenarioTasks = scenarioTasks.sort((t1,t2)=>{
                return t1.position - t2.position;
            });
            let scenario = {
                name: s.name,
                tasks: scenarioTasks
            };
            result[s.id] = scenario;
        });
        return result;
    }
    getAllArray(){
        let result = [];
        let rawScenarios = _getRawJson();
        let allTasks = taskModelContext.getAll();

        rawScenarios.forEach(s => {            
            let scenarioTasks = allTasks.filter(t => t.scenario === s.id);
            //order tasks by position
            scenarioTasks = scenarioTasks.sort((t1,t2)=>{
                return t1.position - t2.position;
            });
            let scenario = {
                id: s.id,
                name: s.name,
                tasks: scenarioTasks
            };
            result.push(scenario);
        });
        return result;
    }
    get(id){
        let scenario = this.getOne(id);
        if(scenario){
            return {
                [scenario.id]:{
                    name: scenario.name,
                    tasks: scenario.tasks
            }};
        }
        return null;
    }
    getOne(id){
        let result = null;
        let allScenarios = _getRawJson();

        let findIndex = allScenarios.findIndex(item => item.id === id); 

        if(findIndex > -1){
            let scenarioTasks = taskModelContext.getAll().filter(t => t.scenario === id);
            let scenario = allScenarios[findIndex];
            result = {                                         
                name: scenario.name,
                tasks: scenarioTasks                
            }
        }
        return result;
    }
    getSortedArray(ordering){
        ordering = ordering || "asc";
        let result = this.getAllArray();
        //sort by name
        result = result.sort((s1,s2)=>{
            return ordering === "asc" ? s1.name.localeCompare(s2.name): s2.name.localeCompare(s1.name);
        });

        //sort by task - template, platform, lang        
        for(let index = 0; index < result.length; index++){
            let s = result[index];
            //template
            let tasks = s.tasks.sort((t1,t2) => ordering === "asc" ? t1.template.localeCompare(t2):t2.template.localeCompare(t1.template));
            //platform
            tasks = s.tasks.sort((t1,t2) => ordering === "asc" ? t1.platform.localeCompare(t2):t2.platform.localeCompare(t1.platform));
            //lang
            tasks = s.tasks.sort((t1,t2) => ordering === "asc" ? t1.lang.localeCompare(t2):t2.lang.localeCompare(t1.lang));

            s.tasks = tasks;
        }
        return result;
    }
    getSortedScenarios(ordering){
        let allScenarios = this.getSortedArray(ordering);
        let result = {};
        allScenarios.forEach(s => {
            result[s.id] = {
                name: s.name,
                tasks: s.tasks
            };
        });

        return result;
    }
    add(scenario){
        let allScenarios = _getRawJson();
        let s = {id: scenario.id,
        name: scenario.name};        
        allScenarios.push(s);

        //save JSON file
        let json = JSON.stringify(allScenarios);
        fs.writeFileSync(filePath, json);                        

        //add tasks
        taskModelContext.addTasks(scenario.tasks);

        return scenario;
    }
    delete(scenarioId){                
        let allScenarios = _getRawJson();
        let index = allScenarios.findIndex(item => item.id === scenarioId);
        allScenarios.splice(index,1);
        
        //save JSON file
        let json = JSON.stringify(allScenarios);
        fs.writeFileSync(filePath, json);

        //delete scenario tasks
        taskModelContext.deleteTasks(scenarioId);
        return index > -1;
    }
}

module.exports = Scenario;