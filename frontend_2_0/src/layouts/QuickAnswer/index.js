/**vdsc
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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
// Data
import authorsTableData from "../QuickAnswer/data/authorsTableData";
import MDButton from "components/MDButton";
import { Icon, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import QuickAnswerModal from "../../components/QuickAnswersModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { i18n } from "../../translate/i18n";
import api from "services/api";

const QuickAnswer = () => {
  const [quickAnswerModalOpen, setQuickAnswerModalOpen] = useState(false);

  const [selectedQuickAnswer, setSelectedQuickAnswer] = useState(null);
  const [deletingQuickAnswer, setDeletingQuickAnswer] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleOpenQuickAnswerModal = () => {
    setSelectedQuickAnswer(null);
    setQuickAnswerModalOpen(true);
  };

  const handleCloseQuickAnswerModal = () => {
    setSelectedQuickAnswer(null);
    setQuickAnswerModalOpen(false);
  };

  const handleEditQuickAnswer = (quickAnswer) => {
    setSelectedQuickAnswer(quickAnswer);
    setQuickAnswerModalOpen(true);
  };

  const handleOpenDeleteQuickAnswerModal = (quickAnswer) => {
    setConfirmModalOpen(true);
    setDeletingQuickAnswer(quickAnswer);
  }

  const handleDeleteQuickAnswer = async (quickAnswerId) => {
    try {
      await api.delete(`/quickAnswers/${quickAnswerId}`);
      console.log(i18n.t("quickAnswers.toasts.deleted"));
    } catch (err) {
      console.error(err);
    }
    setConfirmModalOpen(false);
    setDeletingQuickAnswer(null);
  };

  const { columns, rows } = authorsTableData({ handleEditQuickAnswer, handleOpenDeleteQuickAnswerModal });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ConfirmationModal
        title={
          deletingQuickAnswer &&
          `${i18n.t("Excluir ")} ${
            deletingQuickAnswer.shortcut
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteQuickAnswer(deletingQuickAnswer.id)}
      >
        {i18n.t("Deseja realmente excluir a resposta rápida?")}
      </ConfirmationModal>
      <QuickAnswerModal
        open={quickAnswerModalOpen}
        onClose={handleCloseQuickAnswerModal}
        aria-labelledby="form-dialog-title"
        quickAnswerId={selectedQuickAnswer?.id}
      ></QuickAnswerModal>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Quick Answer
                </MDTypography>
              </MDBox>
              <Grid item xs={6} md={2} lg={12}>
                <MDBox pt={2} px={2} display="flex" justifyContent="end">
                  <MDBox p={1} >
                    <TextField
                      placeholder={"Search"}
                      type="search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>search_icon</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MDBox>
                  <MDBox p={1.5}>
                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={handleOpenQuickAnswerModal}>
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add new Answer
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default QuickAnswer;
