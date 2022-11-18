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

import { useContext, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
// import bgImage from "../../../assets/images/bg-sign-in-basic.jpeg";

import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/Auth/AuthContext";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

const Basic = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { i18n } = useTranslation();
  const [user, setUser] = useState({ email: "", password: "", company: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAuth = await handleLogin(user);

    if (isAuth) {
      window.location.href = "http://localhost:3000/dashboard";
      toast.success("Funcionou!!!");
    } else {
      toast.error("Não Funcionou -_-'");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Login
          </MDTypography>
        </MDBox>
          <div noValidate onSubmit={handleSubmit}>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                <MDBox mb={2}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="company"
                    label={i18n.t("login.form.company")}
                    name="company"
                    value={user.company}
                    onChange={handleChangeInput}
                    autoComplete="company"
                    autoFocus
                  />
                </MDBox>
                <MDBox mb={2}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={i18n.t("login.form.email")}
                    name="email"
                    value={user.email}
                    onChange={handleChangeInput}
                    autoComplete="email"
                  />
                </MDBox>
                <MDBox mb={2}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={i18n.t("login.form.password")}
                    id="password"
                    value={user.password}
                    onChange={handleChangeInput}
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((e) => !e)}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}/>
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Remember me
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                  >
                    Entrar
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </div>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
