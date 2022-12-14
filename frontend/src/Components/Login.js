import React, { useState, useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
// import Logo from "./worldimage.png"
import {
  AppBar,
  Toolbar,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import "../App.css";

import Logo from "../images/logo.png";
import { useAuth } from './Auth';


//const bcrypt = require('bcrypt');
//import bcrypt from 'bcrypt';

const Login = (props) => {


  const sendMessageToSnackbar = (msg) => {
    props.dataFromChild(msg)
  };

  const initialState = {
    handleUsername: "",
    handlePassword: "",
    holdPasswordData: "",
    isClicked: false,
    snackBarMsg: "",
    msg: ""
  };

  const auth = useAuth();

  const GRAPHURL = "http://localhost:5000/graphql"


  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleUsernameFunction = (event) => {
    setState((state.handleUsername = event.target.value));
  };
  const handlePasswordFunction = (event) => {
    setState(
      (state.handlePassword = event.target.value),
      (state.holdPasswordData = event.target.value)
    );
  };

  const handleToggleShowPassword = (event) => {
    if (state.isClicked === false) setState((state.isClicked = true));
    else setState((state.isClicked = false));
  };

  const navigate = useNavigate();

  const registerPage = () => {
    navigate("/register");
  };

  const handleLoginButton = async () => {
    try {
      setState({
        contactServer: true,
      });

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `query {userlogin(username: "${state.handleUsername}", password: "${state.handlePassword}")
                    {msg}}`,
        }),
      });

      let json = await response.json();
      console.log(json);
      if (json.data.userlogin.msg) {
        sendMessageToSnackbar("Successfully Logged In!");
        auth.login(state.handleUsername);
        navigate("/home");
      } else {
        sendMessageToSnackbar("Login Failed: Incorrect Username or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emptyorundefined =
    state.handleUsername === "" ||
    state.handleUsername == undefined ||
    state.handlePassword === "" ||
    state.handlePassword == undefined;

  return (
    <ThemeProvider theme={theme}>
      <Card style={{ textAlign: "center", border: "none", boxShadow: "none" }}>
        <img src={Logo} alt="Logo" style={{ width: "20%" }} />

        <CardHeader title="Login here" />

        <Card style={{ boxShadow: "none" }}>
          <TextField
            style={{ width: "15%", marginTop: 15 }}
            label="Enter username"
            onChange={handleUsernameFunction}
          />
        </Card>

        <Card style={{ boxShadow: "none" }}>
          {state.isClicked && (
            <TextField
              value={state.holdPasswordData}
              style={{ marginTop: 20, width: "15%" }}
              label="Enter password"
              onChange={handlePasswordFunction}
            />
          )}
          {!state.isClicked && (
            <TextField
              value={state.holdPasswordData}
              type="password"
              style={{ marginTop: 20, width: "15%" }}
              label="Enter password"
              onChange={handlePasswordFunction}
            />
          )}
          <Card style={{ border: "none", boxShadow: "none" }}>
            <Button
              style={{ fontSize: 10, marginBottom: 20 }}
              color="primary"
              onClick={handleToggleShowPassword}
            >
              Show Password
            </Button>
          </Card>
        </Card>

        <Button
          disabled={emptyorundefined}
          color="secondary"
          variant="contained"
          onClick={handleLoginButton}
        >
          Login
        </Button>

        <CardHeader title="Not registered?" style={{ marginTop: 50 }} />

        <Button
          style={{ marginBottom: 30 }}
          color="secondary"
          variant="contained"
          onClick={registerPage}
        >
          Register here
        </Button>
      </Card>
    </ThemeProvider>
  );
};
export default Login;
