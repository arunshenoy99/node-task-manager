const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id:userOneId,
    name:'Test',
    email:'test@examplees.com',
    password:'56what!!',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET,{expiresIn:'7days'})
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id:userTwoId,
    name:'Test2',
    email:'test2@examplees.com',
    password:'56what!!',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET,{expiresIn:'7days'})
    }]
}

const taskOne = {
    _id:new mongoose.Types.ObjectId,
    description:'First Task',
    completed:false,
    owner:userOne._id
}

const taskTwo = {
    _id:new mongoose.Types.ObjectId,
    description:'Second Task',
    completed:true,
    owner:userOne._id
}

const taskThree = {
    _id:new mongoose.Types.ObjectId,
    description:'Third Task',
    completed:true,
    owner:userTwo._id
}



const setupDatabase = async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports={
    userOneId,
    userOne,
    userTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}