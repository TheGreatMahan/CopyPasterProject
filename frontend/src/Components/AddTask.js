import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./worldimage.png";
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
import { IntegrationInstructionsRounded } from "@mui/icons-material";
const AddTask = (props) => {
    const initialState = {
        snackBarMsg: "",
        contactServer: false,
        users: [],
        selectedUser: "",
        buttonDisabled: true,
        nameOfTask: "",
        priority: -1,
        duedate: "",
        duetime: "",
        difficulty: -1,
        description: "",
        color: "",
        difficulties: Array.from({length: 11}, (x, i) => i.toString()),
        priorities: Array.from({length: 11}, (x, i) => i.toString())
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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendSnackToApp("Loading countries");


            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: "query {users {username}}",
                }),
            });
            let payload = await response.json();
            console.log(payload);

            setState({
                users: payload.data.users,
            });
            sendSnackToApp( `${payload.data.users.length} users loaded`);

        } catch (error) {
            console.log(error);
            sendSnackToApp( `Problem loading server data - ${error.message}`);
        }
    };
    

    const onChange = (e, selectedOption) => {
        selectedOption
            ? setState({ selectedUser: `${selectedOption}` })
            : setState({ selectedUser: `` });

            if (state.nameOfTask === "" || selectedOption === null || state.duedate === "" 
            || state.duetime === "" || state.difficulty === -1 || state.priority === -1) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const onChangePriorities = (e, selectedOption) => {
        selectedOption
            ? setState({ priority: parseInt(selectedOption)})
            : setState({ priority: -1 });

        if (state.nameOfTask === "" || state.selectedUser === null || state.duedate === "" 
        || state.duetime === "" || state.difficulty === -1 || state.priority === -1) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const onChangeDifficulties = (e, selectedOption) => {
        selectedOption
            ? setState({ difficulty: parseInt(selectedOption) })
            : setState({ difficulty: -1 });

        if (state.nameOfTask === "" || state.selectedUser === null 
        || state.duedate === "" || state.duetime === "" || state.difficulty === -1 || state.priority === -1) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const onChangeNameField = (e, selectedOption) => {
        setState({
            nameOfTask: e.target.value,
        });

        if (state.nameOfTask === "" || state.selectedUser === null || state.duedate === "" 
        || state.duetime === "" || state.difficulty === -1 || state.priority === -1) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const onChangeDescriptionField = (e, selectedOption) => {
        setState({
            description: e.target.value,
        });

        if (state.nameOfTask === "" || state.selectedUser === null 
        || state.difficulty === -1 || state.priority === -1) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };



    const buttonPress = async () => {
        let theUser = state.users.find(
            (user) => user.username === state.selectedUser
        );

        const d = new Date();
        let task={
            name: state.nameOfTask,
            username: theUser.username,
            priority: state.priority,
            duedate: d.toISOString(),
            duetime: d.getTime(),
            difficulty: state.difficulty,
            description: state.description,
            color: state.color
        };

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        setState({
            contactServer: true,
        })
        sendSnackToApp(`Adding task for ${task.name}`);
        
        try {
            let query = JSON.stringify({
                query: `mutation {addtask(name: "${task.name}",username: "${task.username}", priority: ${task.priority} , duedate: "${task.duedate}"
                , duetime: "${task.duetime}", difficulty: ${task.difficulty}, description: "${task.description}" ) { duedate }}`,
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
            })
            sendSnackToApp(`Added Task on ${json.data.addtask.duedate}`);
        } catch (error) {
            setState({
                contactServer: true,
            });
            sendSnackToApp(`${error.message} - task not added`);
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <Card style={{}}>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        width: "50%",
                        marginTop: 40,
                        marginLeft: 100,
                        marginBottom: -50,
                    }}
                />
                <CardHeader
                    title="ProActinators"
                    style={{ textAlign: "center", marginTop: 50 }}
                />
                <CardContent>
                    <Typography
                        color="primary"
                        style={{
                            textAlign: "center",
                            fontSize: 25,
                            marginTop: -20,
                            marginBottom: 20,
                        }}
                    >
                        Add Task
                    </Typography>

                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.users.map((user) => {
                            return user["username"];
                        })}
                        getOptionLabel={(option) => option}
                        style={{ width: "100%" }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="users"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    
                    <TextField
                        id="outlined-basic"
                        label="Name of Task"
                        variant="outlined"
                        style={{
                            width: "100%",
                            marginTop: 10,
                            marginBottom: 15,
                        }}
                        onChange={onChangeNameField}
                    />

                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.priorities}
                        getOptionLabel={(option) => option}
                        style={{ width: "100%" }}
                        onChange={onChangePriorities}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="priority"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />

                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.difficulties}
                        getOptionLabel={(option) => option}
                        style={{ width: "100%" }}
                        onChange={onChangeDifficulties}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="difficulty"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    

                    <TextField
                        id="outlined-basic"
                        label="Description of Task"
                        variant="outlined"
                        style={{
                            width: "100%",
                            marginTop: 10,
                            marginBottom: 15,
                        }}
                        onChange={onChangeDescriptionField}
                    />

                    
                    <Typography align="center">
                        <Button
                            style={{
                                marginTop: 50,
                            }}
                            disabled={buttonDisabled}
                            variant="contained"
                            onClick={() => {
                                buttonPress();
                            }}
                        >
                            Add Task
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};
export default AddTask;
