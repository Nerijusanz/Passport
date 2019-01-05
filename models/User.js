import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,lowercase:true,unique:true,index:true},
    password:{type:String,required:true},

},{timestamps:true});

userSchema.methods.setPassword = function setPassword(inputPassword){
    this.password = bcrypt.hashSync(inputPassword,10);
}

userSchema.methods.isValidPassword = function isValidPassword(inputPassword){
    return bcrypt.compareSync(inputPassword,this.password); //return boolean
};


const User = mongoose.model('User',userSchema);
module.exports = User;