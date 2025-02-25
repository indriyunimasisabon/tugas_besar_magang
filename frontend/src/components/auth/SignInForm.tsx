import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // pastikan import 'react-router-dom'
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState(""); // state untuk email
  const [password, setPassword] = useState(""); // state untuk password
  const navigate = useNavigate();

  // State untuk snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const API_URL = "http://localhost:5000/api/v1/auth";

  interface loginResponse {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      password: string;
      role: string;
    };
  }

  const login = async (
    email: string,
    password: string
  ): Promise<loginResponse> => {
    try {
      const response = await axios.post<loginResponse>(`${API_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Fungsi untuk menampilkan snackbar
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await login(email, password);

      const user = response.user;
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userId", JSON.stringify(user.id));
      localStorage.setItem("userRole", user.role); // simpan role (misalnya "0" atau "1")
      showSnackbar("Login successful!", "success");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error: any) {
      showSnackbar("Login failed: " + error.message, "error");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5">
            <h1 className="mb-6 font-semibold text-center text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Snackbar */}
      {snackbarOpen && (
        <div
          className={`fixed top-4 right-6 transform -translate-x-4 px-4 py-2 rounded shadow-lg ${
            snackbarType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {snackbarMessage}
        </div>
      )}
    </div>
  );
}
