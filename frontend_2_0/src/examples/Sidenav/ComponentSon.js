import React, { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

function ComponentSon(props) {
  const { icon, to, primary } = props;

  const renderLink = forwardRef((itemProps, ref) => (
    <RouterLink to={to} ref={ref} {...itemProps} />
  ));

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ComponentSon.defaultProps = {
  icon: "",
  primary: "",
};

ComponentSon.propTypes = {
  icon: PropTypes.string,
  primary: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export default ComponentSon;
