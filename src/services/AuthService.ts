/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import type { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/create-user", userData);

    if (data.success) {
      Cookies.set("accessToken", data?.data?.accessToken);
      Cookies.set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      Cookies.set("accessToken", data?.data?.accessToken);
      Cookies.set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

export const getCurrentUser = async () => {
  const accessToken = Cookies.get("accessToken");

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);
    const { email, name, role, id } = decodedToken;

    return {
      id,
      email,
      name,
      role,
    };
  }

  return decodedToken;
};

export const getNewAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
      withCredentials: true,
      headers: {
        cookies: `refreshToken=${refreshToken}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Failed to get new access token");
  }
};

export const forgetPassword = async (payload: {
  email: string;
}): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/auth/forget-password", payload);

    return data;
  } catch (error: any) {
    throw new Error("User not found");
  }
};

export const resetPassword = async (payload: {
  email: string;
}): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/auth/reset-password", payload);

    return data;
  } catch (error: any) {
    throw new Error("User not found");
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/auth/users`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
