/* eslint-disable react-refresh/only-export-components */
import type { TUserData } from "@/types/auth";
import { createContext, useContext, useReducer } from "react";

// ---------- State ----------
interface AuthState {
  user: TUserData | null;
}

// ---------- Actions ----------
type AuthAction = { type: "SET_USER"; payload: TUserData | null };

// ---------- Reducer ----------
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

// ---------- Context ----------
interface AuthContextType extends AuthState {
  setUser: (user: TUserData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider ----------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  const setUser = (user: TUserData | null) =>
    dispatch({ type: "SET_USER", payload: user });

  return (
    <AuthContext.Provider value={{ ...state, setUser }}>
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
