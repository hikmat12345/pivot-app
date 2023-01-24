import "./Login.css";

import React, { Component } from "react";
import {
  checkindynamosignin,
  clearStates,
  signinout,
  signupfunc
} from "../../actions/loginactions";
import { currentsessioncheck, signinfunc } from "../../actions/loginactions";

import $ from "jquery";
import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import ForgotEmail from "../Modals/ForgotEmail/ForgotEmail";
import GoogleLogin from "react-google-login";
import { Link } from "react-router-dom";
import Message from "../Modals/message/message";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { getUserEntities } from "../../actions/generalfuntions";
import { toast } from "react-toastify";

var moment = require("moment");
let md5 = require("md5");
var counterbruteforce=0;
class Login extends Component {
  constructor() {
    super();

    this.state = {
      rememberme: false,
      isLoading: false,
      show: false,
      openForgotEmailModal: false,
      email: "",
      password: "",
      required_messages: [],
      required_tips: [],
      message_heading: "",
      message_desc: "",
      openMessageModal: false,
      wpcount: 0,
      tmp_guid: "",
      onlyemailcheck: false,
      moveToNextPage: false,
      formErrors: {
        email: "",
        password: ""
      }
    };
  }
  
  componentWillMount = async () => {
        await this.props.currentsessioncheck();
    let ckmail = cookie.load("useremail");
    let ckpass = cookie.load("userpassword");

    if (ckmail !== undefined && ckpass !== undefined) {
      await this.setState({
        email: ckmail,
        password: ckpass,
        rememberme: true
      });
    }
  
    if(this.props.isAuthenticated) {
      this.props.history.push("/projects", {
        from: "/login"
      });
        
    }
    const urlParams = new URLSearchParams(window.location.search);
    const email_field = urlParams.get('email');
    const password_field = urlParams.get('password');
    // console.log(email_field,'email_field',password_field)
    if (email_field !== null && password_field !== null) {
      await this.setState({
        email: email_field,
        password: password_field
      })
    }
    await this.getConfigs();
    await this.getConfigsTool();
      $(document).ready(function(){
$(this).find('#email').focus();
})
  };

  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName == "email") {
      fieldValue = fieldValue.toLowerCase();
    }
    this.setState({ [fieldName]: fieldValue });
    // this.validateField(fieldName, fieldValue);
  };

  onBlurHandle = (event) => {  
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.validateField(fieldName, fieldValue); 
  };

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

  login = async event => {

    
    // event.preventDefault();

    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ""
      );
      $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })

    } else if (formErrors.email == "Please enter valid email format.") {
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ""
      );
      $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ""
      );
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



counterbruteforce=counterbruteforce+1;

if(counterbruteforce>3){
    window.open("https://www.google.com/", "_self");
}
      await this.checkbyemail();
        
      if (this.state.onlyemailcheck) {
        await this.props.checkindynamosignin(
          this.state.email,
          md5(this.state.password)
        );
        // console.log(this.props.dynamocheckemail[0] && this.props.dynamocheckemail[0].KartaUserId,'dynamocheckemaildynamocheckemail')
        // console.log(this.props.dynamocheckemail[0].LockedOut,'dynamocheckemaildynamocheckemail')

        if (this.props.dynamocheckemail.length !== 0) {
          //check time to reset locked out user
          if (this.props.dynamocheckemail[0].lockedouttime !== null) {
            var a = this.props.dynamocheckemail[0].lockedouttime;
            var b = moment.utc();

            var x = b.diff(a);
            var d = moment.duration(x, "milliseconds");
            var mins = Math.floor(d.asMinutes());

            //end reset
          } else {
            var min = 59;
          }

          if (this.props.dynamocheckemail[0].Disabled == true) {
            // toast.error("You Can't Signin Because This User Is Disabled");
            this.setState({
              message_desc: "You Can't Signin Because This User Is Disabled",
              message_heading: "User Disabled",
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
                "Module": "Login",
                "Description": "Login Disabled",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": "",
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);


          } else if (
            this.props.dynamocheckemail[0].LockedOut == true &&
            mins < 59
          ) {
            // toast.error("You Can't Signin Because This User Is Locked Out");
            this.state.required_messages.map(e =>
              e.ID == 3
                ? this.setState({
                  message_desc: e.Desc,
                  message_heading: e.Heading,
                  openMessageModal: true
                })
                : ""
            );
            $(document).ready(function(){
              $(this).find('#ok_button').focus();
            });
                  

            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Login",
                "Description": "Login Locked Out",
                "ProjectName": "",
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": "",
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);


          } else {
            //login call---------------
            this.resetlockedout();
            await this.props.signinfunc(this.state.email, this.state.password);

            if (
              this.props.signindetails.challengeName === "SMS_MFA" ||
              this.props.signindetails.challengeName === "SOFTWARE_TOKEN_MFA"
            ) {
              this.props.history.push("/login-security", {
                email: this.state.email,
                code: "code",
                password: this.state.password
              });
            } else if (
              this.props.errsignin !== "" &&
              this.props.errsignin.message === "User does not exist."
            ) {
              //Create user if not found in cognito

              if (this.props.dynamocheckemail[0].type !== "Owner") {
                this.props.history.push("/login-change-password");
              } else {
                // toast.error(
                //   "you are admin so can't signup here, only login here, please go through wizard login once."
                // );
                this.setState({
                  message_desc: "you are admin so can't signup here, only login here, please go through wizard login once.",
                  message_heading: "Login",
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
                    "Module": "Login",
                    "Description": "Login Attempt Failed",
                    "ProjectName": "",
                    "ColumnName": "",
                    "ValueFrom": "",
                    "ValueTo": "",
                    "Tenantid": localStorage.getItem('tenantguid')
                  }
                ]);
    
    
              }
            } else if (
              this.props.errsignin !== "" &&
              this.props.errsignin.message === "Incorrect username or password."
            ) {
              // toast.error(this.props.errsignin.message);
              this.setState({
                message_desc: this.props.errsignin.message,
                message_heading: "Error",
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
                  "Module": "Login",
                  "Description": "Login Attempt Failed",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": "",
                  "ValueTo": "",
                  "Tenantid": localStorage.getItem('tenantguid')
                }
              ]);
  
  
              this.props.clearStates();
            } else if (
              this.props.errsignin !== "" &&
              this.props.errsignin.message === "User is not confirmed."
            ) {
              // toast.error(this.props.errsignin.message);
              this.setState({
                message_desc: this.props.errsignin.message,
                message_heading: "Error",
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
                  "Module": "Login",
                  "Description": "Login Attempt Failed",
                  "ProjectName": "",
                  "ColumnName": "",
                  "ValueFrom": "",
                  "ValueTo": "",
                  "Tenantid": localStorage.getItem('tenantguid')
                }
              ]);
  
  
              this.props.clearStates();
              Auth.resendSignUp(this.state.email)
                .then(() => {
                  // toast.success("code resent successfully");
                  this.setState({
                    message_desc: "Code Resent Successfully",
                    message_heading: "Code Sent",
                    openMessageModal: true
                  })
                  $(document).ready(function(){
                    $(this).find('#ok_button').focus();
              })
                  this.props.history.push("/signup-security", {
                    signup: true,
                    email: this.state.email,
                    password: this.state.password
                  });
                })
                .catch(e => {
                  // toast.error("code not resent successfully");
                  this.setState({
                    message_desc: "Code Sent Faild",
                    message_heading: "Code Not Sent",
                    openMessageModal: true
                  })
                  $(document).ready(function(){
                    $(this).find('#ok_button').focus();
              })
                });
            } else {
              if (this.props.dynamocheckemail.length !== 0) {

                await this.props.getUserEntities(this.props.dynamocheckemail[0].tenantguid);
                let isSubscriptionExpired = await this.verifiySubscriptions(this.props.getUserEntity);
                
                if(!isSubscriptionExpired||this.props.dynamocheckemail[0].tenantguid==="SYSTEM") {
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
                
                  if (this.props.dynamocheckemail[0].totp_setup_required) {
                      
                    await Auth.setupTOTP(this.props.signindetails)
                      .then(code => {
                        counterbruteforce=0;
                        this.props.history.push("/login-security", {
                          email: this.state.email,
                          code: code,
                          password: this.state.password
                        });
                      })
                      .catch(err => {
                        // toast.error("totp setup faild");
                        this.setState({
                          message_desc: "Totp Setup Faild",
                          message_heading: "Faild",
                          openMessageModal: true
                        })
                        $(document).ready(function(){
                          $(this).find('#ok_button').focus();
                    })
                      });
                  } else {
  //this.props.signindetails.setDeviceStatusNotRemembered({
  //          onSuccess: function (result) {
  //            console.log('call result: ' + result);
  //          },
  //
  //       
  //        });
                      counterbruteforce=0;
                    this.props.history.push("/projects");
                    
  
                    let dateTime = new Date().getTime();
                    this.activityRecord([
                      {
                        "User": localStorage.getItem('Email'),
                        "Datetime": dateTime,
                        "Module": "Login",
                        "Description": "Login",
                        "ProjectName": "",
                        "ColumnName": "",
                        "ValueFrom": "",
                        "ValueTo": "",
                        "Tenantid": localStorage.getItem('tenantguid')
                      }
                    ]);
  
  
                  }
                } else {
                  // toast.error("user not found in dynamo");
                  this.setState({
                    message_desc: "User Subscription Expired.",
                    message_heading: "Subscription Expired",
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
                      "Module": "Login",
                      "Description": "User Subscription Expired.",
                      "ProjectName": "",
                      "ColumnName": "",
                      "ValueFrom": "",
                      "ValueTo": "",
                      "Tenantid": localStorage.getItem('tenantguid')
                    }
                  ]);
      
      
                  await this.props.signinout();

                  if (this.props.signoutresult !== "") {
                    this.props.history.push("/login");
                  }
                  this.props.clearStates();
                }
                //
              } else {
                // toast.error("user not found in dynamo");
                this.setState({
                  message_desc: "User not found in dynamo",
                  message_heading: "User not found",
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
                    "Module": "Login",
                    "Description": "Login Attempt Failed",
                    "ProjectName": "",
                    "ColumnName": "",
                    "ValueFrom": "",
                    "ValueTo": "",
                    "Tenantid": localStorage.getItem('tenantguid')
                  }
                ]);
    
    
                await this.props.signinout();

                if (this.props.signoutresult !== "") {
                  this.props.history.push("/login");
                }
                this.props.clearStates();
              }
            }
          }
        } else {
          if (this.state.wpcount < 3) {
            await this.countplus();
          }
          // toast.error("user not logged in dynamo");
          this.setState({
            message_desc: "User not logged in dynamo",
            message_heading: "User not logged in",
            openMessageModal: true
          })
          $(document).ready(function(){
            $(this).find('#ok_button').focus();
          });
          if (this.state.wpcount >= 3){
            this.state.required_messages.map(e =>
              e.ID == 3
                ? this.setState({
                  message_desc: e.Desc,
                  message_heading: e.Heading,
                  openMessageModal: true
                })
                : ""
            );
            $(document).ready(function(){
              $(this).find('#ok_button').focus();
            });
          } else {
            this.state.required_messages.map(e =>
              e.ID == 4
                ? this.setState({
                  message_desc: e.Desc,
                  message_heading: e.Heading,
                  openMessageModal: true
                })
                : ""
            );
            $(document).ready(function(){
              $(this).find('#ok_button').focus();
            });
          }
          await this.props.signinout();

          if (this.props.signoutresult !== "") {
            this.props.history.push("/login");
          }
          this.props.clearStates();
                  

          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Login",
              "Description": "Login Attempt Failed",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": "",
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);


        }
      } else {
        // toast.error("email not correct");
        this.state.required_messages.map(e => e.ID == 10 ?
          this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          }) : ''
        )
        $(document).ready(function(){
          $(this).find('#ok_button').focus();
        })
                  

        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Login",
            "Description": "Login Attempt Failed",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": "",
            "Tenantid": localStorage.getItem('tenantguid')
          }
        ]);


      }
        
        
        
      await this.setState({
        isLoading: false
      });
    }
  };

  resetlockedout = async () => {
    var count = 0;
    var guid = this.state.tmp_guid;
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotUser",
        guid: guid,
        fieldname: "wpcount",
        value: count
      }
    })
      .then(data => { })
      .catch(err => {
        console.log(err);
      });

    await API.post("pivot", "/userlockout", {
      body: {
        guid: guid,
        LockedOut: false,
        lockedouttime: this.props.dynamocheckemail[0].lockedouttime
      }
    })
      .then(data => { })
      .catch(err => {
        console.log(err);
      });
  };

  //wrong password count
  countplus = async () => {
    var count = this.state.wpcount + 1;
    var guid = this.state.tmp_guid;
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotUser",
        guid: guid,
        fieldname: "wpcount",
        value: count
      }
    })
      .then(data => { })
      .catch(err => {
        console.log(err);
      });

    if (count >= 3) {
      await API.post("pivot", "/userlockout", {
        body: {
          guid: guid,
          LockedOut: true,
          lockedouttime: moment.utc()
        }
      })
        .then(data => { })
        .catch(err => {
          console.log(err);
        });
    }
  };

  //check by email
  checkbyemail = async () => {
    await API.post("pivot", "/usergetbyemailonly", {
      body: {
        email: this.state.email
      }
    })
      .then(data => {
        if (data.Count > 0) {
          this.setState({
            onlyemailcheck: true,
            wpcount: data.Items[0].wpcount,
            tmp_guid: data.Items[0].guid
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //set cookies
  remeberMe = e => {
    this.setState({
      rememberme: e.target.checked
    });
  };

  openModal =async(name) => {

   await this.setState({ [name]: true });
    $(document).ready(function () { 
      $('#tex').focus(); 
    });
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
        });
        // console.log(data.Message,'MessageMessageMessageMessage');
        localStorage.setItem("RequiredMessages", JSON.stringify(data.Message));
        // this.setState({ config: data });
        // toast.success("Formats Get Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Messages.",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Messages")
      });
  };

  getConfigsTool = async () => {
    await API.post("pivot", "/getconfig", {
      body: {
        guid: "TOOLTIPS"
      }
    })
      .then(data => {
        this.setState({
          required_tips: data.ToolTip
        });
        // console.log(data.ToolTip,'TOOLTIPSTOOLTIPSTOOLTIPS');
        localStorage.setItem("ToolTip", JSON.stringify(data.ToolTip));
        // this.setState({ config: data });
        // toast.success("Formats Get Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Messages.",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Messages")
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
              message_desc: "User not Updated Successfully.",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User not Updated Successfully");
          });
        await this.setState({
          isLoading: false
        });
        await this.login();
      }
    }
    if (data && data.error && data.error === "popup_closed_by_user") {
      console.log(">>>1122>>google login error");
      // toast.error("User not Updated");
      this.setState({
        message_desc: "User not found on google",
        message_heading: "User not updated",
        openMessageModal: true
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
      await this.checkbyemail();

      if (this.state.onlyemailcheck) {
        await this.props.checkindynamosignin(
          this.state.email,
          md5(this.state.password)
        );

        if (this.props.dynamocheckemail.length !== 0) {
          await props.onClick(); //open google modal
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
      } else {
        // toast.error("email not correct");
        this.state.required_messages.map(e => e.ID == 10 ?
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

  responseFacebook = async data => {
   
    if ((data && data.email) || (data && data.name)) {
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
              message_desc: "User not Updated Successfully.",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User not Updated Successfully");
          });
        await this.setState({
          isLoading: false
        });
        await this.login();
      }
    } else {
      console.log(">>>>>Facebook login error");
      // toast.error("User not Updated");
      this.setState({
        message_desc: "User not found on facebook",
        message_heading: "User not updated",
        openMessageModal: true
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
      await this.checkbyemail();

      if (this.state.onlyemailcheck) {
        await this.props.checkindynamosignin(
          this.state.email,
          md5(this.state.password)
        );

        if (this.props.dynamocheckemail.length !== 0) {
          await props.onClick(); //open fb modal
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
      } else {
        // toast.error("email not correct");
        this.state.required_messages.map(e => e.ID == 10 ?
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

  onPressEnter_Login = (e) =>{
    if(e.which == 13){
      e.preventDefault()
      document.getElementById('SubmitButton').click();
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
        return true;
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

  handleForgotEmailModal = async () => {

   await this.openModal("openForgotEmailModal");

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Login",
        "Description": "Forgot Password",
        "ProjectName": "",
        "ColumnName": "",
        "ValueFrom": "",
        "ValueTo": "",
        "Tenantid": localStorage.getItem('tenantguid')
      }
    ]);
  }

  verifiySubscriptions = async (subscriptions) => {
    if(subscriptions) {
      console.log("verifiySubscriptions", subscriptions);
  
      if(subscriptions.Item && subscriptions.Item.Subscription) {
        let dates = subscriptions.Item.Subscription.map(item => (item.SubscritionExpires * 1000));
        let currentDate = new Date().getTime();
        let orderedDates = undefined;
        let isSubscriptionExpired = undefined;
    
        orderedDates = dates.sort((a, b) => {
          return a > b
        });

        // isSubscriptionExpired = new Date(currentDate) > new Date(new Date().setDate(new Date().getDate()-40));
        isSubscriptionExpired = new Date(currentDate) > new Date(orderedDates[orderedDates.length - 1]);
        if(isSubscriptionExpired) {
          isSubscriptionExpired = Math.floor( ( currentDate - new Date(orderedDates[orderedDates.length - 1]) ) / 86400000) >= 30 ? true : false;
        }

        return isSubscriptionExpired;
      }
    }
    return undefined;
  }

  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="login_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center login_form_mx_width">
              <div className="login_signup_form_main">
                <div className="login_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 login_order-xs-2">
                      <h4>Login - Details</h4>
                    </div>
                    <div className="col-12 col-sm-3 login_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="login_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div id="FormSubmit" onKeyUp={this.onPressEnter_Login} className="login_signup_form">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email" 
                            name="email"
                            value={this.state.email}
                            onChange={this.handleFieldChange}
                            onBlur={this.onBlurHandle}
                            autoComplete="false"
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.email !== ""
                              ? this.state.formErrors.email
                              : ""}
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="login_password_eye">
                            <input
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control login_pass"

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
                              className="login_hidden_pass"
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
                        <div className="row">
                          <div className="col-6">
                          <div className="custom-radio" id="remember_melogin">
                            <label
                                className="login_container remember"
                                htmlFor="customRadio"
                              > <span>Remember me</span>
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
                          </div>
                          <div className="col-6">
                            <div className="forgot_pass">
                          
                              <label
                                className="cursor-pointer"
                                onClick={()=>this.handleForgotEmailModal()}
                                htmlFor="forgot"
                              >
                                Forgot Password
                              </label>
                             
                            </div>
                          </div>
                        </div>

                        {/* <div className="login_social_login">
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
                                className="btn btn-default login_google_btn"
                              >
                                <img
                                  src="images/google.png"
                                  className="img-fluid float-left"
                                  alt="Google Login"
                                />{" "}
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
                                className="btn btn-default login_fb_btn"
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
                        <a
                          // href="#"
                          onClick={this.login}
                          onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                          onKeyUp={(e) =>{if(e.keyCode===13){
                            e.stopPropagation();
                            this.login()
                          }}}
                          id="SubmitButton"
                          className="login_bottom_btn"
                        >
                          <button type="button" className="login_theme_btn">
                            Login
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ForgotEmail
          openModal={this.state.openForgotEmailModal}
          closeModal={() => this.closeModal("openForgotEmailModal")}
          props={this.props}
          required_messages={this.state.required_messages}
          required_tips={this.state.required_tips}
          
        />
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
  isAuthenticated: arg.result.isAuthenticated,
  dynamocheckemail: arg.result.dynamocheckemail,
  dynamoerror: arg.result.dynamoerror,
  signoutresult: arg.result.signoutresult,  
  getUserEntity: arg.commonRresult.getUserEntity,
});
export default connect(mapStateToProps, {
  signupfunc,
  signinfunc,
  currentsessioncheck,
  checkindynamosignin,
  signinout,
  clearStates,
  getUserEntities
})(Login);
