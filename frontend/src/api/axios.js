import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "X-Requested-With": "XMLHttpRequest" },
  withCredentials: true, // très important !
});

// Ajoute le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
});

export default api;
