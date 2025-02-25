import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  departement: string;
  role?: number;
}

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/users")
      .then((response) => {
        const users = response.data.data;
        // Mapping data user ke format UserData yang digunakan pada tabel.
        const mappedUsers: UserData[] = users.map(
          (user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            address: string;
            departement: string;
            role?: string;
          }) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            departement: user.departement,
            role: user.role || "Unknown",
          })
        );
        setTableData(mappedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("accessToken");
    axios
      .delete(`http://localhost:5000/api/v1//deleteUser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Update state dengan menghapus user yang telah dihapus
        setTableData((prevData) => prevData.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[802px]">
          <Table>
            {/* Header Tabel */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Departemen
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Body Tabel */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start">
                    {user.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.phone}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.address}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.departement}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.role === 1 ? 'Admin' : 'User '}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <button
                      className="bg-red-500 text-white rounded-lg p-2"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
