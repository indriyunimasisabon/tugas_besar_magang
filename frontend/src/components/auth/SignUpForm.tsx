import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import axios from "axios";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menampilkan error

  const API_URL = "http://localhost:5000/api/v1/auth/register";

  const roleMapping: { [key: string]: number } = {
    user: 0,
    admin: 1,
    super_admin: 2,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validasi sebelum dikirim ke backend
    if (!name || !email || !password) {
      setErrorMessage("Semua field harus diisi");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        name,
        email,
        password,
        role: roleMapping[role], // Sesuai dengan backend
      });

      if (!role) {
        setErrorMessage("Role harus dipilih");
        return;
      }

      setErrorMessage(""); // Reset error message jika berhasil
    } catch (error: any) {
      console.error(
        "Error saat registrasi:",
        error.response?.data?.msg || error.message
      );
      setErrorMessage(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  return (
    <div className="overflow-hidden flex justify-center items-center rounded-2xl border border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center items-center flex-1 w-full mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign Up
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign up!
              </p>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <Label>
                      Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label>
                      Password<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
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

                  {/* Role */}
                  <div>
                    <Label>
                      Role<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-200"
                      >
                        <option value="" disabled>
                          Select Role
                        </option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      className="w-5 h-5"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                      By creating an account means you agree to the{" "}
                      <span className="text-gray-800 dark:text-white/90">
                        Terms and Conditions,
                      </span>{" "}
                      and our{" "}
                      <span className="text-gray-800 dark:text-white">
                        Privacy Policy
                      </span>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-4 py-3 mb-4 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}