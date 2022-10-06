import React, { useEffect, useReducer, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IconButton, TableCell } from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import HistoryIcon from '@material-ui/icons/History';

import { useTranslation } from "react-i18next";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { parseISO, format, getMonth } from "date-fns";
import BillingHistoricModal from "../../components/BillingHistoricModal";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Payments = () => {
    const classes = useStyles();
    const { i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [billings, setBillings] = useState([]);
    const [billingHistoricModalOpen, setBillingHistoricModalOpen] = useState(false);
    const [selectedBillingHistoric, setSelectedBillingHistoric] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/billings/");
                setBillings(data);
                setLoading(false);
            } catch (err) {
                toastError(err);
            }
        };
        fetchProducts();
    }, []);

    const formatToBRL = (quantity) => {
        let BRL = 'R$';
        let money = quantity.toFixed(2);

        return `${BRL} ${money}`.replace('.', ',');
    }

    const getMonth = (date) => {
        const meses = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        let month = format(parseISO(date), "MM");

        month = parseInt(month)

        return meses[month-1];
    } 

    const handleOpenBillingHistoricModal = (billing) => {
        setSelectedBillingHistoric(billing);
        setBillingHistoricModalOpen(true);
    };

    const handleCloseBillingHistoricModal = () => {
        setSelectedBillingHistoric(null);
        setBillingHistoricModalOpen(false);
    };

    return (
        <MainContainer>
            <BillingHistoricModal
                open={billingHistoricModalOpen}
                onClose={handleCloseBillingHistoricModal}
                aria-labelledby="form-dialog-title"
                billingId={selectedBillingHistoric && selectedBillingHistoric.id}
            />
            <MainHeader>
                <Title>Pagamentos</Title>
            </MainHeader>
            <Paper
                className={classes.mainPaper}
                variant="outlined"
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Empresa</TableCell>
                            <TableCell align="center">Mês</TableCell>
                            <TableCell align="center">Valor Total dos Disparos</TableCell>
                            <TableCell align="center">Valor da Mensalidade</TableCell>
                            <TableCell align="center">Valor Total</TableCell>
                            <TableCell align="center">Valor Pago</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { billings && billings.map((billing) => {
                            return (
                                <TableRow key={billing.id}>
                                    <TableCell align="center">{billing.company.name}</TableCell>
                                    <TableCell align="center">{getMonth(billing.createdAt)}</TableCell>
    
                                    <TableCell align="center">{formatToBRL(billing.totalTriggerValue)}</TableCell>
                                    <TableCell align="center">{formatToBRL(billing.totalMonthValue)}</TableCell>
                                    <TableCell align="center">{formatToBRL(billing.totalValue)}</TableCell>
                                    <TableCell align="center">Valor Pago</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenBillingHistoricModal(billing)}
                                        >
                                            <HistoryIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
        </Paper>
    </MainContainer>
  );
};

export default Payments;