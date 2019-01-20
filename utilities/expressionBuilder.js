"use strict";
/*
Date: 2019-01-13
Description: Build Javascript condition expression (only support 'and', 'or')
Author: Hoang Tran - Scorpy
 */


class ExpressionBuilder {
    constructor() {

    }

    static tokenize(conditions) {
        if (typeof (conditions) !== 'string') return [];
        let tokens = conditions.split(/ /g).filter(c => c !== '');

        let result = [];

        tokens.forEach(c => {
            c = c.toLocaleLowerCase().replace(/and/g, "&&");
            c = c.toLocaleLowerCase().replace(/or/g, "||");
            result.push({
                type: c === "&&" || c === "||" ? "conditionExp" : "keyword",
                value: c
            });
        });
        return result;
    }

    static buildExpression(conditions, objToSearch, objName) {
        let tokens = this.tokenize(conditions);
        let result = [];

        tokens.forEach(t => {
            if (t.type === "conditionExp") result.push(t.value);
            else {
                let expressions = [];
                for (let field in objToSearch) {
                    if(typeof(field) !== 'string') continue;
                    expressions.push(`${objName}.${field}.toLowerCase()==="${t.value}"`);
                }
                result.push(`(${expressions.join("||")})`);
            }
        });

        let json = JSON.stringify(objToSearch);
        return `let ${objName} = ${json};return ${result.join('')};`;
    }    
}
module.exports = ExpressionBuilder;