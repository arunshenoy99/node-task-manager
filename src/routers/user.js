const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('/test',(req,res)=>{
    res.send('From a new file')
})


//CREATE NEW USER
router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token =await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})


//FIND ALL USERS
router.get('/users',async(req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(200).send(e)
    }
    
})

//FIND USER BY ID

router.get('/users/:id',(req ,res)=>{
    try{
        const user = User.findById(req.params.id)
        if(!user){
            return res.status(404).send({error:'User not found'})
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

//UPDATE USER BY ID

router.patch('/users/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Option'})
    }
    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
        // const user =await  User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})    //returns updated user
        if(!user){
            res.status(404).send({error:'User not found'})
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id',async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
        return res.status(404).send({error:'User not found'})
        }
        res.send(user)
    }catch(e){
        res.status(400).send()
    }
})









module.exports=router