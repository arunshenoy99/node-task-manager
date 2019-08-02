const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const app = express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
//Paths 
const port = process.env.PORT

//Configure JSON AND EXPRESS SERVER
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('Server started on port '+port)
})
