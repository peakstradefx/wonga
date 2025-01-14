import axios from "axios";
import { signOut, getSession } from "next-auth/react";

// Create axios instance
export const instance = axios.create({
  baseURL: "/api",
  timeout: 35000,
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Get the session before each request
    const session = await getSession();

    // If session exists, add the token to headers
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Handle unauthorized access
      // await signOut({ callbackUrl: "/auth/login" });
    } else if (status === 412) {
      console.error("Precondition Failed: ", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Export a helper function to refresh the instance configuration
export const refreshAuthToken = async () => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session?.user.accessToken}`;
  }
};
