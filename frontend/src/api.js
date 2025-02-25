import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/auth"

export const login = async (email, password) =>{
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
}