// React
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Prop-Types
import PropTypes from "prop-types";

// Form
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

// Material UI
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";

// Toast
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";

// API
import api from "../../services/api";

// Components
import MDButton from "../MDButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
  },

  textField: {
    marginRight: theme.spacing(1),
    width: "100%",
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    left: "50%",
    marginLeft: -12,
    marginTop: -12,
    position: "absolute",
    top: "50%",
  },

  textQuickAnswerContainer: {
    width: "100%",
  },
}));

function QuickAnswersModal({ open, onClose, quickAnswerId }) {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const isMounted = useRef(true);

  const initialState = {
    shortcut: "",
    message: "",
  };

  const QuickAnswerSchema = Yup.object().shape({
    shortcut: Yup.string()
      .min(2, `${i18n.t("quickAnswers.yup.short")}`)
      .max(15, `${i18n.t("quickAnswers.yup.long")}`)
      .required(`${i18n.t("quickAnswers.yup.required")}`),
    message: Yup.string()
      .min(8, `${i18n.t("quickAnswers.yup.short")}`)
      .max(30000, `${i18n.t("quickAnswers.yup.long")}`)
      .required(`${i18n.t("quickAnswers.yup.required")}`),
  });

  const [quickAnswer, setQuickAnswer] = useState(initialState);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  useEffect(() => {
    const fetchQuickAnswer = async () => {
      if (!quickAnswerId) return;

      try {
        const { data } = await api.get(`/quickAnswers/${quickAnswerId}`);
        if (isMounted.current) {
          setQuickAnswer(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchQuickAnswer();
  }, [quickAnswerId, open]);

  const handleClose = () => {
    onClose();
    setQuickAnswer(initialState);
  };

  const handleSaveQuickAnswer = async (values) => {
    try {
      if (quickAnswerId) {
        await api.put(`/quickAnswers/${quickAnswerId}`, values);
        toast.success(i18n.t("quickAnswersModal.edited"));
      } else {
        await api.post("/quickAnswers", values);
        toast.success(i18n.t("quickAnswersModal.success"));
      }
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle id="form-dialog-title">
          {quickAnswerId
            ? `${i18n.t("quickAnswersModal.title.edit")}`
            : `${i18n.t("quickAnswersModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={quickAnswer}
          enableReinitialize
          validationSchema={QuickAnswerSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQuickAnswer(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("quickAnswersModal.form.shortcut")}
                    name="shortcut"
                    autoFocus
                    error={touched.shortcut && Boolean(errors.shortcut)}
                    helperText={touched.shortcut && errors.shortcut}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("quickAnswersModal.form.message")}
                    name="message"
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    multiline
                    rows={5}
                    fullWidth
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <MDButton
                  onClick={handleClose}
                  color="error"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("quickAnswersModal.buttons.cancel")}
                </MDButton>
                <MDButton
                  type="submit"
                  color="info"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {quickAnswerId
                    ? `${i18n.t("quickAnswersModal.buttons.okEdit")}`
                    : `${i18n.t("quickAnswersModal.buttons.okAdd")}`}
                  {isSubmitting && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                  )}
                </MDButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}

// Setting default values for the props of QuickAnswerModal
QuickAnswersModal.defaultProps = {
  quickAnswerId: null,
};

// Typechecking props for the QuickAnswerModal
QuickAnswersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quickAnswerId: PropTypes.number,
};

export default QuickAnswersModal;
