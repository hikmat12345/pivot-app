import "./ApplyGroup.css";

import React, { Component } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import Message from "../../Modals/message/message";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

class ApplyGroup extends Component {
  constructor() {
    super();
    this.state = {
      checkall: false,
      check: false,
      groupData: [],
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
    };
  }

  componentWillReceiveProps = async () => {
    if (this.props.getGroupsData.length > 0) {
      var v = this.props.getGroupsData;

      v.map(e => {
        e.checkbox = false
      })
      await this.setState({
        groupData: v,
        groupsLength: this.props.getGroupsData.length
      })
    }
    if (this.props.gvalue) {
      var x = "";
      console.log(this.props.gvalue)
      this.state.groupData.map(u => {
        u.checkbox = false
      })
      await this.setState({ groupData: this.state.groupData })
      var arr = this.props.gvalue.split(',');
      var temparr = JSON.parse(JSON.stringify(arr));
      var count = this.props.checkcount;
      arr.map(e => {
        var x = this.state.groupData.find(u => u.Code == e);
        if (x) {
          var y = temparr.filter(r => r == x.Code);

          if (y.length == count) {
            console.log("in all row s")

            if (x) {
              x.checkbox = true;
              x.colorflag = ""
            }
          }
          else {
            if (x) {
              x.checkbox = true;
              x.colorflag = "undo"
            }
          }
        }
      })
      await this.setState({ groupData: this.state.groupData })

    }
    else if (this.props.gvalue == "") {
      // console.log("wrp == else")
      var x = this.state.groupData;
      x.map(u => {
        u.checkbox = false
        // console.log("wrp == false")
      })
      await this.setState({ groupData: x })
    }
  }

  closeModal = name => {
    this.setState({
      openMessageModal: false
    });
  };

  selectAll = async (e) => {
    var x = this.state.groupData;
    var y = e.target.checked;
    await this.setState({ checkall: e.target.checked })
    if (x.length > 0) {
      x.map(ee => {
        ee.checkbox = y;
        ee.colorflag = y === true ? "" : "undo"
      })
      await this.setState({ groupData: x })
    }
  }

  checkHandler = async (e) => {
    var name = e.target.name;
    var value = e.target.checked;
    var x = this.state.groupData;
    x.map(e => {
      if (e.guid == name) {
        e.checkbox = value
        e.colorflag = value === true ? "" : "undo"
      }
    })
    await this.setState({ groupData: x })
  }

  apply = async () => {
    var DarkBlueGroup = this.state.groupData.filter(j => j.colorflag == "" && j.checkbox === true)
    var UncheckedGroup = this.state.groupData.filter(j => j.checkbox === false)
    let oldGroups = [];
    this.props.getGroupsData.map(j => {
      if (j.checkbox) {
        oldGroups.push(j.Code);
      }
    });

    var data = DarkBlueGroup;
    var datafalse = UncheckedGroup;
    var final_code = "";
    data.map((d, i) => {
      if (final_code == "") {
        final_code = d.Code
      } else {
        final_code = final_code + "," + d.Code;
      }
    })

    var final_UnChecked = "";
    datafalse.map((d, i) => {
      if (final_UnChecked == "") {
        final_UnChecked = d.Code
      } else {
        final_UnChecked = final_UnChecked + "," + d.Code;
      }
    });

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Icons",
        "Description": "Apply Group",
        "ProjectName": this.props.selectedProject.Name,
        "Projectguid": this.props.selectedProject.guid,
        "ColumnName": "",
        "ValueFrom": oldGroups.toString(),
        "ValueTo": final_code,
        "Tenantid": localStorage.getItem('tenantguid')
      }
    ]);

    this.props.closeModal();
    await this.props.getGroupCheckedValue(final_code, final_UnChecked);
    await this.props.updateGroupsHelper();
    await this.props.redRowHandler();

    this.state.groupData.map(u => {

      u.checkbox = false

    })
    this.setState({ groupData: this.state.groupData })




  }

  activityRecord = async (finalarray) => {
    await API.post("pivot", "/addactivities", {
      body: {
        activities: finalarray
      }
    })
      .then(async data => {
        // toast.success('Activity successfully recorded.')
      })
      .catch(err => {
        this.setState({
          message_desc: "Activity failed to record.",
          message_heading: "Activity",
          openMessageModal: true,
        })
        // toast.error('Activity failed to record.')
      });
  }
  
  render() {
    let groupData = this.state.groupData.sort(function (a, b) {
      if(!(a.Code && b.Code)) return 0;
      var nameA = a.Code.toUpperCase()
      var nameB = b.Code.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      // names must be equal
      return 0
    })
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="agm_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="agm_main_wrapper pxl-5">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center agm_form_mx_width">
                  <div className="agm_signup_form_main"
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      e.stopPropagation();
                      this.apply()
                    }
                  }}
                  >
                    <div className="agm_signup_header">
                      <div className="row">
                        <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 agm_order-xs-2">
                          <h4>Apply Groups</h4>
                          <span>{this.props.checkcount} Row(s) Selected</span>
                        </div>
                        <div className="col-12 col-sm-3 agm_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="agm_signup_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="agm_project_scroll">
                            <table className="table table-striped table-sm table-responsive agm_fixed_headers">
                              <thead>
                                <tr>
                                  <th scope="col">
                                    <label className="agm_container agm_remember">
                                      <input
                                        type="checkbox"
                                        name="type"
                                        onClick={this.selectAll}
                                        checked={this.state.checkall}
                                      />
                                      <span className="agm_checkmark header_checkBox"></span>
                                    </label>
                                  </th>
                                  <th scope="col">Code</th>
                                  <th scope="col">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {groupData.length > 0 ?
                                  groupData.map(u => (
                                    <tr>
                                      <th scope="row">
                                        <label className={u.colorflag ? "agm_container agm_remember " + `${u.colorflag}` : "agm_container agm_remember"}>
                                          <input type="checkbox" name={u.guid} checked={u.checkbox} onChange={this.checkHandler} />
                                          <span className="agm_checkmark"></span>
                                        </label>
                                      </th>
                                      <td>{u.Code}</td>
                                      <td>{u.Description}</td>
                                    </tr>

                                  )

                                  )

                                  : "no groups"}
                              </tbody>
                            </table>
                            {/* <div class="form-group agm_select">
                          <div className="row no-gutters">
                            <div className="col-12 col-md-3">
                              <label>Type:</label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">Owner
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">Edit
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">View
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div> */}
                            <div className="clearfix"></div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-center border-top">
                            <button
                                id="apply_group_btn"
                              type="button"
                              onClick={this.apply}
                              onKeyDown={(e) => { if (e.keyCode === 13) { e.preventDefault(); e.stopPropagation() } }}
                              onKeyUp={(e) => {
                                if (e.keyCode === 13) {
                                  e.stopPropagation();
                                  this.apply()
                                }
                              }}
                              className="agm_theme_btn"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </Modal>
    );
  }
}

export default ApplyGroup;
