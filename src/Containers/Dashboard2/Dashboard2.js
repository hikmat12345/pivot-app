import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { toast } from "react-toastify";
import { API } from "aws-amplify";

import "./Dashboard2.css";
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      activities: [],
      isLoading: true,
    };
  }

  componentWillMount = () => {
    if (
      this.props.history.location.state &&
      this.props.history.location.state.guid
    ) {
    } else {
      this.props.history.push("/projects");
    }
  };

  componentDidMount = async () => {
    // var y = document.getElementById("undo_img");
    // y.focus();

    // $("#undo_img").focus();

    // tabing code
    // $(document).ready(function () {
    //   $(".dashTwoTabs").keydown(function (v) {
    //     var id = $(this).attr("id");
    //     if (v.keyCode == 13) {
    //       var g = `${id}`;
    //       document.getElementById(g).click();
    //     }
    //   });
    // });
    //  end

    await API.post("pivot", "/getactivities", {
      body: {
        Tenantid: localStorage.getItem("tenantguid"),
      },
    })
      .then(async (data) => {
        // toast.success("Activities successfully retrieved.");
        data = data.sort(function (a, b) {
          var dateA = new Date(a.Datetime), dateB = new Date(b.Datetime);
          return dateB - dateA;
        });
        this.setState({
          activities: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        // toast.error("Activities failed to retrieved.");
        this.setState({
          isLoading: false,
        });
      });
  };

  goToDashboard = () => {
    this.props.history.push("/dashboard", {
      guid: this.props.history.location.state.guid,
      projects: this.props.history.location.state.projects,
      user_type: this.props.history.location.state.user_type,
    });
  };

  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="main-head">
          <div className="row">
            <div className="col-6 col-lg-2 col-md-2 col-sm-4 pl-60-2">
              <a className="navbar-brand " href="#">
                {" "}
                <img
                  src="/images/pivot.png"
                  className="img-fluid float-right"
                  alt="Logo"
                />
              </a>
            </div>
            <div className="col-6 col-lg-8 col-md-7 col-sm-4 text-center">
              <div className="icon-fa text-center">
                {/* <span
                  class="img-fluid fa dashTwoTabs"
                  id="undo_img"
                  tabIndex="1"
                >
                  {" "}
                  <img
                    src="/images/2/Group -56.png"
                    className="img-fluid"
                    alt=""
                  />
                </span>
                <span
                  class="img-fluid fa dashTwoTabs"
                  id="redo_img"
                  tabIndex="2"
                >
                  {" "}
                  <img
                    src="/images/2/Group -55.png"
                    className="img-fluid"
                    alt=""
                  />
                </span> */}
              </div>
            </div>
            <div className="col-12 col-lg-2 col-md-3 col-sm-4">
              <div className=" text-right mt-2">
                <span className="text-white pr-2">Activity Log</span>
                <div
                  onClick={this.goToDashboard}
                  id="closed_dash_two"
                  className="float-right dashTwoTabs"
                >
                  {" "}
                  <span tabIndex="3" className="fa fa-times cros-h"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-table table-responsive  ">
          <table className="scroll table dash-table">
            <thead className="">
              <tr>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>User</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Date Time</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Module</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Description</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Project Name</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Reference</th>
                <th style={{ width: "150px", fontSize: "9px", textAlign: "center" }}>Value From</th>
                <th style={{ width: "350px", fontSize: "9px", textAlign: "center" }}>Value To</th>
              </tr>
            </thead>
            <tbody id="table_height">
              {this.state.activities.map((activity, index) => {
                const date = new Date(activity.Datetime);
                const dateTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
                  date.getHours() + ":" + ( date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() );
                return (
                  <tr key={index} class="bg-b gray_row">
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.User !== null ? activity.User : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{dateTime !== null ? dateTime : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.Module !== null ? activity.Module : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.Description !== null ? activity.Description : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.ProjectName !== null ? activity.ProjectName : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.ColumnName !== null ? activity.ColumnName : ""}</td>
                    <td style={{ width: "150px", fontSize: "9px", textAlign: "left" }}>{activity.ValueFrom !== null ? activity.ValueFrom : ""}</td>
                    <td style={{ display: "block", width: "350px", fontSize: "9px", textAlign: "left" }}>{activity.ValueTo !== null ? activity.ValueTo.toString() : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
