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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "pages/Dashboard/data/reportsBarChartData";
import reportsLineChartData from "pages/Dashboard/data/reportsLineChartData";

import { AuthContext } from "context/Auth/AuthContext";
import { i18n } from "translate/i18n";
import { useContext, useEffect, useRef, useState } from "react";

// Dashboard components
import {
  Autocomplete,
  Card,
  CardContent,
  Icon,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useTranslation } from "react-i18next";
import toastError from "errors/toastError";
import useTickets from "hooks/useTickets";
import api from "services/api";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import { parseISO } from "date-fns";

const Dashboard = () => {
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  var userQueueIds = [];

  const [loading, setLoading] = useState(false);
  const [registerCount, setRegisterCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [fileId, setFileId] = useState("");
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState("");
  const [categoryCount, setCategoryCount] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [tickets, setTickets] = useState([]);
  const [biggerTickets, setBiggerTickets] = useState([]);
  const [smallerTickets, setSmallerTickets] = useState([]);
  const [averageTime, setAverageTime] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [noWhatsCount, setNoWhatsCount] = useState(0);

  const dates = useRef(new Date().toISOString());
  const { ticket } = useTickets({ date: dates.current });

  const [reportsBarChartData, setReportsBarChartData] = useState({
    labels: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ],
    datasets: { label: "Tickets", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  });

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }

  const GetTickets = (status, showAll, withUnreadMessages) => {
    const { count } = useTickets({
      status: status,
      showAll: showAll,
      withUnreadMessages: withUnreadMessages,
      queueIds: JSON.stringify(userQueueIds),
    });
    return count;
  };

  useEffect(() => {
    if (ticket) {
      setReportsBarChartData((prevState) => {
        let aux = [...prevState.labels];
        aux.forEach((a) => {
          ticket.forEach((ticket) => {
            format(startOfHour(parseISO(ticket.createdAt)), "HH:mm") === a.time && a.amount++;
          });
        });
        const response = {
          labels: prevState.labels,
          datasets: {
            label: prevState.datasets.label,
            data: aux,
          },
        };
        return response;
      });
    }
  }, [ticket]);

  useEffect(() => {
    setDate("");
  }, [fileId]);

  useEffect(() => {
    setFileId("");
  }, [date]);

  useEffect(() => {
    const handleFilter = async () => {
      setLoading(true);
      try {
        setLoading(true);
        const { data } = await api.get("/registers/list", {
          params: { fileId, date },
        });

        setRegisterCount(data.reports.total);
        setSentCount(data.reports.sent || "0");
        setDeliveredCount(data.reports.delivered || "0");
        setReadCount(data.reports.read || "0");
        setErrorCount(data.reports.error || "0");
        setInteractionCount(data.reports.interaction || "0");
        setNoWhatsCount(data.reports.noWhats || "0");

        setCategoryCount(data.category);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    handleFilter();
  }, [fileId, date]);

  useEffect(() => {
    const handleFiles = async () => {
      setLoading(true);
      try {
        setLoading(true);

        const { data } = await api.get("file/list?status=5");
        setFiles(data.reports);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
      try {
        setLoading(true);

        const { data } = await api.get("file/list?status=6");
        setFiles(files.concat(data.reports));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    handleFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchAverangeTime = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/tickets/time", {
          params: { searchParam },
        });
        setTickets(data.averageTimes);

        if (data.averageTimes.length >= 6) {
          setBiggerTickets(data.averageTimes.slice(0, 3));

          const smallerTickets = data.averageTimes.slice(-3);
          smallerTickets.sort((a, b) => {
            return a.averageMilliseconds - b.averageMilliseconds;
          });

          setSmallerTickets(smallerTickets);
        }

        setAverageTime(data.totalAverageTime);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAverangeTime();
  }, [searchParam]);

  const handleSelectOption = (_, newValue) => {
    if (newValue) {
      setFileId(newValue.id);
    } else {
      setFileId("");
    }
  };

  const renderOptionLabel = (option) => {
    if (option.number) {
      return `${option.name} - ${option.number}`;
    } else {
      return `${option.name}`;
    }
  };

  // const getGridSize = () => {
  //   if (categoryCount.length === 1) {
  //     return 12;
  //   }
  //   if (categoryCount.length === 2) {
  //     return 6;
  //   }
  //   if (categoryCount.length === 3) {
  //     return 4;
  //   }
  //   return 12;
  // };

  const handleSearch = (e) => {
    setSearchParam(e.target.value.toLowerCase());
  };

  const formatTime = (milliseconds) => {
    let seconds = milliseconds / 1000;

    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor((seconds / 60 - minutes) * 60);

    let hours = Math.floor(minutes / 60);
    minutes = Math.floor((minutes / 60 - hours) * 60);

    let secondsString = seconds.toString();
    let minutesString = minutes.toString();
    let hoursString = hours.toString();

    if (secondsString.length === 1) {
      secondsString = `0${secondsString}`;
    }

    if (minutesString.length === 1) {
      minutesString = `0${minutesString}`;
    }

    if (hoursString.length === 1) {
      hoursString = `0${hoursString}`;
    }

    return `${hoursString}:${minutesString}:${secondsString}`;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <MDBox pt={2} px={2} display="flex" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  File
                </MDTypography>
              </MDBox>
              <MDBox p={1.5}>
                <Autocomplete
                  onChange={(e, newValue) => handleSelectOption(e, newValue)}
                  options={files}
                  getOptionLabel={renderOptionLabel}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={i18n.t("dashboard.file")}
                      InputLabelProps={{ required: true }}
                    />
                  )}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <MDBox pt={2} px={2} display="flex" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Date
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <MDInput
                  type="date"
                  fullWidth
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox pt={2} px={2} display="flex" alignItems="center">
              <MDTypography variant="h6" fontWeight="medium">
                Ativos
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox pt={2} px={2} display="flex" alignItems="center">
              <MDTypography variant="h6" fontWeight="medium">
                Receptivos
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="perm_phone_msg"
                title="In Service"
                count={GetTickets("open", "true", "false")}
                percentage={{
                  label: "Chamadas sendo atendidas.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="hourglass_top"
                title="Waiting"
                count={GetTickets("pending", "true", "false")}
                percentage={{
                  label: "Chamadas em espera.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="done_outline"
                title="Finalized"
                count={GetTickets("closed", "true", "false")}
                percentage={{
                  label: "Chamadas finalizadas.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="check_box"
                title="Handed Out"
                count={deliveredCount}
                percentage={{
                  label: "Mensagens entregues.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="touch_app"
                title="Interation"
                count={interactionCount}
                percentage={{
                  label: "Interação com cliente.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="publish"
                title="Imported"
                count={registerCount}
                percentage={{
                  label: "Contatos importados.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="mark_email_read"
                title="Read"
                count={readCount}
                percentage={{
                  label: "Mensagens lidas.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="telegram"
                title="Sent"
                count={sentCount}
                percentage={{
                  label: "Mensagens enviadas.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="error_outline"
                title="Mistakes"
                count={errorCount}
                percentage={{
                  label: "Erro ao enviar ou receber.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="phonelink_erase"
                title="Sem WhatsApp"
                count={noWhatsCount}
                percentage={{
                  label: "Contato sem WhatsApp",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* {categoryCount && categoryCount.length > 0 && (
            <Grid item xs={12}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.category.title")}
              </Typography>
            </Grid>
          )}
          {categoryCount &&
            categoryCount.map((category) => (
              <Grid item xs={getGridSize()} key={category.name}>
                <Paper
                  className={classes.customFixedHeightPaper}
                  style={{ overflow: "hidden" }}
                >
                  <Typography
                    component="h3"
                    variant="h6"
                    color="primary"
                    paragraph
                  >
                    {category.name}
                  </Typography>
                  <Grid item>
                    <Typography component="h1" variant="h4">
                      {category.count}
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
            ))} */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Tickets Today"
                  description="Percentual de chamadas atual."
                  chart={reportsBarChartData}
                  date={"2022"}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <Card>
                <MDBox pt={2} px={2} display="flex" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    Tempo de Atendimento
                  </MDTypography>
                </MDBox>
                <MDBox p={1.5}>
                  <TextField
                    placeholder={"Pesquisar"}
                    type="search"
                    value={searchParam}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon>search</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MDBox>
                {tickets && tickets.length < 6 && (
                  <MDBox>
                    {tickets.map((ticket, index) => (
                      <Card key={index} elevation={5}>
                        <CardContent>
                          <MDTypography align="center" variant="h6" component="h2">
                            {ticket.user.name}
                          </MDTypography>
                          <br />
                          <MDTypography align="center" variant="h5" component="h2">
                            {formatTime(ticket.averageMilliseconds)}
                          </MDTypography>
                        </CardContent>
                      </Card>
                    ))}
                  </MDBox>
                )}
                {tickets && tickets.length >= 6 && (
                  <>
                    <MDBox pt={2} px={2} display="flex" alignItems="center">
                      <MDTypography variant="h6" fontWeight="medium">
                        Maiores tempos Médios
                      </MDTypography>
                    </MDBox>
                    <MDBox pt={2} px={2} display="flex" alignItems="center">
                      {biggerTickets.map((ticket, index) => (
                        <Grid item xs={12} md={6} lg={4} p={2}>
                          <Card key={index} elevation={5}>
                            <DefaultInfoCard
                              icon="access_time"
                              title={ticket.user.name}
                              value={formatTime(ticket.averageMilliseconds)}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </MDBox>
                    <MDBox pt={2} px={2} display="flex" alignItems="center">
                      <MDTypography variant="h6" fontWeight="medium">
                        Menores tempos Médios
                      </MDTypography>
                    </MDBox>
                    <MDBox pt={2} px={2} display="flex" alignItems="center">
                      {smallerTickets.map((ticket, index) => (
                        <Grid item p={2} xs={12} md={6} lg={4}>
                          <Card key={index} elevation={5}>
                            <DefaultInfoCard
                              icon="access_time"
                              title={ticket.user.name}
                              value={formatTime(ticket.averageMilliseconds)}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </MDBox>
                  </>
                )}
                <MDBox p={1.5} pt={2} px={2} display="flex" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    {tickets && tickets.length > 0
                      ? `Tempo Médio de Atendimentos: ${formatTime(averageTime)}`
                      : `Sem Tickets Resolvidos`}
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        {loading}
      </MDBox>
    </DashboardLayout>
  );
};

export default Dashboard;
