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
  const newState = [...state];

  if (action.type === "LOAD_WHATSAPPS") {
    const whatsapp = action.payload;
    const newWhatsapp = [];

    whatsapp.forEach((whatsapp) => {
      const whatsappIndex = newState.findIndex((w) => w.id === whatsapp.id);
      if (whatsappIndex !== -1) {
        newState[whatsappIndex] = whatsapp;
      } else {
        newWhatsapp.push(whatsapp);
      }
    });

    return [...newState, ...newWhatsapp];
  }

  if (action.type === "UPDATE_WHATSAPPS") {
    const whatsapp = action.payload;
    const whatsappIndex = newState.findIndex((w) => w.id === whatsapp.id);

    if (whatsappIndex !== -1) {
      newState[whatsappIndex] = whatsapp;
      return [...newState];
    }

    return [whatsapp, ...newState];
  }

  if (action.type === "DELETE_WHATSAPPS") {
    const whatsappId = action.payload;

    const whatsappIndex = newState.findIndex((w) => w.id === whatsappId);
    if (whatsappIndex !== -1) {
      newState.splice(whatsappIndex, 1);
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
  const { i18n } = useTranslation();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { user } = useContext(AuthContext);
  const [whatsapp, dispatch] = useReducer(reducer, []);
  const [count, setCount] = useState(1);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [pageNumber, search, limit]);

  useEffect(() => {
    const fetchWhatsapp = async () => {
      try {
        const { data } = await api.get("/whatsapp", {
          params: {
            official: true,
            search,
            limit,
            pageNumber,
          },
        });
        dispatch({ type: "LOAD_WHATSAPPS", payload: data.whatsapps });
        setCount(+data.count);
      } catch (err) {
        toastError(err);
      }
    };

    fetchWhatsapp();
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
      { Header: i18n.t("officialConnections.table.name"), accessor: "name", align: "left" },
      { Header: i18n.t("officialConnections.table.quality"), accessor: "quality", align: "center" },
      { Header: i18n.t("officialConnections.table.limit"), accessor: "tierLimit", align: "center" },
      { Header: i18n.t("officialConnections.table.session"), accessor: "", align: "center" },
      { Header: i18n.t("officialConnections.table.updatedAt"), accessor: "updatedAt", align: "center" },
      { Header: i18n.t("officialConnections.table.default"), accessor: "isDefault", align: "center" },
      { Header: i18n.t("officialConnections.table.actions"), accessor: "actions", align: "center" },
    ],

    rows: whatsapp.map((whatsapp) => ({
      name: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {whatsapp.name}
        </MDTypography>
      ),
      quality: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"" + whatsapp.quality}
        </MDTypography>
      ),
      tierLimit: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"" + whatsapp.tierLimit}
        </MDTypography>
      ),
      updatedAt: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {format(parseISO(whatsapp.updatedAt), "dd/MM/yy HH:mm")}
        </MDTypography>
      ),
      isDefault: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"" + whatsapp.isDefault}
        </MDTypography>
      ),
      actions: (
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          <MDButton
            variant="text"
            color={darkMode ? "white" : "dark"}
            onClick={() => handleEditOfficialConnection(whatsapp)}
          >
            <Icon>edit</Icon>&nbsp;edit
          </MDButton>
          <MDButton
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteOfficialConnectionModal(whatsapp)}
          >
            <Icon>delete</Icon>&nbsp;delete
          </MDButton>
        </MDBox>
      ),
    })),

    count,
  };
}
