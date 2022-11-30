/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// React
import { useReducer, useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import { Icon } from "@mui/material";

// Components
import MDButton from "components/MDButton";

// Others
import { useMaterialUIController } from "context";
import { AuthContext } from "context/Auth/AuthContext";

import api from "services/api";
import openSocket from "services/socket-io";
import toastError from "errors/toastError";
import { format, parseISO } from "date-fns";

// Reducer
const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

export default function UsersTableData({
  search,
  limit,
  pageNumber,
  handleEditOfficialConnection,
  handleOpenDeleteOfficialConnectionModal,
}) {
  const { i18n } = useTranslation();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { user } = useContext(AuthContext);
  const [users, dispatch] = useReducer(reducer, []);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [pageNumber, search, limit]);

  useEffect(() => {
    // setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { search, limit, pageNumber },
          });
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setCount(data.count);
          // setHasMore(data.hasMore);
          // setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, pageNumber]);

  useEffect(() => {
    const socket = openSocket();

    socket.on(`user${user.companyId}`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: + data.userId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return {
    columns: [
      { Header: i18n.t("users.table.name"), accessor: "name", align: "left" },
      { Header: i18n.t("users.table.email"), accessor: "email", align: "center" },
      { Header: i18n.t("users.table.profile"), accessor: "profile", align: "center" },
      { Header: i18n.t("users.table.companyName"), accessor: "company", align: "center" },
      { Header: i18n.t("users.table.actions"), accessor: "actions", align: "center" },
    ],

    rows: users.map((user) => ({
      name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {user.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      ),
      profile: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {user.profile}
        </MDTypography>
      ),
      company: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {user["company.name"] || user.company.name}
        </MDTypography>
      ),
      // updatedAt: (
      //   <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      //     {format(parseISO(whatsapp.updatedAt), "dd/MM/yy HH:mm")}
      //   </MDTypography>
      // ),
      actions: (
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          <MDButton
            variant="text"
            color={darkMode ? "white" : "dark"}
            onClick={() => handleEditOfficialConnection(user)}
          >
            <Icon>edit</Icon>&nbsp;edit
          </MDButton>
          <MDButton
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteOfficialConnectionModal(user)}
          >
            <Icon>delete</Icon>&nbsp;delete
          </MDButton>
        </MDBox>
      ),
    })),

    count,
  };
}
