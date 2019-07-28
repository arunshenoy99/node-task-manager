const express = require('express')
const Task = require('../models/task')

const router = express.Router()

//CREATE NEW TASK

router.post('/tasks',async(req,res)=>{
    const task = new Task(req.body)
    try{
        await user.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//FIND ALL TASKS

router.get('/tasks',async(req,res)=>{

    try{
        const tasks=await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

//FIND TASK BY ID

router.get('/tasks/:id',async(req,res)=>{

    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send({error:'Task not found'})
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})



//UPDATE TASK BY ID

router.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed','desciption']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Not a valid option'})
    }
    try{
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send({error:'Task not found'})
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


//DELETE TASK BY ID
router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
        return res.status(404).send({error:'Task not found'})
        }
        res.send(task)
        
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports=router