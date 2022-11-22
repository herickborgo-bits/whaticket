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

import { useState, useEffect, useContext } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import TicketsQueueSelect from "../../../../components/TicketsQueueSelect";
import profilesListData from "layouts/profile/data/profilesListData";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import { i18n } from "translate/i18n";
import { Can } from "components/Can";
import { Badge, Divider, FormControlLabel, Switch } from "@mui/material";
import ProfilesList from "examples/Lists/ProfilesList";
import { AuthContext } from "context/Auth/AuthContext";
import TabPanel from "components/TabPanel";
import TicketsList from "components/TicketsList";


function Header({ children }) {
  const [searchParam, setSearchParam] = useState("");

  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const { user } = useContext(AuthContext);
  const [showAllTickets, setShowAllTickets] = useState(false);

  // const userQueueIds = user.queues.map((q) => q.id);
  // const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);


  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
      handleTabsOrientation();
      return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  return (
    <MDBox position="relative" mb={5}>
      <Card
        sx={{
          position: "relative",
          mt: -8,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6} lg={12}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                  <Tab
                    value={"open"}
                    label={i18n.t("tickets.tabs.open.title")}
                    icon={<Icon>move_to_inbox</Icon>}
                  />

                  <Tab
                    value={"closed"}
                    label={i18n.t("tickets.tabs.closed.title")}
                    icon={<Icon>check_box</Icon>}
                  />

                  <Tab
                    value={"search"}
                    label={i18n.t("tickets.tabs.search.title")}
                    icon={<Icon>search</Icon>}
                />
                </Tabs>
            </AppBar>
            <Divider/>
          <Grid sx={{ display: "flex" }}>
            {tab === "search" ? (
          <MDBox >
            <InputBase
              inputRef={searchInputRef}
              placeholder={i18n.t("tickets.search.placeholder")}
              type="search"
              onChange={handleSearch}
            />
          </MDBox>
        ) : (
          <>
            <MDButton
              variant="outlined"
              color="primary"
              onClick={() => setNewTicketModalOpen(true)}
            >
              {i18n.t("ticketsManager.buttons.newTicket")}
            </MDButton>
            <Can
              role={user.profile}
              perform="tickets-manager:showall"
              yes={() => (
                <FormControlLabel
                  label={i18n.t("tickets.buttons.showAll")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={showAllTickets}
                      onChange={() =>
                        setShowAllTickets((prevState) => !prevState)
                      }
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              )}
            />
          </>
        )}
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          //selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          //onChange={(values) => setSelectedQueueIds(values)}
        />
      <TabPanel value={tab} name="open">
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Badge
                overlap="rectangular"
                badgeContent={openCount}
                color="primary"
              >
                {i18n.t("ticketsList.assignedHeader")}
              </Badge>
            }
            value={"open"}
          />
          <Tab
            label={
              <Badge
                overlap="rectangular"
                badgeContent={pendingCount}
                color="secondary"
              >
                {i18n.t("ticketsList.pendingHeader")}
              </Badge>
            }
            value={"pending"}
          />
        </Tabs>
        <Grid>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            //selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            //selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={tab} name="closed">
        <TicketsList
          status="closed"
          showAll={true}
          //selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search">
        <TicketsList
          searchParam={searchParam}
          showAll={true}
          //selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
          </Grid>
          <Divider/>
          <Grid>
            <Grid item xs={12} md={2} xl={12} sx={{ display: "flex" }}>
              <MDBox >
                  <Grid>
                    <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
                  </Grid>
              </MDBox>
            </Grid>
          </Grid>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
