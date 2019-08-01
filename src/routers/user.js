const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')

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


//LOGIN A USER

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

//LOGOUT A USER
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{return token.token!=req.token})
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//LOGOUT OF ALL SESSIONS
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})


//FIND PROFILE
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})

//FIND USER BY ID

// router.get('/users/:id',async(req ,res)=>{
//     try{
//         const user = await User.findById(req.params.id)
//         if(!user){
//             return res.status(404).send({error:'User not found'})
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

//UPDATE USER BY AUTHENTICATION

router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Option'})
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
        }catch(e){
        res.status(400).send()
    }
})

const upload = multer({
    dest:'avatars',
    limits:{
        fileSize:1000000          //1 MB 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('Please upload an image file'))
        }
        // cb(new Error('File must be a pdf'))          //WRONG FILE
        // cb(undefined,true)                           //CORRECT FILE CALL CALLBACK WITH TRUE TO EXPECT UPLOAD
        // cb(undefined,false)                          //CORRECT FILE BUT REJECT IT SILENTLY, NO UPLOAD HAPPENS
        cb(undefined,true)
    }
   
})

router.post('/users/me/avatar',upload.single('avatar'),(req , res)=>{
    res.send()
})








module.exports=router