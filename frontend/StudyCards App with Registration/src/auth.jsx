export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isAuth = () => !!localStorage.getItem("token");