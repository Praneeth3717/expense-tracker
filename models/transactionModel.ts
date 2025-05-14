import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITransaction extends Document {
    userId:mongoose.Types.ObjectId,
    type:string,
    category:string,
    amount:number,
    date:Date
}

const TransactionSchema:Schema<ITransaction>=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        required:true,
        enum: ["income", "expense"]
    },
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
},
{ timestamps: true }
)

const Transaction:Model<ITransaction>=mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction",TransactionSchema)

export default Transaction