import React, { useReducer, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Calendar from "./Calendar/Calendar";
import ListTasks from "./Calendar/ListTasks";
import CompletedTasks from "./Calendar/CompletedTasks";

import { ThemeProvider } from "@mui/material/styles";
import {
  Autocomplete,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import theme from "../theme";
import "../App.css";
import GrowthStats from "./Calendar/GrowthStats";

const Home = (props) => {
  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    countries: [],
    selectedCountry: "",
    nameOfPerson: "",
    buttonDisabled: true,
    currentView: "Calendar",
  };

  // const GRAPHURL = "http://localhost:5000/graphql";
  const GRAPHURL = "/graphql";

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const drawerWidth = 240;

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sendMessageToSnackbar = (msg) => {
    props.dataFromChild(msg);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card style={{ textAlign: "center" }}>
        <Box sx={{ display: "flex" }}>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
              <List>
                {["Calendar", "Tasks List", "Tasks Completed", "Growth Stats"].map(
                  (text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          console.log(text);
                          setState({
                            currentView: text,
                          });
                        }}
                      >
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
              <Divider />
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {state.currentView === "Tasks List" && (
              <ListTasks dataFromChild={sendMessageToSnackbar} />
            )}
            {state.currentView === "Tasks Completed" && (
              <CompletedTasks dataFromChild={sendMessageToSnackbar} />
            )}
            {state.currentView === "Calendar" && (
              <Calendar dataFromChild={sendMessageToSnackbar} />
            )}
            {state.currentView === "Growth Stats" && (
              <GrowthStats dataFromChild={sendMessageToSnackbar} />
            )}
            {/* {state.currentView === "Growth Stats" && <GrowthStats />} */}
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  );
};
export default Home;
