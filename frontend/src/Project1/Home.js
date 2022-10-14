import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./worldimage.png"
import {
    AppBar,
    Toolbar,
    
    Card,
    CardHeader,
    CardContent,
    Typography,
    
} from "@mui/material";
import theme from "../theme";
import "../App.css";
const Project1 = () => {
    return (
        <ThemeProvider theme={theme}>
            
            <Card  style={{}}>
                <img src={Logo} alt="Logo" style={{width:"50%",marginTop:70, marginLeft:100,marginBottom:-50}}/>
                <CardHeader
                    title="World Wide Travel Alerts"
                    style={{ textAlign: "center", marginTop: 60 }}
                />
                <CardContent>
 
                    <p />
                    <Typography color="error" style={{fontSize:12,textAlign:"right"}}>©INFO3139-MahanMehdipour-2022</Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};
export default Project1;
