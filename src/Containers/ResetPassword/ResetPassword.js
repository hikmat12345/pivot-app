import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./ResetPassword.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { updatefield, clearStatesCommon } from "../../actions/generalfuntions";
import {
  signupfunc,
  clearallstates,
  clearStates
} from "../../actions/loginactions";
import { API } from "aws-amplify";
import Message from "../Modals/message/message";
import $ from "jquery";
let md5 = require("md5");

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      confirmpassShow: false,
openMessageModal: false,
message_desc: "",
message_heading: "",
required_messages: [],
      password: "",
      guid: "",
      confirmpassword: "",
      formErrors: {
        password: "",
        confirmpassword: ""
      }
    };
  }
  // componentDidUpdate() {
  //   console.log(this.props.dynamocheckemail);
  // }
  componentWillMount = () => {
    if (
      this.props.location.state === undefined ||
      (this.props.location.state !== undefined &&
        !this.props.location.state.entity)
    ) {
      this.props.history.push("/wizard-login");
    }
    if (this.props.dynamocheckemail.length == 0) {
      this.props.history.push("/wizard-login");
    }
      var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
// var tips = JSON.parse(localStorage.getItem("ToolTip"));
this.setState({
required_messages: messages
})
  };

  handleInputFields = async(event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    await this.setState({ [fieldName]: fieldValue});

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
        } else if(!strongRegex.test(this.state.password)){
          formErrors.password = "password length should be 10 or greater and It must contain '\special characters, uppercase, lowercase and numbers\'";
        } else if (this.state.confirmpassword) {
          if (this.state.password !== this.state.confirmpassword) {
            formErrors.confirmpassword = "Password not matched.";
            formErrors.password = "";
          } else {
            formErrors.confirmpassword = "";
            formErrors.password = "";
          }
        } else {
          formErrors.password = "";
        }
        break;
      case "confirmpassword":
        if (value.length < 1) {
          formErrors.confirmpassword = "This Field is Required.";
        } else if (this.state.password !== this.state.confirmpassword) {
          formErrors.confirmpassword = "Password not matched.";
        } else {
          formErrors.confirmpassword = "";
        }
        break;
    
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };

  saveButton = async () => {
    var formErrors = this.state.formErrors;

    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
         this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
       else if(formErrors.password == "password length should be 10 or greater and It must contain '\special characters, uppercase, lowercase and numbers\'"){
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    if (!this.state.confirmpassword ) {
      formErrors.confirmpassword = "This Field is Required.";
        this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    } else if (this.state.password !== this.state.confirmpassword ) {
      formErrors.confirmpassword  = "Password not matched.";
        this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.password &&
      !formErrors.confirmpassword 
    ) {
      this.setState({ isLoading: true });
      await this.props.signupfunc(
        this.props.dynamocheckemail[0].Email,
        this.props.dynamocheckemail[0].Email,
        this.state.password
      );
      if (this.props.signupSuccess) {
        // toast.success("Signup Successfuly");

        await this.props.updatefield(
          "PivotUser",
          this.props.dynamocheckemail[0].guid,
          "Password",
          md5(this.state.password)

        );
        if (this.props.updateresulterr) {
          this.props.clearStates();
          this.setState({
            message_desc: "Update Password Failed In Dynamo",
            message_heading: "Dynamo",
            openMessageModal: true,
          })
          // toast.error("Update Password Failed In Dynamo");
        }

        if (this.props.updateresult) {
          // toast.success("Update Password Successfully In Dynamo");

          var entity = this.props.location.state.entity;

          this.props.history.push("/wizard-security", {
            entity: entity,
            guid: this.props.dynamocheckemail[0].guid,
            dynamouser:this.props.dynamocheckemail[0]
          });
        }
      }
      if (this.props.signupErr) {
        this.props.clearStates();
        this.setState({
          message_desc: "Signup Error In Cognito",
          message_heading: "Sign Up",
          openMessageModal: true,
        })
        // toast.error("Signup Error In Cognito");
        this.props.history.push("/wizard-login");
      }
      this.props.clearStates();
      this.setState({ isLoading: false });
    }
  };
closeModal = name => {
if (name === "closeAll") {
this.setState({ openDeleteModal: false });
this.props.closeModal("closeAll");
} else {
this.setState({ [name]: false });
}
};

onPressEnter_ResetPassword = (e) =>{
  if(e.which == 13){
    e.preventDefault()
    document.getElementById('SubmitButton').click();
  }
}

  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="rs_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center rs_form_mx_width">
              <div className="rs_signup_form_main">
                <div className="rs_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 rs_order-xs-2">
                      <h4>Reset your Password</h4>
                    </div>
                    <div className="col-12 col-sm-3 rs_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="rs_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div className="rs_signup_form">
                        <div onKeyUp={this.onPressEnter_ResetPassword} id="FormSubmit" className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="wl_password_eye">
                            <input
                              autocomplete="off"
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control"
                              placeholder="enter your password"
                              name="password"
                              autoFocus={true}
                              value={this.state.password}
                              onChange={this.handleInputFields}
                              onBlur={this.onBlurHandle}
                            />
                              <div className="text-danger error-12">
                                    {this.state.formErrors.password !== ""
                                      ? this.state.formErrors.password
                                      : ""}
                                  </div>
                            <span
                              className="wl_hidden_pass"
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
                          <div className="form-group pt-2">
                            <label htmlFor="password">Confirm Password</label>
                            <div className="wl_password_eye">
                              <input
                                autocomplete="off"
                                type={
                                  this.state.confirmpassShow ? "text" : "password"
                                }
                                id="password"
                                className="form-control"
                                placeholder="enter your password"
                                name="confirmpassword"
                                value={this.state.confirmpassword}
                                onChange={this.handleInputFields}
                                onBlur={this.onBlurHandle}
                              />
                                <div className="text-danger error-12">
                                    {this.state.formErrors.confirmpassword !== ""
                                      ? this.state.formErrors.confirmpassword
                                      : ""}
                                  </div>
                              <span
                                className="wl_hidden_pass"
                                onClick={() =>
                                  this.setState({
                                    confirmpassShow: !this.state.confirmpassShow
                                  })
                                }
                              >
                                <img
                                  src={
                                    this.state.confirmpass
                                      ? "images/eye-off.png"
                                      : "images/eye.png"
                                  }
                                  className="img-fluid"
                                  alt="Show Password"
                                />
                              </span>
                            </div>
                          </div>{" "}
                          <button
                            type="button"
                            className="rs_theme_btn rs_back"
                            onClick={()=>this.props.history.push("/wizard-entity", {
                              usersuccess: true
                            })}
                             onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.props.history.push("/wizard-entity", {
                                  usersuccess: true
                                })
                              }}}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            className="rs_theme_btn"
                            id="SubmitButton"
                            onClick={this.saveButton}
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.saveButton()
                              }}}
                          >
                            Next
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
            <Message
openModal={this.state.openMessageModal}
closeModal={() => this.closeModal("openMessageModal")}
heading={this.state.message_heading}
>
{this.state.message_desc}
</Message>
      </div>
    );
  }
}

const mapStateToProps = arg => ({
  //  confirmsignupdata:arg.result.confirmsignupdata,
  // signuperr:arg.result.confirmsignuperr,
  dynamocheckemail: arg.result.dynamocheckemail,
  updateresult: arg.commonRresult.fieldupdatestatus,
  updateresulterr: arg.commonRresult.fieldupdateerr,
  signupSuccess: arg.result.signupresult,
  signupErr: arg.result.errorsignup

  // dynamoerror:arg.result.dynamoerror
});

export default connect(
  mapStateToProps,
  { updatefield, clearStates, signupfunc, clearallstates, clearStatesCommon }
)(ResetPassword);
