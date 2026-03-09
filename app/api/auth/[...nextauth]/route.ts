import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import pool from "@/lib/mysql";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  provider: string;
}

interface CustomJWT extends JWT {
  id?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Please enter email and password");
        }

        const [rows] = await pool.query<UserRow[]>(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [email],
        );

        const user = rows[0];

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.provider !== "credentials") {
          throw new Error(`Please sign in using ${user.provider}`);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      const customToken = token as CustomJWT;

      if (user) {
        customToken.id = user.id;
      }

      return customToken;
    },

    async session({ session, token }) {
      const customSession = session as CustomSession;
      const customToken = token as CustomJWT;

      if (customToken.id) {
        customSession.user.id = customToken.id;
      }

      return customSession;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url === `${baseUrl}/` ? `${baseUrl}/dashboard` : url;
      }
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
