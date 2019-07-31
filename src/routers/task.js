const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

//CREATE NEW TASK

router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//FIND ALL TASKS

router.get('/tasks',auth,async(req,res)=>{
    try{
        // const tasks=await Task.find({owner:req.user._id})
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

//FIND TASK BY ID

router.get('/tasks/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})



//UPDATE TASK BY ID

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed','description']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Not a valid option'})
    }
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send({error:'Task not found'})
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


//DELETE TASK BY ID
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
        return res.status(404).send({error:'Task not found'})
        }
        res.send(task)
        
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports=router