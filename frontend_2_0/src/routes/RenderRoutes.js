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

/**
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// React
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Material Dashboard 2 React layouts
// import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Menu1 from "layouts/menu1";
import Menu2 from "layouts/menu2";
import Menu3 from "layouts/menu3";

import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import QuickAnswer from "pages/QuickAnswer";
import OfficialConnections from "pages/OfficialConnections";
import Tickets from "pages/Tickets";

// @mui icons
import Icon from "@mui/material/Icon";

import api from "services/api";
import { AuthContext } from "context/Auth/AuthContext";
import toastError from "errors/toastError";

function renderRoutes() {
  const i18n = useTranslation();
  const { isAuth, user } = useContext(AuthContext);

  const [routes, setRoutes] = useState([]);

  const components = {
    Dashboard: <Dashboard />,
    "Quick Answers": <QuickAnswer />,
    Tickets: <Tickets />,
    "Official Connections": <OfficialConnections />,
  };

  useEffect(() => {
    const createRoutes = (menus, path = "") => {
      const routes = [];

      for (const menu of menus) {
        const name = i18n.t(`mainDrawer.listItems.${menu.name}`);
        const key = menu.name.replaceAll(" ", "");
        const icon = <Icon fontSize="small">{menu.icon}</Icon>;

        let route = null;
        let collapse = null;
        let component = null;

        if (menu.collapse) {
          collapse = createRoutes(menu.collapse, `${path}/${menu.name.replaceAll(" ", "")}`);
        } else {
          route = `${path}/${menu.name.replaceAll(" ", "")}`;
          component = components[menu.name] ? components[menu.name] : <Dashboard />;
        }

        const routeData = {
          type: "collapse",
          name,
          key,
          icon,
          route: route ? route : null,
          component: component ? component : null,
          collapse: collapse ? collapse : null,
        };

        routes.push(routeData);
      }

      return routes;
    };

    const fetchParentMenu = async (menuId) => {
      try {
        const { data } = await api.get(`/menus/${menuId}`);
        return data;
      } catch (err) {
        toastError(err);
      }
    };

    const fetchMenus = async () => {
      try {
        const { data } = await api.get("/menus/company");

        const menus = [];
        const allMenus = [];
        const parentMenus = [];
        const parentMenusIds = [];

        for (const menu of data) {
          if (menu.parentId) {
            if (parentMenusIds.indexOf(menu.parentId) === -1) {
              parentMenusIds.push(menu.parentId);

              const parentMenu = await fetchParentMenu(menu.parentId);
              parentMenus.push(parentMenu);
              allMenus.push(parentMenu);
              allMenus.push(menu);
            } else {
              allMenus.push(menu);
            }
          } else {
            allMenus.push(menu);
          }
        }

        for (const parent of parentMenus) {
          if (parent.parentId && parentMenusIds.indexOf(parent.parentId) === -1) {
            parentMenusIds.push(parent.parentId);

            const parentMenu = await fetchParentMenu(parent.parentId);
            allMenus.push(parentMenu);
          }
        }

        for (const menu of allMenus) {
          if (menu.parentId || menu.isParent) {
            if (menu.isParent) {
              const collapseMenus = [];
              for (const collapse of allMenus) {
                if (collapse.parentId === menu.id) {
                  collapseMenus.push(collapse);
                }
              }
              menu.collapse = [...collapseMenus];
              if (!menu.parentId) {
                menus.push(menu);
              }
            }
          } else {
            menus.push(menu);
          }
        }

        const routes = createRoutes(menus);
        setRoutes(routes);
      } catch (err) {
        console.log(err);
      }
    };

    if (isAuth) fetchMenus();
  }, [isAuth, user]);

  // const routes = [
  //   {
  //     type: "collapse",
  //     name: "Dashboard",
  //     key: "dashboard",
  //     icon: <Icon fontSize="small">dashboard</Icon>,
  //     route: "/dashboard",
  //     component: <Dashboard />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Quick Answer",
  //     key: "quickAnswer",
  //     icon: <Icon fontSize="small">question_answer</Icon>,
  //     route: "/quickAnswer",
  //     component: <QuickAnswer />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Dashboard",
  //     key: "dashboard",
  //     icon: <Icon fontSize="small">dashboard</Icon>,
  //     // route: "/dashboard",
  //     // component: <Dashboard />,
  //     collapse: [
  //       {
  //         type: "collapse",
  //         name: "Menu 1",
  //         key: "menu1",
  //         icon: <Icon fontSize="small">dashboard</Icon>,
  //         route: "/dashboard/menu1",
  //         component: <Menu1 />,
  //       },
  //       {
  //         type: "collapse",
  //         name: "Menu 2",
  //         key: "menu2",
  //         icon: <Icon fontSize="small">dashboard</Icon>,
  //         // route: "/dashboard/menu2",
  //         // component: <Menu2 />,
  //         collapse: [
  //           {
  //             type: "collapse",
  //             name: "Menu 3",
  //             key: "menu3",
  //             icon: <Icon fontSize="small">dashboard</Icon>,
  //             route: "/dashboard/menu2/menu3",
  //             component: <Menu3 />,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     type: "collapse",
  //     name: "Table",
  //     key: "tables",
  //     icon: <Icon fontSize="small">table_view</Icon>,
  //     route: "/tables",
  //     component: <Tables />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Billing",
  //     key: "billing",
  //     icon: <Icon fontSize="small">receipt_long</Icon>,
  //     route: "/billing",
  //     component: <Billing />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "RTL",
  //     key: "rtl",
  //     icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //     route: "/rtl",
  //     component: <RTL />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Notifications",
  //     key: "notifications",
  //     icon: <Icon fontSize="small">notifications</Icon>,
  //     route: "/notifications",
  //     component: <Notifications />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Profile",
  //     key: "profile",
  //     icon: <Icon fontSize="small">person</Icon>,
  //     route: "/profile",
  //     component: <Profile />,
  //   },
  //   {
  //     type: "collapse",
  //     name: "Sign In",
  //     key: "sign-in",
  //     icon: <Icon fontSize="small">login</Icon>,
  //     route: "/login",
  //     component: <Login />,
  //   },
  // ];

  return { routes };
}

export default renderRoutes;

// const routes = [
//   {
//     type: "collapse",
//     name: "Dashboard1",
//     key: "dashboard1",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard1",
//     component: <Dashboard1 />,
//   },
//   {
//     type: "collapse",
//     name: "Quick Answer",
//     key: "quickAnswer",
//     icon: <Icon fontSize="small">question_answer</Icon>,
//     route: "/quickAnswer",
//     component: <QuickAnswer />,
//   },
//   {
//     type: "collapse",
//     name: "Dashboard",
//     key: "dashboard",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard",
//     component: <Dashboard />,
//     collapse: [
//       {
//         type: "collapse",
//         name: "Menu 1",
//         key: "menu1",
//         icon: <Icon fontSize="small">dashboard</Icon>,
//         route: "/menu1",
//         component: <Menu1 />,
//       },
//       {
//         type: "collapse",
//         name: "Menu 2",
//         key: "menu2",
//         icon: <Icon fontSize="small">dashboard</Icon>,
//         route: "/menu2",
//         component: <Menu2 />,
//         collapse: [
//           {
//             type: "collapse",
//             name: "Menu 3",
//             key: "menu3",
//             icon: <Icon fontSize="small">dashboard</Icon>,
//             route: "/menu3",
//             component: <Menu3 />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: "collapse",
//     name: "Table",
//     key: "tables",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/tables",
//     component: <Tables />,
//   },
//   {
//     type: "collapse",
//     name: "Billing",
//     key: "billing",
//     icon: <Icon fontSize="small">receipt_long</Icon>,
//     route: "/billing",
//     component: <Billing />,
//   },
//   {
//     type: "collapse",
//     name: "RTL",
//     key: "rtl",
//     icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
//     route: "/rtl",
//     component: <RTL />,
//   },
//   {
//     type: "collapse",
//     name: "Notifications",
//     key: "notifications",
//     icon: <Icon fontSize="small">notifications</Icon>,
//     route: "/notifications",
//     component: <Notifications />,
//   },
//   {
//     type: "collapse",
//     name: "Profile",
//     key: "profile",
//     icon: <Icon fontSize="small">person</Icon>,
//     route: "/profile",
//     component: <Profile />,
//   },
//   {
//     type: "collapse",
//     name: "Sign In",
//     key: "sign-in",
//     icon: <Icon fontSize="small">login</Icon>,
//     route: "/authentication/sign-in",
//     component: <SignIn />,
//   },
// ];

// export default routes;
