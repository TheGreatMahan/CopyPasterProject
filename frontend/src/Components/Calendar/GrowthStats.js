import React, { useReducer, useEffect } from "react";

import Plot from 'react-plotly.js';

import {
    Card,
    CardHeader,
    CardContent,
    Box,
    Typography,
} from "@mui/material";
import { useAuth } from "../Auth";


const GrowthStats = () => {

    const auth = useAuth();

    const initialState = {
        chartDataX: [],
        chartDataY: [],
        totalPoints: 0,
        losses: 0,
        wins: 0
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);


    useEffect(() => {
        fetchTasksForUser(auth.user)
    }, [])

    const GRAPHURL = "http://localhost:5000/graphql";

    const fetchTasksForUser = async (user) => {
        try {
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

            let numValues = [{ value: -1, points: 0 }, { value: 0, points: 0 }, { value: 1, points: 0 }];
            numValues.forEach((obj) => {
                obj.points = dateData.filter((item) => obj.value === item.points)
                    .reduce((accumulator, currentValue) => accumulator + currentValue.points, 0)
            });

            let totalPoints = numValues.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
            let losses = numValues[0].points;
            let wins = numValues[2].points;


            setState({ chartDataX: x, chartDataY: y, totalPoints: totalPoints, losses: losses, wins: wins });
            console.log('x: ' + x)
            console.log('y: ' + y)

            return payload.data.tasksforuser;
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Box textAlign='center'>
            <Card style={{ width: "100%", boxShadow: 'none' }}>
                <CardHeader
                    title="Your points displayed"
                    style={{ color: 'black', textAlign: "center" }}
                />

                <Typography style={{ fontWeight: '500', fontSize: '24px' }}>Total points: {state.totalPoints}</Typography>
                <Typography style={{ fontWeight: '450', color: 'green' }}>Wins: {state.wins}</Typography>
                <Typography style={{ fontWeight: '450', color: 'red' }}>Losses: {state.losses}</Typography>

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
                        layout={{ width: '80%', height: '50%' }}

                    />
                </CardContent>
            </Card>
        </Box>
    );
}

export default GrowthStats;