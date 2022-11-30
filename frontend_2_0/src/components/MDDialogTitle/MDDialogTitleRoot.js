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

// @mui material components
import { DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMaterialUIController } from "context";

export default styled(DialogTitle)(({ theme }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { palette } = theme;
  const { white, dark } = palette;

  return {
    backgroundColor: darkMode ? dark.main : white.main,
    pointerEvents: "auto",
  };
});
