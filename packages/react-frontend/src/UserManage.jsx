import React, { createContext, useState, useContext } from "react";

const UserManage = createContext(null);

export const UserState = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserManage.Provider value={{ user, login, logout }}>
      {children}
    </UserManage.Provider>
  );
};

export const useUser = () => useContext(UserManage);
