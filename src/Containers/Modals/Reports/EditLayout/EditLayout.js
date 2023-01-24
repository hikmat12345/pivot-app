import "./EditLayout.css";

import { API, JS, Storage } from "aws-amplify";
import React, { Component } from "react";

import DeleteModal from "../Delete/Delete";
import Dropzone from "react-dropzone";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

class EditLayout extends Component {
  constructor() {
    super();
    this.state = {
      openDeleteModal: false,
      guid: "",
      isLoading: false,
      edit_layout_name: "",
      oldfile: "",
      newfile: "",
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      form_errors: {
        edit_layout_name: "",
        file: "",
      },
    };
  }

  componentWillReceiveProps = async () => {
    if (this.props.guid) {
      var layout = this.props.layouts.find((u) => u.guid == this.props.guid);

      if (layout) {
        await this.setState({
          edit_layout_name: layout.Name,
          guid: layout.guid,
          oldfile: layout.Filename,
        });
      }
    }
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = async (name) => {
    this.setState({ [name]: false });
    await this.setState({ guid: "", edit_layout_name: "" });
  };

  closeModalwithoutdelete = async (name) => {
    this.setState({ [name]: false });
  };

  openDeleteModal = () => {
    if (this.state.guid) {
      this.openModal("openDeleteModal");
      //  this.props.closeModal("deleteModalIsOpenNow");
    } else {
      this.setState({
        message_desc: "Please select layout to delete",
        message_heading: "Layout",
        openMessageModal: true,
      })
      // toast.error("please select layout to delete");
    }
  };

  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("SubmitButton_editLayout").click();
    }
  };

  editLayout = async (guid, Filename, Name, tenantguid) => {
    var templateguid = this.props.current_template;
    var Projectid = this.props.Projectid;

    await API.post("pivot", "/editaddlayout", {
      body: {
        guid,
        Filename,
        Name,
        tenantguid,
        templateguid,
        Projectid,
      },
    })
      .then((data) => {
        console.log(data);
        // toast.success("File get successfully");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error in file editing",
          message_heading: "File",
          openMessageModal: true,
        })
        // toast.error("Error in file editing")
      });

    await this.props.getLayouts();
    this.setState({ guid: "", edit_layout_name: "", oldfile: "", newfile: "" });
    this.props.closeModal("openEditLayoutModal");
  };

  onSaveEditHandler = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    let dateTime = new Date().getTime();
    let layout = this.props.layouts.find((u) => u.guid == this.props.guid);
    this.activityRecord([
      {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Reports",
        "Description": "Edit Layout - Name",
        "ProjectName": this.props.currentproject.Name,
        "Projectguid": this.props.currentproject.guid,
        "ColumnName": "",
        "ValueFrom": JSON.parse(JSON.stringify(layout ? layout.Name : "")),
        "ValueTo": this.state.edit_layout_name,
        "Tenantid": localStorage.getItem('tenantguid')
      }, {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Reports",
        "Description": "Edit Layout - MRT File",
        "ProjectName": this.props.currentproject.Name,
        "Projectguid": this.props.currentproject.guid,
        "ColumnName": "",
        "ValueFrom": JSON.parse(JSON.stringify(layout ? layout.Filename : "")),
        "ValueTo": this.state.newfile ? this.state.newfile.name : "",
        "Tenantid": localStorage.getItem('tenantguid')
      }
    ]);

    let tenantguid = localStorage.getItem("tenantguid");
    var guid = this.state.guid;
    var form_errors = this.state.form_errors;
    if (this.state.edit_layout_name === "") {
      form_errors.edit_layout_name = "This Field is Required.";
    }
    this.setState({
      form_errors: form_errors,
    });
    if (form_errors.edit_layout_name == "") {
      if (this.state.newfile && form_errors.file == "") {
        var x = this.state.newfile.name;

        var fla = false;
        var d = new Date();
        var y = x.substring(x.length - 3, x.length);
        var date = d.getTime() + "." + y;

        await Storage.put("pivotReports/" + date, this.state.newfile)
          .then(async (result) => {
            fla = true;

            // toast.success("Success! Uploaded in s3 bucket");
          })
          .catch((err) => {
            this.setState({
              message_desc: err,
              message_heading: "Layout",
              openMessageModal: true,
            })
            // toast.error(err);
          });

        await this.editLayout(
          guid,
          date,
          this.state.edit_layout_name,
          tenantguid
        );
      } else if (!this.state.newfile && this.state.oldfile) {
        await this.editLayout(
          guid,
          this.state.oldfile,
          this.state.edit_layout_name,
          tenantguid
        );
      }
    }
    this.setState({ isLoading: false });
  };

  validateField = (field_name, field_value) => {
    var form_errors = this.state.form_errors;
    switch (field_name) {
      case "edit_layout_name":
        if (field_value === "") {
          form_errors.edit_layout_name = "This field is required";
        } else {
          form_errors.edit_layout_name = "";
        }
        break;
      default:
        break;
    }
  };

  onChangeValue = (e) => {
    var field_name = e.target.name;
    var field_value = e.target.value;
    if (field_name === "edit_layout_name") {
      this.setState({
        edit_layout_name: field_value,
      });
      this.validateField(field_name, field_value);
    }
  };

  fileUpload = async (e) => {
    var x = e[0].name;
    var form_errors = this.state.form_errors;
    var y = x.substring(x.length - 3, x.length);
    if (y == "mrt") {
      form_errors.file = "";
      await this.setState({ newfile: e[0] });
    } else {
      form_errors.file = "mrt file type must be selected";
    }
    this.setState({
      form_errors: form_errors,
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
          onHide={() => this.props.closeModal("openEditLayoutModal")}
          className="el_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="el_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 el_form_mx_width">
                    <div className="el_signup_form_main">
                      <div className="el_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={() =>
                              this.props.closeModal("openEditLayoutModal")
                            }
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 el_order-xs-2">
                            <h4>Edit Layout</h4>
                          </div>
                          <div className="col-12 col-sm-3 el_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="el_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyDown={this.formSubmitHandler}
                              className="el_signup_form"
                            >
                              <div className="form-group">
                                <label htmlFor="p-name">Layout Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="edit_layout_name"
                                  value={this.state.edit_layout_name}
                                  name="edit_layout_name"
                                  onChange={this.onChangeValue}
                                  placeholder=""
                                />
                                <div className="text-danger error-12">
                                  {this.state.form_errors.edit_layout_name !==
                                  ""
                                    ? this.state.form_errors.edit_layout_name
                                    : ""}
                                </div>
                              </div>

                              <div class="row no-gutters d-flex h-100 input-group mb-2 mt-1">
                                <div className="el_form_upload_message col-12 justify-content-center align-self-center">
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
                                            className="el_upload"
                                            alt="download"
                                          />
                                          &nbsp;&nbsp;Drag and drop or click to
                                          upload new file
                                        </p>
                                      </div>
                                    )}
                                  </Dropzone>
                                </div>
                              </div>
                              <button
                                onClick={this.openDeleteModal}
                                type="button"
                                className="el_theme_btn el_back"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={this.onSaveEditHandler}
                                id="SubmitButton_editLayout"
                                className="el_theme_btn"
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
          </Modal.Body>
        </Modal>

        <DeleteModal
          openModal={this.state.openDeleteModal}
          guid={this.state.guid}
          getLayouts={this.props.getLayouts}
          closeModal={() => this.closeModal("openDeleteModal")}
          closeModalwd={() => this.closeModalwithoutdelete("openDeleteModal")}
          editCloseModal={this.props.editCloseModal}
          layoutName={this.state.edit_layout_name}
          currentproject = {this.props.currentproject}
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

export default EditLayout;
