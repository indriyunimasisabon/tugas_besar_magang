import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [currentUser, setCurrentUser] = useState<null | {
    id: number;
    name: string;
    email: string;
    role?: number;
  }>(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      axios
        .get("http://localhost:5000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token ke server
          },
        })
        .then((response) => {
          const loggedInUser = response.data.data.find(
            (user: { id: number; name: string; email: string; role?: number } ) => user.id == Number(userId)
          );
          if (loggedInUser) {
            setCurrentUser(loggedInUser);
            
          } else {
            console.warn("User not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);
  const handleLogout = () => {
    const token = localStorage.getItem("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    
    
    navigate("/");
  };
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        <br/>
        {/* Tampilkan nama & role user yang sedang login */}
        <span className="block mr-1 font-medium text-theme-sm">
          {currentUser
            ? `${currentUser.name} - ${currentUser.role === 1 ? 'Admin' : 'User'}`
            : "Loading..."}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          {/* Tampilkan info user di dalam dropdown juga, jika mau */}
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400"></span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400"></span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Account settings
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
