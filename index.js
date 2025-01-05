var express = require('express')
let ejs = require('ejs')
var mySqlDao = require('./mysqlDao')
var myMongoDB = require('./mongoDao')
var bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');


var app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))

app.listen(3004, () => {
console.log("Server is running on port 3004")
})