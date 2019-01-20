"use strict";
/*
Rules:
● One task belongs to one scenario
● Position is the task position in a scenario
● Facebook supports text, image, video, audio, sticker, button, carousel
● Line supports text, image, video, audio, sticker
● Sticker is always the unique in task array of a scenario
● Carousel is always the last one in task array of a scenario
*/
let _facebookSuports = ["text", "image", "video", "audio", "sticker", "button", "carousel"],
_lineSupports = ["text", "image", "video", "audio", "sticker"],
_validateMsg = {
   "InvalidObjType" : "Invalid object type",
   "TasksNotDefined" : "Tasks not defined",
   "InvalidTask"   : "Invalid task.",
   "DifferentScenarios": "A task must belong to one scenario",
   "LineNotSuports": "Line only supports text, image, video, audio and sticker template",
   "FacebookNotSupport": "Facebook only supports text, image, video, audio, sticker, button and carousel template",
   "DuplicateStickerTask": "Duplicate sticker task",
   "CarouselTask": "The carousel task must be the last one in the array of a scenario",
   //Adding tasks
   "StickerExisting": "Sticker is existing, can not add more task",
   "LastCarousel": "Carousel is the last task, can not add more task",
   "ValidTasks": "The tasks is not valid"
},
_validTaskProperties = ["template","scenario","platform","lang"],
_templates = {
    text: "text",
    image: "image",
    video: "video",
    audio: "audio",
    sticker: "sticker",
    button: "button",
    carousel: "carousel"
};

class ScenarioValidator{
    constructor(){
        
    }

    static validateAddTasks(scenario){
        let result = [];
        // if sticker is existing in its task array, cannot add more sticker 
        if(scenario.tasks.findIndex(t => t.template === _templates.sticker) > -1) result.push({key:"StickerExisting", value:_validateMsg.StickerExisting});
        // if carousel is the last position in its task array, cannot add more task
        if(scenario.tasks.findIndex(t => t.template === _templates.carousel) > -1) result.push({key:"LastCarousel", value:_validateMsg.LastCarousel});

        return result;
    }
    static validate(scenario){
        let result = [];
        if(typeof(scenario) !== 'object') return {key:"InvalidObjType", value:_validateMsg.InvalidObjType};
        if(!scenario.hasOwnProperty('tasks')) return {key:"TasksNotDefined", value:_validateMsg.TasksNotDefined};        
        let scenarioIds = [];
        //valide task
        for(let tIndex = 0; tIndex < scenario.tasks.length; tIndex++){
            let task = scenario.tasks[tIndex];
            let missingProperties = [];
            for(let index = 0; index < _validTaskProperties.length; index++)
            {
                let propertyName = _validTaskProperties[index];
                if(!task.hasOwnProperty(_validTaskProperties[index])) missingProperties.push(propertyName);
            }
            if(missingProperties.length > 0){
                result.push({key:"InvalidTask",value: `${_validateMsg.InvalidTask}. Index[${tIndex}] - Missing: ${missingProperties.join(",")}`});
            }
            if(scenarioIds.indexOf(task.scenario) === -1) scenarioIds.push(task.scenario);
        };
        
        if(result.length > 0) return result;

        // One task belongs to one scenario
        if(scenarioIds.length > 1) result.push({key:"DifferentScenarios", value:_validateMsg.DifferentScenarios});
        // Facebook supports text, image, video, audio, sticker, button, carousel
        if(scenario.tasks.filter(t => t.platform === "facebook" && _facebookSuports.indexOf(t.template) === -1).length > 0) result.push({key:"FacebookNotSupport", value:_validateMsg.FacebookNotSupport});
        // Line supports text, image, video, audio, sticker
        if(scenario.tasks.filter(t => t.platform === "line" && _lineSupports.indexOf(t.template) === -1).length > 0) result.push({key:"LineNotSuports", value:_validateMsg.LineNotSuports});
        // Sticker is always the unique in task array of a scenario
        if(scenario.tasks.filter(t => t.template === "sticker").length > 1) result.push({key:"DuplicateStickerTask",value:_validateMsg.DuplicateStickerTask});
        // Carousel is always the last one in task array of a scenario        
        if(scenario.tasks.findIndex(t => t.template === "carousel") > -1 && scenario.tasks[scenario.tasks.length - 1].template !== "carousel") result.push({key:"CarouselTask", value:_validateMsg.CarouselTask});

        if(result.length === 0) result.push({key:"ValidScenario", value:_validateMsg.ValidScenario});
        return result;

    }
}

module.exports = ScenarioValidator;