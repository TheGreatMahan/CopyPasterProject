import React, { useState, useReducer } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Logout from "./Components/Logout";
import ListTasks from "./Components/Calendar/ListTasks";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
  Box,
} from "@mui/material";
import { useAuth } from "./Components/Auth";

const App = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const initialState = {
    snackBarMsg: "",
    gotData: false,
    isOpen: false,
    openModal: false,
  };

  const auth = useAuth();

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ gotData: false });
  };

  const dataFromChild = (msg) => {
    setState({ snackBarMsg: msg, gotData: true });
  };

  const handleModalClick = (component) => {
    setState({ isOpen: true });
    return component;
  };

  const handleModalClose = () => {
    setState({ isOpen: false, openModal: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="relative"
        color="error"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap component="div">
            {auth.user === "" && "Team: Copypasters"}
            {auth.user !== "" && `Welcome ${auth.user}`}
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {auth.user == "" && (
              <MenuItem onClick={handleClose} component={Link} to="/login">
                Login
              </MenuItem>
            )}
            {auth.user == "" && (
              <MenuItem onClick={handleClose} component={Link} to="/register">
                Register
              </MenuItem>
            )}
            {auth.user !== "" && (
              <MenuItem onClick={handleClose} component={Link} to="/home">
                Home
              </MenuItem>
            )}
            {auth.user !== "" && (
              <MenuItem onClick={handleClose} component={Link} to="/logout">
                Log Out
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
          <Route path="/" element={<Login dataFromChild={dataFromChild} />} />
          <Route
            path="/login"
            element={<Login dataFromChild={dataFromChild} />}
          />
          <Route
            path="/register"
            element={<Register dataFromChild={dataFromChild} />}
          />
          <Route
            path="/logout"
            element={<Logout dataFromChild={dataFromChild} />}
          />
          <Route
            path="/home"
            element={<Home dataFromChild={dataFromChild} />}
          />
        </Routes>
      </div>

      <Snackbar
        open={state.gotData}
        message={state.snackBarMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      />
    </ThemeProvider>
  );
};

export default App;
