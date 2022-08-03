import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, getToken, clearToken } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const [user, setUser] = React.useState({
    user: null,
    token: null,
  });

  let navigate = useNavigate();

  const { data, refetch, isLoading } = useQuery(
    "get-me",
    () =>
      api.get("get-me", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }),
    {
      onSuccess: (data) => {
        setUser({ user: data.user, token: data.token });
      },

      onError: (status) => {
        logout();
      },
      enabled: false,
    }
  );

  const bootstrapMe = () => {
    if (getToken()) {
      refetch();
    }
  };

  React.useEffect(() => {
    bootstrapMe();
  }, []);

  const logout = () => {
    setUser({ user: null, token: null });
    clearToken();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ ...user, setUser, logout: logout }}
      {...props}
    />
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
