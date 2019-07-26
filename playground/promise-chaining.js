const User = require('../src/models/user')
require('../src/db/mongoose')

// User.findByIdAndUpdate('5d391ce18d89653620d3bf98',{age:1}).then((result)=>{
//     console.log(result)
//     return User.countDocuments({age:1})
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })


const updateAgeAndCount = async(id,age)=>{
    const result = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return({
        result,count
    })
}

updateAgeAndCount('5d391ca979679b41143ad94a',20).then((data)=>{
    console.log(data)
}).catch((e)=>{
    console.log(e)
})