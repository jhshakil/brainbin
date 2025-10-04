/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";
import { getAllTask, getMyTask } from "@/services/TaskServices";
import type { TTaskQueryParams, TTasks } from "@/types/task";

// ---------- State ----------
interface TaskState {
  allTasks: TTasks;
  myTasks: TTasks;
}

// ---------- Actions ----------
type TaskAction =
  | { type: "SET_ALL_TASKS"; payload: TTasks }
  | { type: "SET_MY_TASKS"; payload: TTasks };

// ---------- Reducer ----------
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_ALL_TASKS":
      return { ...state, allTasks: action.payload };
    case "SET_MY_TASKS":
      return { ...state, myTasks: action.payload };
    default:
      return state;
  }
};

// ---------- Context ----------
interface TaskContextType extends TaskState {
  setAllTasks: (tasks: TTasks) => void;
  setMyTasks: (tasks: TTasks) => void;
  fetchTasks: (query: TTaskQueryParams) => Promise<void>;
  fetchMyTasks: (userId: string, query: TTaskQueryParams) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ---------- Provider ----------
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    allTasks: {
      data: [],
      meta: { total: 0, page: 1, per_page: 10, totalPages: 0 },
    },
    myTasks: {
      data: [],
      meta: { total: 0, page: 1, per_page: 10, totalPages: 0 },
    },
  });

  const setAllTasks = (tasks: TTasks) =>
    dispatch({ type: "SET_ALL_TASKS", payload: tasks });

  const setMyTasks = (tasks: TTasks) =>
    dispatch({ type: "SET_MY_TASKS", payload: tasks });

  // fetch all tasks
  const fetchTasks = async (query: TTaskQueryParams) => {
    try {
      const res = await getAllTask(query);
      if (res?.success) {
        setAllTasks(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // fetch my tasks (filtered by userId)
  const fetchMyTasks = async (userId: string, query: TTaskQueryParams) => {
    try {
      const res = await getMyTask({ id: userId, query });
      if (res?.success) {
        setMyTasks(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch my tasks:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ ...state, setAllTasks, setMyTasks, fetchTasks, fetchMyTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// ---------- Hook ----------
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
