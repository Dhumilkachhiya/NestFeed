import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Home, Heart, PlusSquare } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import AuthSidebar from "./AuthSidebar";
// import HomeBook from "@/assets/HomeBook.jpg";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed";
      const zodErrors = error.response?.data?.errors;
      if (zodErrors && zodErrors.length > 0) {
        toast.error(zodErrors[0].message);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex min-h-screen bg-white">
      <AuthSidebar />

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <form onSubmit={handleSignup} className="max-w-md w-full space-y-6 px-4">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2e42bf] to-[#d037a2]">HomeBook</span>
              <p className="text-gray-500 text-sm mt-1">Create an account to join the community</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                name="username"
                placeholder="Full Name"
                value={input.username}
                onChange={(e) => setInput({ ...input, username: e.target.value })}
                className="py-4 text-center border-gray-300 focus:ring-2 focus:ring-[#9142ca]"
              />
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
                Creating Account...
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
                Sign Up
              </Button>
            )}

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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold"
              style={{ color: '#9142ca' }}
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;