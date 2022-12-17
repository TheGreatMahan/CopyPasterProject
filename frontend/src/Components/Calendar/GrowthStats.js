import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    TextField,
    Autocomplete,
    CardHeader,
    CardContent,
    Typography,
    Tooltip,
  } from "@mui/material";
  import theme from "../../theme";
  import "../../App.css";
  import {useAuth} from "../Auth";
  import { Line } from "react-chartjs-2";

  const GrowthStats = (props) => {
    const initialState = {
      //snackBarMsg: "",
      msg: "",
      contactServer: false,
      advisories: [],
      radioButton: "",
      list: [],
      listForTable: [],
      selectedOption: "",
      isOpen: false,
      openModal: false,
      selectedId: "",
      snackBarMsg: "",
      gotData: false,
      difficulties: ["easy", "normal", "hard", "very hard", "NIGHTMARE"],
      chartData: {}
    };
  
    const auth = useAuth();

    const sendMessageToSnackbar = (msg) => {
        props.dataFromChild(msg);
      };
      const reducer = (state, newState) => ({ ...state, ...newState });
    
      const [state, setState] = useReducer(reducer, initialState);
    
      const GRAPHURL = "http://localhost:5000/graphql";
      //const GRAPHURL = "/graphql";
    
      useEffect(() => {
        displayData
        fetchTasksForUser(auth.user);
      }, []);
    
      const displayData = () => {
        const Data = [
          {
            id: 1,
            year: 2016,
            userGain: 80000,
            userLost: 823
          },
          {
            id: 2,
            year: 2017,
            userGain: 45677,
            userLost: 345
          },
          {
            id: 3,
            year: 2018,
            userGain: 78888,
            userLost: 555
          },
          {
            id: 4,
            year: 2019,
            userGain: 90000,
            userLost: 4555
          },
          {
            id: 5,
            year: 2020,
            userGain: 4300,
            userLost: 234
          }
        ];

        let chartData = {
          labels: Data.map((data) => data.year), 
          datasets: [
            {
              label: "Users Gained ",
              data: Data.map((data) => data.userGain),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        }

        setState({chartData: chartData});
      }
      const fetchTasksForUser = async (user) => {
        try {
          setState({
            contactServer: true,
          });
          sendMessageToSnackbar("Loading tasks");
    
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
          sendMessageToSnackbar(
            `found ${payload.data.tasksforuser.length} tasks for ${user}`
          );
    
          setState({
            listForTable: payload.data.tasksforuser,
          });
    
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
          dateData.forEach((data) => { data.completiondate = data.completiondate.toLocaleDateString()});

          let combinedData = labels.map((label) => { return({completiondate: label, points: 0})});
          combinedData.forEach((obj) => {
            obj.points = dateData.filter((item) => obj.completiondate === item.completiondate)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue.points, 0)});

          let chartData = {
            labels: combinedData.map((data) => data.completiondate), 
            datasets: [
              {
                label: "Dates",
                data: combinedData.map((data) => data.points),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
              }
            ]
          }

          const Data = [
            {
              id: 1,
              year: 2016,
              userGain: 80000,
              userLost: 823
            },
            {
              id: 2,
              year: 2017,
              userGain: 45677,
              userLost: 345
            },
            {
              id: 3,
              year: 2018,
              userGain: 78888,
              userLost: 555
            },
            {
              id: 4,
              year: 2019,
              userGain: 90000,
              userLost: 4555
            },
            {
              id: 5,
              year: 2020,
              userGain: 4300,
              userLost: 234
            }
          ];

          chartData = {
            labels: Data.map((data) => data.year), 
            datasets: [
              {
                label: "Users Gained ",
                data: Data.map((data) => data.userGain),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
              }
            ]
          }

          setState({chartData: chartData});
          return payload.data.tasksforuser;
        } catch (error) {
          console.log(error);
          sendMessageToSnackbar(`Problem loading server data - ${error.message}`);
        }
      };

      return (
        <ThemeProvider theme={theme}>
        <div className="chart-container">
          <h2 style={{ textAlign: "center" }}>Line Chart</h2>
          <Line
            data={state.chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Tasks Completed Per Day"
                },
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
        </ThemeProvider>
      );

};
export default GrowthStats;