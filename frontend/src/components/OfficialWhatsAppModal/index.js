import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, useFormikContext } from "formik";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	Button,
	DialogActions,
	TextField,
	Switch,
	FormControlLabel,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@material-ui/core";

import QueueSelect from "../QueueSelect";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},

	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
}));

const SessionSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
});

const OfficialWhatsAppModal = ({ open, onClose, whatsAppId, connectionId }) => {
	const { i18n } = useTranslation();
	const classes = useStyles();

	const initialState = {
		whatsappAccountId: "",
		official: true,
		messageCallbackUrl: "",
		statusCallbackUrl: "",
		callbackAuthorization: ""
	};

	const [whatsApp, setWhatsApp] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [flows, setFlows] = useState([]);
	const [flow, setFlow] = useState("");

	const [isConnectionTested, setIsConnectionTested] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState(null);

	useEffect(() => {
		const fetchSession = async () => {
			if (!whatsAppId) return;

			try {
				const { data } = await api.get(`whatsapp/${whatsAppId}`);
				setWhatsApp(data);
				setFlow(data.flowId ?? "");

				const whatsQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(whatsQueueIds);
			} catch (err) {
				console.log(err);
				toastError(err);
			}
		};

		const fetchFlows = async () => {
			try {
				const { data } = await api.get('flows');
				setFlows(data);
			} catch (err) {
				toastError(err);
			}
		}

		fetchFlows();
		fetchSession();
	}, [whatsAppId]);

	const handleClose = () => {
		setIsConnectionTested(false);
		setPhoneNumber(null);
		setWhatsApp(initialState);
		setSelectedQueueIds([]);
		setFlow("");
		onClose();
	};

	const handleSaveWhatsApp = async values => {
		const whatsappData = {
			...values,
			queueIds: selectedQueueIds,
			officialConnectionId: connectionId ? connectionId : null,
			name: phoneNumber ? phoneNumber.display_phone_number.replaceAll("+", "").replaceAll("-", "").replaceAll(" ", "") : "",
			facebookPhoneNumberId: phoneNumber ? phoneNumber.id : null,
			flowId: flow ? flow : null,
		};

		try {
			if (whatsAppId) {
				await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
			} else {
				await api.post("/whatsapp", whatsappData);
			}
			toast.success(i18n.t("whatsappModal.success"));
			handleClose();
		} catch (err) {
			toastError(err);
		}
	};

	const handleConnectionTest = async (whatsappAccountId) => {
		try {
			const { data } = await api.get('/whatsappsession/testConnection', {
			  params: { whatsappAccountId, connectionId }
			});

			if (data) {
				setPhoneNumber(data.data[0]);
			  	setIsConnectionTested(true);
			  	toast.success("Phone Number Found.");
			} else {
			  	setIsConnectionTested(false);
			}
		} catch (err) {
			setIsConnectionTested(false);
			toastError(err);
		}
	}
	const handleFlowChange = (e) => {
		setFlow(e.target.value);
	}

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
			>
				<DialogTitle>
				{whatsAppId
						? i18n.t("officialWhatsappModal.title.edit")
						: i18n.t("officialWhatsappModal.title.add")}
				</DialogTitle>
				<Formik
					initialValues={whatsApp}
					enableReinitialize={true}
					validationSchema={SessionSchema}
				>
					{({ values, touched, errors, isSubmitting, handleChange }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Whatsapp Account Id"
										autoFocus
										name="whatsappAccountId"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										margin="dense"
										className={classes.textField}
										fullWidth
										onChange={(e) => {
											setIsConnectionTested(false);
											handleChange(e);
										}}
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Message Callback URL"
										name="messageCallbackUrl"
										error={touched.messageCallbackUrl && Boolean(errors.messageCallbackUrl)}
										helperText={touched.messageCallbackUrl && errors.messageCallbackUrl}
										variant="outlined"
										margin="dense"
										className={classes.textField}
										fullWidth
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Status Callback URL"
										name="statusCallbackUrl"
										error={touched.statusCallbackUrl && Boolean(errors.statusCallbackUrl)}
										helperText={touched.statusCallbackUrl && errors.statusCallbackUrl}
										variant="outlined"
										margin="dense"
										className={classes.textField}
										fullWidth
									/>
								</div>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label="Callback Authorization"
										name="callbackAuthorization"
										error={touched.callbackAuthorization && Boolean(errors.callbackAuthorization)}
										helperText={touched.callbackAuthorization && errors.callbackAuthorization}
										variant="outlined"
										margin="dense"
										className={classes.textField}
										fullWidth
									/>
								</div>
								{ isConnectionTested &&
									<>
										<div>
											<Field
												as={TextField}
												label="Name"
												autoFocus
												name="name"
												variant="outlined"
												margin="dense"
												value={phoneNumber ? phoneNumber.verified_name : ""}
												fullWidth
												disabled
											/>
										</div>
										<div>
											<Field
												as={TextField}
												label="Phone Number"
												autoFocus
												name="phoneNumber"
												variant="outlined"
												margin="dense"
												value={phoneNumber ? phoneNumber.display_phone_number : ""}
												fullWidth
												disabled
											/>
										</div>
										<div>
											<Field
												as={TextField}
												label="Quality Rating"
												autoFocus
												name="qualityRating"
												variant="outlined"
												margin="dense"
												value={phoneNumber ? phoneNumber.quality_rating : ""}
												fullWidth
												disabled
											/>
										</div>
									</>
								}
								<div>
									<FormControl
										variant="outlined"
										className={classes.multFieldLine}
										margin="dense"
										fullWidth
									>
										<InputLabel>Fluxo</InputLabel>
										<Select
											value={flow}
											onChange={(e) => { handleFlowChange(e) }}
											label="Fluxo"
										>
											<MenuItem value={""}>Nenhum</MenuItem>
											{ flows && flows.map(flow => {
												return (
													<MenuItem value={flow.id} key={flow.id}>{flow.name}</MenuItem>
												)
											}) }
										</Select>
									</FormControl>
								</div>
								<QueueSelect
									selectedQueueIds={selectedQueueIds}
									onChange={selectedIds => setSelectedQueueIds(selectedIds)}
								/>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									variant="outlined"
								>
									{i18n.t("officialWhatsappModal.buttons.cancel")}
								</Button>
								<Button
									onClick={() => handleConnectionTest(values.whatsappAccountId)}
									color="primary"
									variant="contained"
								>
									Testar
								</Button>
								<Button
									onClick={() => { handleSaveWhatsApp(values) }}
									color="primary"
									variant="contained"
									className={classes.btnWrapper}
									disabled={!isConnectionTested}
								>
									{ whatsAppId 
										? "Editar" 
										: i18n.t("officialWhatsappModal.buttons.add")
									}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default React.memo(OfficialWhatsAppModal);
