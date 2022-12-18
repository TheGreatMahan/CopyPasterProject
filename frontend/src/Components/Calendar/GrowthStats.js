import React, { useReducer, useEffect } from "react";

import Plot from 'react-plotly.js';

import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    Autocomplete,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import { useAuth } from "../Auth";


const GrowthStats = () => {

    const auth = useAuth();

    const initialState = {
        chartDataX: [],
        chartDataY: [],
        totalPoints: 0
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);


    useEffect(() => {
        fetchTasksForUser(auth.user)
    }, [])

    const GRAPHURL = "http://localhost:5000/graphql";

    const fetchTasksForUser = async (user) => {
        try {

            // sendMessageToSnackbar("Loading tasks");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: `query {tasksforuser(username:"${user}"){_id, completiondate, points}}`,
                }),
            });
            let payload = await response.json();
            console.log(payload);
            // sendMessageToSnackbar(
            //     `found ${payload.data.tasksforuser.length} tasks for ${user}`
            // );



            console.log(payload);
            //console.log(state.difficulties.indexOf('hard'));

            let labels = payload.data.tasksforuser.filter((data) => data.completiondate !== null && data.completiondate !== "");
            labels = labels.map((data) => data.completiondate);
            labels = labels.map((data) => new Date(data));
            labels = labels.map((data) => data.toLocaleDateString());
            labels = labels.filter((v, i, a) => a.indexOf(v) === i);

            let dateData = payload.data.tasksforuser
            dateData = dateData.filter((data) => data.completiondate !== null && data.completiondate !== "");
            dateData.forEach((data) => { data.completiondate = new Date(data.completiondate) });
            dateData.forEach((data) => { data.completiondate = data.completiondate.toLocaleDateString() });

            let combinedData = labels.map((label) => { return ({ completiondate: label, points: 0 }) });
            combinedData.forEach((obj) => {
                obj.points = dateData.filter((item) => obj.completiondate === item.completiondate)
                    .reduce(
                        (accumulator, currentValue) => accumulator + currentValue.points, 0)
            });

            let x = combinedData.map((data) => data.completiondate);
            let y = combinedData.map((data) => data.points);


            setState({ chartDataX: x, chartDataY: y });
            console.log('x: ' + x)
            console.log('y: ' + y)

            return payload.data.tasksforuser;
        } catch (error) {
            console.log(error);
            // sendMessageToSnackbar(`Problem loading server data - ${error.message}`);
        }
    };



    return (

        <Box textAlign='center'>
            <Card style={{ width: "100%", boxShadow: 'none' }}>
                <CardHeader
                    title="Your points displayed"
                    style={{ color: 'black', textAlign: "center" }}
                />

                <CardContent>
                    <Plot
                        data={[
                            {
                                x: state.chartDataX,
                                y: state.chartDataY,
                                // bar, 
                                type: 'scatter',
                                //mode: 'lines+markers',
                                marker: { color: 'green' }
                            }
                        ]}
                        config={{
                            // turn off modebar on hover
                            displayModeBar: false
                        }}
                        layout={{ width: '80%', height: '50%', /* title: `showing data for ${state.grabSelectedTicker}` */ }}
                        
                    />
                </CardContent>

            </Card>
        </Box>

    );
}

export default GrowthStats;