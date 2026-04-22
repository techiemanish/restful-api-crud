// @Author : techiemanish (Fixed + Safe Version)

var express = require('express');
require('dotenv').config();
var app = express();
var bodyParser = require('body-parser');

let resources = __dirname + "/public";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

let Handler = (req, res) => {
  let absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
};
app.get("/", Handler);

app.use("/public", express.static(resources));


var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("MongoDB connected");
});

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  employee_name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => isNaN(v),
      message: "Name should not be numeric"
    }
  },
  employee_salary: {
    type: Number,
    required: true,
    min: 1000,
    max: 10000000
  },
  employee_age: {
    type: Number,
    required: true,
    min: 18,
    max: 65
  }
});

let Employee = mongoose.model('Employee', employeeSchema);

// ================= API ENDPOINTS =================

// CREATE
app.post("/employees", async function(req, res){
  try {
    const emp = new Employee(req.body);
    const saved = await emp.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
app.get('/employees', async (req, res) => {
  try {
    const result = await Employee.find({}, {
      _id: 0,
      employee_id: 1,
      employee_name: 1,
      employee_salary: 1,
      employee_age: 1
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
app.get('/employees/:id', async function(req, res){
  try {
    let val = req.params.id;

    let result = await Employee.findOne(
      { employee_id: val },
      { _id: 0 }
    );

    if(!result){
      return res.status(404).json("No employee found with id " + val);
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/employees/:id', async function(req, res){
  try {
    let val = req.params.id;

    let updated = await Employee.findOneAndUpdate(
      { employee_id: val },
      req.body,
      { new: true, runValidators: true }
    );

    if(!updated){
      return res.status(404).json("No employee found with id " + val);
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/employees/:id', async function(req, res){
  try {
    let val = req.params.id;

    let result = await Employee.deleteOne({ employee_id: val });

    if(result.deletedCount === 0){
      return res.status(404).json("No employee found with id " + val);
    }

    res.json({
      employee_id: val,
      message : "1 record has been deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
