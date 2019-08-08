import axios from "axios";

export const openAPI = axios.create({
  //baseURL: "open.sernigan.io/",
  baseURL: "http://localhost:8008/",
  headers: {
    "Content-Type": "application/json"
  }
});
