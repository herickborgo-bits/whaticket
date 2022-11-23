import { useState } from "react";
import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "components/DataTable";
import MDButton from "components/MDButton";
import OfficialConnectionsTableData from "./data/OfficialConnectionsTableData";
import { Icon } from "@mui/material";
import OfficialConnectionsModal from "components/OfficialConnectionsModal";
import ConfirmationModal from "components/ConfirmationModal";

function OfficialConnections() {
    const { i18n } = useTranslation();

    const [officialConnectionModalOpen, setOfficialConnectionModalOpen] = useState(false);

    const [selectedOfficialConnection, setSelectedOfficialConnection] = useState(null);
    const [deletingOfficialConnection, setDeletingOfficialConnection] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const handleOpenOfficialConnectionModal = () => {
        setSelectedOfficialConnection(null);
        setOfficialConnectionModalOpen(true);
    };

    const handleCloseOfficialConnectionModal = () => {
        setSelectedOfficialConnection(null);
        setOfficialConnectionModalOpen(false);
    };

    const handleEditOfficialConnection = (officialConnection) => {
        setSelectedOfficialConnection(officialConnection);
        setOfficialConnectionModalOpen(true);
    };

    const handleOpenDeleteOfficialConnectionModal = (officialConnection) => {
        setConfirmModalOpen(true);
        setDeletingOfficialConnection(officialConnection);
    };

    const handleDeleteOfficialConnection = async (officialConnectionId) => {
        try {
            await api.delete(`/officialConnections/${officialConnectionId}`);
            toast.success(i18n.t("officialConnections.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }

        setConfirmModalOpen(false);
        setDeletingOfficialConnection(null);
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

    const { columns, rows, count } = OfficialConnectionsTableData({
        search,
        limit,
        pageNumber,
        handleEditOfficialConnection,
        handleOpenDeleteOfficialConnectionModal,
    });

    return (
        <DashboardLayout>
            <ConfirmationModal
                title={deletingOfficialConnection && `${i18n.t("officialConnections.confirmationModal.deleteTitle")} ${deletingOfficialConnection.name}?`}
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteOfficialConnection(deletingOfficialConnection.id)}
            >
                {i18n.t("officialConnections.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <OfficialConnectionsModal
                open={officialConnectionModalOpen}
                onClose={handleCloseOfficialConnectionModal}
                aria-labelledby="form-dialog-title"
                whatsAppId={selectedOfficialConnection?.id}
            />
            <DashboardNavbar />
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
                                    {i18n.t("officialConnections.title")}
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage
                                    showTotalEntries
                                    noEndBorder
                                    // canSearch
                                    useButton={
                                        <MDButton variant="gradient" color="dark" onClick={handleOpenOfficialConnectionModal}>
                                            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                            &nbsp;{i18n.t("officialConnections.buttons.add")}
                                        </MDButton>
                                    }
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
    )
}

export default OfficialConnections;