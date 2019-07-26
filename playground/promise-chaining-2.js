const Task = require('../src/models/task')
require('../src/db/mongoose')

// Task.findByIdAndDelete('5d392c2709fe030160370596').then((task)=>{
//     console.log('The deleted task is '+task)
//     return Task.countDocuments({completed:false})
// }).then((count)=>{
//     console.log('The number of tasks to be completed is '+count)
// }).catch((e)=>{
//     console.log(e)
// })


deleteTaskAndCount = async(id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.count({completed:false})
    return{task,count}
}

deleteTaskAndCount('5d392c05adb77c3f7c0f5b3c').then((data)=>{
    console.log(data)
}).catch((e)=>{
    console.log(e)
})
