import React, { Component } from "react";
import "./ForgotChangePassword.css";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { API } from "aws-amplify";
import {
  updatePasswordInDynamo,
  clearStates
} from "../../../actions/loginactions";
import Message from "../message/message";
let md5 = require("md5");

class ForgotChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      accessCode: "",
      email: "",
      show: false,
      showConfirm: false,
      password: "",
      confirmPassword: "",
      email_guid: "",
      email_two_factor: false,
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      required_messages: [],
      formErrors: {
        password: "",
        confirmPassword: ""
      }
    };
  }
  clearStates = async () =>{
   await this.setState({
      password: "",
      confirmPassword: "",
      formErrors: {
        password: "",
        confirmPassword: ""
      }
    })
  }
  componentWillReceiveProps =()=> {
    this.setState({ accessCode: this.props.code, email: this.props.email, required_messages: this.props.required_messages });
    $(document).ready(function () {
      $("#password1").focus();
    });
  }
  handleFieldChange =async(event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
    // await this.validateField(fieldName, fieldValue);
  };
  onBlurHandle = async (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    // this.setState({ [event.target.name]: event.target.value });
    await this.validateField(fieldName, fieldValue);
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
        } 
         else if (this.state.confirmPassword) {
           if (this.state.password !== this.state.confirmPassword) {
             formErrors.confirmPassword = "Passwords do not match";
             formErrors.password = "";
           } else {
             formErrors.confirmPassword = "";
             formErrors.password = "";
           }
         } 
        else {
          formErrors.password = "";
        }
        break;
      case "confirmPassword":
        if (value.length < 1) {
          formErrors.confirmPassword = "This Field is Required.";
        }
         else if (this.state.password !== this.state.confirmPassword) {
           formErrors.confirmPassword = "Passwords do not match";
         } 
        else {
          formErrors.confirmPassword = "";
        }
        break;
      default:
        break;
    }
   await this.setState({
      formErrors: formErrors
    });
  };

  onNext = async (event, closeModal) => {
    event.preventDefault();
    let formErrors = this.state.formErrors;
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    if (!this.state.confirmPassword) {
      formErrors.confirmPassword = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    } else if (this.state.password !== this.state.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    else if (formErrors.password == "password length should be 10 or greater and It must contain '\special characters, uppercase, lowercase and numbers\'") {
      this.state.required_messages.map(e => e.ID == 4 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.password && !formErrors.confirmPassword) {
       this.setState({
         password: "",
         confirmPassword: "",
         formErrors: {
           password: "",
           confirmPassword: ""
         }
       });
       let { email, accessCode, password } = this.state;

       if (email && accessCode) {
         await this.setState({
           isLoading: true
         });
         await Auth.forgotPasswordSubmit(email, accessCode, password)
           .then(async data => {
             await this.props.updatePasswordInDynamo(email, md5(password));
             await this.checkbyemail();
             if (this.state.email_two_factor == true) {
               await this.updateTwoFactor()
             };
             closeModal("closeAll");
             // toast.success("Password Updated Successfully");
             if (this.props.updatePasswordErr) {
                    
              this.setState({
                message_desc: "Password Not Updated in Dynamo.",
                message_heading: "Password",
                openMessageModal: true,
              })
              // toast.error("Password Not Updated in Dynamo");
             }
             if (this.props.updatePassword) {
               // toast.success("Password Updated Successfully In Dynamo");
             }
             this.setState({
               password: "",
               confirmPassword: "",
               accessCode: "",
               email: ""
             });
             await API.post("pivot", "/unloackatforgotpsw", {
               body: {
                 guid: this.state.email_guid,
                 LockedOut: false,
                 wpcount: 0
               }
             })
               .then(data => {
                
               })
               .catch(err => {
                 console.log(err);
               });
            
           })
           .catch(err => {
             // toast.error(err.message);
             this.state.required_messages.map(e => e.ID == 2 ?
               this.setState({
                 message_desc: e.Desc,
                 message_heading: e.Heading,
                 openMessageModal: true
               }) : '')
             closeModal("openForgotChangePasswordModal");
           });

         this.setState({
           isLoading: false
         });
         await this.props.clearStates();
         await this.clearStates()
       }
    }
  };
  closeModal = name => {
    if (name == "openForgotChangePasswordModal"){
      this.props.closeModal('openForgotChangePasswordModal')
      this.clearStates();
    }
    this.setState({ [name]: false });
  };
  updateTwoFactor = async () => {
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotUser",
        guid: this.state.email_guid,
        fieldname: "totp_setup_required",
        value: true
      }
    })
      .then(data => { })
      .catch(err => {
        console.log(err);
      });
  }
  checkbyemail = async () => {
    await API.post("pivot", "/usergetbyemailonly", {
      body: {
        email: this.state.email
      }
    })
      .then(data => {
        console.log(data.Items[0])
        this.setState({
          email_guid: data.Items[0].guid,
          email_two_factor: data.Items[0].two_factor
        })
      })
      .catch(err => {
        console.log(err);
      });
  };
  submitChangePass=(e)=>{ 
    if(e.keyCode==13){ 
     e.preventDefault();
     document.getElementById('febtn1').click();
    }
    else if(e.keyCode == 27){
      this.clearStates();
    }
  }
  closebutton = async()=>{
    this.clearStates();
    this.props.closeModal("openForgotChangePasswordModal");
    this.props.props.closeModal("openForgotSecurityModal");
    this.props.props.props.closeModal("openForgotEmailModal");
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
          onHide={() => this.props.closeModal("openForgotChangePasswordModal")}
          className="forgot_email_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="fcp_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 fcp_form_mx_width">
                    <div className="fcp_signup_form_main" onKeyUp={(e)=>this.submitChangePass(e)}>
                      <div className="fcp_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={() =>
                            this.closebutton()
                          } className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 fcp_order-xs-2">
                            <h4>Forgot - Change Password</h4>
                          </div>
                          <div className="col-12 col-sm-3 fcp_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="fcp_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div className="fcp_signup_form">
                              <div className="form-group pt-2">
                                <label htmlFor="password">Password</label>
                                <div className="fcp_password_eye">
                                  <input 
                                    type={this.state.show ? "text" : "password"}
                                    id="password1"
                                    className="form-control"
                                    value="pplummer@pivotreports"
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
                                    className="fcp_hidden_pass"
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
                                <div className="fcp_password_eye">
                                  <input
                                    type={
                                      this.state.showConfirm
                                        ? "text"
                                        : "password"
                                    }
                                    id="password"
                                    className="form-control"
                                    value="pplummer@pivotreports"
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
                                    className="fcp_hidden_pass"
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
                              <div className="fcp_bottom_btn">
                                <button
                                  onClick={()=>this.closeModal('openForgotChangePasswordModal')}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.closeModal('openForgotChangePasswordModal')
                                  }}}
                                  type="button"
                                  className="fcp_theme_btn fcp_back"
                                >
                                  Back
                                </button>
                                <button
                                id="febtn1"
                                  onClick={event =>
                                    this.onNext(event, this.props.closeModal)
                                  }
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.onNext(e, this.props.closeModal)
                                  }}}
                                  type="button"
                                  className="fcp_theme_btn"
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
const mapStateToProps = state => ({
  updatePassword: state.result.updatePassword,
  updatePasswordErr: state.result.updatePasswordErr
});
export default connect(
  mapStateToProps,
  {
    updatePasswordInDynamo,
    clearStates
  }
)(ForgotChangePassword);
