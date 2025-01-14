import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader } from "lucide-react"; 
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore";

const SignUpPage = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState("");

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthenticationStore();

  // Reset client-side errors on input change
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setClientError(""); // Clear client-side error
  };

  const validateInputs = () => {
    if (!username || !email || !password) {
      setClientError("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      setClientError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validateInputs()) return;

    try {
      await signup(email, password, username);  
      navigate("/signin");  
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white backdrop-filter rounded-2xl shadow-xl overflow-hidden mx-auto my-12"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-l from-orange-950 to-amber-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Username" 
            value={username}  
            onChange={handleInputChange(setUsername)}  
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleInputChange(setEmail)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword)}
          />
          {/* Display Errors */}
          {(clientError || error) && (
            <p className="text-red-500 font-semibold mt-2">
              {clientError || error}
            </p>
          )}

          <motion.button
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-orange-500 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:ring-opacity-50 disabled:opacity-70 transition"
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader className="animate-spin" size={20} /> Signing Up...
              </div>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-orange-500 bg-opacity-100 flex justify-center">
        <p className="text-sm text-white">
          Already have an account?{" "}
          <Link to={"/signin"} className="text-amber-800 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
