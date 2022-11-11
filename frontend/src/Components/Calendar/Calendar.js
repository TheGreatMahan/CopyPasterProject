import * as React from "react";
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
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { PropertyPane } from "./property-pane";
import dataSource from "./datasource.json";
import {
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import "../../App.css";


function editorTemplate(props) {
  return ((props !== undefined) ? <table className="custom-event-editor" style={{ width: '100%' }} cellPadding={5}><tbody>
    <tr><td className="e-textlabel">Subject</td><td colSpan={4}>
      <input id="Subject" className="e-field e-input" type="text" name="Subject" style={{ width: '100%' }} />
    </td></tr>
    <tr><td className="e-textlabel">Start date</td><td colSpan={4}>
      <DatePickerComponent id="StartTime" format='dd/MM/yy' data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field" readonly ></DatePickerComponent>
    </td></tr>
    <tr><td className="e-textlabel">Finish date</td><td colSpan={4}>
      <DatePickerComponent id="EndTime" format='dd/MM/yy' data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DatePickerComponent>
    </td></tr>
    <tr><td className="e-textlabel">Difficulty</td><td colSpan={4}>
      <DropDownListComponent id="EventType" placeholder='Choose difficulty' data-name='EventType' className="e-field" style={{ width: '100%' }} dataSource={['easy', 'normal', 'hard', 'very hard', 'death']}>
      </DropDownListComponent>
    </td></tr>
    <tr><td className="e-textlabel">Description</td><td colSpan={4}>
      <textarea id="Description" className="e-field e-input" name="Description" rows={2} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
    </td></tr></tbody></table> : <div></div>);
}


function Calendar() {

  React.useEffect(() => {
    updateSampleSection();
  }, []);

  let scheduleObj;
  const data = extend([], dataSource.scheduleData, null, true);

  function onDragStart(args) {
    args.navigation.enable = true;
  }

  return (
    <Card style={{ maxHeight: '550px', overflow: 'auto' }}>
      <div className="schedule-control-section">
        <div className="col-lg-9 control-section">
          <div className="control-wrapper">
            <ScheduleComponent
              height="650px"
              ref={(schedule) => (scheduleObj = schedule)}
              selectedDate={new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
              eventSettings={{ dataSource: data }}
              dragStart={onDragStart.bind(this)}
              editorTemplate={editorTemplate.bind(this)}
            >
              <ViewsDirective>
                <ViewDirective option="Month" />
              </ViewsDirective>
              <Inject services={[Month]} />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    </Card >
  );
}
export default Calendar;