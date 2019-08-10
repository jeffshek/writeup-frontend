import axios from "axios";

export const openAPI = axios.create({
  baseURL: process.env.REACT_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
