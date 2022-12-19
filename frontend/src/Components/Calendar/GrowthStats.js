import React, { useReducer, useEffect } from "react";

import Plot from 'react-plotly.js';

import {
    Card,
    CardHeader,
    CardContent,
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete
} from "@mui/material";
import { useAuth } from "../Auth";


const GrowthStats = () => {

    const auth = useAuth();

    const initialState = {
        chartDataX: [],
        chartDataY: [],
        totalPoints: 0,
        losses: 0,
        wins: 0,
        currentFriend: "",
        friends: [],
        users: [],
        friendStats: []
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);


    useEffect(() => {
        fetchTasksForUser(auth.user);
        fetchPotentialFriends();
    }, []);

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

            let stats = calculateStats(payload.data.tasksforuser);

            if(user === auth.user)
            {
               setState({chartDataX: stats.chartDataX, chartDataY: stats.chartDataY, totalPoints: stats.totalPoints, losses: stats.losses, wins: stats.wins}); 
            }
            
            return payload.data.tasksforuser;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPotentialFriends = async () => {
        try {
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    query: `query {users{username}}`,
                }),
            });

            let payload = await response.json();
            let data = payload.data.users.filter((user) => user !== auth.user && state.friends.indexOf(user) === -1);
            setState({users: data});

            return payload.data.tasksforuser;
        } catch (error) {
            console.log(error);
        }
    };

    const calculateStats = (stats) => {
            let labels = stats.filter((data) => data.completiondate !== null && data.completiondate !== "");
            labels = labels.map((data) => data.completiondate);
            labels = labels.map((data) => new Date(data));
            labels = labels.map((data) => data.toLocaleDateString());
            labels = labels.filter((v, i, a) => a.indexOf(v) === i);

            let dateData = stats
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


            return { chartDataX: x, chartDataY: y, totalPoints: totalPoints, losses: losses, wins: wins };

    };

    const onChangeFriendSelect = (e, selectedOption) => {
        selectedOption
          ? setState({ currentFriend: selectedOption })
          : setState({ currentFriend: "" });
    
        // if (
        //   state.Subject === "" ||
        //   state.selectedUser === null ||
        //   state.StartTime === "" ||
        //   state.Description === "" ||
        //   state.difficulty === -1 ||
        //   state.priority === -1
        // ) {
        //   setButtonDisabled(true);
        // } else {
        //   setButtonDisabled(false);
        // }
      };

      const buttonPressAddFriend = async () => {
        if(state.currentFriend !== auth.user && state.friends.indexOf(state.currentFriend) === -1 )
        {
            let friends = state.friends.concat(state.currentFriend);
            setState({friends: friends});
            friends.forEach(async friend => {
                let data = await fetchTasksForUser(friend.username);
                let stats = calculateStats(data);
                stats.username = friend.username
                setState({friendStats: state.friendStats.concat(stats)});
            });
        } 
      };

    return (
        <Box textAlign='center'>
            <Card style={{ width: "100%", boxShadow: 'none' }}>
                <CardHeader
                    title="Your points displayed"
                    style={{ color: 'black', textAlign: "center" }}
                />
                <div style={{position: "relative"}}>
                <Autocomplete
              data-testid="autocomplete"
              options={state.users.map((usr) => {
                return usr;
              })}
              getOptionLabel={(option) => option.username}
              style={{ width: "20%", left: "10%" }}
              onChange={onChangeFriendSelect}
              value={state.currentFriend}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: 5 }}
                  {...params}
                  label="Users"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
                <Button
              style={{
                marginRight: 50,
                //position: "absolute",
                left: "10px",
                display: "block",
                marginTop: "30px"
              }}
              variant="contained"
              onClick={() => {
                buttonPressAddFriend();
              }}
            >
              Add Friend
            </Button>
            <Typography dangerouslySetInnerHTML={{__html: `Your friends ==&gt; ${state.friendStats.map((stat) => {return " <strong> " + stat.username + "</strong>" + ": " + stat.totalPoints + "points"}) }`}}></Typography>
                </div>
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