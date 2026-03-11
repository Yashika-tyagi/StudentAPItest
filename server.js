const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/student");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

/* ================================
   CREATE STUDENT
================================ */
app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* ================================
   GET ALL STUDENTS
================================ */
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================================
   SEARCH STUDENTS BY COURSE
   (Professional way using query)
   Example:
   /students/search?course=BCA
================================ */
app.get("/students/search", async (req, res) => {
    try {
        const { course } = req.query;

        if (!course) {
            return res.status(400).json({ message: "Course query is required" });
        }

        const students = await Student.find({ course });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ================================
   GET STUDENT BY ID
================================ */
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

/* ================================
   UPDATE STUDENT
================================ */
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

/* ================================
   DELETE STUDENT
================================ */
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);

});
