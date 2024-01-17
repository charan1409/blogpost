import axios from "axios";

const axiosHelper = axios.create({
  baseURL: "https://blogpostbackend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosHelper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosHelper;
