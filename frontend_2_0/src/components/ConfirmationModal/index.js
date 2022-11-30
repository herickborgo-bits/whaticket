import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import PropTypes from "prop-types";
import MDButton from "../MDButton";

function ConfirmationModal({ title, children, open, onClose, onConfirm }) {
  const { i18n } = useTranslation();

  return (
    <Dialog open={open} onClose={() => onClose(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{children}</Typography>
      </DialogContent>
      <DialogActions>
        <MDButton variant="outlined" onClick={() => onClose(false)} color="error">
          {i18n.t("confirmationModal.buttons.cancel")}
        </MDButton>
        <MDButton
          variant="contained"
          onClick={() => {
            onClose(false);
            onConfirm();
          }}
          color="info"
        >
          {i18next.t("confirmationModal.buttons.confirm")}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationModal.defaultProps = {
  title: "",
}

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ConfirmationModal;
