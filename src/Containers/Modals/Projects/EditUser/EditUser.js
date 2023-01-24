import "./EditUser.css";

import React, { Component } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import DeleteModal from "../Delete/Delete";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import MultiSelect from "@khanacademy/react-multi-select";
import { toast } from "react-toastify";

var moment = require('moment');
let md5 = require("md5");

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      userData: "", //contains user's data to edit
      login_user_type: "",
      login_user_email: "",
      isLoading: false,
      openDeleteModal: false,
      projectCompleteList: [],
      projectList: [],
      projectAaccesSelected: [],
      email: "",
      email_body: "",
      message: "",
      type: "Admin",
      disable: false,
      lockedout: false,
      required_messages: [],
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      allProjectsSelected: [],
      projectAccessOptions: [
        { label: "The Butcher Series 1", value: "The Butcher Series 1" },
        { label: "Snowden", value: "Snowden" },
        { label: "Chopper Series 1", value: "Chopper Series 1" },
        {
          label: "The Great Chase Series 10",
          value: "The Great Chase Series 10"
        }
      ],
      formErrors: {
        email: "",
        message: "",
        projectAccess: ""
      },
      selected: []
    };
  }

  async componentWillReceiveProps() {
    // console.log(this.props.projectList,'this.props.projectListthis.props.projectList')
    let user = this.props.userData.Item;
    if (user) {
      await this.setState({
        userData: user,
        projectList: user.projectAccess,
        email: user.Email,
        message: user.message || '',
        type: user.type,
        disable: user.Disabled,
        lockedout: user.LockedOut,
        projectCompleteList: this.props.projectList.filter(project => project.TenantGuid !== "SYSTEM"),
        required_messages: this.props.required_messages,
        login_user_type: this.props.login_user_type,
        login_user_email: this.props.login_user_email
      });
    }
    var finalCompleteProject = this.state.projectCompleteList.map(e => { return { label: e.Name, value: e.guid } });
    var finalProjectNamesSelected = this.state.projectCompleteList.map(e => e.guid);
    let systemProjects = this.state.projectCompleteList.filter(e => {
      if (e.TenantGuid === "SYSTEM") {
        return { label: e.Name, value: e.guid }
      }
    });
    let projectsGuids = this.state.projectCompleteList.map(e => e.guid);
    let accessibleProjects = systemProjects.map(e => e.guid).concat(this.state.projectList);
    // Removing duplicate elements.
    accessibleProjects = accessibleProjects.filter((a, b) => accessibleProjects.indexOf(a) === b);
    // Removing those guids who doesn't exist in projects list.
    accessibleProjects = accessibleProjects.filter(guid => projectsGuids.includes(guid));

    console.log(finalProjectNamesSelected, 'projectCompleteListprojectCompleteList')
    await this.setState({
      projectAccessOptions: finalCompleteProject
    })

    await this.setState({
      projectAaccesSelected: accessibleProjects,
      // projectAaccesSelected: this.state.projectList,
      allProjectsSelected: finalProjectNamesSelected
    })

  }

  openModal = name => {
    if (name == "openDeleteModal") {
      this.setState({ openDeleteModal: true });
      $(document).ready(function () {
        $(this).find('#projects_sub_del').focus();
      })
    }
    this.setState({ [name]: true });
  };

  closeModal = name => {
    if (name === "closeAll") {
      this.setState({ openDeleteModal: false });
      this.props.closeModal("closeAll");
    } else {
      this.setState({ [name]: false });
    }
  };

  validateField = async (name, value) => {
    var email_pattern = /^[a-z0-9+]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var formErrors = this.state.formErrors;
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
      /*   case "message":
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
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    if (fieldName == 'email') {
      fieldValue = fieldValue.toLowerCase();
    }
    this.setState({ [event.target.name]: fieldValue }, () => { });
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
    var formErrors = this.state.formErrors;
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

  onSave = async (event, optional = undefined) => {
    event.preventDefault();
    var formErrors = this.state.formErrors;
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
    if (this.state.type !== "Admin" && this.state.login_user_type !== 'SYSTEM') {
      if (!this.state.projectAaccesSelected.length) {
        // console.log(this.state.projectAaccesSelected.length,'this.state.projectAaccesSelected')

        formErrors.projectAccess = "This Field is Required.";
      }
    }



    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.projectAccess) {
      // this.props.history.push("/wizard-entity");
      if (this.state.userData && this.state.userData.guid) {
        await this.setState({
          isLoading: true
        });


        let cognitoSignup = "";
        let checkUser = undefined;
        if (this.state.login_user_type === 'SYSTEM' && this.props.userData.Item.Email !== this.state.email) {
          checkUser = await this.getUserByEmail();
          await this.deleteUserFromCognito();
          cognitoSignup = false;
        }
        if (checkUser === undefined || checkUser.Items.length === 0) {
          let password = await this.randGenPassword();
          //edit user data
          await API.post("pivot", "/adduser", {
            body: {
              guid: this.state.userData.guid,
              Avatar: this.state.userData.Avatar,
              Disabled: this.state.disable,
              Email: this.state.email,
              InvitationSent: this.state.userData.InvitationSent,
              LastLogin: this.state.userData.LastLogin,
              LockedOut: this.state.lockedout,
              mobile: this.state.userData.mobile,
              Username: this.state.userData.Username,
              message: this.state.message === "" ? null : this.state.message,
              projectAccess: this.state.type == "Admin" || this.state.type == "Owner" || this.state.type == "SYSTEM" ? this.state.allProjectsSelected : this.state.projectAaccesSelected,
              ProjectAccessAll: this.state.allProjectsSelected.length === this.state.projectAaccesSelected.length ? true : false,
              type: this.state.type == "SYSTEM" ? "SYSTEM" : this.state.type == "Owner" ? "Owner" : this.state.type,
              wpcount: this.state.userData.wpcount,
              lockedouttime: this.state.lockedout ? moment.utc() : this.state.userData.lockedouttime,
              // password: this.state.userData.Password,
              password: optional === "resendInviteHandler" ? md5(password) : this.state.userData.Password,
              two_factor: this.state.userData.two_factor,
              KartraUserID: this.props.subscriptions.Item.buyer_id ? this.props.subscriptions.Item.buyer_id : null,
              cognitoSignup: cognitoSignup === "" ? this.state.userData.cognitoSignup : cognitoSignup,
              tenant: this.state.userData.tenantguid,
              totp_setup_required: this.state.userData.totp_setup_required
            }
          })
            .then(async data => {
              let { user } = this.props;
              let { userData, message, type, disable, lockedout } = this.state;
              let dateTime = new Date().getTime();
              this.activityRecord([
                {
                  "User": localStorage.getItem('Email'),
                  "Datetime": dateTime,
                  "Module": "Project List",
                  "Description": "Edit User - Email",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": "",
                  "ValueTo": userData.Email,
                  "Tenantid": localStorage.getItem('tenantguid')
                }, {
                  "User": localStorage.getItem('Email'),
                  "Datetime": dateTime,
                  "Module": "Project List",
                  "Description": "Edit User - Message",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": "",
                  "ValueTo": message,
                  "Tenantid": localStorage.getItem('tenantguid')
                }, {
                  "User": localStorage.getItem('Email'),
                  "Datetime": dateTime,
                  "Module": "Project List",
                  "Description": "Edit User - Type",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": userData.type,
                  "ValueTo": type == "SYSTEM" ? "SYSTEM" : type == "Owner" ? "Owner" : type,
                  "Tenantid": localStorage.getItem('tenantguid')
                }, {
                  "User": localStorage.getItem('Email'),
                  "Datetime": dateTime,
                  "Module": "Project List",
                  "Description": "Edit User - Account",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": disable,
                  "ValueTo": lockedout,
                  "Tenantid": localStorage.getItem('tenantguid')
                }
              ]);

              if (optional === "resendInviteHandler") {
                await this.resendInviteHandler(event, password);
              }

              await this.props.getUsers();
              this.props.closeModal("openEditUserModal");
              await this.clearStates();
              // toast.success("User Edited Successfully");
            })
            .catch(err => {
              this.setState({
                message_desc: "User not Edited Successfully",
                message_heading: "User",
                openMessageModal: true,
              })
              // toast.error("User not Edited Successfully");
            });
        } else {
          this.setState({
            message_desc: "This email is already registered.",
            message_heading: "User",
            openMessageModal: true
          })
        }
        await this.setState({
          isLoading: false
        });
      }
    }
  };

  clearStates = async () => {
    this.setState({
      userData: "", //contains user's data to edit
      isLoading: false,
      email: "",
      message: "",
      type: "Admin",
      disable: false,
      lockedout: false,
      projectAaccesSelected: []
    });
  };

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

  resendInviteHandler = async (event, password) => {
    if (this.state.userData.cognitoSignup == false) {
      this.setState({
        isLoading: true
      });
      await this.getConfigEmail();
      let link = `${process.env.REACT_APP_INVITE_APP_URL}/login?email=${this.state.userData.Email}&password=${password}`;
      var entity_name = JSON.parse(localStorage.getItem('completetenent')).Item
      //sending passwrod to email,on which email user is created now
      var msg_subject = this.state.email_body && this.state.email_body.subject;
      var final_subject = msg_subject.replace("(Entity Name)", `${entity_name.name}`)
      var email_message = this.state.email_body && this.state.email_body.body;
      var final_message = email_message.replace("(Password)", `${password}`);

      let message = `${final_message}<br/> Link: ${link}`;
      // this.state.type == "Admin"
      //   ? "https://d14j155jdismzg.cloudfront.net/wizard-login"
      //   : "https://d14j155jdismzg.cloudfront.net/login";
      // let message = `Hi ${this.state.userData.Email}, here is you login details for Pivot. Let me know if you have any problems. Regards Pivot.<br/> Click on this link to get login: ${link} <br/> Your Password is: ${this.state.userData.Password}`;
      await API.post("pivot", "/sendemail", {
        body: {
          TO: this.state.userData.Email,
          SUBJECT: final_subject,
          MSG: message
        }
      })
        .then(async data => {
          let { userData } = this.state;
          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Edit User - Resend Invite",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": userData.Email,
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);

          // toast.success("Email Sent Again Successfully");
          this.setState({
            message_desc: "Invitation has been Resent ",
            message_heading: "Email Sent",
            openMessageModal: true
          })
          $(document).ready(function () {
            $(this).find('#ok_button').focus();
          })
          await this.updateUserOnResend()
        })
        .catch(err => {
          this.setState({
            message_desc: "Email Is Not Sent Again!",
            message_heading: "Email",
            openMessageModal: true,
          })
          // toast.error("Email Is Not Sent Again!");
        });
      this.setState({
        isLoading: false
      });
    }
    else {
      this.setState({
        message_desc: "Invitation cannot sent because this user is already created",
        message_heading: "Can't Send",
        openMessageModal: true
      })
      $(document).ready(function () {
        $(this).find('#ok_button').focus();
      })
    }
  }

  updateUserOnResend = async () => {
    await API.post("pivot", "/resetbothlock", {
      body: {
        guid: this.state.userData.guid,
        LockedOut: false,
        Disabled: false,
        date: new Date()
      }
    })
      .then(async data => {
        // toast.success("User Lock Updated");
        await this.setState({
          disable: false,
          lockedout: false
        });
        await this.props.getUsers();
      })
      .catch(err => {
        this.setState({
          message_desc: "User Lock Not Updated",
          message_heading: "User",
          openMessageModal: true,
        })
        // toast.error("User Lock Not Updated");
        // this.setState({ openMessageModal: true })
      });
  }

  deleteUserHandler = async () => {

    await this.setState({
      isLoading: true
    })

    var deletefromcognito = false;
    const Aws = require('aws-sdk');
    Aws.config.update({
      region: process.env.REACT_APP_COGNITO_REGION,
      accessKeyId: process.env.REACT_APP_accesskey,
      secretAccessKey: process.env.REACT_APP_secretkey
    });
    const cognitoIdentityService = new Aws.CognitoIdentityServiceProvider();
    var params = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      Username: this.state.userData.Email,
    };
    // console.log(params);
    var that = this;
    await cognitoIdentityService.adminDeleteUser(params, function (err, data) {
      if (err) {
        this.setState({
          message_desc: "Error In Deleting from Cognito.",
          message_heading: "Cognito",
          openMessageModal: true,
        })
        // toast.error('Error In Deleting from Cognito.', {
        //   autoClose: 5000
        // });
        console.log(err);
        return false;
      }
      else {
        deletefromcognito = true

        // toast.success('Successfully Deleted from User Pool.', {autoClose: 5000});
      }
    });


    await API.post("pivot", "/deletePivotUser", {
      body: {
        guid: this.state.userData.guid
      }
    })
      .then(async data => {
        let { userData } = this.state;
        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Edit User - Delete",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": userData.Email,
            "Tenantid": localStorage.getItem('tenantguid')
          }
        ]);

        // toast.success("User Deleted from DB");
      })
      .catch(err => {
        this.setState({
          message_desc: "User Not Deleted from DB",
          message_heading: "Cognito",
          openMessageModal: true,
        })
        // toast.error("User Not Deleted from DB");
      });
    this.setState({ openDeleteModal: false });

    this.props.closeModal("openEditUserModal");
    await this.props.getUsers();
    // this.props.closeModal("closeAll");
    this.setState({
      isLoading: false
    })
  }

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

  //   componentDidUpdate =() =>{
  //     $(document).ready(function () {
  //     $('#FormSubmit').keydown(function (e) {
  //       if(e.which == 13){
  //         e.preventDefault()
  //         document.getElementById('SubmitButton').click();
  //       } });
  //   });
  // } 
  
  formSubmitHandler = (e) => {

    if (e.keyCode == 13) {
      e.preventDefault();
      e.stopPropagation();
      if ($('.multi-select .dropdown').is(":focus") || $('.multi-select .dropdown').focus()) {

      } else {
        document.getElementById('SubmitButton_editUser').click();
      }
    }
  }

  multiSelectEnter = (e) => {

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
        // toast.error('Activity failed to record.')
      });
  }

  deleteUserFromCognito = async () => {



    const Aws = require('aws-sdk');
    Aws.config.update({
      region: process.env.REACT_APP_COGNITO_REGION,
      accessKeyId: process.env.REACT_APP_accesskey,
      secretAccessKey: process.env.REACT_APP_secretkey
    });
    const cognitoIdentityService = new Aws.CognitoIdentityServiceProvider();
    var params = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      Username: this.props.userData.Item.Email,
    };
    // console.log(params);
    var that = this;
    await cognitoIdentityService.adminDeleteUser(params, function (err, data) {
      if (err) {
        //        toast.error('Error In Deleting from Cognito.', {
        //          autoClose: 5000
        //        });
        //        console.log(err);
        return false;
      }
      else {


        // toast.success('Successfully Deleted from User Pool.', {autoClose: 5000});
      }
    });
  }

  getUserByEmail = async () => {
    let result = false;
    await API.post("pivot", "/usergetbyemailonly", {
      body: { email: this.state.email }
    })
      .then(data => {

        result = data

      })
      .catch(err => {
        this.setState({
          message_desc: "User Not Found",
          message_heading: "User",
          openMessageModal: true,
        })
        // toast.error("User Not Found");
      });
    return result;
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
          onHide={() => this.props.closeModal("openEditUserModal")}
          // className="eum_modal"
          className={
            this.state.openDeleteModal
              ? "eum_modal modal-backdrop"
              : "eum_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="eum_main_wrapper">
                <div className="row">
                  <div className="col-12 eum_form_mx_width">
                    <div className="eum_signup_form_main">
                      <div className="eum_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={() => this.props.closeModal("openEditUserModal")} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 eum_order-xs-2">
                            <h4>Edit User</h4>
                          </div>
                          <div className="col-12 col-sm-3 eum_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="eum_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.formSubmitHandler} id="FormSubmit" className="eum_signup_form">
                              <div className="form-group">
                                <label htmlFor="p-name">Email</label>
                                <input
                                  autoComplete="off"
                                  disabled={this.state.login_user_type === 'SYSTEM' ? false : true}
                                  type="email"
                                  className="form-control"
                                  id="p-name"
                                  placeholder="pplummer@pivotreports.com"
                                  name="email"
                                  value={this.state.email}
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
                                <label htmlFor="message_edit_user">Message</label>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  className="form-control"
                                  id="message_edit_user"
                                  placeholder="Your Message..."
                                  name="message"
                                  value={this.state.message}
                                  onChange={this.handleInputFields}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.message !== ""
                                    ? this.state.formErrors.message
                                    : ""}
                                </div>
                              </div>
                              {this.state.type === "Admin" || this.state.type === "Owner" || this.state.type === "SYSTEM" ? '' :
                                <div onKeyDown={(e)=>this.multiSelectEnter(e)} className="form-group eum_select">
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
                              {this.state.type == "Owner" || this.state.type == "SYSTEM" ? '' :
                                <div className="form-group eum_select">
                                  <div className="row no-gutters">
                                    <div className="col-12 col-lg-3">
                                      <label>Type:</label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="eum_container eum_remember">
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
                                        <span className="eum_checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="eum_container eum_remember">
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
                                        <span className="eum_checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="eum_container eum_remember">
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
                                        <span className="eum_checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>}
                              {this.state.type == "SYSTEM" || this.state.type == "Owner" ? '' :
                                <div className="form-group eum_select">
                                  <div className="row no-gutters">
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label>Account:</label>
                                    </div>
                                    <div className="col-12 col-lg-3 justify-content-center align-self-center">
                                      <label className="eum_container eum_remember">
                                        Disable
                                      <input
                                          type="checkbox"
                                          name="disable"
                                          value="disable"
                                          checked={this.state.disable}
                                          onChange={this.handleAccount}
                                        />
                                        <span className="eum_checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="col-12 col-lg-4 justify-content-center align-self-center">
                                      <label className="eum_container eum_remember">
                                        Locked Out
                                      <input
                                          type="checkbox"
                                          name="lockedout"
                                          value="lockedout"
                                          checked={this.state.lockedout}
                                          onChange={this.handleAccount}
                                        />
                                        <span className="eum_checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>}
                              {/* {console.log(this.state.login_user_type,'this.state.login_user_type',this.state.type)} */}
                              <div className="text-center">
                                <div className="row no-gutters">
                                  {(((this.state.login_user_type == "Admin" || this.state.login_user_type == "SYSTEM") && (this.state.type == "Owner")) || (this.state.login_user_type == "SYSTEM" && this.state.email == "plumafish@gmail.com")) ? "" :
                                    <div className="col-12 col-lg-4 col-xl-4 order1">
                                      <button
                                        onClick={() =>
                                          this.openModal("openDeleteModal")
                                        }
                                        onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                        onKeyUp={(e) =>{if(e.keyCode===13){
                                          e.stopPropagation();
                                          this.openModal("openDeleteModal")
                                        }}}
                                        type="button"
                                        className="eum_theme_btn eum_back"
                                      >
                                        Delete
                                    </button>
                                    </div>}
                                  <div className="col-6 col-lg-4 xs-100">
                                    <button
                                      type="button"
                                      className="eum_theme_btn eum_back eum_invite"
                                      onClick={(e) => {this.onSave(e, "resendInviteHandler")}}
                                      onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                      onKeyUp={(e) =>{if(e.keyCode===13){
                                        e.stopPropagation();
                                        this.onSave(e, "resendInviteHandler");
                                      }}}
                                    >
                                      Resend Invite
                                    </button>
                                  </div>
                                  <div className="col-6 col-lg-4 col-xl-4 xs-100">
                                    <button
                                      onClick={this.onSave}
                                      onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                      onKeyUp={(e) =>{if(e.keyCode===13){
                                        e.stopPropagation();
                                        this.onSave(e)
                                      }}}
                                      id="SubmitButton_editUser"
                                      type="button"
                                      className="eum_theme_btn eum_save_btn"
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
            </div>
          </Modal.Body>
        </Modal>

        <DeleteModal
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          confirmDelete={this.deleteUserHandler}
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

export default EditUser;
