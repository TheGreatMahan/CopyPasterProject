import React, { useState, useReducer } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Project1/Home";
import ResetAlerts from "./Project1/ResetAlerts";
import AddAdvisory from "./Project1/AddAdvisory";
import ListAdvisory from "./Project1/ListAdvisories";
import {
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Snackbar,
} from "@mui/material";
const App = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const initialState = {
        snackBarMsg: "",
        gotData: false,
    };

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

    const msgFromChild = (msg) => {
        setState({ snackBarMsg: msg, gotData: true });
    };
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="error">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        INFO3139 - Case Study #1
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
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/home"
                        >
                            Home
                        </MenuItem>
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/resetalerts"
                        >
                            Reset Alerts
                        </MenuItem>
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/addadvisory"
                        >
                            Add Advisory
                        </MenuItem>
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/listadvisory"
                        >
                            List Advisory
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/resetalerts" element={<ResetAlerts dataFromChild={msgFromChild}/>} />
                    <Route path="/addadvisory" element={<AddAdvisory dataFromChild={msgFromChild}/>} />
                    <Route path="/listadvisory" element={<ListAdvisory dataFromChild={msgFromChild}/>} />
                    
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
