const  mongoose = require("mongoose");
 const bcrypt = require('bcrypt') ;
//define personSchema 
const userSchema =  new mongoose.Schema({
    name:{
        type:String ,
        required:true
    },
    age:{
        type:Number,
        required:true 
    },
    email:{
        type:String ,
    },
    mobile:{
        type:String ,
        
    },
    address:{
        type:String,
        required:true 
    },
    aadharCardNumber:{ // it is username here 
        type:Number ,
        required:true ,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter', 'admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false 
    },
   

});

userSchema.pre('save' , async function(next){
    const person = this ;
    //hash the password only if it has been modified(or is new)
    if(!person.isModified('password')) return next() ;
    try {
       //hash password  generation 
       const salt = await bcrypt.genSalt(10) ;
       //hash passwrod
       const hashedPassword = await bcrypt.hash(person.password , salt) ;
       
       //override the plain  password with hashed  one  
       person.password = hashedPassword ;
       next() ;
    } catch (error) {
        return next(error) ; 
    }
})
// this function check password is valid or not 
userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await  bcrypt.compare(candidatePassword, this.password) ;
        return isMatch ;
    } catch (error) {
        throw error ;
    }
}
//create person schema 
const user = mongoose.model('user' , userSchema) ;
module.exports = user ; 