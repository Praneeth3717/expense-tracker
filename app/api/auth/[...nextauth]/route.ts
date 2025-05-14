import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from '../../../../models/userModel';
import connectDB from '../../../lib/dbConnect';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials.password) {
                    throw new Error("Please enter email and password");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("No user found with this email");
                
                if (user.provider !== 'credentials') {
                    throw new Error(`Please sign in with ${user.provider}`);
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordCorrect) throw new Error("Invalid password");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    pages: {
        signIn: '/',
        error: '/',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id || user._id;
                token.provider = 'credentials';
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url === `${baseUrl}/`) {
                return `${baseUrl}/dashboard`;
            }

            return `${baseUrl}/`;
            }
        },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };

