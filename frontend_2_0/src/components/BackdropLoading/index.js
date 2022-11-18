import React from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { withStyles } from "@mui/styles";

const useStyles = withStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

const BackdropLoading = () => {
	const classes = useStyles();
	return (
		<Backdrop className={classes.backdrop} open={true}>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};

export default BackdropLoading;
