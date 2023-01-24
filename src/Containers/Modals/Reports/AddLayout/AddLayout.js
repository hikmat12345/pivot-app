import "./AddLayout.css";

import { API, Storage } from "aws-amplify";
import React, { Component } from "react";

import Dropzone from "react-dropzone";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const uuidv1 = require("uuid/v1");
class AddLayout extends Component {
  constructor() {
    super();
    this.state = {
      add_layout_name: "",
      file: "",
      isLoading: false,
      openMessageModal: false,
      message_heading: '',
      message_desc: '',
      form_errors: {
        add_layout_name: "",
        file: "",
      },
    };
  }

  closeModal = async (name) => {
    this.setState({ [name]: false });
  };

  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("SubmitButton_addLayout").click();
    }
  };

  fileUpload = async (e) => {
    await this.setState({ file: e[0] });
    var x = this.state.file.name;
    var form_errors = this.state.form_errors;
    var y = x.substring(x.length - 3, x.length);
    if (y == "mrt") {
      form_errors.file = "";
    } else {
      form_errors.file = "mrt file type must be selected";
    }
    this.setState({
      form_errors: form_errors,
    });
  };

  insertLayout = async (Filename, Name, tenantguid) => {
    var templateguid = this.props.current_template;
    var Projectid = this.props.Projectid;
    await this.setState({ isLoading: true });
    let newLayout = {
      Filename: Filename,
      Name: Name,
      Projectid: Projectid,
      guid: uuidv1(),
      templateguid: templateguid,
      tenantguid: tenantguid,
    }
    await API.post("pivot", "/editaddlayout", {
      body: newLayout,
    })
      .then((data) => {
        console.log(data);
        // toast.success("File get successfully");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error in file getting",
          message_heading: "File",
          openMessageModal: true,
        })
        // toast.error("Error in file getting")
      });
    // await this.props.getLayouts();
    await this.props.getLayoutsFromReports(newLayout);
    await this.props.setNewLayout(newLayout.guid)
    await this.setState({ add_layout_name: "" });
    await this.setState({ isLoading: false });
    this.props.closeModal();
  };

  onSaveAddLayout = async (e) => {
    e.preventDefault();
    var form_errors = this.state.form_errors;
    await this.setState({ isLoading: true });
    if (this.state.add_layout_name === "") {
      form_errors.add_layout_name = "This Field is Required.";

      this.setState({
        form_errors: form_errors,
      });
    } else if (form_errors.add_layout_name == "") {
      if (form_errors.file == "" && this.state.file && this.state.file != "") {
        var x = this.state.file.name;

        var fla = false;
        var d = new Date();
        var y = x.substring(x.length - 3, x.length);
        var date = d.getTime() + "." + y;

        await Storage.put("pivotReports/" + date, this.state.file)
          .then(async (result) => {

            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Reports",
                "Description": "Add Layout - Name",
                "ProjectName": this.props.currentproject.Name,
                "Projectguid": this.props.currentproject.guid,
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.add_layout_name,
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Reports",
                "Description": "Add Layout - MRT File",
                "ProjectName": this.props.currentproject.Name,
                "Projectguid": this.props.currentproject.guid,
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.file.name,
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);
            fla = true;
          })
          .catch((err) => {
            this.setState({
              message_desc: err,
              message_heading: "Layout",
              openMessageModal: true,
            })
            // toast.error(err);
          });
        let tenantguid = localStorage.getItem("tenantguid");
        await this.insertLayout(date, this.state.add_layout_name, tenantguid);
        // toast.success("Success! Uploaded in s3 bucket");
      } else {
        form_errors.file = "File should be selected";
        this.setState({
          form_errors: form_errors,
        });
      }
    }
    await this.setState({ isLoading: false });
    //  Storage.get("pivotReports/1578656216924.mrt").then(e=>{console.log(e)}).catch(e=>{})
  };

  validateField = (field_name, field_value) => {
    var form_errors = this.state.form_errors;
    switch (field_name) {
      case "add_layout_name":
        if (field_value === "") {
          form_errors.add_layout_name = "This field is required";
        } else {
          form_errors.add_layout_name = "";
        }
        break;
      default:
        break;
    }
  };

  onChangeValue = (e) => {
    var field_name = e.target.name;
    var field_value = e.target.value;
    if (field_name === "add_layout_name") {
      this.setState({
        add_layout_name: field_value,
      });
      this.validateField(field_name, field_value);
    }
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
          className="al_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="al_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 al_form_mx_width">
                    <div className="al_signup_form_main">
                      <div className="al_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={this.props.closeModal}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 al_order-xs-2">
                            <h4>Add Layout</h4>
                          </div>
                          <div className="col-12 col-sm-3 al_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="al_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyDown={this.formSubmitHandler}
                              className="al_signup_form"
                            >
                              <div className="form-group">
                                <label htmlFor="p-name">Layout Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="add_layout_name"
                                  value={this.state.add_layout_name}
                                  name="add_layout_name"
                                  onChange={this.onChangeValue}
                                  placeholder=""
                                />
                                <div className="text-danger error-12">
                                  {this.state.form_errors.add_layout_name !== ""
                                    ? this.state.form_errors.add_layout_name
                                    : ""}
                                </div>
                              </div>

                              <div class="row no-gutters d-flex h-100 input-group mb-2 mt-1">
                                <div className="al_form_upload_message col-12 justify-content-center align-self-center">
                                  <Dropzone onDrop={this.fileUpload}>
                                    {({ getRootProps, getInputProps }) => (
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />

                                        {/* <img
                                      alt="send_msg"
                                      src={attachUserIcPng}
                                      width="23"
                                      height="43"
                                    /> */}
                                        <p>
                                          <img
                                            src="images/download.png"
                                            className="al_upload"
                                            alt="download"
                                          />
                                          &nbsp;&nbsp;Drag and drop or click to
                                          upload new file
                                        </p>
                                      </div>
                                    )}
                                  </Dropzone>
                                  <div className="text-danger error-12">
                                    {this.state.form_errors.file !== ""
                                      ? this.state.form_errors.file
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="al_body">
                                  <button
                                    onClick={this.onSaveAddLayout}
                                    type="button"
                                    className="al_theme_btn"
                                    id="SubmitButton_addLayout"
                                  >
                                    Save
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
          </Modal.Body>
        </Modal>
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

export default AddLayout;
