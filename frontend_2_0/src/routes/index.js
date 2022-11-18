import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Switch from "@mui/material/Switch";

import Basic from "../layouts/authentication/sign-in/index";

import Route from "./Route";
import routes from "./RenderRoutes";

import { AuthProvider } from "../context/Auth/AuthContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import LoggedInLayout from "../../src/layouts/authentication/components/BasicLayout/index";

const Routes = () => {
  const getRoutes = (allRoutes) => allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse);
    }

    if (route.route) {
      return <Route exact path={route.route} element={route.component} key={route.key} />;
    }

    return null;
  });

  return (
    <>
      <Switch>
        <Route exact path="/authentication/sign-in" component={Basic} />
          <WhatsAppsProvider>
            { getRoutes(routes) }
          </WhatsAppsProvider>
      </Switch>
    </>
  );
};

export default Routes;
