export const saveAuth = ({ token, role, userId, username }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
};

export const getRole = () => localStorage.getItem("role");
export const isLoggedIn = () => !!localStorage.getItem("token");
