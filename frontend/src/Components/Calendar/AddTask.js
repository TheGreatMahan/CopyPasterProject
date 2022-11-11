import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./../worldimage.png";
import {
  Autocomplete,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import theme from "../../theme";
import "../../App.css";

import { IntegrationInstructionsRounded } from "@mui/icons-material";
const AddTask = (props) => {
  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    users: [],
    selectedUser: "testman3",
    buttonDisabled: true,
    nameOfTask: "",
    priority: "-1",
    duedate: "",
    completiondate: "",
    difficulty: "-1",
    description: "",
    color: "",
    _id: "",
    isUpdate: false,
    difficulties: Array.from({ length: 11 }, (x, i) => i.toString()),
    priorities: Array.from({ length: 11 }, (x, i) => i.toString()),
  };

  const GRAPHURL = "http://localhost:5000/graphql";
  //const GRAPHURL = "/graphql";

  const sendSnackToApp = (msg) => {
    props.dataFromChild(msg);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    if (props.id !== null) {
      try {
        setState({
          contactServer: true,
          isUpdate: true,
          _id: props.id,
        });
        sendSnackToApp("Loading task");

        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query: `query {taskbyid(_id: "${props.id}") {_id, name, username, priority, duedate, 
                completiondate, difficulty, description, color}}`,
          }),
        });
        let payload = await response.json();

        console.log(payload);

        setState({
          selectedUser: payload.data.taskbyid.username,
          nameOfTask: payload.data.taskbyid.name,
          priority: payload.data.taskbyid.priority.toString(),
          duedate: new Date(payload.data.taskbyid.duedate),
          completiondate: new Date(payload.data.taskbyid.completiondate),
          difficulty: payload.data.taskbyid.difficulty.toString(),
          description: payload.data.taskbyid.description,
          color: payload.data.taskbyid.color,
        });
        sendSnackToApp(`${payload.data.taskbyid.name} task loaded`);
      } catch (error) {
        console.log(error);
        sendSnackToApp(`Problem loading server data - ${error.message}`);
      }
    }
  };

  // const fetchUsers = async () => {
  //   try {
  //     setState({
  //       contactServer: true,
  //     });
  //     sendSnackToApp("Loading countries");

  //     let response = await fetch(GRAPHURL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json; charset=utf-8",
  //       },
  //       body: JSON.stringify({
  //         query: "query {users {username}}",
  //       }),
  //     });
  //     let payload = await response.json();

  //     setState({
  //       users: payload.data.users,
  //     });
  //     sendSnackToApp(`${payload.data.users.length} users loaded`);
  //   } catch (error) {
  //     console.log(error);
  //     sendSnackToApp(`Problem loading server data - ${error.message}`);
  //   }
  // };

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setState({ selectedUser: selectedOption })
      : setState({ selectedUser: "" });

    if (
      state.nameOfTask === "" ||
      selectedOption === null ||
      state.duedate === "" ||
      state.description === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangePriorities = (e, selectedOption) => {
    selectedOption
      ? setState({ priority: selectedOption })
      : setState({ priority: "-1" });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.duedate === "" ||
      state.description === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeDifficulties = (e, selectedOption) => {
    selectedOption
      ? setState({ difficulty: selectedOption })
      : setState({ difficulty: "-1" });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.duedate === "" ||
      state.description === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeNameField = (e, selectedOption) => {
    setState({
      nameOfTask: e.target.value,
    });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.duedate === "" ||
      state.difficulty === -1 ||
      state.priority === -1 ||
      state.description === ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeDescriptionField = (e, selectedOption) => {
    setState({
      description: e.target.value,
    });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.duedate === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeDateField = (e, selectedOption) => {
    setState({
      duedate: e.value,
    });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.difficulty === -1 ||
      state.priority === -1 ||
      state.description === ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeCompletionDateField = (e, selectedOption) => {
    setState({
      completiondate: e.value,
    });

    if (
      state.nameOfTask === "" ||
      state.selectedUser === null ||
      state.duedate === "" ||
      state.difficulty === -1 ||
      state.priority === -1 ||
      state.description === ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const buttonPress = async () => {
    //const d = new Date();
    let task = {
      id: state._id,
      name: state.nameOfTask,
      username: state.selectedUser,
      priority: parseInt(state.priority),
      duedate: state.duedate.toISOString(),
      completiondate: "",
      difficulty: parseInt(state.difficulty),
      description: state.description,
      color: state.color,
    };

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    setState({
      contactServer: true,
    });

    if (state.isUpdate) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  const addTask = async (task) => {
    sendSnackToApp(`Adding task for ${task.name}`);
    try {
      let query = JSON.stringify({
        query: `mutation {addtask(name: "${task.name}",username: "${task.username}", priority: ${task.priority} , duedate: "${task.duedate}"
                , completiondate: "${task.completiondate}", difficulty: ${task.difficulty}, description: "${task.description}" ) { duedate }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();

      setState({
        contactServer: true,
      });
      sendSnackToApp(`Added Task on ${json.data.addtask.duedate}`);
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendSnackToApp(`${error.message} - task not added`);
    }
  };

  const updateTask = async (task) => {
    sendSnackToApp(`Updating task for ${task.name}`);
    try {
      let query = JSON.stringify({
        query: `mutation {updatetask(_id: "${task.id}", name: "${task.name}", username: "${task.username}", priority: ${task.priority} , duedate: "${task.duedate}"
                , completiondate: "${task.completiondate}", difficulty: ${task.difficulty}, description: "${task.description}" ) { msg }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();

      setState({
        contactServer: true,
      });
      sendSnackToApp(`${json.data.updatetask.msg}`);
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendSnackToApp(`${error.message} - task not updated`);
    }
  };

  const deleteTask = async () => {
    sendSnackToApp(`Updating task for ${state.name}`);
    try {
      let query = JSON.stringify({
        query: `mutation {deletetask(_id: "${state._id}" ) { msg }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();

      setState({
        contactServer: true,
      });
      sendSnackToApp(`${json.data.deletetask.msg}`);
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendSnackToApp(`${error.message} - task not updated`);
    }
  };

  return (
    <Modal
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
      aria-labelledby="Task Info"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
    >

      <Card style={{ width: 500, height: 600 }}>
        <CardContent>
          <Typography
            style={{
              textAlign: "center",
              fontSize: 25,
              marginTop: 10,
            }}
          >
            ProActinators
          </Typography>

          <Typography
            color="primary"
            style={{
              textAlign: "center",
              fontSize: 25,
              marginBottom: 20,
            }}
          >
            Add Task
          </Typography>


          {/* <Autocomplete
              data-testid="autocomplete"
              options={state.users.map((user) => {
                return user["username"];
              })}
              getOptionLabel={(option) => option}
              style={{ width: "100%" }}
              onChange={onChange}
              value={state.selectedUser}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="users"
                  variant="outlined"
                  fullWidth
                />
              )}
            /> */}


          <Card style={{ marginBottom: 20, border: "none", boxShadow: "none", width: '100%' }}>
            <TextField
              style={{ width: '100%', marginTop: 5 }}
              id="outlined-basic"
              label="Name of Task"
              variant="outlined"
              onChange={onChangeNameField}
              value={state.nameOfTask}
            />
          </Card>

          <Card style={{ marginBottom: 20, border: "none", boxShadow: "none", width: '100%' }}>
            <Autocomplete
              data-testid="autocomplete"
              options={state.priorities}
              getOptionLabel={(option) => option}
              onChange={onChangePriorities}
              value={state.priority}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: 5 }}
                  {...params}
                  label="priority"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Card>

          <Card style={{ marginBottom: 10, border: "none", boxShadow: "none", width: '100%' }}>
            <DateTimePickerComponent
              placeholder="Please Choose the Due Date"
              format="dd-mm-yyyy hh:mm a"
              id="duedate"
              value={state.duedate}
              className="e-field"
              data-name="duedate"
              onChange={onChangeDateField}
            />
          </Card>

          <Card style={{ marginBottom: 20, border: "none", boxShadow: "none", width: '100%' }}>
            {state.isUpdate && (
              <DateTimePickerComponent
                placeholder="Please Choose the Completion Date"
                format="dd-mm-yyyy hh:mm a"
                id="completiondate"
                value={state.completiondate}
                className="e-field"
                data-name="completiondate"
                onChange={onChangeCompletionDateField}
              />
            )}
          </Card>

          <Card style={{ marginBottom: 20, border: "none", boxShadow: "none", width: '100%' }}>
            <Autocomplete
              data-testid="autocomplete"
              options={state.difficulties}
              getOptionLabel={(option) => option}
              style={{ width: "100%" }}
              onChange={onChangeDifficulties}
              value={state.difficulty}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: 5 }}
                  {...params}
                  label="difficulty"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Card>

          <Card style={{ marginBottom: 20, border: "none", boxShadow: "none", width: '100%' }}>
            <TextField
              id="outlined-basic"
              label="Description of Task"
              variant="outlined"
              style={{
                width: "100%",
                marginTop: 10,
              }}
              onChange={onChangeDescriptionField}
              value={state.description}
            />
          </Card>

          <Typography align="center">
            <Button
              style={{
                marginRight: 50,
              }}
              disabled={buttonDisabled}
              variant="contained"
              onClick={() => {
                buttonPress();
              }}
            >
              Save Task
            </Button>
            <Button
              disabled={!state.isUpdate}
              color="error"
              variant="contained"
              onClick={() => {
                deleteTask();
              }}
            >
              Delete
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Modal>
  );
};
export default AddTask;
