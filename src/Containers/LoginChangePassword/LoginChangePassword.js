import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./LoginChangePassword.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import { signupfunc, clearStates } from "../../actions/loginactions";
import Message from "../Modals/message/message";
import $ from "jquery";
let md5 = require("md5");

class LoginChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      show: false,
      showConfirm: false,
      openMessageModal: false,
      message_desc: "",
message_heading: "",
required_messages: [],
      pass: "",
      confpass: "",
      passerror: "",
      confpasserror: "",
      passflag: false,
      confpassflag: false
    };
  }
  componentWillMount = () => {
    if (!this.props.dynamocheckemail[0]) {
      this.props.history.push("/login");
    }
    var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
    //  var tips = JSON.parse(localStorage.getItem("ToolTip"));
    this.setState({
      required_messages: messages
    })
  };
  onchange = async event => {
    //alert(event.target.value);
    var name = event.target.name;
    var value = event.target.value;
    await this.setState({[name]: value});
  };
  onBlurHandle = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.validation(fieldName, fieldValue);
  }
  validation = (name, value) => {
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})"
    );

    switch (name) {
      case "pass":
        if (value.length < 1) {
          this.setState({
            passerror: "This Field is Required",
            passflag: false
          });
        } else if (!strongRegex.test(this.state.pass)) {
          this.setState({
            passerror:
              "password length should be 10 or greater and It must contain 'special characters, uppercase, lowercase and numbers'"
          });
        } else if (this.state.confpass) {
          if (this.state.pass !== this.state.confpass) {
            this.setState({
              confpasserror: "Password Not Matched",
              confpassflag: false,
              passerror: ""
            });
          } else {
            this.setState({
              confpasserror: "",
              passerror: ""
            });
          }
        } else {
          this.setState({
            passerror: "",
            passflag: true
          });
        }

        break;
      case "confpass":
        if (value !== "") {
          this.setState({
            confpasserror: "",
            confpassflag: true
          });
          if (value !== this.state.pass) {
            this.setState({
              confpasserror: "Password Not Matched",
              confpassflag: false
            });
          }
        } else {
          this.setState({
            confpasserror: "This Field is Required",
            confpassflag: false
          });
        }
        break;
    }
  };
  changepassword = async () => {
    let { passerror, confpasserror } = this.state;
    if (!this.state.pass) {
      passerror = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
    }
    else if(passerror == "password length should be 10 or greater and It must contain 'special characters, uppercase, lowercase and numbers'"){
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
    }
    if (!this.state.confpass) {
      confpasserror = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
    } else if (this.state.pass !== this.state.confpass) {
      confpasserror = "Password not matched.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
    }

    await this.setState({
      confpasserror,
      passerror
    });

    if (!this.state.confpasserror && !this.state.passerror) {
      await this.setState({ isLoading: true });
     await API.post("pivot", "/updatefields", {
        body: {
          table: "PivotUser",
          guid: this.props.dynamocheckemail[0].guid,
          fieldname: "Password",
          value: md5(this.state.pass)

        }
      })
        .then(async data => {
          // toast.success("password successfully updated");

          await this.props.signupfunc(
            this.props.dynamocheckemail[0].Email,
            this.props.dynamocheckemail[0].Email,
            this.state.pass
          );
          if (this.props.signupresult !== "") {
            // toast.success("user successfully sign up in cognito enter code we have sent on your email.");

            await this.props.clearStates();
            this.props.history.push("/signup-security", {
              signup: true,
              email: this.props.dynamocheckemail[0].Email,
              password: this.state.pass,
              guid: this.props.dynamocheckemail[0].guid
            });
          } else {
            this.setState({
              message_desc: "Failed to signup.",
              message_heading: "Sign Up",
              openMessageModal: true,
            })
            // toast.error("Failed to signup ");
            await this.props.clearStates();
            this.props.history.push("/login");
          }
        })
        .catch(err => {
          this.setState({
            message_desc: "Error in changing password.",
            message_heading: "Change password",
            openMessageModal: true,
          })
          // toast.error("error in changing password");
        });
     await this.setState({ isLoading: false });
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
  onPressEnterChangePass = (e) =>{
    if(e.which == 13){
      e.preventDefault()
      document.getElementById('SubmitButton').click();
    }
  }

  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="lcp_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center lcp_form_mx_width">
              <div className="lcp_signup_form_main">
                <div className="lcp_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 lcp_order-xs-2">
                      <h4>Login - Change Password</h4>
                    </div>
                    <div className="col-12 col-sm-3 lcp_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="lcp_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div id="FormSubmit" onKeyUp={this.onPressEnterChangePass} className="lcp_signup_form">
                        <div className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="lcp_password_eye">
                            <input
                              placeholder="enter password"
                              onChange={this.onchange}
                              autoFocus
                              onBlur={this.onBlurHandle}
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control"
                              name="pass"
                              value={this.state.pass}
                            />
                            <span
                              className="lcp_hidden_pass"
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

                            <div className="text-danger error-12">
                              {this.state.passerror !== ""
                                ? this.state.passerror
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="password">Confirm Password</label>
                          <div className="lcp_password_eye">
                            <input
                              placeholder="re-enter password"
                              onChange={this.onchange}
                              onBlur={this.onBlurHandle}
                              type={
                                this.state.showConfirm ? "text" : "password"
                              }
                              id="password"
                              name="confpass"
                              className="form-control"
                              value={this.state.confpass}
                            />
                            <span
                              className="lcp_hidden_pass"
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
                            <div className="text-danger error-12">
                              {this.state.confpasserror !== ""
                                ? this.state.confpasserror
                                : ""}
                            </div>
                          </div>
                        </div>
                        <Link to="/login">
                          <button
                            type="button"
                            className="lcp_theme_btn lcp_back"
                          >
                            Back
                          </button>
                        </Link>

                        <button
                          type="button"
                          id="SubmitButton"
                          onClick={this.changepassword}
                          onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                          onKeyUp={(e) =>{if(e.keyCode===13){
                            e.stopPropagation();
                            this.changepassword()
                          }}}
                          className="lcp_theme_btn"
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
  signupdetails: arg.result.signupresult,
  errorss: arg.result.errorsignup,
  dynamocheckemail: arg.result.dynamocheckemail
});

export default connect(
  mapStateToProps,
  { signupfunc, clearStates }
)(LoginChangePassword);
