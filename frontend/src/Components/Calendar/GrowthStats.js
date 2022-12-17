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


import theme from "../../theme";

const GrowthStats = () => {


    let test1 = [1, 2, 3]
    let test2 = [4, 5, 6]

    return (

        <Box textAlign='center'>
            <Card style={{ marginLeft: '25%', width: "50%", boxShadow: 'none' }}>
                <CardHeader
                    title="title here"
                    style={{ color: 'black', textAlign: "center" }}
                />


                <CardContent>
                    <Plot
                        data={[
                            {
                                x: test1,
                                y: test2,
                                type: 'scatter',
                                //mode: 'lines+markers',
                                marker: { color: 'green' },
                            }
                        ]}
                        config={{
                            // turn off modebar on hover
                            displayModeBar: false
                        }}
                        layout={{ width: '50%', height: '50%', /* title: `showing data for ${state.grabSelectedTicker}` */ }}
                    />
                </CardContent>

            </Card>
        </Box>

    );
}

export default GrowthStats;