/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";
import { getAllTask, getMyTask } from "@/services/TaskServices";
import type { TTask } from "@/types/task";

// ---------- State ----------
interface TaskState {
  allTasks: TTask[];
  myTasks: TTask[];
}

// ---------- Actions ----------
type TaskAction =
  | { type: "SET_ALL_TASKS"; payload: TTask[] }
  | { type: "SET_MY_TASKS"; payload: TTask[] };

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
  setAllTasks: (tasks: TTask[]) => void;
  setMyTasks: (tasks: TTask[]) => void;
  fetchTasks: () => Promise<void>;
  fetchMyTasks: (userId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ---------- Provider ----------
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    allTasks: [],
    myTasks: [], // ✅ initial
  });

  const setAllTasks = (tasks: TTask[]) =>
    dispatch({ type: "SET_ALL_TASKS", payload: tasks });

  const setMyTasks = (tasks: TTask[]) =>
    dispatch({ type: "SET_MY_TASKS", payload: tasks });

  // fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await getAllTask();
      if (res?.success) {
        setAllTasks(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // fetch my tasks (filtered by userId)
  const fetchMyTasks = async (userId: string) => {
    try {
      const res = await getMyTask(userId);
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
