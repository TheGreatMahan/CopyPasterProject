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
} from "@mui/material";
import theme from "../theme";
import "../App.css";

import Logo from "../images/logo.png";

const Register = () => {
  const initialState = {
    handleUsername: "",
    handlePassword: "",
    holdPasswordData: "",
    isClicked: false,
  };

  const GRAPHURL = "http://localhost:5000/graphql";

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


  const handleRegisterButton = async () => {
    //Send new user to server
    let user = {
      username: state.handleUsername,
      password: state.handlePassword,
    };

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setState({
      contactServer: true,
    });

    try {
      let query = JSON.stringify({
        query: `mutation {adduser(username: "${user.username}",password: "${user.password}") 
                {username, password}}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      if (json != null) {
        alert("Register successful!");
      } else {
        alert("Register failed");
      }

      setState({
        contactServer: true,
      });
    } catch (error) {
      setState({
        contactServer: true,
      });
    }
  };

  const emptyorundefined =
    state.handleUsername === "" ||
    state.handleUsername === undefined ||
    state.handlePassword === "" ||
    state.handlePassword === undefined;

  return (
    <ThemeProvider theme={theme}>
      <Card style={{ textAlign: "center", border: "none", boxShadow: "none" }}>

        <img src={Logo} alt="Logo" style={{ width: "20%" }} />

        <CardHeader
          title="Register"
        />

        <Card style={{ boxShadow: "none" }}>
          <TextField
            style={{ width: '15%' }}
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
          <Card style={{border: "none", boxShadow: "none"}} >
            <Button
              style={{ fontSize: 10 }}
              color="primary"
              onClick={handleToggleShowPassword}
            >
              Show Password
            </Button>
          </Card>
        </Card>

        <Button
          disabled={emptyorundefined}
          style={{ marginBottom: 30, marginTop: 30 }}
          color="secondary"
          variant="contained"
          onClick={handleRegisterButton}
        >
          Register
        </Button>
      </Card>
    </ThemeProvider>
  );
};
export default Register;
