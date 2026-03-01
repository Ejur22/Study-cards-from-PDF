// import { createContext, useContext, useState, useEffect } from "react";
// import api from "./api";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser] = useState(null); // user info, including role

//   useEffect(() => {
//     if (token) {
//       // Получаем профиль пользователя (и роль)
//       api.get("/me")
//         .then(res => setUser(res.data))
//         .catch(() => setUser(null));
//     } else {
//       setUser(null);
//     }
//   }, [token]);

//   const login = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   const isAuth = !!token;
//   const role = user?.role || "guest";

//   return (
//     <AuthContext.Provider value={{ token, login, logout, isAuth, user, role }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "./api";

// Определяем тип пользователя (как минимум с полем role)
interface User {
  role: string;
  // можно добавить другие поля, например, id, name и т.д.
  [key: string]: any;
}

// Тип для значения контекста
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuth: boolean;
  user: User | null;
  role: string;
}

// Создаём контекст с начальным значением (заглушки)
const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuth: false,
  user: null,
  role: "guest",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null); // user info, including role

  useEffect(() => {
    if (token) {
      // Получаем профиль пользователя (и роль)
      api.get<User>("/me")
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuth = !!token;
  const role = user?.role || "guest";

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth, user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);