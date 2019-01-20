"use strict";

const config = require('./config/');
const routes = require('./routes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

let app = express();

const SERVER_PORT = process.env.PORT || config.constants.serverPort;

/********middleware********/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//error hanlder
app.use(function(err,req,res,next) {
    console.log(err.stack);
    res.status(config.constants.httpStatus.InternalError).send({"Error" : err.stack});
});
/*************************/

/**********routing********/
app.use(routes);
/*************************/

app.listen(SERVER_PORT, () => console.log(`Server is listening on port: ${SERVER_PORT}`));