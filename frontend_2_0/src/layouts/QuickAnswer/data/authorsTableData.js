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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { Icon } from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import { useState, useEffect } from "react";

import api from "../../../services/api";
import toastError from "../../../errors/toastError";
import { i18n } from "../../../translate/i18n";

export default function data({ handleEditQuickAnswer, handleOpenDeleteQuickAnswerModal }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [quickAnswers, setQuickAnswers] = useState([]);

  useEffect(() => {
    const fetchQuickAnswers = async () => {
      try {
        const { data } = await api.get('/quickAnswers/');
        setQuickAnswers(data.quickAnswers);
      } catch (err) {
        console.error(err);
      }
    }

    fetchQuickAnswers();
  }, []);

  return {
    columns: [
      { Header: "Shortcut", accessor: "shortcut", align: "left" },
      { Header: "Quick Reply", accessor: "quickReply", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],

    rows: quickAnswers.map((quickAnswer) => {
      return {
        shortcut: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {quickAnswer.shortcut}
          </MDTypography>
        ),
        quickReply: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
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
      }
    }),

    // rows: [
    //   {
    //     shortcut: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Atalho 1
    //       </MDTypography>
    //     ),
    //     quickReply: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Reply 1
    //       </MDTypography>
    //     ),
    //     actions: (
    //       <>
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Editar
    //         </MDTypography>
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Deletar
    //         </MDTypography>
    //       </>
    //     )
    //   },
    //   {
    //     shortcut: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Atalho 2
    //       </MDTypography>
    //     ),
    //     quickReply: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Reply 2
    //       </MDTypography>
    //     ),
    //     actions: (
    //       <>
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Editar
    //         </MDTypography>
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Deletar
    //         </MDTypography>
    //       </>
    //     )
    //   },
    //   // {
    //   //   author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //   //   function: <Job title="Manager" description="Organization" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       23/04/18
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //       // <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //       //   Edit
    //       // </MDTypography>
    //   //   ),
    //   // },
    //   // {
    //   //   author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //   //   function: <Job title="Programator" description="Developer" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       11/01/19
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       Edit
    //   //     </MDTypography>
    //   //   ),
    //   // },
    //   // {
    //   //   author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //   //   function: <Job title="Executive" description="Projects" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       19/09/17
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       Edit
    //   //     </MDTypography>
    //   //   ),
    //   // },
    //   // {
    //   //   author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
    //   //   function: <Job title="Programator" description="Developer" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       24/12/08
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       Edit
    //   //     </MDTypography>
    //   //   ),
    //   // },
    //   // {
    //   //   author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
    //   //   function: <Job title="Manager" description="Executive" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       04/10/21
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       Edit
    //   //     </MDTypography>
    //   //   ),
    //   // },
    //   // {
    //   //   author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
    //   //   function: <Job title="Programator" description="Developer" />,
    //   //   status: (
    //   //     <MDBox ml={-1}>
    //   //       <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //   //     </MDBox>
    //   //   ),
    //   //   employed: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       14/09/20
    //   //     </MDTypography>
    //   //   ),
    //   //   action: (
    //   //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //   //       Edit
    //   //     </MDTypography>
    //   //   ),
    //   // },
    // ],
  };
}
