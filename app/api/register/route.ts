import connectDB from '../../lib/dbConnect'
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from '../../../models/userModel'

export const POST = async (req:NextRequest) => {
    try {
        const { name, email, password } = await req.json();

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" }, 
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            provider: 'credentials' }
        );

        await newUser.save();
        return NextResponse.json(
            { message: "User created successfully" }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in registration:", error);
        
        return NextResponse.json(
            { error: "Failed to register user" }, 
            { status: 500 }
        );
    }
};
