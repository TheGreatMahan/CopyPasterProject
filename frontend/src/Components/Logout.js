import React, { useState, useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
//import Logo from "./worldimage.png";
import { Card, CardHeader, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import "../App.css";

import Logo from "../images/logo.png";
import { useAuth } from './Auth';


const Logout = () => {
  const navigate = useNavigate();

  const auth = useAuth();
  auth.logout();

  const loginPage = () => {
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Card style={{ textAlign: "center" }}>
        <img src={Logo} alt="Logo" style={{ width: "20%" }} />
        <CardHeader title="You are logged out" />
        <Button
          style={{ marginBottom: 30 }}
          color="secondary"
          variant="contained"
          onClick={loginPage}
        >
          log In
        </Button>
      </Card>
    </ThemeProvider>
  );
};
export default Logout;
