import React, { Component } from "react";
import "./Share.css";
import Modal from "react-bootstrap/Modal";
import { fcall } from "q";
import $ from "jquery";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import Message from "../../Modals/message/message";
var moment = require("moment");
let md5 = require("md5");
class Share extends Component {
  constructor() {
    super();
    this.state = this.state = {
      email: "",
      message: "",
      isLoading: false,
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      required_messages: [],
      edit: true,
      view: false,
      form_errors: { email: "" },
    };
  }

  closeModal = (name) => {
    this.setState({
      openMessageModal: false,
    });
  };

  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("SubmitButton_share").click();
    } else if (e.keyCode == 27) {
      this.closebutton();
    }
  };

  inputHandler = async (e) => {
    var name = e.target.name;
    await this.setState({ [name]: e.target.value });
    if (name == "email") {
      var err = this.state.form_errors;
      err.email = "";
      await this.setState({ form_errors: err });
    }
  };

  radioCheck = async (e) => {
    if (e.target.name == "edit") {
      await this.setState({ edit: true, view: false });
    } else {
      await this.setState({ edit: false, view: true });
    }
  };

  randGenPassword() {
    //randome generate password
    let generator = require("generate-password");
    return generator.generate({
      length: 22,
      numbers: true,
      symbols: true,
      strict: true,
      exclude: '"[$&+,:;=?#|<>.-^*()%!~`',
    });
  }

  share = async () => {
    var form_errors = this.state.form_errors;
    if (this.state.email == "") {
      form_errors.email = "this field is required";
      await this.setState({ form_errors });
    }
    await this.setState({ isLoading: true });
    if (form_errors.email == "") {
      let checkUser = false;
      await API.post("pivot", "/usergetbyemailonly", {
        body: {
          email: this.state.email,
        },
      })
        .then(async (data) => {
          checkUser = data.Items.length ? false : true;
        })
        .catch((err) => {
          this.setState({
            message_desc: "There is an Error while getting User By Email",
            message_heading: "User",
            openMessageModal: true,
          })
          // toast.error("There is an Error while getting User By Email");
        });
      if (checkUser) {
        var email_body;
        await API.post("pivot", "/getconfig", {
          body: {
            guid: "InviteEmail",
          },
        })
          .then((data) => {
            this.setState({
              email_body: data,
            });
            email_body = data;
          })
          .catch((err) => {
            this.setState({
              message_desc: "Error While Getting Messages",
              message_heading: "Messages",
              openMessageModal: true,
            })
            // toast.error("Error While Getting Messages")
          });

        let password = await this.randGenPassword();
        var completetenent = JSON.parse(localStorage.getItem("completetenent"));
        let tenantguid = localStorage.getItem("tenantguid");
        await API.post("pivot", "/adduser", {
          body: {
            Avatar: "filename",
            Disabled: false,
            Email: this.state.email,
            InvitationSent: new Date(),
            LastLogin: null,
            LockedOut: false,
            mobile: "+61 499 999 999",
            Username: this.state.email,
            message: this.state.message === "" ? null : this.state.message,
            projectAccess: [this.props.selectedProject.guid],
            type: this.state.edit ? "Edit" : "View",
            password: md5(password),
            two_factor: completetenent.Item.two_factor,
            KartraUserID: null,
            tenant: tenantguid,
            wpcount: 0,
            cognitoSignup: false,
            lockedouttime: null,

            totp_setup_required: completetenent.Item.two_factor,
          },
        })
          .then(async (data) => {
            // toast.success("user added successfully");
            // let link = `https://d14j155jdismzg.cloudfront.net/login?email=${this.state.email}&password=${password}`;
            let link = `${process.env.REACT_APP_INVITE_APP_URL}/login?email=${this.state.email}&password=${password}`;
            
            var msg_subject = email_body && email_body.subject;
            var final_subject = msg_subject.replace(
              "(Entity Name)",
              `${completetenent.Item.name}`
            );
            var email_message = email_body && email_body.body;
            var final_message = email_message.replace(
              "(Password)",
              `${password}`
            );
            let message = `${final_message}<br/> Link: ${link}`;
            await API.post("pivot", "/sendemail", {
              body: {
                TO: this.state.email,
                SUBJECT: final_subject,
                MSG: message,
              },
            })
              .then((data) => {
                // toast.success("invite sent successfully");
              })
              .catch((err) => {
                this.setState({
                  message_desc: "Invite sent failed",
                  message_heading: "Invite",
                  openMessageModal: true,
                })
                // toast.error("invite sent failed");
              });
          })
          .catch((err) => {
            this.setState({
              message_desc: "Add user failed",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("add user failed");
          });

        this.props.closeModal();
      } else {
        await this.setState({
          message_desc: "Already sent invitation!",
          message_heading: "Invitation",
          openMessageModal: true,
        });

        $(document).ready(function () {
          $(this).find("#ok_button").focus();
        });
      }

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Icons",
          "Description": "Share - Email",
          "ProjectName": this.props.selectedProject.Name,
          "Projectguid": this.props.selectedProject.guid,
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": this.state.email,
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Icons",
          "Description": "Share - Type",
          "ProjectName": this.props.selectedProject.Name,
          "Projectguid": this.props.selectedProject.guid,
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": this.state.edit ? "Edit" : "View",
          "Tenantid": localStorage.getItem('tenantguid')
        }
      ]);

    }
    this.setState({ isLoading: false });
  };

  closebutton = async () => {
    var form_errors = this.state.form_errors;
    form_errors.email = "";
    await this.setState({ form_errors: form_errors });
    this.props.closeModal();
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
          message_desc: "Activity failed to record",
          message_heading: "Activity",
          openMessageModal: true,
        })
        // toast.error('Activity failed to record.')
      });
  }

  render() {
    return (
      <>
        {" "}
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className="sm_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="sm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 sm_form_mx_width">
                    <div className="sm_signup_form_main">
                      <div className="sm_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={this.closebutton}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 sm_order-xs-2">
                            <h4>Share</h4>
                          </div>
                          <div className="col-12 col-sm-3 sm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sm_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyUp={this.formSubmitHandler}
                              className="sm_signup_form"
                            >
                              <div className="form-group">
                                <label htmlFor="p-name">Email</label>
                                <input
                                  type="text"
                                  className="form-control share_email"
                                  id="p-name"
                                  name="email"
                                  onChange={this.inputHandler}
                                  placeholder=""
                                />
                              </div>
                              <div className="text-danger error-12">
                                {this.state.form_errors.email !== ""
                                  ? this.state.form_errors.email
                                  : ""}
                              </div>
                              <div className="form-group">
                                <label htmlFor="p-name">Message</label>
                                <input
                                  type="text"
                                  name="message"
                                  onChange={this.inputHandler}
                                  className="form-control"
                                  id="p-name"
                                  placeholder=""
                                />
                              </div>
                              <div className="row">
                                <div className="col-12 col-md-3">
                                  <label>Type:</label>
                                </div>
                                <div className="col-12 col-md-3">
                                  <label className="sm_container sm_remember">
                                    Edit
                                    <input
                                      type="radio"
                                      name="edit"
                                      checked={this.state.edit}
                                      onClick={this.radioCheck}
                                    />
                                    <span className="sm_checkmark"></span>
                                  </label>
                                </div>
                                <div className="col-12 col-md-4">
                                  <label className="sm_container sm_remember">
                                    Read Only
                                    <input
                                      type="radio"
                                      name="view"
                                      checked={this.state.view}
                                      onClick={this.radioCheck}
                                    />
                                    <span className="sm_checkmark"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="sm_body">
                                  <button
                                    id="SubmitButton_share"
                                    onClick={this.share}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }
                                    }}
                                    onKeyUp={(e) => {
                                      if (e.keyCode === 13) {
                                        e.stopPropagation();
                                        this.share(e);
                                      }
                                    }}
                                    type="button"
                                    className="sm_theme_btn"
                                  >
                                    Share
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

export default Share;
