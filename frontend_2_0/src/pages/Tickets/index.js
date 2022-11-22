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
import { useContext, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
// @mui icons

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import ProfilesList from "examples/Lists/ProfilesList";

// Overview page components
import Header from "pages/Tickets/components/Header/index";

// Data
import profilesListData from "layouts/profile/data/profilesListData";
import { FormControlLabel, Switch } from "@mui/material";
import { Can } from "components/Can";
import i18n from "translate/i18n";
import { AuthContext } from "context/Auth/AuthContext";
import TicketsQueueSelect from "../../components/TicketsQueueSelect";

function Tickets() {

  const [showAllTickets, setShowAllTickets] = useState(false);
  const { user } = useContext(AuthContext);
  // const userQueueIds = user.queues.map((q) => q.id);
  // const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={9} />
      <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
        <Header>

        </Header>
      </Grid>
    </DashboardLayout>
  );
}

export default Tickets;
