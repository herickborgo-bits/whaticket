
import React, { forwardRef, useContext, useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material";
import ComponentSon from "../Sidenav/ComponentSon"

function ComponentDad(props) {
  const { icon, primary, children, translation, drawerOpen } = props;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const renderedIcon = getIcon(icon, true);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  }

  return (
    <List>
      <li>
        <ListItem button open={open} onClick={handleClick} className={classes.root}>
          {renderedIcon ? <ListItemIcon>{renderedIcon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
          {open ? < KeyboardArrowDownIcon fontSize="large" /> : <ArrowForwardIosIcon fontSize="small" />}
        </ListItem>
      </li>
      <Collapse component="li" in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={drawerOpen ? classes.nested : ""} >
          { children && children.map(child => {
            if (child.isParent) {
              return (
                <ComponentDad
                  key={child.id}
                  icon={child.icon}
                  primary={translation(child.name)}
                  children={child.children}
                  translation={translation}
                  drawerOpen={drawerOpen}
                />
              )
            } else {
              return (
                <ComponentSon
                  key={child.id}
                  to={`/${(child.name).replaceAll(" ", "")}`}
                  primary={translation(child.name)}
                  icon={child.icon}
                  drawerOpen={drawerOpen}
                />
              )
            }
          }) }
        </List>
      </Collapse>
    </List>
  )
}

export default ComponentDad;