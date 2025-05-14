import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document{
  name: string;
  email: string;
  password: string;
  provider?: string
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