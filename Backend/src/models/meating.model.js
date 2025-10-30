import mongoose, { Mongoose, Schema } from "mongoose";

const meatingSchema=new Schema({
    user_id:{type:String},
    meatingcode:{type:String,required:true},
    date:{type:Date,default:Date.now,required:true},

})

const Meating=mongoose.model("Meating",meatingSchema);
export {Meating};