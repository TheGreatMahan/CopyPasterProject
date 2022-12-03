import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "../worldimage.png";
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
import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
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
    //snackBarMsg: "",
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
    difficulties: ["easy", "normal", "hard", "very hard", "NIGHTMARE"],
  };

  const columns = [
    { field: "Subject", headerName: "Task Name", width: 200 },
    { field: "Description", headerName: "Task Description", width: 200 },
    {
      field: "priority",
      headerName: "Task Priority",
      type: "number",
      width: 130,
    },
    {
      field: "StartTime",
      headerName: "Task Due Date",
      width: 300,
      renderCell: (params) => {
        let date = new Date(params.row.StartTime);
        console.log(date.toISOString());
        return date.toString();
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },

    {
      field: "difficulty",
      headerName: "Task Difficulty",
      type: "number",
      width: 130,
      sortable: true,
      valueGetter: (params) =>
      `${state.difficulties[params.row.difficulty]}`,
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
          query: `query {tasksforuser(username:"${user}"){_id, Subject, Description, StartTime, priority, difficulty}}`,
        }),
      });
      let payload = await response.json();
      console.log(payload);
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
      <Card style={{}}>
        <CardHeader
          title="Your Tasks"
          style={{ textAlign: "center", marginTop: 60 }}
        />
        <CardContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row._id}
              rows={state.listForTable}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              onRowClick={handleClick}
            />
          </div>
          {state.isOpen && (
            <AddTask
              open={state.isOpen}
              onClose={handleClose}
              id={state.selectedId}
              dataFromChild={sendSnackToApp}
            ></AddTask>
          )}
          <ControlPointIcon
            fontSize="large"
            style={{ position: "absolute", bottom: "50px", right: "50px" }}
            onClick={(e) => handleClick(null)}
            className="addicon"
          ></ControlPointIcon>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};
export default ListTasks;
