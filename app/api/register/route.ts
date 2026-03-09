import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: RegisterBody = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const [existingUser] = await pool.query<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query<ResultSetHeader>(
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
