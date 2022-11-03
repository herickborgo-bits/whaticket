import React, { forwardRef, useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ComponentDad from "../Sidenav/ComponentDad"


function ComponentSon(props) {
  const { icon, to, primary, className, drawerOpen, ...other } = props;

  const renderLink = forwardRef((itemProps, ref) => (<RouterLink to={to} ref={ref} {...itemProps} />))

  const renderedIcon = getIcon(icon, false);

  return (
    <li>
      <ListItem button component={renderLink} className={className} {...other}>
        {renderedIcon ? <ListItemIcon>{renderedIcon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

return ComponentSon;