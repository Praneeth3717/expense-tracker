import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document{
  _id: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  _v?: number;
}
const UserSchema:Schema<IUser>=new mongoose.Schema(
  {
    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      unique:true,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    provider: { 
      type: String, 
      required: true,
      default: 'credentials'
    },
},{timestamps:true})

const User:Model<IUser>= mongoose.models.User || mongoose.model<IUser>('User',UserSchema)

export default User