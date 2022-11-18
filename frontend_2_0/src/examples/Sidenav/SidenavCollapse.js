/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function SidenavCollapse({ icon, name, active, collapse, collapseName, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  if (collapse) {
    return (
      <>
        <ListItem component="li" onClick={handleClick}>
          <MDBox
            {...rest}
            sx={(theme) =>
              collapseItem(theme, {
                active,
                transparentSidenav,
                whiteSidenav,
                darkMode,
                sidenavColor,
              })
            }
          >
            <ListItemIcon
              sx={(theme) =>
                collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
              }
            >
              {typeof icon === "string" ? (
                <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
              ) : (
                icon
              )}
            </ListItemIcon>

            <ListItemText
              primary={name}
              sx={(theme) =>
                collapseText(theme, {
                  miniSidenav,
                  transparentSidenav,
                  whiteSidenav,
                  active,
                })
              }
            />

            {open ? (
              <Icon fontSize="small">expand_less</Icon>
            ) : (
              <Icon fontSize="small">expand_more</Icon>
            )}
          </MDBox>
        </ListItem>
        {open &&
          collapse.map((child) => {
            if (child.collapse) {
              return (
                <SidenavCollapse
                  name={child.name}
                  icon={child.icon}
                  active={child.key === collapseName}
                  collapse={child.collapse}
                  collapseName={collapseName}
                />
              );
            }

            return (
              <NavLink key={child.key} to={child.route}>
                <SidenavCollapse
                  name={child.name}
                  icon={child.icon}
                  active={child.key === collapseName}
                />
              </NavLink>
            );
          })}
      </>
    );
  }

  return (
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme) =>
          collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />
      </MDBox>
    </ListItem>
  );

  // return (
  //   <ListItem component="li">
  //     <MDBox
  //       {...rest}
  //       sx={(theme) =>
  //         collapseItem(theme, {
  //           active,
  //           transparentSidenav,
  //           whiteSidenav,
  //           darkMode,
  //           sidenavColor,
  //         })
  //       }
  //     >
  //       <ListItemIcon
  //         sx={(theme) =>
  //           collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
  //         }
  //       >
  //         {typeof icon === "string" ? (
  //           <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
  //         ) : (
  //           icon
  //         )}
  //       </ListItemIcon>

  //       <ListItemText
  //         primary={name}
  //         sx={(theme) =>
  //           collapseText(theme, {
  //             miniSidenav,
  //             transparentSidenav,
  //             whiteSidenav,
  //             active,
  //           })
  //         }
  //       />
  //     </MDBox>
  //   </ListItem>
  // );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
  collapse: null,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  collapse: PropTypes.arrayOf(PropTypes.object),
  collapseName: PropTypes.string,
};

export default SidenavCollapse;
