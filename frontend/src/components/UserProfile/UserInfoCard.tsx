import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [currentUser, setCurrentUser] = useState<null | {
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;
      departement: string;
      role?: string;
    }>(null);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

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
            (user: { id: number; name: string; email: string; role?: string } ) => user.id == Number(userId)
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
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

            <div className="my-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {currentUser
            ? `${currentUser.name}`
            : "Loading..."}
              </p>
            </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {currentUser
            ? `${currentUser.email}`
            : "Loading..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {currentUser
            ? `${currentUser.phone}`
            : "Loading..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {currentUser
            ? `${currentUser.address}`
            : "Loading..."}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Departement
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {currentUser
            ? `${currentUser.departement}`
            : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
