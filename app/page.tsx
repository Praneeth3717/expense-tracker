"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-800"></div>
  </div>
);

interface UserState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const toggleForm = () => setIsSignIn(!isSignIn);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isSignIn) {
      if (user.password !== user.confirmPassword) {
        setError("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post('/api/register', {
          name: user.name,
          email: user.email,
          password: user.password,
        });

        if (res.status === 201) {
          alert("Registration successful! You can now sign in.");
          toggleForm();
          setUser({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong! Please try again.");
      }
    } else {
      try {
        const result = await signIn("credentials", {
          email: user.email,
          password: user.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid credentials. Please try again.");
        }else{
          router.push('/dashboard')
        }
      } catch (error) {
        console.error(error);
        setError("Login failed. Please try again.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-5 bg-white">
      <div className="col-span-1 md:col-span-3 flex items-center justify-center p-4 sm:p-5 md:p-8 bg-gray-50">
        <div className="w-full max-w-md px-4 sm:px-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            TrackMyCash
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-1 italic">
            &quot;Beware of little expenses; a small leak will sink a great ship.&quot;
          </p>
          <p className="text-gray-500 text-xs mb-4 sm:mb-6">– Benjamin Franklin</p>

          <h2 className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3">
            {isSignIn ? "Welcome Back, Friend...!" : "Sign Up and Go!"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-3">
            {!isSignIn && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={user.name}
                onChange={handleChange}
                className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition text-sm"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition text-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition text-sm"
              required
            />
            {!isSignIn && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={user.confirmPassword}
                onChange={handleChange}
                className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition text-sm"
                required
              />
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button
              type="submit"
              className="bg-red-900 hover:bg-red-950 text-white p-2 rounded-md font-medium shadow-md transition duration-300 text-sm"
            >
              {isLoading ? <Spinner /> : isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-3 sm:mt-4 text-xs text-gray-600 text-center">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-red-800 hover:underline font-medium ml-1 transition"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      <div className="col-span-2 relative hidden md:block">
        <Image
          className="object-cover"
          src="/expenses.webp"
          alt="Expenses illustration"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    </div>
  );
}