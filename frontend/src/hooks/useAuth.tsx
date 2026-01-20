"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"; // ✅ ReactNode added
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { User } from "@/types/api";
import { RegisterFormState } from "app/[locale]/auth/register/consts";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (body: RegisterFormState) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ ReactNode type
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    token && checkAuth();
  }, []);

  // Add initial token check
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await authApi.whoami();
      setUser(userData);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { access_token, user } = await authApi.login(email, password);
    localStorage.setItem("token", access_token);
    document.cookie = `auth-token=${access_token}; path=/; max-age=86400`;
    document.cookie = `user-role=${user.role || "user"}; path=/; max-age=86400`;
    setUser(user);
    router.refresh();
    router.push("/tournaments");
  };

  const signup = async (body: RegisterFormState) => {
    const { access_token, user } = await authApi.signup(body);
    localStorage.setItem("token", access_token);
    document.cookie = `auth-token=${access_token}; path=/; max-age=86400`;
    document.cookie = `user-role=${user.role || "user"}; path=/; max-age=86400`;
    setUser(user);
    router.push("/tournaments");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
