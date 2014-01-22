/*
 *Node build script 1.0.0
 *Author: Sudhanshu Yadav
 *github.com/s-yadav
 *Copyright (c) 2014 Sudhanshu Yadav.
 *Under MIT licenses
 */
 
var Handlebars=require('handlebars');

/** Handle bar helper functions **/
Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});
module.exports = Handlebars;