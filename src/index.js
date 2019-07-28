const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const app = express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

//Paths 
const port = process.env.PORT||3000

//Configure JSON AND EXPRESS SERVER
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const jwt = require('jsonwebtoken')

// const myFunction = ()=>{
//     const token = jwt.sign({_id:'abc123'},'thisismyauth',{expiresIn:'7 days'})
//     const isMatch = jwt.verify(token,'thisismyauth')
//     console.log(isMatch)
// }

app.listen(port,()=>{
    console.log('Server started on port '+port)
})

// myFunction()