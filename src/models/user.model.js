const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        lowercase:true,
        unique:[true,"email already exist"]
    },

    name:{
        type:String,
        required:[true,"name is required"],
    },

    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be at least 6 characters long"],
        select:false
    },
    systemuser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{timestamps:true})


userschema.pre('save',async function(){
    if(!this.isModified('password')){
        return
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    return
})

userschema.methods.comparePassword = async function(password){
    
    return await bcrypt.compare(password,this.password)
}

const usermodel = mongoose.model('User',userschema)
module.exports = usermodel