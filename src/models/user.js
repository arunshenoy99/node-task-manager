const mongoose = require('mongoose')
const validator=require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can\'t be password')
            }
        }
    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }

    ]
})

userSchema.methods.generateAuthToken =async function(){
    const user =this
    const token = jwt.sign({_id:user._id.toString()},'thisismyauth',{expiresIn:'7 days'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//HASH THE PLAIN TEXT PASSWORD BEFORE SAVING
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password=await bcryptjs.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)


module.exports=User