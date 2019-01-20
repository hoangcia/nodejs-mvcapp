# nodejs-mvcapp
Simple Node Restful API with MVC architecture
This app require **NodeJs 11.x (or above)** and **Express 4.x** to run
# Project structure
```
root
|--config
|  |--constants.js
|  |--index.js
|
|--controllers
|  |--scenario.js
|
|--models
|  |--data
|  |  |--scenario.json
|  |  |--task.json
|  |
|  |--index.js
|  |--models.scenario.js
|  |--models.task.js
|  |--validator.scenario.js
|  
|--routes
|  |--api
|  |  |--index.js
|  |  |--scenario.js
|  |
|  |--index.js
|  
|--utilities
|  |--expressionBuilder.js
|
|--app.js
|--package.json
|--README.md
```
# How to run
1. Open Command Prompt or Terminal, go to project folder
2. Type **"npm install"** to install standard libraries required for our app
3. Run the app by typing **"node app.js"**. By default, the app is running on port **9999**

# Testing
1. In order to test the API, you need [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop//@ "Postman") (a Chrome extension)
2. Open *Postman* to create requests test our API. Here's a list of examples:
  * *[GET]* - http://localhost:9999/api/scenario/getAll - get all scenarios
  * *[DELETE]* - http://localhost:9999/api/scenario/delete/[id] - delete a scenario by id (for example: http://localhost:9999/api/scenario/delete/new_scenario2)
  * *[POST]* - http://localhost:9999/api/scenario/add - add a new scenario (for example in JSON format: 
  ```
  {
   "name":"New Scenario 2",
   "tasks":[
      {
         "scenario":"new_scenario2",
         "template":"button",
         "platform":"facebook",
         "lang":"en_US"
      },
      {
         "scenario":"new_scenario2",
         "template":"text",
         "platform":"line",
         "lang":"en_US"
      }
   ]
}
```
  * *[POST]* - http://localhost:9999/api/scenario/addTasks - add new tasks to an existing scenario (for example in JSON format:
  ```
  {
"scenario":"new_scenario2",
"tasks":
	[
	{
        "template": "sticker",
        "platform": "facebook",
        "lang": "en_US"
    }
	]
}
  ```
  * *[GET]* - http://localhost:9999/api/scenario/search?searchString=[conditions] - search scenario by **conditions**
  
  The *conditions* can contain conjunction "and","or" in your *searchString*. 
  
  For example: **facebook and button**, **facebook or line**
  * *[GET]* - http://localhost:9999/api/scenario/sort?ordering=[orderingType] - get the ordered list of scenarios by **orderingType**
  
  **orderingType** can be one of these types: *"asc"* or *"desc"*
  
  # Done.
  
  # And Happy coding
