import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./worldimage.png";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import theme from "../theme";
import "../App.css";
const ResetAlerts = (props) => {
    const initialState = {
        snackBarMsg: "",
        msg: "",
        contactServer: false,
        msgs: [],
    };
    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";

    const reducer = (state, newState) => ({ ...state, ...newState });

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchData();
    }, []);

    const sendSnackToApp = (msg) => {
        props.dataFromChild(msg);
    };

    const fetchData = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendSnackToApp("Running Setup");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: "query {setupalerts{results}}",
                }),
            });
            let payload = await response.json();
            let resArr = payload.data.setupalerts.results
                .replace(/([.])\s*(?=[A-Z])/g, "$1|")
                .split("|");

            setState({
                msgs: resArr,
            });
        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);
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
                        marginTop: 70,
                        marginLeft: 100,
                        marginBottom: -50,
                    }}
                />
                <CardHeader
                    title="World Wide Travel Alerts"
                    style={{ textAlign: "center", marginTop: 60 }}
                />
                <CardContent>
                    <Typography style={{ textAlign: "center" }}>
                        Alert Setup - Details
                    </Typography>
                </CardContent>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {state.msgs.map((message) => (
                                <TableRow key={message}>
                                    <TableCell component="th" scope="message">
                                        <Typography color="error">
                                            {message}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </ThemeProvider>
    );
};
export default ResetAlerts;
