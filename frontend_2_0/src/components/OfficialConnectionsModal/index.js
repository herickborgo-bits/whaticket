// React
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Prop-Types
import PropTypes from "prop-types";

// Form
import * as Yup from "yup";
import { Formik, Form, Field, useFormikContext } from "formik";

// Material UI
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
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
import QueueSelect from "components/QueueSelect";
import MDBox from "components/MDBox";

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

function OfficialConnectionsModal({ open, onClose, whatsAppId }) {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    greetingMessage: "",
    farewellMessage: "",
    isDefault: false,
    facebookToken: "",
    facebookPhoneNumberId: "",
    phoneNumber: "",
    facebookBusinessId: "",
    official: true,
    flowId: "",
    queueIds: [],
  };

  const [isConnectionTested, setIsConnectionTested] = useState(false);

  const SessionSchema = Yup.object().shape({
    shortcut: Yup.string()
      .min(2, `${i18n.t("quickAnswers.yup.short")}`)
      .max(15, `${i18n.t("quickAnswers.yup.long")}`)
      .required(`${i18n.t("quickAnswers.yup.required")}`),
    message: Yup.string()
      .min(8, `${i18n.t("quickAnswers.yup.short")}`)
      .max(30000, `${i18n.t("quickAnswers.yup.long")}`)
      .required(`${i18n.t("quickAnswers.yup.required")}`),
  });

  const [whatsApp, setWhatsApp] = useState(initialState);
  const [flows, setFlows] = useState([]);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  useEffect(() => {
    const fetchSession = async () => {
    	if (!whatsAppId) return;

    	try {
    		const { data } = await api.get(`whatsapp/${whatsAppId}`);
    		setWhatsApp({
          name: data.name ?? "",
          greetingMessage: data.greetingMessage ?? "",
          farewellMessage: data.farewellMessage ?? "",
          isDefault: data.isDefault ?? false,
          facebookToken: data.facebookToken ?? "",
          facebookPhoneNumberId: data.facebookPhoneNumberId ?? "",
          phoneNumber: data.phoneNumber ?? "",
          facebookBusinessId: data.facebookBusinessId ?? "",
          official: data.official ?? true,
          flowId: data.flowId ?? "",
          queueIds: data.queues?.map(queue => queue.id) ?? []
        });
    	} catch (err) {
    		toastError(err);
    	}
    };

    const fetchFlows = async () => {
      try {
        const { data } = await api.get("flows");
        setFlows(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchSession();
    fetchFlows();
  }, [open, whatsAppId]);

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
  };

  const handleConnectionTest = async ({
    facebookToken,
    facebookPhoneNumberId,
    facebookBusinessId,
  }) => {
    try {
      const response = await api.get('/whatsappsession/testConnection/', {
          params: { facebookToken, facebookPhoneNumberId, facebookBusinessId },
      });

      setIsConnectionTested(response);
    } catch (err) {
      toastError(err);
      setIsConnectionTested(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
			if (whatsAppId) {
				await api.put(`/whatsapp/${whatsAppId}`, values);
        toast.success("Criado com sucesso!");
			} else {
				await api.post("/whatsapp", values);
        toast.success("Editado com sucesso!");
			}
			handleClose();
		} catch (err) {
			toastError(err);
		}
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle>
          {whatsAppId
            ? i18n.t("officialWhatsappModal.title.edit")
            : i18n.t("officialWhatsappModal.title.add")}
        </DialogTitle>
        <Formik
          initialValues={whatsApp}
          enableReinitialize={true}
          validationSchema={SessionSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values);

            setTimeout(() => {
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting, handleChange }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("whatsappModal.form.name")}
                    autoFocus
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Field
                        as={Switch}
                        color="primary"
                        name="isDefault"
                        checked={values.isDefault}
                      />
                    }
                    label={i18n.t("whatsappModal.form.default")}
                  />
                </div>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.labelNumber")}
                    name="phoneNumber"
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                    required
                  />
                </div>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.labelToken")}
                    name="facebookToken"
                    error={touched.facebookToken && Boolean(errors.facebookToken)}
                    helperText={touched.facebookToken && errors.facebookToken}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                    required
                    onChange={(e) => {
                      handleChange(e);
                      setIsConnectionTested(false);
                    }}
                  />
                </div>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.labelId")}
                    name="facebookPhoneNumberId"
                    error={touched.facebookPhoneNumberId && Boolean(errors.facebookPhoneNumberId)}
                    helperText={touched.facebookPhoneNumberId && errors.facebookPhoneNumberId}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                    required
                    onChange={(e) => {
                      handleChange(e);
                      setIsConnectionTested(false);
                    }}
                  />
                </div>
                <div className={classes.textQuickAnswerContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.labelBusiness")}
                    name="facebookBusinessId"
                    error={touched.facebookBusinessId && Boolean(errors.facebookBusinessId)}
                    helperText={touched.facebookBusinessId && errors.facebookBusinessId}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                    required
                    onChange={(e) => {
                      handleChange(e);
                      setIsConnectionTested(false);
                    }}
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.greetingMessage")}
                    type="greetingMessage"
                    multiline
                    minRows={3}
                    fullWidth
                    name="greetingMessage"
                    error={touched.greetingMessage && Boolean(errors.greetingMessage)}
                    helperText={touched.greetingMessage && errors.greetingMessage}
                    variant="outlined"
                    margin="dense"
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("officialWhatsappModal.title.farewellMessage")}
                    type="farewellMessage"
                    multiline
                    minRows={3}
                    fullWidth
                    name="farewellMessage"
                    error={touched.farewellMessage && Boolean(errors.farewellMessage)}
                    helperText={touched.farewellMessage && errors.farewellMessage}
                    variant="outlined"
                    margin="dense"
                  />
                </div>
                <div>
                  <FormControl
                    variant="outlined"
                    className={classes.multFieldLine}
                    margin="dense"
                    fullWidth
                  >
                    <InputLabel>Fluxo</InputLabel>
                    <Select
                      sx={{ padding: "12px" }}
                      name="flowId"
                      label="Fluxo"
                      defaultValue=""
                      IconComponent={(_props) => {
                        const open = _props.className.toString().includes("iconOpen");

                        if (open) return <Icon>keyboard_arrow_up</Icon>;

                        return <Icon>keyboard_arrow_down</Icon>;
                      }}
                    >
                      <MenuItem value={""}>Nenhum</MenuItem>
                      {flows &&
                        flows.map((flow) => {
                          return (
                            <MenuItem value={flow.id} key={flow.id}>
                              {flow.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <QueueSelect
                    id="queueIds"
                    name="queueIds"
                    selectedQueueIds={values?.queueIds}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <MDButton
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("officialWhatsappModal.buttons.cancel")}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="dark"
                  disabled={isSubmitting}
                  className={classes.btnWrapper}
                  onClick={() => handleConnectionTest(values)}
                >
                  {i18n.t("officialWhatsappModal.buttons.testConnection")}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="dark"
                  type="submit"
                  disabled={!isConnectionTested}
                  className={classes.btnWrapper}
                  onClick={handleSubmit}
                >
                  {i18n.t("officialWhatsappModal.buttons.add")}
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
OfficialConnectionsModal.defaultProps = {
  whatsAppId: null,
};

// Typechecking props for the QuickAnswerModal
OfficialConnectionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  whatsAppId: PropTypes.number,
};

export default OfficialConnectionsModal;
