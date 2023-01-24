import "./ReportsMain.css";

import { API, JS, Storage } from "aws-amplify";
import React, { Component } from "react";

import $ from "jquery";
import AddLayoutModal from "../AddLayout/AddLayout";
import EditLayoutModal from "../EditLayout/EditLayout";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const uuidv1 = require("uuid/v1");
class ReportsMain extends Component {
  constructor() {
    super();
    this.state = {
      openAddLayoutModal: false,
      openEditLayoutModal: false,
      isLoading: false,
      layouts: [],
      guid: null,
      select_layout: "",
      select_template: "",
      select_level: "",
      report_title: "",
      counter: 1,
      header_notes: "",
      footer_notes: "",
      required_messages: [],
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      displayLayoutEditButton: true,
      form_errors: {
        select_layout: "",
        select_template: "",
        select_level: "",
        report_title: "",
        header_notes: "",
        footer_notes: "",
      },
    };
  }

  componentWillReceiveProps = async () => {
    await this.setState({
      //select_template:this.props.current_template,
      layouts: this.props.layouts,
    });

    if (this.props.reportdata !== null && this.props.reportdata.length > 0) {
      let layout = this.props.layouts.find(layout => layout.guid === this.props.reportdata[0].LayoutGuid)
      await this.setState({
        guid: this.props.reportdata[0].guid,
        select_layout: this.props.reportdata[0] && this.props.reportdata[0].LayoutGuid ? this.props.reportdata[0].LayoutGuid : "",
        displayLayoutEditButton: layout && layout.tenantguid === "SYSTEM" ? (this.props.user.tenantguid === "SYSTEM" ? true : false) : true,
        select_template: this.props.reportdata[0].Template,
        select_level: this.props.reportdata[0].Level,
        report_title: this.props.reportdata[0].Title,
        header_notes: this.props.reportdata[0].HeaderNote,
        footer_notes: this.props.reportdata[0].FooterNote,
      });
    } else {
      await this.clearStates();
      var messages = JSON.parse(localStorage.getItem("RequiredMessages"));

      await this.setState({
        required_messages: messages,
        select_template: this.props.current_template,
      });
    }

    // tabing code
    $(document).ready(function () {
      $("#add_layout").keydown(function (v) {
        if (v.shiftKey) {
          v.preventDefault();
          if (v.keyCode == 9) {
            document.getElementById("select_layout_report").focus();
          }
        } else if (v.keyCode == 13) {
          $("#add_layout").click();
        }
      });
      $("#select_layout_report").keydown(function (v) {
        if (v.keyCode == 9) {
          v.preventDefault();
          $("#add_layout").focus();
        }
      });
      $("#goToEditDropList").keydown(function (c) {
        if (c.shiftKey) {
          c.preventDefault();
          if (c.keyCode == 9) {
            document.getElementById("edit_layout").focus();
          }
        }
      });
      $("#edit_layout").keydown(function (x) {
        if (x.shiftKey) {
          x.preventDefault();
          if (x.keyCode == 9) {
            document.getElementById("add_layout").focus();
          }
        } else if (x.keyCode == 9) {
          x.preventDefault();
          $("#goToEditDropList").focus();
        } else if (x.keyCode == 13) {
          $("#edit_layout").click();
        }
      });
    });
    //  end
  };

  openModal = (name) => {
    if (name === "openAddLayoutModal") {
      this.setState({ openAddLayoutModal: true });
      $(document).ready(function () {
        $(this).find("#add_layout_name").focus();
      });
    } else if (name === "openEditLayoutModal") {
      if (this.state.select_layout !== "") {
        this.setState({ openEditLayoutModal: true });
        $(document).ready(function () {
          $(this).find("#edit_layout_name").focus();
        });
      } else {
        this.state.required_messages.map((e) =>
          e.ID == 11
            ? this.setState({
              message_desc: "Please select Template first",
              message_heading: "Select Template",
              openMessageModal: true,
            })
            : ""
        );
        // toast.error('Select Template first');
        return false;
      }
    }

    this.setState({ [name]: true });
  };

  closeModal = async (name) => {
    if (name === "deleteModalIsOpenNow") {
      //when delete modal open then we need to close Edit modal and Reaport Main modal
      this.props.closeModal(); //to close main Report Modal
      this.setState({
        openEditLayoutModal: false,
        select_layout: "",
        layouts: [], //to close Edit Modal
      });
    } else if (name == "openReportsModal") {
      this.props.closeModal();
      this.clearStates();
    } else {
      //when user not open delete modal then it works in the same way as others are working
      await this.setState({ [name]: false });
    }
  };

  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      if ($("#edit_layout").is(":focus")) {
      } else {
        document.getElementById("SubmitButton_Report").click();
      }
    } else if (e.keyCode == 27) {
      this.setState({ counter: 1 });
      this.clearStates();
    }
  };

  createReportHandler = async (e) => {
    e.preventDefault();
    var form_errors = this.state.form_errors;
    if (this.state.select_layout === "") {
      form_errors.select_layout = "This Field is Required.";
      $("#rTempValid2").addClass("mb-0");
    }
    if (this.state.select_template === "") {
      form_errors.select_template = "This Field is Required.";
      $("#rTempValid1").addClass("mb-0");
    }
    if (this.state.select_level === "") {
      form_errors.select_level = "This Field is Required.";
      $("#rTempValid3").addClass("mb-0");
    }
    // if (this.state.report_title === "") {
    //   form_errors.report_title = "This Field is Required.";
    // }
    // if (this.state.header_notes === "") {
    //   form_errors.header_notes = "This Field is Required.";
    // }
    // if (this.state.footer_notes === "") {
    //   form_errors.footer_notes = "This Field is Required.";
    // }
    this.setState({
      form_errors: form_errors,
    });
    if (
      form_errors.select_layout == "" &&
      form_errors.select_template == "" &&
      form_errors.select_level == "" &&
      form_errors.report_title == "" &&
      form_errors.header_notes == "" &&
      form_errors.footer_notes == ""
    ) {
      this.setState({ isLoading: true });
      let tenant_guid = localStorage.getItem("tenantguid");
      let user_guid = localStorage.getItem("guid");
      await API.post("pivot", "/addreports", {
        body: {
          FooterNote: this.state.footer_notes,
          HeaderNote: this.state.header_notes,
          Hide: false,
          LayoutGuid: this.state.select_layout,
          Level: this.state.select_level,
          Template: this.state.select_template,
          Report: "Standard",
          TenantGuid: tenant_guid,
          Title: this.state.report_title,
          UserID: user_guid,
          guid: this.state.guid !== null ? this.state.guid : uuidv1(),
          Projectid: this.props.currentproject.guid,
        },
      })
        .then(async (data) => {
          let previousTemplateGuid = this.props.reportdata && this.props.reportdata[0] && this.props.reportdata[0].Template ? this.props.reportdata[0].Template : "";
          let previousTemplateName = "";
          if (previousTemplateGuid) {
            previousTemplateName = this.props.template_list.find(template => template.guid === previousTemplateGuid);
            previousTemplateName = previousTemplateName ? previousTemplateName.TemplateName : "";
          }

          let previousLayoutGuid = this.props.reportdata && this.props.reportdata[0] && this.props.reportdata[0].LayoutGuid ? this.props.reportdata[0].LayoutGuid : "";
          let previousLayoutName = "";
          if (previousLayoutGuid) {
            previousLayoutName = this.props.layouts.find(layout => layout.guid === previousLayoutGuid);
            previousLayoutName = previousLayoutName ? previousLayoutName.Name : "";
          }

          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Template",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": previousTemplateName,
              "ValueTo": this.props.template_list.find(template => template.guid === this.state.select_template) ?
                this.props.template_list.find(template => template.guid === this.state.select_template).TemplateName :
                "",
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Layout",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": previousLayoutName,
              "ValueTo": this.props.layouts.find(layout => layout.guid === this.state.select_layout) ?
                this.props.layouts.find(layout => layout.guid === this.state.select_layout).Name :
                "",
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Level",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.reportdata && this.props.reportdata.length > 0 ? this.props.reportdata[0].Level : "",
              "ValueTo": this.state.select_level,
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Report Title",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.reportdata && this.props.reportdata.length > 0 ? this.props.reportdata[0].Title : "",
              "ValueTo": this.state.report_title,
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Header Notes",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.reportdata && this.props.reportdata.length > 0 ? this.props.reportdata[0].HeaderNote : "",
              "ValueTo": this.state.header_notes,
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Reports",
              "Description": "Footer Notes",
              "ProjectName": this.props.currentproject.Name,
              "Projectguid": this.props.currentproject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.reportdata && this.props.reportdata.length > 0 ? this.props.reportdata[0].FooterNote : "",
              "ValueTo": this.state.footer_notes,
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);
          let reportData = {
            Template: this.props.template_list.find(template => template.guid === this.state.select_template) ?
              this.props.template_list.find(template => template.guid === this.state.select_template).TemplateName :
              "",
            LayoutGuid: this.props.layouts.find(layout => layout.guid === this.state.select_layout) ?
              this.props.layouts.find(layout => layout.guid === this.state.select_layout).Name :
              "",
            Level: this.state.select_level,
            Title: this.state.report_title,
            HeaderNote: this.state.header_notes,
            FooterNote: this.state.footer_notes
          }
          await this.props.generatereport(this.state.select_template, reportData);
          await this.clearStates();
          this.props.closeModal();
        })
        .catch((err) => {
          console.log("xxxxxxxxxxxxxxxxxxx There is an Error while adding Report - ", err)
          this.setState({
            message_desc: "There is an Error while adding Report",
            message_heading: "Report",
            openMessageModal: true,
          })
          // toast.error("There is an Error while adding Report");
        });
      this.setState({ isLoading: false });
    }
  };

  glayouts = async () => {
    await this.props.getLayouts();
  };

  setNewLayout = (layoutGuid) => {
    this.setState({
      select_layout: layoutGuid
    })
  }

  validateField = (field_name, field_value) => {
    var form_errors = this.state.form_errors;
    switch (field_name) {
      case "select_layout":
        if (field_value === "") {
          form_errors.select_layout = "This field is required";
        } else {
          form_errors.select_layout = "";
          $("#rTempValid2").removeClass("mb-0");
        }
        break;
      case "select_template":
        if (field_value === "") {
          form_errors.select_template = "This field is required";
        } else {
          form_errors.select_template = "";
          $("#rTempValid1").removeClass("mb-0");
        }
        break;
      case "select_level":
        if (field_value === "") {
          form_errors.select_level = "This field is required";
        } else {
          form_errors.select_level = "";
          $("#rTempValid3").removeClass("mb-0");
        }
        break;
      // case "report_title":
      //   if (field_value === "") {
      //     form_errors.report_title = "This field is required";
      //   } else {
      //     form_errors.report_title = "";
      //   }
      //   break;
      // case "header_notes":
      //   if (field_value === "") {
      //     form_errors.header_notes = "This field is required";
      //   } else {
      //     form_errors.header_notes = "";
      //   }
      //   break;
      // case "footer_notes":
      //   if (field_value === "") {
      //     form_errors.footer_notes = "This field is required";
      //   } else {
      //     form_errors.footer_notes = "";
      //   }
      //   break;
      default:
        break;
    }
    this.setState({
      form_errors: form_errors,
    });
  };

  onChangeValue = async (e) => {
    let field_name = e.target.name;
    let field_value = e.target.value;
    let { select_layout } = this.state;
    // console.log(field_value, "fields value");
    if (field_name === "select_layout") {
      let layout = this.props.layouts.find(layout => layout.guid === field_value)
      console.log("xxxxxxxxxxxxxxxxxxxxxx Selected Layout Tenant: ", layout ? layout.tenantguid : undefined)
      console.log(this.props.user ? "xxxxxxxxxxxxxxxxxxxxxx User Type: " + this.props.user.type + ", User TenantGuid: " + this.props.user.tenantguid : undefined)

      this.setState({
        select_layout: field_value,
        displayLayoutEditButton: layout && layout.tenantguid === "SYSTEM" ? (this.props.user.tenantguid === "SYSTEM" ? true : false) : true,
      });
      this.validateField(field_name, field_value);
    }
    if (field_name === "select_template") {
      if (field_value !== "") {
        await this.props.getReportdata(field_value);
        if(this.props.reportdata[0]) {
          select_layout = this.props.reportdata[0].LayoutGuid;
        } else {
          select_layout = "";
        }

        await this.setState({
          select_template: field_value,
          select_layout
        });
        await this.validateField(field_name, field_value);
      }
    }
    if (field_name === "select_level") {
      this.setState({
        select_level: field_value,
      });
      this.validateField(field_name, field_value);
    }
    if (field_name === "report_title") {
      this.setState({
        report_title: field_value,
      });
      this.validateField(field_name, field_value);
    }
    if (field_name === "header_notes") {
      this.setState({
        header_notes: field_value,
      });
      this.validateField(field_name, field_value);
    }
    if (field_name === "footer_notes") {
      this.setState({
        footer_notes: field_value,
      });
      this.validateField(field_name, field_value);
    }
    // console.log('field_name====>',field_name,'field_value====>',field_value)
  };

  toAddLayout = (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      if (e.keyCode == 9) {
        document.getElementById("api-pass").focus();
      }
    } else if (e.keyCode == 9) {
      e.preventDefault();
      $("#add_layout").focus();
    }
  };

  backToEdit = (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      if (e.keyCode == 9) {
        $("#add_layout").focus();
      }
    }
  };

  clearStates = async () => {
    await this.setState({
      layouts: [],
      guid: null,
      select_layout: "",
      //select_template: "",
      select_level: "",
      report_title: "",
      counter: 1,
      header_notes: "",
      footer_notes: "",
      required_messages: [],
      form_errors: {
        select_layout: "",
        select_template: "",
        select_level: "",
        report_title: "",
        header_notes: "",
        footer_notes: "",
      },
    });
  };

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
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className={
            this.state.openAddLayoutModal || this.state.openEditLayoutModal
              ? "rm_modal modal-backdrop"
              : "rm_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="rm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center rm_form_mx_width">
                    <div className="rm_signup_form_main">
                      <div className="rm_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={() => this.closeModal("openReportsModal")}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 rm_order-xs-2">
                            <h4>Reports</h4>
                          </div>
                          <div className="col-12 col-sm-3 rm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="rm_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyUp={this.formSubmitHandler}
                              className="rm_signup_form"
                            >
                              <div
                                class="form-group rm_select"
                                id="rTempValid1"
                              >
                                <label>Template</label>
                                <select
                                  onKeyDown={(e) => this.backToEdit(e)}
                                  id="select_layout_report"
                                  class="form-control rm_custom_select"
                                  value={this.state.select_template}
                                  name="select_template"
                                  onChange={this.onChangeValue}
                                >
                                  <option value="" defaultValue>
                                    Select
                                  </option>
                                  {this.props.template_list &&
                                    this.props.template_list.length > 0
                                    ? this.props.template_list.map((tl) => (
                                      <option value={tl.guid}>
                                        {tl.TemplateName}
                                      </option>
                                    ))
                                    : ""}
                                </select>
                                <span className="rm_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12">
                                {this.state.form_errors.select_template !== ""
                                  ? this.state.form_errors.select_template
                                  : ""}
                              </div>
                              <div
                                class="form-group rm_select"
                                id="rTempValid2"
                              >
                                <div className="form-group text-right rm_aai">
                                  {
                                    this.state.displayLayoutEditButton &&
                                    <img
                                      id="edit_layout"
                                      tabIndex="992"
                                      onClick={() =>
                                        this.openModal("openEditLayoutModal")
                                      }
                                      alt="edit"
                                      src="/images/p2.png"
                                      class="img-fluid float-right mr-2 point-c font_18"
                                    />
                                  }
                                  <img
                                    id="add_layout"
                                    tabIndex="991"
                                    onClick={() =>
                                      this.openModal("openAddLayoutModal")
                                    }
                                    alt="add"
                                    src="/images/p3.png"
                                    class="img-fluid float-right mr-2 point-c font_18"
                                  />
                                </div>
                                <label>Layout</label>
                                <select
                                  class="form-control rm_custom_select"
                                  value={this.state.select_layout}
                                  id="goToEditDropList"
                                  name="select_layout"
                                  onChange={this.onChangeValue}
                                >
                                  <option value="" defaultValue>
                                    Select
                                  </option>

                                  {this.props.layouts &&
                                    this.props.layouts.length > 0
                                    ? this.props.layouts.map((v) => (
                                      <option value={v.guid}>{v.Name}</option>
                                    ))
                                    : ""}
                                </select>

                                <span className="rm_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12">
                                {this.state.form_errors.select_layout !== ""
                                  ? this.state.form_errors.select_layout
                                  : ""}
                              </div>

                              <div
                                class="form-group rm_select"
                                id="rTempValid3"
                              >
                                <label>Level</label>
                                <select
                                  class="form-control rm_custom_select"
                                  value={this.state.select_level}
                                  name="select_level"
                                  onChange={this.onChangeValue}
                                >
                                  <option value="" defaultValue>
                                    Select
                                  </option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                </select>

                                <span className="rm_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12">
                                {this.state.form_errors.select_level !== ""
                                  ? this.state.form_errors.select_level
                                  : ""}
                              </div>

                              <div className="form-group">
                                <label htmlFor="URL">Report Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="URL"
                                  value={this.state.report_title}
                                  name="report_title"
                                  onChange={this.onChangeValue}
                                />
                                <div className="text-danger error-12">
                                  {this.state.form_errors.report_title !== ""
                                    ? this.state.form_errors.report_title
                                    : ""}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="key">Header Notes</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="key"
                                  value={this.state.header_notes}
                                  name="header_notes"
                                  onChange={this.onChangeValue}
                                />
                                <div className="text-danger error-12">
                                  {this.state.form_errors.header_notes !== ""
                                    ? this.state.form_errors.header_notes
                                    : ""}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="api-pass">Footer Notes</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="api-pass"
                                  value={this.state.footer_notes}
                                  name="footer_notes"
                                  onChange={this.onChangeValue}
                                />
                                <div className="text-danger error-12">
                                  {this.state.form_errors.footer_notes !== ""
                                    ? this.state.form_errors.footer_notes
                                    : ""}
                                </div>
                              </div>

                              <div className="rm_signup_body">
                                <div className="col-12">
                                  <div className="rm_body">
                                    <button
                                      type="button"
                                      onKeyDown={(e) => this.toAddLayout(e)}
                                      onClick={this.createReportHandler}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }
                                      }}
                                      onKeyUp={(e) => {
                                        if (e.keyCode === 13) {
                                          e.stopPropagation();
                                          this.createReportHandler(e);
                                        }
                                      }}
                                      className="rm_theme_btn"
                                      id="SubmitButton_Report"
                                    >
                                      Create
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
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <AddLayoutModal
          currentproject={this.props.currentproject}
          Projectid={this.props.currentproject.guid}
          openModal={this.state.openAddLayoutModal}
          current_template={this.props.current_template}
          getLayouts={this.glayouts}
          getLayoutsFromReports={this.props.getLayoutsFromReports}
          closeModal={() => this.closeModal("openAddLayoutModal")}
          setNewLayout={this.setNewLayout}
        />

        <EditLayoutModal
          currentproject={this.props.currentproject}
          Projectid={this.props.currentproject.guid}
          openModal={this.state.openEditLayoutModal}
          guid={this.state.select_layout}
          layouts={this.props.layouts}
          getLayouts={this.glayouts}
          getLayoutsFromReports={this.props.getLayoutsFromReports}
          closeModal={this.closeModal}
          current_template={this.props.current_template}
          editCloseModal={this.closeModal}
        />
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    );
  }
}

export default ReportsMain;
