//Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// create an instace of express
const app = express();
// convert to json midleware
app.use(express.json());
app.use(cors())
// Define the route
// app.get('/',(req, res)=>{
// res.send("Hello World!");
// })


// Sample in-memory storage for todo item
// let todos = [];

mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("DB Connected!.");
})
.catch((err)=>{
    console.log(err);
})

// Creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type: String
    },
    description: String
})

// Creating model
const todoModel = mongoose.model('Todo',todoSchema);

//Create a new ToDo item
app.post('/todos', async(req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);

    // creating item in md
    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);

    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }

})


// get All item
app.get('/todos', async(req, res) => {
    try{
      const todos = await todoModel.find();
      res.json(todos);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


// Update todo item
app.put('/todos/:id',async(req, res)=>{
    try{
        const { title, description } = req.body;  
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"ToDo Not Found"});
        }
        res.json(updatedTodo);

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }

})

// Delete a ToDo item
app.delete('/todos/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        const deleteTodo = await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }

})



// Start the Server
const port = 8000;
app.listen(port, () => {
    console.log("Server is listening the port" + port);
})