import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance for public API (no auth required)
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// No auth interceptor - public endpoints don't need token
// No 401 redirect - public pages shouldn't redirect to login

export default publicApi;
