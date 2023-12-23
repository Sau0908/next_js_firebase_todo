import { auth } from "@/Firebase";
import { useAuth } from "@/context/useAuth";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { authUser, isLoading, setAuthUser } = useAuth();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/todos");
    }
  }, [authUser, isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      console.log(user);
      setAuthUser({
        uid: user.uid,
        email: user.email,
        username,
      });
    } catch (error) {
      setError("Error creating user: " + error.message);
    }
  };

  const googleHandler = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      router.push("/todos");
    } catch (error) {
      setError("Error signing in with Google: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up for Your Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
            required
          />
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
            Sign Up
          </button>
          <button
            onClick={googleHandler}
            className="relative w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          >
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <AiFillGoogleCircle size={30} />
            </span>
            Continue with Google
          </button>
          <p className="text-center text-sm mt-4">
            Already have an account?
            <Link href="/login">
              <span className="font-bold"> LogIn</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
