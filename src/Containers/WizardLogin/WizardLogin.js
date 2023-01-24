import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./WizardLogin.css";
import { connect } from "react-redux";
import { signinfunc, checkindynamosignin } from "../../actions/loginactions";
import { signupfunc, clearStates } from "../../actions/loginactions";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Message from "../Modals/message/message";
import { API } from "aws-amplify";
import $ from "jquery";
let md5 = require("md5");

class WizardLogin extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      required_messages: [],
      show: false,
      rememberme: false,
      email: "",
      password: "",
      formErrors: {
        email: "",
        password: ""
      }
    };
  }

  SignIn = async () => {
    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
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
    else if (formErrors.email == "Please enter valid email format.") {
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
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
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
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.password) {
      await this.setState({
        isLoading: true
      });
      await this.props.checkindynamosignin(
        this.state.email,
        md5(this.state.password)

      );

      if (this.props.dynamocheckemail.length !== 0) {
        if (this.props.dynamocheckemail[0].type === "Owner" ) {
          if (this.state.rememberme) {
            cookie.save("useremail", this.state.email, {
              path: "/"
            });
            cookie.save("userpassword", this.state.password, {
              path: "/"
            });
          } else {
            cookie.remove("useremail", {
              path: "/"
            });
            cookie.remove("userpassword", {
              path: "/"
            });
          }

          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Wizard",
              "Description": "Login",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": "",
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);

          this.props.clearStates();
          this.props.history.push("/wizard-entity", {
            usersuccess: true
          });

        } else {
           // toast.error(" please login via login details");
           this.setState({
            message_desc: "Please login via login details",
            message_heading: "Invalid login",
            openMessageModal: true
          })
          $(document).ready(function(){
            $(this).find('#ok_button').focus();
          });

          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Wizard",
              "Description": "Failed attempts",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": "",
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);
          
        }
      } else {
        if (this.props.dynamocheckemail.length === 0) {
          // toast.error("user not Found");
          this.state.required_messages.map(e => e.ID == 4 ?
            this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true
            }) : ''
          );
          $(document).ready(function(){
            $(this).find('#ok_button').focus();
          });
        }
        if (this.props.dynamoerror !== "") {
          this.setState({
            message_desc: "User not get",
            message_heading: "User",
            openMessageModal: true,
          })
          // toast.error("user not get");
        }

        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Wizard",
            "Description": "Failed attempts",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": "",
            "Tenantid": localStorage.getItem('tenantguid')
          }
        ]);

        this.props.clearStates();
        this.props.history.push("/wizard-login");
      }
      await this.setState({
        isLoading: false
      });
    }
    // Auth.signOut();
    // await this.props.signinfunc("moazam996@gmail.com", "1Pakistan@");
  };


  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName == 'email') {
      fieldValue = fieldValue.toLowerCase();
    }
    this.setState({ [fieldName]: fieldValue });
    // this.validateField(fieldName, fieldValue);
  };
  onBlurHandle = (event) => {  
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.validateField(fieldName, fieldValue); 
  }

  validateField = async (name, value) => {
    let email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
      case "password":
        if (value.length < 1) {
          formErrors.password = "This Field is Required.";
        } else {
          formErrors.password = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };
  //set cookies
  remeberMe = e => {
    this.setState({
      rememberme: e.target.checked
    });
  };
  responseGoogle = async data => {
    if (data && data.profileObj) {
      let email = data.profileObj.email || null;
      let name = data.profileObj.name || null;
      let imgUrl = data.profileObj.imageUrl || null;

      if (this.props.dynamocheckemail.length !== 0) {
        await this.setState({
          isLoading: true
        });
        let user = this.props.dynamocheckemail[0];

        //update user data
        await API.post("pivot", "/updateUsersocial", {
          body: {
            guid: user.guid,
            Avatar: imgUrl,
            Username: name
          }
        })
          .then(async data => {
            // toast.success("User Updated Successfully");
          })
          .catch(err => {
            this.setState({
              message_desc: "User not Updated Successfully",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User not Updated Successfully");
          });
        await this.setState({
          isLoading: false
        });
        await this.SignIn();
      }
    }
    if (data && data.error && data.error === "popup_closed_by_user") {
     
      // toast.error("User not Updated");
      this.setState({
        message_desc : "User not found on google",
        message_heading: "User not updated",
        openMessageModal : true
      }) 
      $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
      await this.props.clearStates();
    }

  };
  googleOpenModal = async props => {
    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
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
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
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
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.password) {
      await this.setState({
        isLoading: true
      });
      await this.props.checkindynamosignin(
        this.state.email,
        md5(this.state.password)
      );

      if (this.props.dynamocheckemail.length !== 0) {
        if (this.props.dynamocheckemail[0].type === "Admin" && this.props.dynamocheckemail[0].kartracreated === true) {
          await props.onClick(); //open google modal
        } else {
          // toast.error(" please login via login details");
          this.setState({
            message_desc: "Please login via login details",
            message_heading: "Invalid login",
            openMessageModal: true
          })
          $(document).ready(function(){
            $(this).find('#ok_button').focus();
      })
        }
      } else {
        // toast.error("user not Found");
        this.state.required_messages.map(e=> e.ID == 4 ? 
          this.setState({
           message_desc : e.Desc,
           message_heading: e.Heading,
           openMessageModal : true
         })  :'')
         $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
      }
      await this.setState({
        isLoading: false
      });
    }
  };
  responseFacebook = async data => {

    if (data && data.email || data && data.name) {
      let email = data.email || null;
      let name = data.name || null;
      let imgUrl =
        (data && data.picture && data.picture.data && data.picture.data.url) ||
        null;

      if (this.props.dynamocheckemail.length !== 0) {
        await this.setState({
          isLoading: true
        });
        let user = this.props.dynamocheckemail[0];

        //update user data
        await API.post("pivot", "/updateUsersocial", {
          body: {
            guid: user.guid,
            Avatar: imgUrl,
            Username: name
          }
        })
          .then(async data => {
            // toast.success("User Updated Successfully");
          })
          .catch(err => {
            this.setState({
              message_desc: "User not Updated Successfully",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User not Updated Successfully");
          });
        await this.setState({
          isLoading: false
        });
        await this.SignIn();
      }
    } else {
      console.log(">>>>>Facebook login error");
      // toast.error("User not Updated");
      this.setState({
        message_desc : "User not found on facebook",
        message_heading: "User not updated",
        openMessageModal : true
      }) 
      $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
      await this.props.clearStates();
    }
  };
  fbOpenModal = async props => {
    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
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
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
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
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.password) {
      await this.setState({
        isLoading: true
      });
      await this.props.checkindynamosignin(
        this.state.email,
        md5(this.state.password)
      );

      if (this.props.dynamocheckemail.length !== 0) {
        if (this.props.dynamocheckemail[0].type === "Admin" && this.props.dynamocheckemail[0].kartracreated === true) {
          await props.onClick(); //open fb modal
        } else {
          // toast.error("you are not admin please login via login details");
          this.setState({
            message_desc: "You are not admin please login via login details",
            message_heading: "Invalid login",
            openMessageModal: true
          })
          $(document).ready(function(){
            $(this).find('#ok_button').focus();
      })
        }
      } else {
        // toast.error("user not Found");
        this.state.required_messages.map(e => e.ID == 4 ?
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
        isLoading: false
      });
    }
  };
  closeModal = name => {
    this.setState({ [name]: false });
  };
  getConfigs = async () => {
    await API.post("pivot", "/getconfig", {
      body: {
        guid: "MESSAGES"
      }
    })
      .then(data => {
        this.setState({
          required_messages: data.Message
        })
        // console.log(data.Message, 'MessageMessageMessageMessage');
        localStorage.setItem("RequiredMessages", JSON.stringify(data.Message))
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
  componentDidMount = async () => {
    await this.getConfigs();
  }
  onPressEnter_wizardLogin = (e) =>{
    if(e.which == 13){
      e.preventDefault()
      document.getElementById('NextButton').click();
    }
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
  };

  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="wl_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center wl_form_mx_width">
              <div onKeyUp={this.onPressEnter_wizardLogin} className="wl_signup_form_main">
                <div className="wl_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 wl_order-xs-2">
                      <h4>Wizard Setup – Login Details</h4>
                    </div>
                    <div className="col-12 col-sm-3 wl_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="wl_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div id="FormNext" className="wl_signup_form">
                        <div className="form-group">
                          <label for="email">Email</label>
                          <input
                            autocomplete="off"
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleFieldChange}
                            onBlur={this.onBlurHandle}
                            placeholder=""
                            autoFocus
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.email !== ""
                              ? this.state.formErrors.email
                              : ""}
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="wl_password_eye">
                            <input
                              autocomplete="off"
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control"
                              placeholder=""
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
                        </div>
                        <div className="custom-radio">
                            <label
                                className="login_container remember"
                                htmlFor="customRadio"
                              > Remember me
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customRadio"
                                name="example1"
                                checked={this.state.rememberme}
                                onChange={this.remeberMe}
                              />
                             
                             <span className="login_checkmark"></span>
                              </label> 
                            </div> 
                        {/* <div className="wl_social_login">
                          <label>Login with:</label>
                          <GoogleLogin
                            clientId="1066583344907-3m14fsb71o1lbh9uhu1k5bm91gijbcb7.apps.googleusercontent.com"
                            render={renderProps => (
                              <button
                                onClick={() =>
                                  this.googleOpenModal(renderProps)
                                }
                                onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                onKeyUp={(e) =>{if(e.keyCode===13){
                                  e.stopPropagation();
                                  this.googleOpenModal(renderProps)
                                }}}
                                className="btn btn-default wl_google_btn"
                              >
                                <img
                                  src="images/google.png"
                                  className="img-fluid float-left"
                                  alt="Google Login"
                                />
                                Google
                              </button>
                            )}
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={"single_host_origin"}
                          />
                          <FacebookLogin
                            appId="3339064519500965"
                            fields="name,email,picture"
                            autoLoad={false}
                            callback={this.responseFacebook}
                            render={renderProps => (
                              <button
                                onClick={() => this.fbOpenModal(renderProps)}
                                onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                onKeyUp={(e) =>{if(e.keyCode===13){
                                  e.stopPropagation();
                                  this.fbOpenModal(renderProps)
                                }}}
                                className="btn btn-default wl_fb_btn"
                              >
                                <img
                                  src="images/fb.png"
                                  className="img-fluid float-left"
                                  alt="Facebook Login"
                                />{" "}
                                Facebook
                              </button>
                            )}
                            />

                        </div> */}
                        <div className="wl_bottom_btn">
                          <button
                            onClick={this.SignIn}
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                            onKeyUp={(e) =>{if(e.keyCode===13){
                              e.stopPropagation();
                              this.SignIn()
                            }}}
                            id="NextButton"
                            type="button"
                            className="wl_theme_btn"
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
  signupdetails: arg.result.signupresult,
  signindetails: arg.result.signinresult,
  errorss: arg.result.errorsignup,
  errsignin: arg.result.errorsignin,
  dynamocheckemail: arg.result.dynamocheckemail,
  dynamoerror: arg.result.dynamoerror
});
export default connect(
  mapStateToProps,
  { signupfunc, signinfunc, checkindynamosignin, clearStates }
)(WizardLogin);
