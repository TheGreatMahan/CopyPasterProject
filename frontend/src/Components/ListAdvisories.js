import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Logo from "./worldimage.png";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import {
    Card,
    TextField,
    Autocomplete,
    CardHeader,
    CardContent,
    Typography,
} from "@mui/material";
import theme from "../theme";
import "../App.css";
const ListAdvisories = (props) => {
    const initialState = {
        snackBarMsg: "",
        msg: "",
        contactServer: false,
        advisories: [],
        radioButton: "",
        list: [],
        listForTable: [],
        selectedOption: "",
    };
    const sendSnackToApp = (msg) => {
        props.dataFromChild(msg);
    };
    const reducer = (state, newState) => ({ ...state, ...newState });

    const [state, setState] = useReducer(reducer, initialState);

 // const GRAPHURL = "http://localhost:5000/graphql"; 
    const GRAPHURL = "/graphql";

    useEffect(() => {
        fetchAdvisories();
    }, []);

    const fetchAdvisories = async () => {
        try {
            setState({
                contactServer: true,
            });

            sendSnackToApp("Loading advisories");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: "query {advisories{name,country, text,date}}",
                }),
            });
            let payload = await response.json();

            setState({
                advisories: payload.data.advisories,
            });
            sendSnackToApp(`${payload.data.advisories.length} advisories loaded`);
        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);

        }
    };

    const fetchRegions = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendSnackToApp("Loading regions");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: "query {regions}",
                }),
            });
            let payload = await response.json();

            setState({
                list: payload.data.regions,
            });
            sendSnackToApp(`found ${payload.data.regions.length} regions`);

        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);
        }
    };

    const fetchSubRegions = async () => {
        try {
            setState({
                contactServer: true,
            });
            sendSnackToApp("Loading subregions");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: "query {subregions}",
                }),
            });
            let payload = await response.json();

            setState({
                list: payload.data.subregions,
            });
            sendSnackToApp(`found ${payload.data.subregions.length} subregions`);

        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);
        }
    };

    const fetchAlertsForSubRegion = async (subregion) => {
        try {
            setState({
                contactServer: true,
            });
            sendSnackToApp("Loading subregions");

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: `query {alertsforsubregion(subregion:"${subregion}"){name, text,date}}`,
                }),
            });
            let payload = await response.json();
            sendSnackToApp(`found ${payload.data.alertsforsubregion.length} subregions for ${subregion}`);

            return payload.data.alertsforsubregion;
        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);
        }
    };

    const fetchAlertsForRegion = async (region) => {
        try {
            setState({
                contactServer: true,
            });

            sendSnackToApp("Loading sub regions");
            
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: `query {alertsforregion(region:"${region}"){name, text,date}}`,
                }),
            });
            let payload = await response.json();
            sendSnackToApp(`found ${payload.data.alertsforregion.length} regions for ${region}`);
            return payload.data.alertsforregion;

        } catch (error) {
            console.log(error);
            sendSnackToApp(`Problem loading server data - ${error.message}`);
        }
    };

    const onChange = async (e, selectedOption) => {
        selectedOption
            ? setState({ selectedOption: `${selectedOption}` })
            : setState({ selectedOption: `` });

        if (selectedOption !== null) {
            if (state.radioButton === "Traveler") {
                let listForTraveler = state.advisories.filter(
                    (advisory) => advisory.name === selectedOption
                );

                listForTraveler = listForTraveler.map((each) => {
                    return {
                        country: each.country,
                        text1: `${each.text}`,
                        text2: `${each.date}`,
                    };
                });

                setState({
                    listForTable: listForTraveler,
                });
            } else if (state.radioButton === "Region") {
                let alerts = await fetchAlertsForRegion(selectedOption);

                alerts = alerts.map((alert) => {
                    return {
                        country: alert.name,
                        text1: `${alert.text}`,
                        text2: `${alert.date}`,
                    };
                });

                setState({
                    listForTable: alerts,
                });
            } else if (state.radioButton === "Subregion") {
                let alerts = await fetchAlertsForSubRegion(selectedOption);

                alerts = alerts.map((alert) => {
                    return {
                        country: alert.name,
                        text1: `${alert.text}`,
                        text2: `${alert.date}`,
                    };
                });
                setState({
                    listForTable: alerts,
                });
            }
        }
    };

    const handleChange = (event) => {
        setState({
            radioButton: event.target.value,
        });

        if (event.target.value === "Traveler") {
            fetchAdvisories();
            let listNames = state.advisories.map((advisory) => {
                return advisory["name"];
            });

            listNames = [...new Set(listNames)];

            setState({
                list: listNames,
            });
        } else if (event.target.value === "Region") {
            fetchRegions();
        } else if (event.target.value === "Subregion") {
            fetchSubRegions();
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
                    <Typography
                        color="primary"
                        style={{
                            textAlign: "center",
                            fontSize: 25,
                            marginTop: -20,
                            marginBottom: 20,
                        }}
                    >
                        List Advisories By:
                    </Typography>
                    <RadioGroup
                        style={{ justifyContent: "center" }}
                        row
                        aria-label="gender"
                        name="gender1"
                        value={state.radioButton}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="Traveler"
                            control={<Radio />}
                            label="Traveler"
                        />
                        <FormControlLabel
                            value="Region"
                            control={<Radio />}
                            label="Region"
                        />
                        <FormControlLabel
                            value="Subregion"
                            control={<Radio />}
                            label="Subregion"
                        />
                    </RadioGroup>

                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.list}
                        getOptionLabel={(option) => option}
                        style={{ width: "100%" }}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={state.radioButton}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />

                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography color="primary">
                                            Country
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography color="primary">
                                            Alert Information
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.listForTable.map((element) => (
                                    <TableRow key={element.text2 +' '+ element.text1 +' '+ element.country}>
                                        <TableCell
                                            component="th"
                                            scope="element"
                                        >
                                            <Typography color="secondary">
                                                {element.country}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="element"
                                        >
                                            <Typography
                                                color="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                {element.text1}
                                                <br />
                                                {element.text2}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};
export default ListAdvisories;
