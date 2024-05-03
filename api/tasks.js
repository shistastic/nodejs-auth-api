/** 
const express = require('express');
const TaskDTO = require('../models/task.js');
const authenticateToken = require('../middleware/middleware_auth.js');
const app = require('../index'); 

// Create a new task
app.post('/',authenticateToken, async (req, res) => {
  try {
    const newTask = new TaskDTO({
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      userId: req.user.id
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Retrieve all tasks for a specific user
app.get('/',authenticateToken, async (req, res) => {
  try {
    const tasks = await TaskDTO.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task
app.put('/:id',authenticateToken, async (req, res) => {
  try {
    let task = await TaskDTO.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.taskName = req.body.taskName || task.taskName;
    task.taskDescription = req.body.taskDescription || task.taskDescription;
    task.status = req.body.status || task.status;

    task = await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
app.delete('/:id',authenticateToken, async (req, res) => {
  try {
    const task = await TaskDTO.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/
