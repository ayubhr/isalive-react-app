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

import Login from "./pages/Login";
import Account from "./pages/Account";

//import style
import "./login.css";
import "./account.css";

const RootStack: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/account"} element={<Account />} />
      </Routes>
    </>
  );
};

const App = () => (
  <RecoilRoot>
    <RootStack />
  </RecoilRoot>
);

export default App;
