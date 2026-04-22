// @Author : techiemanish (Optimized Version)

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// ================= SCHEMA =================
const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: [true, "Employee ID is required"],
    unique: true,
    trim: true
  },
  employee_name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
    validate: {
      validator: v => isNaN(v),
      message: "Name should not be numeric"
    }
  },
  employee_salary: {
    type: Number,
    required: true,
    min: [1000, "Salary too low"],
    max: [10000000, "Salary too high"]
  },
  employee_age: {
    type: Number,
    required: true,
    min: [18, "Minimum age is 18"],
    max: [65, "Maximum age is 65"]
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

// ================= API ROUTES =================

// CREATE
app.post("/employees", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const saved = await employee.save();

    res.status(201).json({
      success: true,
      data: saved
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// READ ALL
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find({}, {
      _id: 0,
      employee_id: 1,
      employee_name: 1,
      employee_salary: 1,
      employee_age: 1
    });

    res.json({
      count: employees.length,
      data: employees
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// READ BY ID
app.get("/employees/:id", async (req, res) => {
  try {
    const emp = await Employee.findOne(
      { employee_id: req.params.id },
      { _id: 0 }
    );

    if (!emp) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(emp);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// UPDATE
app.put("/employees/:id", async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { employee_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

// DELETE
app.delete("/employees/:id", async (req, res) => {
  try {
    const result = await Employee.deleteOne({ employee_id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ================= KEEP ALIVE (Render Free Tier Fix) =================
setInterval(async () => {
  try {
    await fetch("https://restful-api-crud.onrender.com/employees");
    console.log("Self ping success");
  } catch (err) {
    console.log("Ping failed");
  }
}, 1000 * 60 * 10); // every 10 min

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
