const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/task");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todoapp")
.then(()=>console.log("MongoDB Connected"))
.catch(err => console.log(err));


// GET all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// ADD new task
app.post("/tasks/add", async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.json(newTask);
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

// TOGGLE completed
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;

    if (task.completed) {
        task.completedAt = new Date();
    } else {
        task.completedAt = null;
    }

    await task.save();
    res.json(task);
});

app.get("/analytics", async (req, res) => {
    const now = new Date();

    const today = new Date(now.setHours(0,0,0,0));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    const daily = await Task.countDocuments({ completedAt: { $gte: today }});
    const weekly = await Task.countDocuments({ completedAt: { $gte: weekAgo }});
    const monthly = await Task.countDocuments({ completedAt: { $gte: monthStart }});
    const yearly = await Task.countDocuments({ completedAt: { $gte: yearStart }});

    res.json({ daily, weekly, monthly, yearly });
});



app.listen(5000, () => console.log("Server running on port 5000"));
