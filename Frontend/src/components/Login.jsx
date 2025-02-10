import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
        const url = isLogin ? `${base_url}/api/auth/login` : `${base_url}/api/auth/signin`;
        const data = isLogin ? { email, password } : { name, email, password };
        const response = await axios.post(url, data);
        console.log(response.data);
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", response.data.user._id);
          setLoading(false);
          toast.success(response.data.message);
          navigate("/events");
        } else {
          console.error("Authentication failed:", response.data.error);
          setLoading(false);
          toast.error(response.data.error);
        }
      } catch (error) {
        console.log("Error:", error.response?.data?.error || error.message);
        setLoading(false);
        toast.error(error.response?.data?.error || error.message);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      { loading ? <Loader /> : (
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-blue-500 hover:underline focus:outline-none cursor-pointer"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
        <p className="mt-4 text-sm text-center">
          <button
            onClick={() => navigate("/events") }
            className="ml-1 text-blue-500 hover:underline focus:outline-none cursor-pointer"
          >
            Continue as a guest?
          </button>
        </p>
      </div>
      )}
    </div>
  );
}
