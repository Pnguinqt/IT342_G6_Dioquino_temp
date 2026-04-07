import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};