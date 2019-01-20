"use strict";

class LoginController {
    constructor() {

    }

    sayHello(req, res, next) {
        return res.status(200).json({
            message: "hello"
        });
    }
}

module.exports = LoginController;