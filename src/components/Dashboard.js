import React, { Component } from "react";
import Loading from "components/Loading";
import Panel from "components/Panel";
import classnames from "classnames";
import axios from "axios";
import { getTotalInterviews, getLeastPopularTimeSlot, getMostPopularDay, getInterviewsPerDay } from "helpers/selectors";


// SUPER FAKE DATA

const data = [
  {
    id: 1, 
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];




class Dashboard extends Component {

  //initial state
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {},
  } 

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if(focused) {
      this.setState({ focused });
    }
   
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.dataa
      });
    })

  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  
  selectPanel(id) {
    this.setState( previousState => ({
       focused: previousState.focused !== null ? null : id
    }));
   } 

  // render
  render() {
    // console.log(this.state)
    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});
    

    if(this.state.loading) {
      return <Loading />; 
    }

    const panels = data
      .filter(
        panel => this.state.focused === null || this.state.focused === panel.id
      )
      .map(panel => (
      <Panel
        key={panel.id}
        // id={panel.id}
        label={panel.label}
        value={panel.getValue(this.state)}
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
