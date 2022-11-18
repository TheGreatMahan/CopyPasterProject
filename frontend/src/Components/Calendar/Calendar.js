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
import { extend } from "@syncfusion/ej2-base";
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
import { Card, CardHeader, CardContent } from "@mui/material";
import "../../App.css";


const initialState = {
  snackBarMsg: "",
  contactServer: false,
  data: [],
  scheduleObj: {}
};

function editorTemplate(props) {
  return props !== undefined ? (
    <table
      className="custom-event-editor"
      style={{ width: "100%" }}
      cellPadding={5}
    >
      <tbody>
        <tr>
          <td className="e-textlabel">Name</td>
          <td colSpan={4}>
            <input
              id="name"
              className="e-field e-input"
              type="text"
              name="name"
              style={{ width: "100%" }}
            />
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">Start date</td>
          <td colSpan={4}>
            <DatePickerComponent
              id="StartTime"
              format="dd/MM/yy"
              data-name="StartTime"
              value={new Date(props.startTime || props.StartTime)}
              className="e-field"
            ></DatePickerComponent>
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">Finish date</td>
          <td colSpan={4}>
            <DatePickerComponent
              id="EndTime"
              format="dd/MM/yy"
              data-name="EndTime"
              value={new Date(props.endTime || props.EndTime)}
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
              dataSource={["easy", "normal", "hard", "very hard", "death"]}
            ></DropDownListComponent>
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">Description</td>
          <td colSpan={4}>
            <textarea
              id="description"
              className="e-field e-input"
              name="description"
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

// function eventTemplate(props) {
//   return (<div>
// <div className="name">{props.name}</div>
// <div className="time">
// Time: {this.getTimeString(props.StartTime)} - {this.getTimeString(props.EndTime)}</div>
// </div>);
// }

function Calendar() {

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
  
    React.useEffect(() => {
      updateSampleSection();
      datamanager();
    }, []);
  
    const datamanager = async () => {
      new DataManager({
        adaptor: new GraphQLAdaptor({
          query: `query {tasksforuser(username: "testman3") {_id, name, description, duedate, priority, difficulty, color, completiondate}}`,
          response: {
            result: "tasksforuser",
          },
        }),
        url: "http://localhost:5000/graphql",
      })
        .executeQuery(new Query().take(100))
        .then((e) => {
          let data = e.result;
          data.forEach((task) => {
            let enddate = new Date(task.duedate);
            enddate.setHours(enddate.getHours() + 1);
            task.EndTime = enddate;
            task.StartTime = task.duedate;
            task.Subject = task.name;
            task.Description = task.description;
            //task.StartTime = new Date(task.duedate);
          });
          setState({ data: data });
          console.log(data);
        });
      //   updateSampleSection();
      // }
    }

    // const datamanager = async () => {
    //   new DataManager({
    //     adaptor: new GraphQLAdaptor({
    //       query: `query {calendarfindall {_id, EventID, Subject StartTime, EndTime, CategoryColor}}`,
    //       response: {
    //         result: "calendarfindall",
    //       },
    //     }),
    //     url: "http://localhost:5000/graphql",
    //   })
    //     .executeQuery(new Query().take(100))
    //     .then((e) => {
    //       let data = e.result;
    //       // data.forEach((task) => {
    //       //   task.duedate = new Date(task.duedate);
    //       // });
    //       setState({ data: data });
    //       console.log(data);
    //     });
    //   //   updateSampleSection();
    //   // }
    // }
  
  
  
  
    let scheduleObj;
    // const data = extend([], dataSource.scheduleData, null, true);
  
    function onDragStart(args) {
      args.navigation.enable = true;
    }

  //render() {
    return (
      <Card style={{ maxHeight: "550px", overflow: "auto" }}>
        
//         {//state.data !== null &&
        <div className="schedule-control-section">
           <div className="col-lg-9 control-section">
             <div className="control-wrapper">
               <ScheduleComponent
                height="650px"
                ref={(schedule) => {
                  (scheduleObj = schedule)
                }}
                selectedDate={new Date().toJSON().slice(0, 10).replace(/-/g, "/")}
                eventSettings={{
                  dataSource: state.data,
                  fields: {
                    Id: "_id",
                    Subject: { name: "name" },
                    Description: { name: "description" },
                  },
                }} //, query: query }}
                dragStart={onDragStart.bind(this)}
                editorTemplate={editorTemplate.bind(this)}
                timezone="America/New_York"
              >
                 <ViewsDirective>
                   <ViewDirective option="Month" />
                 </ViewsDirective>
                 <Inject services={[Month]} />
               </ScheduleComponent>
             </div>
           </div>
        </div> }
    </Card> 
    );
  }
    
//}

export default Calendar
