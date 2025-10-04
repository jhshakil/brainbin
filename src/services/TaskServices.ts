/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axiosInstance";
import type { TTask, TTaskQueryParams } from "@/types/task";

export const getAllTask = async (query: TTaskQueryParams) => {
  try {
    const params = new URLSearchParams();

    if (query.search) params.append("search", query.search);
    if (query.status) params.append("status", query.status);
    if (query.page) params.append("page", query.page.toString());
    if (query.per_page) params.append("per_page", query.per_page.toString());

    const { data } = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/task?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getMyTask = async ({
  id,
  query,
}: {
  id: string;
  query: TTaskQueryParams;
}) => {
  try {
    const params = new URLSearchParams();

    if (id) params.append("userId", id);
    if (query.search) params.append("search", query.search);
    if (query.status) params.append("status", query.status);
    if (query.page) params.append("page", query.page.toString());
    if (query.per_page) params.append("per_page", query.per_page.toString());

    const { data } = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/task?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createTask = async (payload: Partial<TTask>): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/task`,
      payload
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateTask = async (payload: Partial<TTask>): Promise<any> => {
  try {
    const { data } = await axiosInstance.patch(`/task/${payload._id}`, payload);

    return data;
  } catch (error: any) {
    throw new Error("Failed to update task");
  }
};

export const DeleteTask = async (id: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(`/task/${id}`);

    return data;
  } catch (error: any) {
    throw new Error("Failed to delete task");
  }
};
