import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Home, Heart } from "lucide-react";
import AuthSidebar from "./AuthSidebar";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";
// import HomeBook from "@/assets/HomeBook.jpg";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AuthSidebar />

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <form onSubmit={signupHandler} className="max-w-md w-full space-y-6 px-4">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2e42bf] to-[#d037a2]">HomeBook</span>
              <p className="text-gray-500 text-sm mt-1">Welcome back, please log in to continue</p>
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                className="py-4 text-center border-gray-300 focus:ring-2 focus:ring-[#9142ca]"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                className="py-4 text-center border-gray-300 focus:ring-2 focus:ring-[#9142ca]"
              />
            </div>

            {loading ? (
              <Button className="w-full py-6" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging In...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-6 text-white font-medium transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #2e42bf 0%, #9142ca 50%, #d037a2 100%)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Log In
              </Button>
            )}

            <div className="flex items-center justify-between mt-4">
              <Link
                to="/forgot-password"
                className="text-sm hover:underline"
                style={{ color: '#9142ca' }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Button
              variant="outline"
              className="w-full py-6 space-x-2 border-gray-300 hover:bg-gray-50"
            >
              <img src="/google-icon.svg" className="w-5 h-5" alt="Google" />
              <span>Continue with Google</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold"
              style={{ color: '#9142ca' }}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;