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
const AddAdvisory = (props) => {
    const initialState = {
        snackBarMsg: "",
        contactServer: false,
        countries: [],
        selectedCountry: "",
        nameOfPerson: "",
        buttonDisabled: true,
    };


    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    
    const sendSnackToApp = (msg) => {
        props.dataFromChild(msg);
    };

    const reducer = (state, newState) => ({ ...state, ...newState });

    const [state, setState] = useReducer(reducer, initialState);

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
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
                    query: "query {alerts{name, text}}",
                }),
            });
            let payload = await response.json();

            setState({
                countries: payload.data.alerts,
            });
            sendSnackToApp( `${payload.data.alerts.length} countries loaded`);

        } catch (error) {
            console.log(error);
            sendSnackToApp( `Problem loading server data - ${error.message}`);
        }
    };

    const onChange = (e, selectedOption) => {
        selectedOption
            ? setState({ selectedCountry: `${selectedOption}` })
            : setState({ selectedCountry: `` });

        if (state.nameOfPerson === "" || selectedOption === null) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const onChangeTextField = (e, selectedOption) => {
        setState({
            nameOfPerson: e.target.value,
        });

        if (e.target.value === "" || state.selectedCountry === "") {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    };

    const buttonPress = async () => {
        let theCountry = state.countries.find(
            (country) => country.name === state.selectedCountry
        );

        const d = new Date();
        let advisory={
            name: state.nameOfPerson,
            country: theCountry.name,
            text: theCountry.text,
            date: d.toISOString(),
        };

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        setState({
            contactServer: true,
        })
        sendSnackToApp(`Adding advisory for ${advisory.name}`);
        
        try {
            let query = JSON.stringify({
                query: `mutation {addadvisory(name: "${advisory.name}",country: "${advisory.country}", text: "${advisory.text}" , date: "${advisory.date}" ) { date }}`,
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
            })
            sendSnackToApp(`Added Advisory on ${json.data.addadvisory.date}`);
        } catch (error) {
            setState({
                contactServer: true,
            });
            sendSnackToApp(`${error.message} - advisory not added`);
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
                    title="World Wide Travel Alerts"
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
                        Add Advisory
                    </Typography>

                    <TextField
                        id="outlined-basic"
                        label="Traveler's Name"
                        variant="outlined"
                        style={{
                            width: "100%",
                            marginTop: 10,
                            marginBottom: 15,
                        }}
                        onChange={onChangeTextField}
                    />

                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.countries.map((alert) => {
                            return alert["name"];
                        })}
                        getOptionLabel={(option) => option}
                        style={{ width: "100%" }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="countries"
                                variant="outlined"
                                fullWidth
                            />
                        )}
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
                            Add Advosary
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};
export default AddAdvisory;
