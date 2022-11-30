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

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDDialogContent
import MDDialogContentRoot from "components/MDDialogContent/MDDialogContentRoot";

const MDDialogContent = forwardRef(({ ...rest }, ref) => (
  <MDDialogContentRoot {...rest} ref={ref} />
));

export default MDDialogContent;
