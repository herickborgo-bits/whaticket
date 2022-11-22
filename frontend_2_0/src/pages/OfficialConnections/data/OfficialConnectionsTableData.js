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

import api from "../../../services/api";
import openSocket from "../../../services/socket-io";
import toastError from "../../../errors/toastError";

// import { i18n } from "../../../translate/i18n";

// Reducer
const reducer = (state, action) => {
  const newState = [...state];

  if (action.type === "LOAD_WHATSAPPS") {
    const officialConnection = action.payload;
    const newOfficialConnections = [];

    officialConnection.forEach((officialConnection) => {
      const officialConnectionIndex = newState.findIndex((o) => o.id === officialConnection.id);
      if (officialConnectionIndex !== -1) {
        newState[officialConnectionIndex] = officialConnection;
      } else {
        newOfficialConnections.push(officialConnection);
      }
    });

    return [...newState, ...newOfficialConnections];
  }

  if (action.type === "UPDATE_WHATSAPPS") {
    const officialConnection = action.payload;
    const officialConnectionIndex = newState.findIndex((o) => o.id === officialConnection.id);

    if (officialConnectionIndex !== -1) {
      newState[officialConnectionIndex] = officialConnection;
      return [...newState];
    }

    return [officialConnection, ...newState];
  }

  if (action.type === "DELETE_WHATSAPPS") {
    const officialConnectionId = action.payload;

    const officialConnectionIndex = newState.findIndex((o) => o.id === officialConnectionId);
    if (officialConnectionIndex !== -1) {
      newState.splice(officialConnectionIndex, 1);
    }
    return [...newState];
  }

  if (action.type === "RESET") {
    return [];
  }

  return null;
};

export default function OfficialConnectionsTableData({
  search,
  limit,
  pageNumber,
  handleEditOfficialConnection,
  handleOpenDeleteOfficialConnectionModal,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { user } = useContext(AuthContext);
  const [officialConnection, dispatch] = useReducer(reducer, []);
  const [count, setCount] = useState(1);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [pageNumber, search, limit]);

  useEffect(() => {
    const fetchOfficialConnections = async () => {
      try {
        const { data } = await api.get("/whatsapp/list/", {
          params: {
            official: true,
            search,
            limit,
            pageNumber,
          },
        });
        console.log(data);
        dispatch({ type: "LOAD_WHATSAPPS", payload: data.whatsapps });
        setCount(+data.count);
      } catch (err) {
        toastError(err);
      }
    };

    fetchOfficialConnections();
  }, [pageNumber, search, limit]);

  useEffect(() => {
    const socket = openSocket();

    socket.on(`whatsapp${user.companyId}`, (data) => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_WHATSAPPS", payload: data.whatsapp });
      }
    });

    socket.on(`whatsapp${user.companyId}`, (data) => {
      if (data.action === "delete") {
        dispatch({ type: "DELETE_WHATSAPPS", payload: data.whatsappId });
      }
    });

    socket.on(`whatsappSession${user.companyId}`, (data) => {
      if (data.action === "update") {
        dispatch({ type: "UPDATE_SESSION", payload: data.session });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return {
    columns: [
      { Header: "Nome", accessor: "name", align: "left" },
      { Header: "Qualidade", accessor: "", align: "center" },
      { Header: "Limite", accessor: "", align: "center" },
      { Header: "Sessão", accessor: "", align: "center" },
      { Header: "Ultima Atualização", accessor: "", align: "center" },
      { Header: "Padrão", accessor: "", align: "center" },
      { Header: "Ações", accessor: "actions", align: "center" },
    ],

    rows: officialConnection.map((officialConnection) => ({
      name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {officialConnection.name}
        </MDTypography>
      ),
      quickReply: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {officialConnection.message}
        </MDTypography>
      ),
      actions: (
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          <MDButton
            variant="text"
            color={darkMode ? "white" : "dark"}
            onClick={() => handleEditOfficialConnection(officialConnection)}
          >
            <Icon>edit</Icon>&nbsp;edit
          </MDButton>
          <MDButton
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteOfficialConnectionModal(officialConnection)}
          >
            <Icon>delete</Icon>&nbsp;delete
          </MDButton>
        </MDBox>
      ),
    })),

    count,
  };
}
