import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";

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

const Home = (props) => {
  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    countries: [],
    selectedCountry: "",
    nameOfPerson: "",
    buttonDisabled: true,
    currentView: "",
  };

  // const GRAPHURL = "http://localhost:5000/graphql";
  // test commit
  const GRAPHURL = "/graphql";

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  // const [buttonDisabled, setButtonDisabled] = useState(true);
  //useEffect(() => {}, []);

  const drawerWidth = 240;

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
                {["Tasks List", "Calendar", "Growth Stats"].map(
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
            {/* {state.currentView === "Tasks List"
            <TaskList/>
            }
            {state.currentView === "Calendar"
            <Calendar/>
            }
            {state.currentView === "Growth Stats"
            <GrowthStats/>
            } */}
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  );
};
export default Home;
