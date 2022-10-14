import React, { useState } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./week7/class2/lab13/Lab13HomeComponent";
import SearchPage from "./week7/class2/lab13/Lab13Component";
import {
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    IconButton,
    Typography,
} from "@mui/material";
const App = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        INFO3139 - Lab 13
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
                            to="/search"
                        >
                            Search Users
                        </MenuItem>
                        <MenuItem
                            onClick={handleClose}
                            component={Link}
                            to="/project"
                        >
                            Project
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    
                </Routes>
            </div>
        </ThemeProvider>
    );
};
export default App;
