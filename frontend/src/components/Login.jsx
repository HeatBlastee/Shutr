import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function changeEventHandler(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  async function signupHandler(e) {
    e.preventDefault();
    console.log(input);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
      console.log(input);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={signupHandler}
        className="bg-white shadow-xl rounded-lg p-8 w-96 space-y-5"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Shutr</h1>
          <p className="text-gray-600">Login to see yourself in the Shutr world</p>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full border-gray-300 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full border-gray-300 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
