const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();
const link=process.env.link
app.use(express.json())

mongoose.connect(link)
.then(()=>console.log("mongo db is connected"))
.catch(()=>console.log("mongo bd is not connected"))

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);


app.post('/todo', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get('/todo', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'To-do item not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.put('/todo/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'To-do item not found' });

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (typeof completed === 'boolean') todo.completed = completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'To-do item not found' });
    res.json({ message: 'To-do item deleted', todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});