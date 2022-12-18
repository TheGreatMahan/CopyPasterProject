import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Autocomplete,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import theme from "../../theme";
import "../../App.css";
import { IntegrationInstructionsRounded } from "@mui/icons-material";
import { useAuth } from "../Auth";

const AddTask = (props) => {
  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    users: [],
    selectedUser: "",
    buttonDisabled: true,
    Subject: "",
    priority: "-1",
    StartTime: "",
    EndTime: "",
    completiondate: "",
    difficulty: "-1",
    Description: "",
    CalendarId: {},
    color: "",
    _id: "",
    isUpdate: false,
    points: 0,
    checked: false,
    completed: 0,
    difficulties: [
      ["easy", 0],
      ["normal", 1],
      ["hard", 2],
      ["very hard", 3],
      ["NIGHTMARE", 4],
    ],
    priorities: Array.from({ length: 5 }, (x, i) => (i + 1).toString()),
    calendarCollections: [
      { CalendarText: "Red", CalendarId: 1, CalendarColor: "#e61f15" },
      { CalendarText: "Orange", CalendarId: 2, CalendarColor: "#e68415" },
      { CalendarText: "Lime Green", CalendarId: 3, CalendarColor: "#73e615" },
      { CalendarText: "Light Blue", CalendarId: 4, CalendarColor: "#1db9e0" },
      { CalendarText: "Purple", CalendarId: 5, CalendarColor: "#cd1de0" },
      { CalendarText: "Magenta", CalendarId: 6, CalendarColor: "#d61596" },
      { CalendarText: "Pink", CalendarId: 7, CalendarColor: "#ff75df" },
      { CalendarText: "Forest Green", CalendarId: 8, CalendarColor: "#0f6b28" },
    ],
  };

  const auth = useAuth();

  const GRAPHURL = "http://localhost:5000/graphql";

  const sendMessageToSnackbar = (msg) => {
    props.dataFromChild(msg);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const getKeyByValue = (object, value) => {
    return state.difficulties.find((diff) => diff[1] === value);
  };

  const fetchTask = async () => {
    if (props.id !== null) {
      try {
        setState({
          contactServer: true,
          isUpdate: true,
          _id: props.id,
        });
        sendMessageToSnackbar("Loading task");

        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query: `query {taskbyid(_id: "${props.id}") {_id, Subject, username, priority, StartTime, EndTime, 
                completiondate, difficulty, Description, color, points, completed, CalendarId}}`,
          }),
        });
        let payload = await response.json();

        console.log(
          Object.entries(state.difficulties).map((diff) => {
            return diff;
          })
        );
        setState({
          selectedUser: payload.data.taskbyid.username,
          Subject: payload.data.taskbyid.Subject,
          priority: payload.data.taskbyid.priority.toString(),
          StartTime: new Date(payload.data.taskbyid.StartTime),
          EndTime: new Date(payload.data.taskbyid.EndTime),
          completiondate: new Date(payload.data.taskbyid.completiondate),
          difficulty: getKeyByValue(
            state.difficulties,
            payload.data.taskbyid.difficulty
          ),
          Description: payload.data.taskbyid.Description,
          color: payload.data.taskbyid.color,
          points: payload.data.taskbyid.points,
          completed: payload.data.taskbyid.completed,
          CalendarId:
            state.calendarCollections[payload.data.taskbyid.CalendarId - 1],
        });
        sendMessageToSnackbar(`${payload.data.taskbyid.name} task loaded`);
      } catch (error) {
        console.log(error);
        sendMessageToSnackbar(`Problem loading server data - ${error.message}`);
      }
    }
  };

  const onChangePriorities = (e, selectedOption) => {
    selectedOption
      ? setState({ priority: selectedOption })
      : setState({ priority: "-1" });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.StartTime === "" ||
      state.Description === "" ||
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
      : setState({ difficulty: state.difficulties[0] });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.StartTime === "" ||
      state.Description === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeCalendarId = (e, selectedOption) => {
    selectedOption
      ? setState({ CalendarId: selectedOption })
      : setState({ CalendarId: {} });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.StartTime === "" ||
      state.Description === "" ||
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
      Subject: e.target.value,
    });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.StartTime === "" ||
      state.difficulty === -1 ||
      state.priority === -1 ||
      state.Description === ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const onChangeDescriptionField = (e, selectedOption) => {
    setState({
      Description: e.target.value,
    });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.StartTime === "" ||
      state.difficulty === -1 ||
      state.priority === -1
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const handleCheckbox = (event) => {
    setState({ checked: event.target.checked });

    if (event.target.checked) {
      setButtonDisabled(false);
    }
  };

  const onChangeDateField = (e, selectedOption) => {
    setState({
      StartTime: e.value,
    });

    if (
      state.Subject === "" ||
      state.selectedUser === null ||
      state.difficulty === -1 ||
      state.priority === -1 ||
      state.Description === ""
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const buttonPress = async () => {
    //const d = new Date();
    let enddate = state.StartTime;
    enddate.setHours(enddate.getHours() + 1);
    let task = {
      id: state._id,
      Subject: state.Subject,
      username: auth.user,
      priority: parseInt(state.priority),
      StartTime: state.StartTime.toISOString(),
      EndTime: enddate,
      completiondate: "",
      difficulty: state.difficulty[1],
      Description: state.Description,
      color: state.color,
      points: state.points,
      CalendarId: state.CalendarId.CalendarId,
      completed: 0,
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
    sendMessageToSnackbar(`Adding task for ${task.name}`);
    try {
      let query = JSON.stringify({
        query: `mutation {addtask(Subject: "${task.Subject}", username: "${task.username}", priority: ${task.priority} , StartTime: "${task.StartTime}", EndTime: "${task.EndTime}"
                , difficulty: ${task.difficulty}, Description: "${task.Description}", points: ${task.points}, CalendarId: ${task.CalendarId} ) { StartTime }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();

      console.log(json);
      setState({
        contactServer: true,
        nameOfTask: "",
        priority: "-1",
        duedate: "",
        difficulty: "-1",
        description: "",
      });
      console.log("added task on list");
      sendMessageToSnackbar(`Added Task on ${json.data.addtask.StartTime}`);
      console.log(json);
      clearBoxes();
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendMessageToSnackbar(`${error.message} - task not added`);
    }
  };

  const clearBoxes = () => {
    setState({
      Subject: "",
      priority: "-1",
      StartTime: "",
      EndTime: "",
      completiondate: "",
      difficulty: "-1",
      Description: "",
    });
    props.onClose();
  };

  const updateTask = async (task) => {
    let currentdate = new Date();
    let startTime = new Date(task.StartTime);

    let pointStatus =
      Math.floor(currentdate.getTime()) < Math.floor(startTime.getTime())
        ? 1
        : -1;

    if (state.checked) {
      task.completed = 1;
      task.completiondate = currentdate.toISOString();
      task.points = pointStatus;
    }
    if (!state.checked && task.completed === 0) {
      task.completed = 0;
      task.completiondate = "";
      task.points = 0;
    }
    sendMessageToSnackbar(`Updating task for ${task.Subject}`);
    try {
      let query = JSON.stringify({
        query: `mutation {updatetask(_id: "${task.id}", Subject: "${task.Subject}", username: "${task.username}", priority: ${task.priority} , StartTime: "${task.StartTime}",
                EndTime: "${task.EndTime}", completiondate: "${task.completiondate}", difficulty: ${task.difficulty}, Description: "${task.Description}", points: ${task.points}, completed: ${task.completed}, CalendarId: ${task.CalendarId} ) { msg }}`,
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
      sendMessageToSnackbar(`${json.data.updatetask.msg}`);
      clearBoxes();
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendMessageToSnackbar(`${error.message} - task not updated`);
    }
  };

  const deleteTask = async () => {
    sendMessageToSnackbar(`Updating task for ${state.Subject}`);
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
      sendMessageToSnackbar(`${json.data.deletetask.msg}`);
      clearBoxes();
    } catch (error) {
      setState({
        contactServer: true,
      });
      sendMessageToSnackbar(`${error.message} - task not updated`);
    }
  };

  return (
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      aria-labelledby="Task Info"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
    >
      <Card style={{ width: 500, height: 600, overflow: "scroll" }}>
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

          <Card
            style={{
              marginBottom: 20,
              border: "none",
              boxShadow: "none",
              width: "100%",
            }}
          >
            <TextField
              style={{ width: "100%", marginTop: 5 }}
              id="outlined-basic"
              label="Name of Task"
              variant="outlined"
              onChange={onChangeNameField}
              value={state.Subject}
            />
          </Card>

          <Card
            style={{
              marginBottom: 20,
              border: "none",
              boxShadow: "none",
              width: "100%",
            }}
          >
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

          <Card
            style={{
              marginBottom: 10,
              border: "none",
              boxShadow: "none",
              width: "100%",
            }}
          >
            <DateTimePickerComponent
              placeholder="Please Choose the Due Date"
              format="dd-mm-yyyy hh:mm a"
              id="duedate"
              value={state.StartTime}
              className="e-field"
              data-name="duedate"
              onChange={onChangeDateField}
            />
          </Card>

          <Card
            style={{
              marginBottom: 20,
              border: "none",
              boxShadow: "none",
              width: "100%",
            }}
          >
            <Autocomplete
              data-testid="autocomplete"
              options={state.difficulties.map((diff) => {
                return diff;
              })}
              getOptionLabel={(option) => option[0]}
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

          <Card
            style={{
              marginBottom: 20,
              border: "none",
              boxShadow: "none",
              width: "100%",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Description of Task"
              variant="outlined"
              style={{
                width: "100%",
                marginTop: 10,
              }}
              onChange={onChangeDescriptionField}
              value={state.Description}
            />

            <Autocomplete
              data-testid="autocomplete"
              options={state.calendarCollections.map((cal) => {
                return cal;
              })}
              getOptionLabel={(option) => option.CalendarText}
              style={{ width: "100%" }}
              onChange={onChangeCalendarId}
              value={state.CalendarId}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: 5 }}
                  {...params}
                  label="Colour"
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            {state.isUpdate && (
              <FormControlLabel
                label="Task Completed?"
                control={
                  <Checkbox
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    onChange={handleCheckbox}
                    checked={state.checked}
                    disabled={state.completed === 1}
                  />
                }
              />
            )}
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
