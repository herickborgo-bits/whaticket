import React, { useEffect, useReducer, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import { useTranslation } from "react-i18next";
import ImportModal from "../../components/ImportModal";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { format, parseISO } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    width: 200,
  },
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Importation = () => {
  const classes = useStyles();
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [imports, setImports] = useState([]);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [users, dispatchUsers] = useReducer(reducer, []);

  useEffect(() => {
    dispatchUsers({ type: "RESET" });
  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/");
          dispatchUsers({ type: "LOAD_USERS", payload: data.users });
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  const renderOptionLabel = (option) => {
    return option;
  };

  const handleOpenImportModal = () => {
    setImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setImportModalOpen(false);
  };

  const getStatusByName = (status) => {
    if (status === "Novo") {
      return "0";
    } else if (status === "Processando") {
      return "1";
    } else if (status === "Processado") {
      return "3";
    } else if (status === "Erro") {
      return "4";
    } else {
      return status;
    }
  };

  const getStatusById = (id) => {
    if (id === 0) {
      return "Novo";
    } else if (id === 1) {
      return "Processando";
    } else if (id === 2) {
      return "Processado";
    } else if (id === 3) {
      return "Erro";
    } else {
      return id;
    }
  };

  const getUserById = (userId) => {
    let response = "";
    users.map((user) => {
      if (user.id === userId) {
        response = user.name;
      }
    });
    return response;
  };

  const handleSelectOption = (e, newValue) => {
    setStatus(getStatusByName(newValue));
  };

  const handleFilter = async () => {
    setLoading(true);
    if (!date && !status) {
      toast.error("Fill the form");
    } else {
      try {
        setLoading(true);
        const { data } = await api.get(
          `file/list?Status=${status}&initialDate=${date}`
        );
        setImports(data);
        setLoading(false);
      } catch (err) {
        toastError(err);
      }
    }
  };

  return (
    <MainContainer>
      <ImportModal
        open={importModalOpen}
        onClose={handleCloseImportModal}
        aria-labelledby="form-dialog-title"
      />
      <MainHeader>
        <Title>{i18n.t("importation.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Autocomplete
            className={classes.root}
            options={["Novo", "Processando", "Processado", "Erro"]}
            getOptionLabel={renderOptionLabel}
            onChange={(e, newValue) => handleSelectOption(e, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={i18n.t("importation.form.status")}
                InputLabelProps={{ required: true }}
              />
            )}
          />
          <TextField
            onChange={(e) => {
              setDate(e.target.value);
            }}
            label={i18n.t("importation.form.date")}
            InputLabelProps={{ shrink: true, required: true }}
            type="date"
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            {i18n.t("importation.buttons.filter")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenImportModal}
          >
            {i18n.t("importation.buttons.import")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("importation.table.uploadDate")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("importation.table.fileName")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("importation.table.sentBy")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("importation.table.numberOfRecords")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("importation.table.status")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {imports.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {format(parseISO(item.createdAt), "dd/MM/yy HH:mm")}
                    </TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">
                      {getUserById(item.ownerid)}
                    </TableCell>
                    <TableCell align="center">{item.QtdeRegister}</TableCell>
                    <TableCell align="center">
                      {getStatusById(item.Status)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {loading}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Importation;