import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, getToken, clearToken } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import Loading from "react-fullscreen-loading";

const AuthContext = React.createContext();

AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const [userData, setUserData] = React.useState({
    user: null,
    token: null,
  });

  let navigate = useNavigate();

  const {
    data,
    refetch: refreshUser,
    isLoading,
    isFetching,
  } = useQuery(
    "get-me",
    () =>
      api.get("get-me", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    {
      onSuccess: (data) => {
        setUserData({ user: data.user, token: data.token });
      },

      onError: (status) => {
        logout();
      },
      enabled: false,
    }
  );

  const bootstrapMe = () => {
    if (getToken()) {
      refreshUser();
    }
  };

  React.useEffect(() => {
    bootstrapMe();
  }, []);

  const logout = () => {
    setUserData({ user: null, token: null });
    clearToken();
    navigate("/");
  };

  const value = React.useMemo(
    () => ({ userData, setUserData, refreshUser, logout }),
    [userData, setUserData, refreshUser, logout]
  );

  if (isLoading || isFetching) {
    return <Loading loading background="#f8f9fe" loaderColor="#dc3545" />;
  }

  return <AuthContext.Provider value={value} {...props} />;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
