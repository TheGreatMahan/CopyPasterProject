// @ts-nocheck

import React, { useReducer, useEffect, useState } from "react";
import { SampleBase } from "./sample-base";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
//import "./schedule-component.css";
import { extend, L10n } from "@syncfusion/ej2-base";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { updateSampleSection } from "./sample-base";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { PropertyPane } from "./property-pane";
import dataSource from "./datasource.json";
import {
  DataManager,
  WebApiAdaptor,
  Query,
  GraphQLAdaptor,
} from "@syncfusion/ej2-data";
import { Card, CardHeader, CardContent, Button, TextField } from "@mui/material";
import "../../App.css";
import { findByTestId } from "@testing-library/react";
import { useAuth } from '../Auth';

// function eventTemplate(props) {
//   return (<div>
// <div className="name">{props.name}</div>
// <div className="time">
// Time: {this.getTimeString(props.StartTime)} - {this.getTimeString(props.EndTime)}</div>
// </div>);
// }

const Calendar = (props) => {

  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    data: [],
    scheduleObj: {},
    difficulties: ["easy", "normal", "hard", "very hard", "NIGHTMARE"]
  };

  const auth = useAuth();

  L10n.load({
    'en-US': {
      'schedule': {
        'saveButton': 'Save',
        'cancelButton': 'Cancel',
        'deleteButton': 'Remove',
        'newEvent': 'Add Task',
        'editEvent': 'Edit Task',
      },
    }
  });

  const GRAPHURL = "http://localhost:5000/graphql";

  // const sendMessageToSnackbar = (msg) => {
  //   props.dataFromChild(msg);
  // };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    datamanager();
  }, []);

  const datamanager = async () => {
    try {
      new DataManager({
        adaptor: new GraphQLAdaptor({
          query: `query {tasksforuser(username: "${auth.user}") {_id, Subject, Description, StartTime, EndTime, priority, difficulty, color, completiondate}}`,
          response: {
            result: "tasksforuser",
          },
        }),
        url: "http://localhost:5000/graphql",
      })
        .executeQuery(new Query().take(100))
        .then((e) => {
          let data = e.result;
          setState({ data: data });
          console.log(data);
        });
    } catch (error) {
      console.log('error fetching tasks');
    }
  }

  const fireAddTask = async (task) => {
    try {
      let query = JSON.stringify({
        query: `mutation {addtask(Subject: "${task.Subject}", username: "${task.username}", priority: ${task.priority} , StartTime: "${task.StartTime}"
                  , completiondate: "${task.completiondate}", EndTime: "${task.EndTime}" difficulty: ${task.difficulty}, Description: "${task.Description}", points: ${task.points} ) {StartTime}}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      //sendMessageToSnackbar(`Added Task due: ${json.data.addtask.duedate}`);
      console.log('added task on calendar');
      let json = await response.json();
      //0941166

      /*setState({
          contactServer: true,
          nameOfTask: "",
          priority: "-1",
          duedate: "",
          difficulty: "-1",
          description: ""
      });
  
       */
    } catch (error) {
      //sendMessageToSnackbar(`Task not added: ${error}`);
      console.log(error);
    }
    datamanager();
  };

  const onActionBegin = (args) => {
    console.log(args);
    if (args.requestType === 'eventCreate') {
        // This block is execute before an appointment create
        let subject = document.getElementById("Subject").value;
        let difficultyStr = document.getElementById("EventType").value;
        let difficultyNumeric = state.difficulties.indexOf(difficultyStr);
        let priority = document.getElementById("Priority").value;
        let description = document.getElementById("Description").value;
        let endTime = document.getElementById('StartTime').value;
        endTime.setHours(endTime.getHours() + 1);

        const Data = {
          Subject: subject,
          username: auth.user,
          priority: priority,
          StartTime: props.StartTime.toISOString(),
          EndTime: endTime,
          difficulty: difficultyNumeric,
          Description: description,
          completiondate: "",
          color: "",
          points: 0,
        }
        fireAddTask(Data); //TODO: Assign payload to some state
      
    }
    if (args.requestType === 'eventChange') {
        // This block is execute before an appointment change
    }
    if(args.requestType === 'eventRemove') {
        // This block is execute before an appointment remove
    }
  };

  function editorTemplate(props1) {
    return props1 !== undefined ? (
      <table
        className="custom-event-editor"
        style={{ width: "100%" }}
        cellPadding={5}
      >
        <tbody>
          <tr>
            <td className="e-textlabel">Subject</td>
            <td colSpan={4}>
              <input
                id="Subject"
                className="e-field e-input"
                type="text"
                name="Subject"
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Due date</td>
            <td colSpan={4}>
              <DatePickerComponent
                id="StartTime"
                format="dd-MM-yyyy hh:mm a"
                data-name="StartTime"
                value={props1.StartTime}
                className="e-field"
                readonly
              ></DatePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Finish date</td>
            <td colSpan={4}>
              <DatePickerComponent
                id="completiondate"
                format="dd-MM-yyyy hh:mm a"
                data-name="completiondate"
                value={props1.completiondate}
                className="e-field"
              ></DatePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Difficulty</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="EventType"
                placeholder="Choose difficulty"
                data-name="EventType"
                className="e-field"
                style={{ width: "100%" }}
                dataSource={["easy", "normal", "hard", "very hard", "NIGHTMARE"]}
                //ref={(scope) => { this.dropDownListObject = scope; }}
                index={props1.difficulty}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Description</td>
            <td colSpan={4}>
              <textarea
                id="Description"
                className="e-field e-input"
                name="Description"
                rows={2}
                cols={50}
                style={{
                  width: "100%",
                  height: "60px !important",
                  resize: "vertical",
                }}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Priority</td>
            <td colSpan={4}>
              <textarea
                id="Priority"
                className="e-field e-input"
                name="Priority"
                rows={2}
                cols={50}
                style={{
                  width: "100%",
                  height: "60px !important",
                  resize: "vertical",
                }}
              ></textarea>
            </td>
          </tr>

        </tbody>
      </table>
    ) : (
      <div></div>
    );
  }

  let scheduleObj;

  function onDragStart(args) {
    args.navigation.enable = true;
  }

  return (
    <Card style={{ height: "551px", minHeight: "551px", maxHeight: "1000px", overflow: "auto" }}>

      {
        <div className="schedule-control-section">
          <div className="col-lg-9 control-section">
            <div className="control-wrapper">
              <ScheduleComponent
                height="550px"
                ref={(schedule) => {
                  (scheduleObj = schedule)
                }}
                selectedDate={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}
                eventSettings={{
                  dataSource: state.data,
                }}
                dragStart={onDragStart.bind(this)}
                editorTemplate={editorTemplate.bind(this)}
                timezone="America/New_York"
                showQuickInfo={false}
                actionBegin={onActionBegin.bind(this)}
              >
                <ViewsDirective>
                  <ViewDirective option="Month" />
                </ViewsDirective>
                <Inject services={[Month]} />
              </ScheduleComponent>
            </div>
          </div>
        </div>
      }
    </Card>
  );
}

export default Calendar