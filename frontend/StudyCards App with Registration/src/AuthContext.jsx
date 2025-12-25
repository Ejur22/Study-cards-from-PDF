import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [token, setToken] = useState(() => localStorage.getItem("token"));

const login = (newToken) => {
localStorage.setItem("token", newToken);
setToken(newToken); // триггерит rerender
};

const logout = () => {
localStorage.removeItem("token");
setToken(null);
};

const isAuth = !!token;

return (
<AuthContext.Provider value={{ token, login, logout, isAuth }}>
{children}
</AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);