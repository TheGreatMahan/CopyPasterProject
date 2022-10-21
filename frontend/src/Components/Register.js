import React, { useState, useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
// import Logo from "./worldimage.png"
import {
    AppBar,
    Toolbar,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    TextField,

} from "@mui/material";
import theme from "../theme";
import "../App.css";



const Register = () => {

    const initialState = {
        handleUsername: "",
        handlePassword: "",
        contactServer: false,
    };

    const GRAPHURL = "http://localhost:5000/graphql";

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const handleUsernameFunction = (event) => { setState(state.handleUsername = event.target.value); }
    const handlePasswordFunction = (event) => { setState(state.handlePassword = event.target.value); }



    // TODO for backend developer : link up register button to backend

    const handleRegisterButton = async () => {

        //Send new user to server
        let user = {
            username: state.handleUsername,
            password: state.handlePassword,
        }

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        setState({
            contactServer: true,
        })

        try {
            let query = JSON.stringify({
                query: `mutation {adduser(username: "${user.username}",password: "${user.password}") 
                {username, password}}`,
            });
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: query,
            });
            let json = await response.json();
            if (json != null) {
                alert("Register successful!");
            }
            else {
                alert("Register failed");
            }

            setState({
                contactServer: true,
            })
        } catch (error) {
            setState({
                contactServer: true,
            });
        }

    }

    const emptyorundefined =
        state.handleUsername === "" || state.handleUsername == undefined ||
        state.handlePassword === "" || state.handlePassword == undefined

    return (
        <ThemeProvider theme={theme}>

            <Card style={{ textAlign: 'center' }}>


                {/* add our own logo maybe ?  */}
                {/* <img src={Logo} alt="Logo" style={{width:"50%",marginTop:70, marginLeft:100,marginBottom:-50}}/> */}
                <CardHeader
                    title="ProActinators"
                    style={{ textAlign: "center", marginTop: 30 }}
                />

                <CardHeader
                    title="Register"
                    style={{ textAlign: "center", marginTop: 50 }}
                />

                <Card style={{ boxShadow: "none" }} >
                    <TextField
                        style={{ marginTop: 20 }}
                        label="Enter username"
                        onChange={handleUsernameFunction}
                    />
                </Card>
                <Card style={{ boxShadow: "none" }} >
                    <TextField
                        style={{ marginTop: 20 }}
                        label="Enter password"
                        onChange={handlePasswordFunction}
                    />
                </Card>


                <Button
                    disabled={emptyorundefined}
                    style={{ marginBottom: 30, marginTop: 30 }} color="secondary" variant="contained" onClick={handleRegisterButton}>
                    Register
                </Button>


            </Card>
        </ThemeProvider>
    );
};
export default Register;
