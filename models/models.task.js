"use strict";

let fs = require('fs');
let filePath = `${__dirname}/data/task.json`;
let _getRawJson;
class Task{
    constructor(){
        _getRawJson = ()=>{            
            return JSON.parse(fs.readFileSync(filePath));        
        };
    }
    getAll(){        
        let rawTaskJson = _getRawJson();
        return rawTaskJson;
    }
    get(id){
        let task = this.getAll().filter(item => item.id === id);
        if(task){
            return task[0];
        }
        else return null;
    }

    add(task){
        let alltasks = this.getAll();
        alltasks.push(task);
        //save JSON file
        let json = JSON.stringify(alltasks);
        fs.writeFileSync(filePath, json);

        return task;
    }

    addTasks(tasks){
        let allTasks = this.getAll();
        allTasks = allTasks.concat(tasks);

        //save JSON file
        let json = JSON.stringify(allTasks);
        fs.writeFileSync(filePath, json);

        return tasks;
    }
    delete(id){                
        let allTasks = this.getAll();
        let index = allTasks.findIndex(item => item.id === id);
        allTasks.splice(index,1);
        //save JSON file
        let json = JSON.stringify(allTasks);
        fs.writeFileSync(filePath, json);
        return index > -1;
    }
    deleteTasks(scenarioId){
        let allTasks = this.getAll();
        allTasks = allTasks.filter(t => t.scenario !== scenarioId);
        //save JSON file
        let json = JSON.stringify(allTasks);
        fs.writeFileSync(filePath, json);
    }
}

module.exports = Task;