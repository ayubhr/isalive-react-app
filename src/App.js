// @ts-nocheck
import React from "react";
import {
  Route,
  Navigate,
  Outlet,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import { RecoilRoot } from "recoil";

import { useAuth } from "./context/auth/auth-context";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Loading from "react-fullscreen-loading";

//import style
import "./login.css";
import "./account.css";

const RootStack: React.FC = () => {
  const { userData } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path=""
          element={userData.user === null ? <Login /> : <Account />}
        />
      </Routes>
    </>
  );
};

export default RootStack;
