import React, { Component } from "react";
import "./ChangePassword.css";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { API } from "aws-amplify";

import {
  changePasswordFun,
  clearStates
} from "../../../../actions/loginactions";
import {
  updatefield,
  clearStatesCommon
} from "../../../../actions/generalfuntions";
import Message from "../../message/message";
let md5 = require("md5");

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      showOld: false,
      message_desc: "",
message_heading: "",
openMessageModal: false,
      show: false,
      showConfirm: false,
      oldPassword: "",
      password: "",
      confirmPassword: "",
      formErrors: {
        password: "",
        confirmPassword: "",
        oldPassword: ""
      }
    };
  }
  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
  };
  onBlurHandle = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.validateField(fieldName, fieldValue);
  }

  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})");

    switch (name) {
      case "password":
        if (value.length < 1) {
          formErrors.password = "This Field is Required.";
        } else if (!strongRegex.test(this.state.password)) {
          formErrors.password = "password length should be 10 or greater and It must contain '\special characters, uppercase, lowercase and numbers\'";
        } else if (this.state.confirmPassword) {
          if (this.state.password !== this.state.confirmPassword) {
            formErrors.confirmPassword = "Password not matched.";
            formErrors.password = "";
          } else {
            formErrors.confirmPassword = "";
            formErrors.password = "";
          }
        } else {
          formErrors.password = "";
        }
        break;
      case "confirmPassword":
        if (value.length < 1) {
          formErrors.confirmPassword = "This Field is Required.";
        } else if (this.state.password !== this.state.confirmPassword) {
          formErrors.confirmPassword = "Password not matched.";
        } else {
          formErrors.confirmPassword = "";
        }
        break;
      case "oldPassword":
        if (value.length < 1) {
          formErrors.oldPassword = "This Field is Required.";
        } else {
          formErrors.oldPassword = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };
  closeModal = name => {
    if(name == "openChangePasswordModal"){
      this.props.closeModal()
      this.clearStates();
    }
    else{
      this.setState({ [name]: false });
    }
    
    
  };

  onSave = async (event, closeModal) => {
    event.preventDefault();

    var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
    await this.setState({
      required_messages: messages
     })

    var formErrors = this.state.formErrors;
    if (!this.state.oldPassword) {
      formErrors.oldPassword = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       document.getElementById('ok_button').focus();
    }
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       document.getElementById('ok_button').focus();
    }
   if (!this.state.confirmPassword) {
      formErrors.confirmPassword = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       document.getElementById('ok_button').focus();
    } 
    if (this.state.password !== this.state.confirmPassword) {
      formErrors.confirmPassword = "Password not matched.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       document.getElementById('ok_button').focus();

    }
     if( formErrors.password == "password length should be 10 or greater and It must contain '\special characters, uppercase, lowercase and numbers\'"){
      this.state.required_messages.map(e=> e.ID == 4 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       document.getElementById('ok_button').focus();
    }
    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.password &&
      !formErrors.confirmPassword &&
      !formErrors.oldPassword
    ) {
      let guid = localStorage.getItem("guid");
      let userData = "";
      if (guid) {
        await this.setState({
          isLoading: true
        });
        await API.post("pivot", "/getUserByGuid", {
          body: { guid }
        })
          .then(data => {
            userData = data;
          })
          .catch(err => {
            this.setState({
              message_desc: "User Not Found",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User Not Found");
          });
        if (userData.Item) {
          let passMatch =
            userData.Item.Password === md5(this.state.oldPassword) ? true : false;
          if (passMatch) {
    
            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Icons",
                "Description": "Profile change password",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": "",
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);
            
            await this.props.changePasswordFun(
              this.state.oldPassword,
              this.state.password
            );
          } else {
            // toast.error("Please Enter Correct Old Password!");
            this.state.required_messages.map(e=> e.ID == 4 ? 
              this.setState({
               message_desc : "Please Enter Correct Old Password!",
               message_heading: "Invalid Old Password",
               openMessageModal : true
             })  :'')
          }
        }

        if (this.props.changePassword) {
          // toast.success("Password Updated Sucessfully In Cognito");
          let guid = localStorage.getItem("guid");
          //now also change password in dynamo
          await this.props.updatefield(
            "PivotUser",
            guid,
            "Password",
            md5(this.state.password)

          ); //tableName, guid, fieldName, fieldValue
        }
        if (this.props.changePasswordErr) {
          this.setState({
            message_desc: "Password Not Updated In Cognito",
            message_heading: "Password",
            openMessageModal: true,
          })
          // toast.error("Password Not Updated In Cognito");
        }

        //to check if password updated in dynamo
        if (this.props.fieldupdatestatus) {
          // toast.success("Password Updated Sucessfully In Dynamo");
        }
        if (this.props.fieldupdateerr) {
          this.setState({
            message_desc: "Password Not Updated In Dynamo",
            message_heading: "Password",
            openMessageModal: true,
          })
          // toast.error("Password Not Updated In Dynamo");
        }

        await this.setState({
          isLoading: false,
          password: "",
          confirmPassword: "",
          oldPassword: ""
        });
      } else {
        this.setState({
          message_desc: "Guid Not Found",
          message_heading: "Password",
          openMessageModal: true,
        })
        // toast.error("Guid Not Found");
      }
      this.props.clearStates();
      this.clearStates();
      this.props.clearStatesCommon();

      this.props.closeModal();
    }
  };
  onPressEnter = (e) =>{
    if(e.keyCode == 13){
      document.getElementById('save_change_pass').click();
      this.clearStates()
    }
    else if(e.keyCode == 27){
      this.clearStates()
    }
  }
  clearStates = () =>{
    this.setState({
      oldPassword: "",
      password: "",
      confirmPassword: "",
      formErrors: {
        password: "",
        confirmPassword: "",
        oldPassword: ""
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
          className="chngpass_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="chngpass_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center chngpass_form_mx_width">
                    <div className="chngpass_signup_form_main">
                      <div className="chngpass_signup_header">
                        <div className="row">
                        <img src="/images/2/close.png" onClick={()=>this.closeModal('openChangePasswordModal')} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 chngpass_order-xs-2">
                            <h4>Change Password</h4>
                          </div>
                          <div className="col-12 col-sm-3 chngpass_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="chngpass_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.onPressEnter} className="chngpass_signup_form">
                              <div className="form-group pt-2">
                                <label htmlFor="password">Old Password</label>
                                <div className="chngpass_password_eye">
                                  <input
                                    type={
                                      this.state.showOld ? "text" : "password"
                                    }
                                    id="password"
                                    className="form-control" 
                                    name="oldPassword"
                                    value={this.state.oldPassword}
                                    onChange={this.handleFieldChange}
                                    onBlur={this.onBlurHandle}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.oldPassword !== ""
                                      ? this.state.formErrors.oldPassword
                                      : ""}
                                  </div>
                                  <span
                                    className="chngpass_hidden_pass"
                                    onClick={() =>
                                      this.setState({
                                        showOld: !this.state.showOld
                                      })
                                    }
                                  >
                                    <img
                                      src={
                                        this.state.showOld
                                          ? "images/eye-off.png"
                                          : "images/eye.png"
                                      }
                                      className="img-fluid"
                                      alt="Show Password"
                                    />
                                  </span>
                                </div>
                              </div>

                              <div className="form-group pt-2">
                                <label htmlFor="password">Password</label>
                                <div className="chngpass_password_eye">
                                  <input
                                    type={this.state.show ? "text" : "password"}
                                    id="password"
                                    className="form-control" 
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleFieldChange}
                                    onBlur={this.onBlurHandle}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.password !== ""
                                      ? this.state.formErrors.password
                                      : ""}
                                  </div>
                                  <span
                                    className="chngpass_hidden_pass"
                                    onClick={() =>
                                      this.setState({ show: !this.state.show })
                                    }
                                  >
                                    <img
                                      src={
                                        this.state.show
                                          ? "images/eye-off.png"
                                          : "images/eye.png"
                                      }
                                      className="img-fluid"
                                      alt="Show Password"
                                    />
                                  </span>
                                </div>
                              </div>

                              <div className="form-group pt-2">
                                <label htmlFor="password">
                                  Confirm Password
                                </label>
                                <div className="chngpass_password_eye">
                                  <input
                                    type={
                                      this.state.showConfirm
                                        ? "text"
                                        : "password"
                                    }
                                    id="password"
                                    className="form-control" 
                                    name="confirmPassword"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleFieldChange}
                                    onBlur={this.onBlurHandle}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.confirmPassword !==
                                      ""
                                      ? this.state.formErrors.confirmPassword
                                      : ""}
                                  </div>
                                  <span
                                    className="chngpass_hidden_pass"
                                    onClick={() =>
                                      this.setState({
                                        showConfirm: !this.state.showConfirm
                                      })
                                    }
                                  >
                                    <img
                                      src={
                                        this.state.showConfirm
                                          ? "images/eye-off.png"
                                          : "images/eye.png"
                                      }
                                      className="img-fluid"
                                      alt="Show Password"
                                    />
                                  </span>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <div className="chngpass_body">
                                    <button
                                      onClick={this.onSave}
                                      onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                      onKeyUp={(e) =>{if(e.keyCode===13){
                                        e.stopPropagation();
                                        this.onSave(e)
                                      }}}
                                      type="button"
                                      id="save_change_pass"
                                      className="chngpass_theme_btn"
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
        <Message
          openModal = {this.state.openMessageModal}
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
  changePassword: arg.result.changePassword,
  changePasswordErr: arg.result.changePasswordErr,
  fieldupdatestatus: arg.commonRresult.fieldupdatestatus,
  fieldupdateerr: arg.commonRresult.fieldupdateerr
});
export default connect(
  mapStateToProps,
  {
    changePasswordFun,
    clearStates,
    updatefield,
    clearStatesCommon
  }
)(ChangePassword);
