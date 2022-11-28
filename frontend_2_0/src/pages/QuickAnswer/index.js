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
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "components/DataTable";

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// API
import api from "services/api";

// Toast
import { toast } from "react-toastify";
import toastError from "errors/toastError";

// MUI
import { Icon } from "@mui/material";

// Components
import MDButton from "components/MDButton";
import QuickAnswerModal from "../../components/QuickAnswersModal";
import ConfirmationModal from "../../components/ConfirmationModal";

// Data
import QuickAnswerTableData from "./data/QuickAnswerTableData";

// Translation
import i18n from "translate/i18n";

function QuickAnswer() {
  const [quickAnswerModalOpen, setQuickAnswerModalOpen] = useState(false);

  const [selectedQuickAnswer, setSelectedQuickAnswer] = useState(null);
  const [deletingQuickAnswer, setDeletingQuickAnswer] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

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
  };

  const handleDeleteQuickAnswer = async (quickAnswerId) => {
    try {
      await api.delete(`/quickAnswers/${quickAnswerId}`);
      toast.success(i18n.t("quickAnswers.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }

    setConfirmModalOpen(false);
    setDeletingQuickAnswer(null);
  };

  const getSearchValue = (value) => {
    setSearch(value);
  };

  const getLimitValue = (value) => {
    setLimit(value);
  };

  const getPageNumberValue = (value) => {
    setPageNumber(value);
  };

  const { columns, rows, count } = QuickAnswerTableData({
    search,
    limit,
    pageNumber,
    handleEditQuickAnswer,
    handleOpenDeleteQuickAnswerModal,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ConfirmationModal
        title={deletingQuickAnswer && `${i18n.t("quickAnswers.confirmationModal.deleteTitle")} ${deletingQuickAnswer.shortcut}?`}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteQuickAnswer(deletingQuickAnswer.id)}
      >
        {i18n.t("quickAnswers.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QuickAnswerModal
        open={quickAnswerModalOpen}
        onClose={handleCloseQuickAnswerModal}
        aria-labelledby="form-dialog-title"
        quickAnswerId={selectedQuickAnswer?.id}
      />
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
                  {i18n.t("quickAnswers.title")}
                </MDTypography>
              </MDBox>
              {/* <Grid item xs={6} md={2} lg={12}>
                <MDBox pt={2} px={2} display="flex" justifyContent="end">
                  <MDBox p={1}>
                    <TextField
                      placeholder="Search"
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
                    <MDButton variant="gradient" color="dark" onClick={handleOpenQuickAnswerModal}>
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add new Answer
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid> */}
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage
                  showTotalEntries
                  noEndBorder
                  canSearch
                  useButton={{
                    icon: "add",
                    text: i18n.t("quickAnswers.buttons.add"),
                    onClick: handleOpenQuickAnswerModal
                  }}
                  // useFilters
                  totalItems={count}
                  getSearchValue={getSearchValue}
                  getPageSizeValue={getLimitValue}
                  getPageNumberValue={getPageNumberValue}
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
