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

  if (action.type === "LOAD_QUICK_ANSWERS") {
    const quickAnswers = action.payload;
    const newQuickAnswers = [];

    quickAnswers.forEach((quickAnswer) => {
      const quickAnswerIndex = newState.findIndex((q) => q.id === quickAnswer.id);
      if (quickAnswerIndex !== -1) {
        newState[quickAnswerIndex] = quickAnswer;
      } else {
        newQuickAnswers.push(quickAnswer);
      }
    });

    return [...newState, ...newQuickAnswers];
  }

  if (action.type === "UPDATE_QUICK_ANSWERS") {
    const quickAnswer = action.payload;
    const quickAnswerIndex = newState.findIndex((q) => q.id === quickAnswer.id);

    if (quickAnswerIndex !== -1) {
      newState[quickAnswerIndex] = quickAnswer;
      return [...newState];
    }

    return [quickAnswer, ...newState];
  }

  if (action.type === "DELETE_QUICK_ANSWERS") {
    const quickAnswerId = action.payload;

    const quickAnswerIndex = newState.findIndex((q) => q.id === quickAnswerId);
    if (quickAnswerIndex !== -1) {
      newState.splice(quickAnswerIndex, 1);
    }
    return [...newState];
  }

  if (action.type === "RESET") {
    return [];
  }

  return null;
};

export default function QuickAnswerTableData({
  search,
  limit,
  pageNumber,
  handleEditQuickAnswer,
  handleOpenDeleteQuickAnswerModal,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { user } = useContext(AuthContext);
  const [quickAnswers, dispatch] = useReducer(reducer, []);
  const [count, setCount] = useState(1);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [pageNumber, search, limit]);

  useEffect(() => {
    const fetchQuickAnswers = async () => {
      try {
        const { data } = await api.get("/quickAnswers/", {
          params: {
            search,
            limit,
            pageNumber,
          },
        });
        dispatch({ type: "LOAD_QUICK_ANSWERS", payload: data.quickAnswers });
        setCount(+data.count);
      } catch (err) {
        toastError(err);
      }
    };

    fetchQuickAnswers();
  }, [pageNumber, search, limit]);

  useEffect(() => {
    const socket = openSocket();

    socket.on(`quickAnswer${user.companyId}`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICK_ANSWERS", payload: data.quickAnswer });
      }

      if (data.action === "delete") {
        dispatch({
          type: "DELETE_QUICK_ANSWERS",
          payload: +data.quickAnswerId,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return {
    columns: [
      { Header: "Shortcut", accessor: "shortcut", align: "left" },
      { Header: "Quick Reply", accessor: "quickReply", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],

    rows: quickAnswers.map((quickAnswer) => ({
      shortcut: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {quickAnswer.shortcut}
        </MDTypography>
      ),
      quickReply: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {quickAnswer.message}
        </MDTypography>
      ),
      actions: (
        <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
          <MDButton
            variant="text"
            color={darkMode ? "white" : "dark"}
            onClick={() => handleEditQuickAnswer(quickAnswer)}
          >
            <Icon>edit</Icon>&nbsp;edit
          </MDButton>
          <MDButton
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteQuickAnswerModal(quickAnswer)}
          >
            <Icon>delete</Icon>&nbsp;delete
          </MDButton>
        </MDBox>
      ),
    })),

    count,
  };
}
