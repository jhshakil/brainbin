/* eslint-disable react-refresh/only-export-components */
import { getAllUsers, getCurrentUser } from "@/services/AuthService";
import type { TUserData } from "@/types/auth";
import { createContext, useContext, useEffect, useReducer } from "react";

// ---------- State ----------
interface AuthState {
  user: TUserData | null;
  allUsers: TUserData[]; // ✅ added this
}

// ---------- Actions ----------
type AuthAction =
  | { type: "SET_USER"; payload: TUserData | null }
  | { type: "SET_ALL_USER"; payload: TUserData[] };

// ---------- Reducer ----------
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_ALL_USER":
      return { ...state, allUsers: action.payload };
    default:
      return state;
  }
};

// ---------- Context ----------
interface AuthContextType extends AuthState {
  setUser: (user: TUserData | null) => void;
  setAllUsers: (users: TUserData[]) => void;
  fetchAllUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider ----------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    allUsers: [], // ✅ initial
  });

  const fetchUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
  };
  const fetchAllUsers = async () => {
    const all = await getAllUsers();
    if (all.success) {
      setAllUsers(all?.data);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAllUsers();
  }, []);

  const setUser = (user: TUserData | null) =>
    dispatch({ type: "SET_USER", payload: user });

  const setAllUsers = (users: TUserData[]) =>
    dispatch({ type: "SET_ALL_USER", payload: users });

  return (
    <AuthContext.Provider
      value={{ ...state, setUser, setAllUsers, fetchAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------- Hook ----------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
