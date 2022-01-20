// @Author : techiemanish
var express = require('express');
require('dotenv').config();
var app = express();
var bodyParser = require('body-parser');
console.log("Hello World");
let resources = __dirname + "/public";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

let Handler = (req, res) => {
  let absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
};
app.get("/", Handler);

app.use("/public", express.static(resources));

app.listen(3000, () => {
  console.log('server started');
});

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;

//Schema
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  employee_name : String,
  employee_salary : Number,
  employee_age : Number
});

let Employee = mongoose.model('Employee', employeeSchema);

//API Endpoints

// Post request to the API(Creating record)
app.post("/employees", function(req, res){
  
  var data = {
    employee_id : req.body.employee_id,
    employee_name : req.body.employee_name,
    employee_salary : req.body.employee_salary,
    employee_age : req.body.employee_age
  }
  db.collection('employees').insertOne(data, function(err, collection){
    if(err) return console.log(err);
    console.log("Record Save Successfully");
  })
  res.json({
    employee_id : req.body.employee_id,
    employee_name : req.body.employee_name,
    employee_salary : req.body.employee_salary,
    employee_age : req.body.employee_age
    });

});

//Get request to the API(Reading all the records)
app.get('/employees', (req, res) => {
  db.collection('employees').find({},{ projection: 
  {
    _id : 0,
    employee_id : 1,
    employee_name : 1,
    employee_salary : 1,
    employee_age : 1
  }}).toArray(function(err, result){
    if(err) return console.log(err);
    res.json(result);
    //console.log(result);
  });
});

//To find a employee by id on the api call
app.get('/employees/:id', function(req, res){
  let val = req.params.id;
  let result = db.collection('employees').findOne({employee_id : val},{ projection: 
  {
    _id : 0,
    employee_id : 1,
    employee_name : 1,
    employee_salary : 1,
    employee_age : 1
  }});
  result.then(function(result){
    if(result == null){
      res.json("No employee found with the given employee id " + val);
    }
    else{
      res.json(result);
    }
    
  });
});

//Put API request by id
app.put('/employees/:id', function(req, res){
  let val = req.params.id;
  db.collection('employees').updateOne({employee_id : val},
  {$set: 
    {employee_id : req.body.employee_id,
    employee_name : req.body.employee_name,
    employee_salary : req.body.employee_salary,
    employee_age : req.body.employee_age
    }
  },{upsert: true},function(err){
    if(err){
      return console.log(err);
    }
    console.log("Put request on this employee id " + val + " has been completed.");
  });
  res.json({
    employee_id: req.body.employee_id,
    employee_name : req.body.employee_name,
    employee_salary : req.body.employee_salary,
    employee_age : req.body.employee_age,
    message : "1 record has been updated."
  });
})

//Delete API request by id on the api call
app.delete('/employees/:id', function(req, res){
  let val = req.params.id;
  db.collection('employees').deleteOne({employee_id : val},function(err, obj){
    if(err) return console.log(err);
    console.log("1 record deleted");
  })
  res.json({
    employee_id: req.params.id,
    message : "1 record has been deleted"
  });
});

