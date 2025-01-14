import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Loader } from "lucide-react"; 
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState("");

  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthenticationStore();

  
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setClientError("");
  };

  const validateInputs = () => {
    if (!username || !password) {
      setClientError("Both username and password are required.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    
    if (!validateInputs()) return;

    try {
      await login(username, password); 
      navigate("/search"); 
    } catch (err) {
      console.error("Login failed:", err);
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
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={User}
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleInputChange(setUsername)}
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
              {clientError || error || "Login failed. Please try again."}
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
                <Loader className="animate-spin" size={20} /> Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-orange-500 bg-opacity-100 flex justify-center">
        <p className="text-sm text-white">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-amber-800 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
