import axios from "axios";

const AUTH0_API_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL!;
const AUTH0_MANAGEMENT_API_TOKEN = process.env.AUTH0_MANAGEMENT_API_TOKEN!;

export const apiClient = axios.create({
  baseURL: AUTH0_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH0_MANAGEMENT_API_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
