import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./../worldimage.png";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import AddTask from "./AddTask";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { DataGrid } from "@mui/x-data-grid";
import {
  Card,
  TextField,
  Autocomplete,
  CardHeader,
  CardContent,
  Typography,
  Tooltip,
} from "@mui/material";
import theme from "../../theme";
import "../../App.css";

const ListTasks = (props) => {
  const initialState = {
    snackBarMsg: "",
    msg: "",
    contactServer: false,
    advisories: [],
    radioButton: "",
    list: [],
    listForTable: [],
    selectedOption: "",
    isOpen: false,
    openModal: false,
    selectedId: "",
    snackBarMsg: "",
    gotData: false,
  };

  const columns = [
    { field: "name", headerName: "Task Name", width: 200 },
    { field: "description", headerName: "Task Description", width: 200 },
    {
      field: "priority",
      headerName: "Task Priority",
      type: "number",
      width: 130,
    },
    {
      field: "duedate",
      headerName: "Task Due Date",
      width: 200,
      sortable: true,
    },

    {
      field: "difficulty",
      headerName: "Task Difficulty",
      type: "number",
      width: 130,
      sortable: true,
    },
  ];

  const sendSnackToApp = (msg) => {
    props.dataFromChild(msg);
  };
  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const GRAPHURL = "http://localhost:5000/graphql";
  //const GRAPHURL = "/graphql";

  useEffect(() => {
    fetchTasksForUser("testman3");
  }, []);

  const fetchTasksForUser = async (user) => {
    try {
      setState({
        contactServer: true,
      });
      sendSnackToApp("Loading tasks");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `query {tasksforuser(username:"${user}"){_id, name, description, duedate, priority, difficulty}}`,
        }),
      });
      let payload = await response.json();
      sendSnackToApp(
        `found ${payload.data.tasksforuser.length} tasks for ${user}`
      );

      setState({
        listForTable: payload.data.tasksforuser,
      });

      console.log(payload);

      return payload.data.tasksforuser;
    } catch (error) {
      console.log(error);
      sendSnackToApp(`Problem loading server data - ${error.message}`);
    }
  };

  const handleClick = (params) => {
    setState({ isOpen: true, selectedId: params ? params.row._id : null });
  };

  const handleClose = () => {
    setState({ isOpen: false, openModal: false });
  };

  return (
    <ThemeProvider theme={theme}>

      <Card style={{ border: "none", boxShadow: "none", display: 'flex', justifyContent: 'center', width: '100%' }}>

        <CardContent>
          <Card style={{ height: 500, width: 1000, border: "none", boxShadow: 'none' }}>
            <CardHeader
              title="Your Tasks"
              style={{ marginTop: 60 }}
            />

            <DataGrid
              style={{ width: '100%' }}
              getRowId={(row) => row._id}
              rows={state.listForTable}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[10]}
              onRowClick={handleClick}
            />
          </Card>

          {state.isOpen && (
            <AddTask
              open={state.isOpen}
              onClose={handleClose}
              id={state.selectedId}
              dataFromChild={sendSnackToApp}
            ></AddTask>
          )}
        </CardContent>
      </Card>

      <Card style={{ border: "none", boxShadow: "none" }}>
        <ControlPointIcon fontSize="large" style={{ position: "absolute", bottom: "50px", right: "50px" }}
          onClick={(e) => handleClick(null)}
          className="addicon"
        ></ControlPointIcon>
      </Card>

    </ThemeProvider>
  );
};
export default ListTasks;
