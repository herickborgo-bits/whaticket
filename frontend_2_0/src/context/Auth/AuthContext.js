/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { createContext, useMemo } from "react";

import useAuth from "../../hooks/useAuth.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { loading, user, isAuth, handleLogin, handleLogout } = useAuth();
  const authProviderValue = useMemo(
    () => ({ loading, user, isAuth, handleLogin, handleLogout }),
    [loading, user, isAuth, handleLogin, handleLogout]
  );

  return <AuthContext.Provider value={authProviderValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
