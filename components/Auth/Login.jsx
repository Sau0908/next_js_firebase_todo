import { auth } from "@/Firebase";
import { useAuth } from "@/context/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      router.push("/todos");
    }
  }, [authUser]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", user);
      toast.success("User LogIn Success ");

      router.push("/todos");
    } catch (error) {
      toast.error(error.message);
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login to TODO App</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          >
            Log In
          </button>

          <p className="text-center text-sm mt-4">
            <span> Don't have an account ?</span>
            <Link href="/signup">
              <span className="font-bold"> Sign Up</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
