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
  DragAndDrop, ResourceDirective, ResourcesDirective,
} from "@syncfusion/ej2-react-schedule";
//import "./schedule-component.css";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { extend, L10n } from "@syncfusion/ej2-base";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
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
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import "../../App.css";
import { findByTestId } from "@testing-library/react";
import { useAuth } from "../Auth";


const Calendar = (props) => {
  const initialState = {
    snackBarMsg: "",
    contactServer: false,
    data: [],
    scheduleObj: new ScheduleComponent({
      eventRendered: (args) => {
        let categoryColor = args.data.categoryColor;
        if (!args.element || !categoryColor) {
          return;
        }
        args.element.style.backgroundColor = categoryColor;
      }
    }),
    difficulties: ["easy", "normal", "hard", "very hard", "NIGHTMARE"],
    isTaskComplete: 0, // checkbox bool
    checked: false, // checkbox bool v2
    totalPoints: 0,
    calendarCollections: [
      { CalendarText: 'Red', CalendarId: 1, CalendarColor: '#e61f15' },
      { CalendarText: 'Orange', CalendarId: 2, CalendarColor: '#e68415' },
      { CalendarText: 'Lime Green', CalendarId: 3, CalendarColor: '#73e615' },
      { CalendarText: 'Light Blue', CalendarId: 4, CalendarColor: '#1db9e0' },
      { CalendarText: 'Purple', CalendarId: 5, CalendarColor: '#cd1de0' },
      { CalendarText: 'Magenta', CalendarId: 6, CalendarColor: '#d61596' },
      { CalendarText: 'Pink', CalendarId: 7, CalendarColor: '#ff75df' },
      { CalendarText: 'Forest Green', CalendarId: 8, CalendarColor: '#0f6b28' }
    ],
    priorities: Array.from({ length: 5 }, (x, i) => (i + 1).toString()),
  };

  const auth = useAuth();

  L10n.load({
    "en-US": {
      schedule: {
        saveButton: "Save",
        cancelButton: "Cancel",
        deleteButton: "Remove",
        newEvent: "Add Task",
        editEvent: "Edit Task",
      },
    },
  });

  const GRAPHURL = "http://localhost:5000/graphql";

  const sendMessageToSnackbar = (msg) => {
    props.dataFromChild(msg);
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    datamanager();
  }, []);

  const datamanager = async () => {
    try {
      new DataManager({
        adaptor: new GraphQLAdaptor({
          query: `query {tasksforuser(username: "${auth.user}") {_id, Subject, Description, StartTime, EndTime, priority, difficulty, completiondate, color, completed, points, CalendarId}}`,
          response: {
            result: "tasksforuser",
          },
        }),
        url: "http://localhost:5000/graphql",
      })
        .executeQuery(new Query().take(100))
        .then((e) => {
          let data = e.result;
          data.forEach((task) => {});
          data = data.filter(element =>element.completed !== 1);
          setState({ data: data });
          console.log(data);
        });
    } catch (error) {
      console.log("error fetching tasks");
    }
  };

  const fireAddTask = async (task) => {
    try {
      let query = JSON.stringify({
        query: `mutation {addtask(Subject: "${task.Subject}", username: "${task.username}", priority: ${task.priority} , StartTime: "${task.StartTime}", EndTime: "${task.EndTime}" difficulty: ${task.difficulty}, Description: "${task.Description}", color: "${task.color}", points: ${task.points}, CalendarId: ${task.CalendarId}) {StartTime}}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      console.log("added task on calendar");
      let json = await response.json();
      sendMessageToSnackbar(`Added Task due: ${json.data.addtask.StartTime}`);
      console.log(json);
    } catch (error) {
      sendMessageToSnackbar(`Task not added: ${error}`);
      console.log(error);
    }
    datamanager();
  };

  const updateTask = async (task) => {
    sendMessageToSnackbar(`Updating task for ${task.Subject}`);
    try {
      let query = JSON.stringify({
        query: `mutation {updatetask(_id: "${task.id}", Subject: "${task.Subject}", username: "${task.username}", priority: ${task.priority} , StartTime: "${task.StartTime}",
                EndTime: "${task.EndTime}", difficulty: ${task.difficulty}, Description: "${task.Description}", completiondate: "${task.completiondate}", points: ${task.points}, completed: ${task.completed}, CalendarId: ${task.CalendarId} ) { msg }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      console.log(json);
    } catch (error) {
      console.log('error: ' + error);
    }
    datamanager();
  };

  const deleteTask = async (_id) => {
    sendMessageToSnackbar(`Deleted task for ${state.name}`);
    try {
      let query = JSON.stringify({
        query: `mutation {deletetask(_id: "${_id}" ) { msg }}`,
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      console.log(json);
      sendMessageToSnackbar(`${json.data.deletetask.msg}`);
    } catch (error) {
      sendMessageToSnackbar(`${error.message} - task not deleted`);
    }
    datamanager();
  };


  const onActionBegin = (args) => {
    console.log(args);
    let Data = {};
    if (args.requestType === "eventCreate") {
      let dataObj = args.data[0];

      let subject = dataObj.Subject;
      let difficultyStr = state.difficulties.indexOf(dataObj.difficulty);
      let priority = parseInt(dataObj.priority);
      let description = dataObj.Description;
      let endTime = new Date(dataObj.StartTime);
      endTime.setHours(endTime.getHours() + 1);
      endTime = endTime.toISOString();
      let startTime = new Date(dataObj.StartTime);
      startTime = startTime.toISOString();
      let color = dataObj.task_color;
      let CalendarId = state.calendarCollections.findIndex((obj) => { return obj.CalendarText === dataObj.CalendarId}) + 1;

      console.log(color);

      Data = {
        id: args.data._id,
        Subject: subject,
        username: auth.user,
        priority: priority,
        StartTime: startTime,
        EndTime: endTime,
        completed: 0,
        difficulty: difficultyStr,
        Description: description,
        color: color,
        points: 0,
        CalendarId: CalendarId
      };
      console.log(Data);
      let counterPoints = 0;
      state.data.forEach((task, index) => {
        counterPoints += task.points;
      });
      setState({ totalPoints: counterPoints });
      fireAddTask(Data); 
      //FIXME: here
    }
    if (args.requestType === "eventChange") {
      let subject = args.data.Subject;
      let difficultyStr = state.difficulties.indexOf(args.data.difficulty);
      let priority = parseInt(args.data.priority);
      let description = args.data.Description;
      let endTime = new Date(args.data.StartTime);
      endTime.setHours(endTime.getHours() + 1);
      let startTime = new Date(args.data.StartTime);
      let completiondate = "";
      let CalendarId = state.calendarCollections.findIndex((obj) => { return obj.CalendarText === args.data.CalendarId}) + 1;
      let currentdate = new Date();

      let pointStatus =
        Math.floor(currentdate.getTime()) < Math.floor(startTime.getTime())
          ? 1
          : -1;

      if (args.data.taskState === true) {
        Data = {
          id: args.data._id,
          Subject: subject,
          username: auth.user,
          priority: priority,
          StartTime: startTime.toISOString(),
          EndTime: endTime.toISOString(),
          difficulty: difficultyStr,
          Description: description,
          completed: 1,
          completiondate: currentdate.toISOString(),
          color: "",
          points: pointStatus,
          CalendarId: CalendarId
        };
      }
      if (args.data.taskState === false) {
        Data = {
          id: args.data._id,
          Subject: subject,
          username: auth.user,
          priority: priority,
          StartTime: startTime.toISOString(),
          EndTime: endTime.toISOString(),
          difficulty: difficultyStr,
          Description: description,
          completed: 0,
          completiondate: completiondate,
          color: "",
          points: 0,
          CalendarId: CalendarId
        };
      }

      console.log(Data);
      let counterPoints = 0;
      state.data.forEach((task, index) => {
        counterPoints += task.points;
      });
      setState({ totalPoints: counterPoints });
      updateTask(Data);
    }
    if (args.requestType === "eventRemove") {
      // This block is executed before an appointment remove
      let counterPoints = 0;
      state.data.forEach((task, index) => {
        counterPoints += task.points;
      });
      setState({ totalPoints: counterPoints });
      console.log(state.totalPoints);
      deleteTask(args.data[0]._id);
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
              <DateTimePickerComponent
                id="StartTime"
                format="dd-MM-yyyy hh:mm a"
                data-name="StartTime"
                value={props1.StartTime}
                className="e-field"
                serverTimezoneOffset="-5"
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Difficulty</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="difficulty"
                placeholder="Choose difficulty"
                data-name="difficulty"
                className="e-field"
                style={{ width: "100%" }}
                dataSource={[
                  "easy",
                  "normal",
                  "hard",
                  "very hard",
                  "NIGHTMARE",
                ]}
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
              <DropDownListComponent
                id="priority"
                placeholder="Choose priority"
                data-name="priority"
                className="e-field"
                style={{ width: "100%" }}
                dataSource={state.priorities}
                index={props1.priority - 1}
              ></DropDownListComponent>
            </td>
          </tr>

          <tr>
            <td className="e-textlabel">Colour</td>
            <td colSpan={4}>
              <DropDownListComponent
                id="CalendarId"
                placeholder="Choose colour"
                data-name="CalendarId"
                className="e-field"
                style={{ width: "100%" }}
                dataSource={state.calendarCollections.map((item) => item.CalendarText)}
                index={props1.CalendarId - 1}
              ></DropDownListComponent>
            </td>
          </tr>
            { props1._id !== null && props1._id !== undefined && <tr>
            <td className="e-textlabel">Task complete?</td>
            <td colSpan={1}>
              <CheckBoxComponent
                id="taskState"
                name="taskState"
                className="e-field e-input"
              />
            </td>
          </tr>}
        </tbody>
      </table>
    ) : (
      <div></div>
    );
  }
  function onDragStart(args) {
    args.navigation.enable = true;
  }

  return (
    <Card
      style={{
        height: "551px",
        minHeight: "551px",
        maxHeight: "1000px",
        overflow: "auto",
      }}
    >
      {
        <div className="schedule-control-section">
          <div className="col-lg-9 control-section">
            <div className="control-wrapper">
              <ScheduleComponent
                height="550px"
                ref={(schedule) => {
                  state.scheduleObj = schedule; //FIXME:
                }}
                selectedDate={new Date()
                  .toJSON()
                  .slice(0, 10)
                  .replace(/-/g, "/")}
                eventSettings={{
                  dataSource: state.data,
                }}
                dragStart={onDragStart.bind(this)}
                editorTemplate={editorTemplate.bind(this)}
                timezone="America/New_York"
                showQuickInfo={false}
                actionBegin={onActionBegin.bind(this)}
              >
                 <ResourcesDirective>
                        <ResourceDirective field='CalendarId' title='Calendars' name='Calendars' dataSource={state.calendarCollections} textField='CalendarText' idField='CalendarId' colorField='CalendarColor'>
                        </ResourceDirective>
                      </ResourcesDirective>
                {/* <ResourcesDirective>
                  <ResourceDirective
                      allowMultiple={true}
                      dataSource={state.data}
                      idField="resid"
                      colorField="#FCBA03"
                  />
                </ResourcesDirective> */}
                <Inject
                    services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
                />
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
};

export default Calendar;