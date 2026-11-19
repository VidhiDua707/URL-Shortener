import { apiRequest } from "./api";
export const registerUser = async (name, email, password) => {
  return await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const loginUser = async (email, password) => {
  return await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};