import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/mysql";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, password } = await req.json();

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name,email,password,provider)
       VALUES (?,?,?,?)`,
      [name, email, hashedPassword, "credentials"],
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 },
    );
  }
};
