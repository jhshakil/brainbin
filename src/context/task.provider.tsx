/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from "react";
import { getAllTask } from "@/services/TaskServices";
import type { TTask } from "@/types/task";

// ---------- State ----------
interface TaskState {
  allTasks: TTask[];
}

// ---------- Actions ----------
type TaskAction = { type: "SET_ALL_TASKS"; payload: TTask[] };

// ---------- Reducer ----------
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_ALL_TASKS":
      return { ...state, allTasks: action.payload };
    default:
      return state;
  }
};

// ---------- Context ----------
interface TaskContextType extends TaskState {
  setAllTasks: (tasks: TTask[]) => void;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ---------- Provider ----------
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    allTasks: [],
  });

  const setAllTasks = (tasks: TTask[]) =>
    dispatch({ type: "SET_ALL_TASKS", payload: tasks });

  // fetch tasks from API
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, setAllTasks, fetchTasks }}>
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
