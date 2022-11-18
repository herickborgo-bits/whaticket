import React, { useState } from "react";
import PropTypes from "prop-types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ComponentSon from "./ComponentSon";

function ComponentDad(props) {
  const { icon, primary, childrenMenus } = props;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <List>
      <li>
        <ListItem button open={open} onClick={handleClick}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
          {open ? (
            <KeyboardArrowDownIcon fontSize="large" />
          ) : (
            <ArrowForwardIosIcon fontSize="small" />
          )}
        </ListItem>
      </li>
      <Collapse component="li" in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {Array.isArray(childrenMenus) &&
            childrenMenus.map((child) => {
              if (child.isParent) {
                return (
                  <ComponentDad
                    key={child.id}
                    icon={child.icon}
                    primary={child.name}
                    childrenMenus={child.childrenMenus}
                  />
                );
              }
              return (
                <ComponentSon
                  key={child.id}
                  to={`/${child.name.replaceAll(" ", "")}`}
                  primary={child.name}
                  icon={child.icon}
                />
              );
            })}
        </List>
      </Collapse>
    </List>
  );
}

ComponentDad.defaultProps = {
  icon: "",
  primary: "",
  childrenMenus: null,
};

ComponentDad.propTypes = {
  icon: PropTypes.string,
  primary: PropTypes.string,
  childrenMenus: PropTypes.arrayOf(PropTypes.object),
};

export default ComponentDad;
