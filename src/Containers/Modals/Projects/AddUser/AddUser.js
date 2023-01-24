import "./AddUser.css";

import React, { Component } from "react";
import {
  checkindynamosignin,
  clearStates
} from "../../../../actions/loginactions";

import $ from "jquery";
import { API } from "aws-amplify";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import MultiSelect from "@khanacademy/react-multi-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";

var moment = require('moment');
let md5 = require("md5");

class AddUserModal extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      disable: false,
      lockedout: false,
      counter: 1,
      show: false,
      type: "Edit",
      projectAaccesSelected: [],
      allProjectsSelected: [],
      email: "",
      email_body: "",
      message: "",
      openMessageModal: false,
      required_messages: [],
      message_desc: "",
      message_heading: "",
      projectAccessOptions: [],
      formErrors: {
        email: "",
        message: "",
        projectAccess: ""
      },
      showConfirm: false,
      selected: []
    };
  }

  validateField = async (name, value) => {
    // let email_pattern = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    // let email_pattern = /^[a-z0-9+]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let email_pattern = /^[a-z0-9+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    let formErrors = this.state.formErrors;
    switch (name) {
      case "email":
        if (value.length < 1) {
          formErrors.email = "This Field is Required.";
        } else if (!email_pattern.test(value)) {
          formErrors.email = "Please enter valid email format.";
        } else {
          formErrors.email = "";
        }
        break;
      /*    case "message":
            if (value.length < 1) {
              formErrors.message = "This Field is Required.";
            } else {
              formErrors.message = "";
            }
            break;*/
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };

  handleInputFields = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName == 'email') {
      fieldValue = fieldValue.toLowerCase();
    }

    this.setState({ [fieldName]: fieldValue });
    //this.validateField(fieldName, fieldValue);
  };

  onBlurHandle = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName == 'email') {
      fieldValue = fieldValue.toLowerCase();
    }

    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  }

  handleProjectAccess = val => {
    let formErrors = this.state.formErrors;
    formErrors.projectAccess = "";
    this.setState({ projectAaccesSelected: val, formErrors });
  };

  handleType = async event => {
    await this.setState({ type: event.target.value });
  };

  handleAccount = async e => {
    let name = e.target.name;
    await this.setState({ [name]: e.target.checked });
  };

  saveUser = async event => {
    this.setState({ counter: 1 })
    event.preventDefault();
    var entity_name = JSON.parse(localStorage.getItem('completetenent')).Item

    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
      $(document).ready(function () {
        $(this).find('#ok_button').focus();
      })

    }
    else if (formErrors.email == "Please enter valid email format.") {
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
      $(document).ready(function () {
        $(this).find('#ok_button').focus();
      })
    }
    /* if (!this.state.message) {
       formErrors.message = "This Field is Required.";
       this.state.required_messages.map(e => e.ID == 1 ?
         this.setState({
           message_desc: e.Desc,
           message_heading: e.Heading,
           openMessageModal: true
         }) : '')
         $(document).ready(function(){
           $(this).find('#ok_button').focus();
     })
     }*/
    if (this.state.type !== "Admin" && this.state.login_user_type !== "SYSTEM") {
      if (!this.state.projectAaccesSelected.length) {
        formErrors.projectAccess = "This Field is Required.";
        this.state.required_messages.map(e => e.ID == 1 ?
          this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
      }
    }
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.projectAccess) {
      // this.props.history.push("/wizard-entity");
      await this.setState({
        isLoading: true
      });

      //call api here
      await this.getConfigEmail();
      let checkUser = false;
      await API.post("pivot", "/usergetbyemailonly", {
        body: {
          email: this.state.email
        }
      })
        .then(async data => {
          checkUser = data.Items.length ? false : true;
        })
        .catch(err => {
          this.setState({
            message_desc: "There is an Error while getting User By Email",
            message_heading: "User",
            openMessageModal: true,
          })
          // toast.error("There is an Error while getting User By Email");
        });
      if (checkUser) {
        let password = await this.randGenPassword();
        let guid = localStorage.getItem("tenantguid");
        let data = JSON.parse(localStorage.getItem("completetenent")).Item;
        await API.post("pivot", "/adduser", {
          body: {
            Avatar: "filename",
            Disabled: this.state.disable,
            Email: this.state.email,
            InvitationSent: new Date(),
            LastLogin: null,
            LockedOut: this.state.lockedout,
            mobile: "+61 499 999 999",
            Username: this.state.email,
            message: this.state.message === "" ? null : this.state.message,
            projectAccess: (this.state.type == "Admin" || this.state.login_user_type === "SYSTEM") ? this.state.allProjectsSelected : this.state.projectAaccesSelected,
            ProjectAccessAll: this.state.allProjectsSelected.length === this.state.projectAaccesSelected.length ? true : false,
            type: this.state.login_user_type === "SYSTEM" ? "SYSTEM" : this.state.type,
            password: md5(password),
            two_factor: data.two_factor,
            KartraUserID: this.props.subscriptions.Item.buyer_id ? this.props.subscriptions.Item.buyer_id : null,
            tenant: data.tenantguid,
            wpcount: 0,
            cognitoSignup: false,
            lockedouttime: this.state.lockedout ? moment.utc() : null,
            totp_setup_required: data.two_factor
          }
        })
          .then(async data => {
            let dateTime = new Date().getTime();
            let projectsNames = [];
            let guids = (this.state.type == "Admin" || this.state.login_user_type === "SYSTEM") ? this.state.allProjectsSelected : this.state.projectAaccesSelected;
            if (guids && guids.length === this.state.allProjectsSelected.length) {
              projectsNames.push("All");
            } else {
              this.props.projectList.map(project => {
                if (guids.includes(project.guid)) {
                  projectsNames.push(project.Name)
                }
              });
            }

            this.activityRecord([
              {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Project List",
                "Description": "Add User - Email",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.email,
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Project List",
                "Description": "Add User - Message",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.message,
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Project List",
                "Description": "Add User - Project Access",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": projectsNames.toString(),
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Project List",
                "Description": "Add User - Type",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.login_user_type === "SYSTEM" ? "SYSTEM" : this.state.type,
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);

            //sending passwrod to email,on which email user is created now
            let link = `${process.env.REACT_APP_INVITE_APP_URL}/login?email=${this.state.email}&password=${password}`;
            /* this.state.type == "Admin"
               ? "https://d14j155jdismzg.cloudfront.net/wizard-login"
               : "https://d14j155jdismzg.cloudfront.net/login";*/
            var msg_subject = this.state.email_body && this.state.email_body.subject;
            var final_subject = msg_subject.replace("(Entity Name)", `${entity_name.name}`)
            var email_message = this.state.email_body && this.state.email_body.body;
            var final_message = email_message.replace("(Password)", `${password}`);
            let message = `${final_message}<br/> Link: ${link}`;
            // let message = `Hi ${this.state.email}, here is you login details for Pivot. Let me know if you have any problems. Regards Pivot.<br/> Click on this link to get login: ${link} <br/> Your Password is: ${password}`;
            await API.post("pivot", "/sendemail", {
              body: {
                TO: this.state.email,
                SUBJECT: final_subject,
                MSG: message
              }
            })
              .then(async data => {
                // toast.success("Email Sent Successfully");
                await this.props.closeModal();
                await this.setState({
                  message_desc: "Email Sent Successfully",
                  message_heading: "Email Sent",
                  openMessageModal: true
                })
                document.getElementById('ok_button').focus();
              })
              .catch(async err => {
                await this.props.closeModal();
                this.setState({
                  message_desc: "Email Is Not Sent!",
                  message_heading: "Email",
                  openMessageModal: true,
                })
                // toast.error("Email Is Not Sent!");
                document.getElementById('ok_button').focus();
              });
            await this.props.getUsers();

            await this.clearStates();
            document.getElementById('ok_button').focus();

          })
          .catch(err => {
            this.setState({
              message_desc: "User not Added Successfully",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User not Added Successfully");
          });
      } else {
        // toast.error("User Already Exist With Given Email");
        this.setState({
          message_desc: "User Already Exist With Given Email",
          message_heading: "Email",
          openMessageModal: true
        })
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
      }

      await this.setState({
        isLoading: false
      });
    }
  };

  clearStates = async () => {
    await this.setState({
      projectAaccesSelected: [],
      allProjectsSelected: [],
      email: "",
      message: "",
      type: "Edit",
      account: "disable",
      lockedout: false,
      disable: false,
      formErrors: {
        email: "",
        message: "",
        projectAccess: ""
      }
    });
  };

  componentDidMount() {
    var that = this;
    // this.getConfigEmail 
    window.addEventListener('keydown', async function (e) {
      if (e.keyCode === 27) {
        await that.setState({
          counter: 1,
          formErrors: {
            email: "",
            message: "",
            projectAccess: ""
          }
        })
      }
    })
  }

  getConfigEmail = async () => {
    await API.post("pivot", "/getconfig", {
      body: {
        guid: "InviteEmail"
      }
    })
      .then(data => {
        this.setState({
          email_body: data
        })
        // console.log(this.state.email_body,'email_bodyemail_bodyemail_bodyemail_body');
        // localStorage.setItem("RequiredMessages", JSON.stringify(data.Message))
        // this.setState({ config: data });
        // toast.success("Formats Get Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Messages",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Messages")
      });
  };

  randGenPassword() {
    //randome generate password
    let generator = require("generate-password");
    return generator.generate({
      length: 22,
      numbers: true,
      symbols: true,
      strict: true,
      exclude: '"[$&+,:;=?#|<>.-^*()%!~`'
    });
  }

  componentWillReceiveProps = async () => {
    await this.setState({
      projectList: this.props.projectList.filter(project => project.TenantGuid !== "SYSTEM"),
      required_messages: this.props.required_messages,
      login_user_type: this.props.login_user_type
    })

    var finalProjectNames = this.state.projectList.map(e => { return { label: e.Name, value: e.guid } })
    var finalProjectNamesSelected = this.state.projectList.map(e => e.guid);

    await this.setState({
      projectAccessOptions: finalProjectNames,
      allProjectsSelected: finalProjectNamesSelected
    })
  }

  closeModal = name => {
    if (name === "closeAll") {
      // this.setState({ openEditUserModal: false });
      this.props.closeModal();
    } else {
      this.setState({ [name]: false });
    }
  };

  formSubmitHandler = (e) => {
    var keys = this.state.counter;
    if (keys <= 1) {
      var key = keys + 1;
      this.setState({ counter: key })
      if (e.keyCode === 27) {
        this.clearStates();
        this.setState({ counter: 1 })
      }
    } else {

      if (e.keyCode == 13) {

        e.preventDefault();
        e.stopPropagation();
        if ($(".multi-select .dropdown").is(":focus")) {

        } else {
          e.preventDefault();
          e.stopPropagation();
          document.getElementById('SubmitButton_addUser').click();
          this.setState({ counter: 1 })
        }
      } else if (e.keyCode === 27) {
        e.preventDefault();
        this.clearStates();
        this.setState({ counter: 1 })

      }
    }

  }

  multiSelectEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    $('.multi-select .dropdown').keydown(function (a) {
      if ($('.multi-select .dropdown').is(":focus")) {
        if (a.keyCode == 13) {
          a.preventDefault();
          $('.multi-select .dropdown-content').show();
          $('.multi-select .dropdown').attr('aria-expanded', "true");
        }
      }
    });
    $('.multi-select .dropdown-content label.select-item').keydown(function (v) {
      v.preventDefault();
      if (v.keyCode == 13) {
        v.preventDefault();
        v.stopPropagation();
        $('.multi-select .dropdown-content').hide();
        $('.multi-select .dropdown').attr('aria-expanded', "false");
        $('.multi-select .dropdown').focus();
      } else if (e.keyCode == 32) {
        e.preventDefault();
        e.stopPropagation();
        $('.multi-select .dropdown-content').show();
        $('.multi-select .dropdown').attr('aria-expanded', "true");
      }
    })
  }

  closebutton = async () => {

    var formErrors = this.state.formErrors;
    formErrors.email = ""
    formErrors.message = ""
    await this.setState({ formErrors: formErrors });
    this.props.closeModal();
    this.clearStates();
    this.setState({ counter: 1 })
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
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className="aum_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="aum_main_wrapper">
                <div className="row">
                  <div className="col-12 aum_form_mx_width">
                    <div className="aum_signup_form_main">
                      <div className="aum_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.closebutton} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 aum_order-xs-2">
                            <h4>Add User</h4>
                          </div>
                          <div className="col-12 col-sm-3 aum_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="aum_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.formSubmitHandler} id="FormSubmit" className="aum_signup_form">
                              <div className="form-group">
                                <label htmlFor="email_add_user">Email</label>
                                <input
                                  autoComplete="off"
                                  type="email"
                                  className="form-control"
                                  id="email_add_user"
                                  value={this.state.email}
                                  name="email"
                                  onChange={this.handleInputFields}
                                  onBlur={this.onBlurHandle}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.email !== ""
                                    ? this.state.formErrors.email
                                    : ""}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="p-name">Message</label>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  className="form-control"
                                  id="p-name"
                                  name="message"
                                  value={this.state.message}
                                  onChange={this.handleInputFields}
                                  onBlur={this.onBlurHandle}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.message !== ""
                                    ? this.state.formErrors.message
                                    : ""}
                                </div>
                              </div>
                              {this.state.type === "Admin" || this.state.login_user_type === "SYSTEM" ? '' :
                                <div onKeyUp={(e) => this.multiSelectEnter(e)} className="form-group aum_select">
                                  <label>Project Access</label>
                                  <MultiSelect
                                    name="projectAccess"
                                    options={this.state.projectAccessOptions}
                                    selected={this.state.projectAaccesSelected}
                                    onSelectedChanged={selected =>
                                      this.handleProjectAccess(selected)
                                    }
                                    overrideStrings={{
                                      selectSomeItems: "Select",
                                      allItemsAreSelected:
                                        "All Items are Selected",
                                      selectAll: "All",
                                      search: "Search"
                                    }}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.projectAccess !== ""
                                      ? this.state.formErrors.projectAccess
                                      : ""}
                                  </div>
                                </div>
                              }
                              {this.state.login_user_type == 'SYSTEM' ? "" :
                                <div className="form-group aum_select">
                                  <div className="row no-gutters mt-3">
                                    <div className="col-12 col-sm-3">
                                      <label>Type:</label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="aum_container aum_remember">
                                        Admin
                                      <input
                                          type="radio"
                                          name="type"
                                          value="Admin"
                                          checked={
                                            this.state.type === "Admin"
                                              ? true
                                              : false
                                          }
                                          onChange={this.handleType}
                                        />
                                        <span className="aum_checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="aum_container aum_remember">
                                        Edit
                                      <input
                                          type="radio"
                                          name="type"
                                          value="Edit"
                                          checked={
                                            this.state.type === "Edit"
                                              ? true
                                              : false
                                          }
                                          onChange={this.handleType}
                                        />
                                        <span className="aum_checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="aum_container aum_remember">
                                        Read Only
                                      <input
                                          type="radio"
                                          name="type"
                                          value="View"
                                          checked={
                                            this.state.type === "View"
                                              ? true
                                              : false
                                          }
                                          onChange={this.handleType}
                                        />
                                        <span className="aum_checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>}

                              {/* <div className="form-group aum_select">
                                <div className="row no-gutters mt-3">
                                  <div className="col-12 col-sm-3">
                                    <label>Account:</label>
                                  </div>
                                  <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                    <label className="aum_container aum_remember">
                                      Disable
                                      <input
                                        type="checkbox"
                                        name="disable"
                                        value="disable"
                                        checked={this.state.disable}
                                        onChange={this.handleAccount}
                                      />
                                      <span className="aum_checkmark"></span>
                                    </label>
                                  </div>
                                  <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                    <label className="aum_container aum_remember">
                                      Locked Out
                                      <input
                                        type="checkbox"
                                        name="lockedout"
                                        value="lockedout"
                                        checked={this.state.lockedout}
                                        onChange={this.handleAccount}
                                      />
                                      <span className="aum_checkmark"></span>
                                    </label>
                                  </div>
                                </div>
                              </div> */}
                              <div className="text-center">
                                <button
                                  onClick={this.saveUser}
                                  onKeyDown={(e) => { if (e.keyCode === 13) { e.preventDefault(); e.stopPropagation() } }}
                                  onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.saveUser(e)
                                    }
                                  }}
                                  type="button"
                                  id="SubmitButton_addUser"
                                  className="aum_theme_btn"
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

const mapStateToProps = arg => ({
  chkUserByEmailErr: arg.result.dynamoerror,
  chkUserByEmail: arg.result.dynamocheckemail
});
export default connect(
  mapStateToProps,
  {
    checkindynamosignin,
    clearStates
  }
)(AddUserModal);
