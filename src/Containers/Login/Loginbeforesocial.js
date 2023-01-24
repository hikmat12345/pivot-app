import React, { Component } from "react";
import "./Login.css";
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";
import ForgotEmail from "../Modals/ForgotEmail/ForgotEmail";
import { connect } from "react-redux";
import { signinfunc, currentsessioncheck } from "../../actions/loginactions";
import { getUserEntities } from "../../actions/generalfuntions";
import {
  signupfunc,
  checkindynamosignin,
  signinout,
  clearStates
} from "../../actions/loginactions";
import cookie from "react-cookies";
import Message from "../Modals/message/message";
import { API } from "aws-amplify";
var moment = require('moment');
let md5 = require("md5");


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
        wpcount:0,
        tmp_guid:"",
        onlyemailcheck:false,
      moveToNextPage: false,
      formErrors: {
        email: "",
        password: ""
      }
    };
  }
  componentWillMount = async () => {
    let ckmail = cookie.load("useremail");
    let ckpass = cookie.load("userpassword");
    if (ckmail !== undefined && ckpass !== undefined) {
      await this.setState({
        email: ckmail,
        password: ckpass,
        rememberme: true
      });
    }
    await this.props.currentsessioncheck();
    if (this.props.isAuthenticated) {
      this.props.history.push("/projects");
    }
      await this.getConfigs();
await this.getConfigsTool();
  };
  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    if(fieldName == 'email'){
      fieldValue = fieldValue.toLowerCase();
    }
    this.setState({ [fieldName]: fieldValue });
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
    event.preventDefault();
     
    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
        this.state.required_messages.map(e=> e.ID == 1 ? 
this.setState({
message_desc : e.Desc,
message_heading: e.Heading,
openMessageModal : true
}) :'')
    }
      else if(formErrors.email == "Please enter valid email format."){
this.state.required_messages.map(e=> e.ID == 1 ? 
this.setState({
message_desc : e.Desc,
message_heading: e.Heading,
openMessageModal : true
}) :'')
}
    if (!this.state.password) {
      formErrors.password = "This Field is Required.";
        this.state.required_messages.map(e=> e.ID == 1 ? 
this.setState({
message_desc : e.Desc,
message_heading: e.Heading,
openMessageModal : true
}) :'')
        
    }
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.email && !formErrors.password) {
   
      await this.setState({
        isLoading: true
      });
        
         await this.checkbyemail();
        if(this.state.onlyemailcheck){
      await this.props.checkindynamosignin(
        this.state.email,
         md5(this.state.password)

      );
      // console.log(this.props.dynamocheckemail[0] && this.props.dynamocheckemail[0].KartaUserId,'dynamocheckemaildynamocheckemail')
      // console.log(this.props.dynamocheckemail[0].LockedOut,'dynamocheckemaildynamocheckemail')
      
    

      if (this.props.dynamocheckemail.length !== 0) {
          
          //check time to reset locked out user
         if(this.props.dynamocheckemail[0].lockedouttime!==null){ 
        var a = this.props.dynamocheckemail[0].lockedouttime;
        var b = moment.utc();
    

        var x = b.diff(a);
        var d = moment.duration(x, 'milliseconds');
        var mins = Math.floor(d.asMinutes());

          //end reset
         }else{
             var min =16;
         }
          
            if(this.props.dynamocheckemail[0].Disabled == true){
            toast.error("You Can't Signin Because This User Is Disabled");
              this.setState({
          message_desc : "You Can't Signin Because This User Is Disabled",
          message_heading: "User Disabled",
          openMessageModal : true
        }) 
            }
          else if( this.props.dynamocheckemail[0].LockedOut == true&&mins<15){
        
        toast.error("You Can't Signin Because This User Is Locked Out");
               this.setState({
          message_desc : "You Can't Signin Because This User Is Locked Out",
          message_heading: "User Locked Out",
          openMessageModal : true
        }) 
      }
      else{
        //login call---------------
          
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
          
            if (this.props.dynamocheckemail[0].kartracreated === false) {
                  this.props.history.push("/login-change-password");
                 
 } else {
            toast.error(
              "you are admin so can't signup here, only login here, please go through wizard login once."
            );
          }
            
    
        } else if (
          this.props.errsignin !== "" &&
          this.props.errsignin.message === "Incorrect username or password."
        ) {
             
          toast.error(this.props.errsignin.message);
          this.props.clearStates();
        } else if (
          this.props.errsignin !== "" &&
          this.props.errsignin.message === "User is not confirmed."
        ) {
          toast.error(this.props.errsignin.message);
          this.props.clearStates();
          Auth.resendSignUp(this.state.email)
            .then(() => {
              // toast.success("code resent successfully");
              this.props.history.push("/signup-security", {
                signup: true,
                email: this.state.email,
                password: this.state.password
              });
            })
            .catch(e => {
              toast.error("code not resent successfully");
            });
        } else {
          if (this.props.dynamocheckemail.length !== 0) {
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
                this.resetlockedout();
            if (this.props.dynamocheckemail[0].totp_setup_required) {
              await Auth.setupTOTP(this.props.signindetails)
                .then(code => {
                  this.props.history.push("/login-security", {
                    email: this.state.email,
                    code: code,
                    password: this.state.password
                  });
                })
                .catch(err => {
                  toast.error("totp setup faild");
                });
            } else {
              
              this.props.history.push("/projects");
            }
          } else {
            toast.error("user not found in dynamo");
            await this.props.signinout();

            if (this.props.signoutresult !== "") {
              this.props.history.push("/login");
            }
            this.props.clearStates();
          }
        }
      } } else {
          if(this.state.wpcount<3){
           await this.countplus();
          }
        toast.error("user not logged in dynamo");
           this.state.required_messages.map(e=> e.ID == 4 ? 
          this.setState({
           message_desc : e.Desc,
           message_heading: e.Heading,
           openMessageModal : true
         })  :'')
        await this.props.signinout();

        if (this.props.signoutresult !== "") {
          this.props.history.push("/login");
        }
        this.props.clearStates();
      }
    
        }else{
            toast.error("email not correct");
        }
      await this.setState({
        isLoading: false
      });
    }
  };


resetlockedout=async()=>{
    var count=0;
    var guid=this.state.tmp_guid;
      await API.post('pivot','/updatefields',{
        body:{
            table:"PivotUser",
            guid:guid,
            fieldname:"wpcount",
            value:count
        }
    }).then(data=>{
       
    }).catch(err=>{
        console.log(err);
    })
      
     
          await API.post('pivot','/userlockout',{
        body:{
            guid:guid,
           LockedOut:false,
lockedouttime:this.props.dynamocheckemail[0].lockedouttime
        }
    }).then(data=>{
       
    }).catch(err=>{
        console.log(err);
    })
      
      
}
//wrong password count
countplus=async()=>{
    var count=this.state.wpcount+1;
    var guid=this.state.tmp_guid;
      await API.post('pivot','/updatefields',{
        body:{
            table:"PivotUser",
            guid:guid,
            fieldname:"wpcount",
            value:count
        }
    }).then(data=>{
       
    }).catch(err=>{
        console.log(err);
    })
      
      if(count>=3){
          await API.post('pivot','/userlockout',{
        body:{
            guid:guid,
           LockedOut:true,
lockedouttime:moment.utc()
        }
    }).then(data=>{
       
    }).catch(err=>{
        console.log(err);
    })
      }
      
}
//check by email
checkbyemail=async()=>{
    await API.post('pivot','/usergetbyemailonly',{
        body:{
            email:this.state.email
        }
    }).then(data=>{
        if(data.Count>0){
           this.setState({
               onlyemailcheck:true,
               wpcount:data.Items[0].wpcount,
               tmp_guid:data.Items[0].guid,
               
           })
        }
       
    }).catch(err=>{
        console.log(err);
    })
   
}

  //set cookies
  remeberMe = e => {
    this.setState({
      rememberme: e.target.checked
    });
  };

  openModal = name => {
    this.setState({ [name]: true });
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
required_messages : data.Message
})
// console.log(data.Message,'MessageMessageMessageMessage');
localStorage.setItem("RequiredMessages",JSON.stringify(data.Message))
// this.setState({ config: data });
// toast.success("Formats Get Successfully");
})
.catch(err => toast.error("Error While Getting Messages"));
};
getConfigsTool = async () => {
await API.post("pivot", "/getconfig", {
body: {
guid: "TOOLTIPS"
}
})
.then(data => {
this.setState({
required_tips : data.ToolTip
})
// console.log(data.ToolTip,'TOOLTIPSTOOLTIPSTOOLTIPS');
localStorage.setItem("ToolTip",JSON.stringify(data.ToolTip))
// this.setState({ config: data });
// toast.success("Formats Get Successfully");
})
.catch(err => toast.error("Error While Getting Messages"));
};

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
                      <div className="login_signup_form">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="pplummer@pivotreports.com"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleFieldChange}
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
                              placeholder="password"
                              name="password"
                              value={this.state.password}
                              onChange={this.handleFieldChange}
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
                          <div className="col-12 col-md-6">
                            <div className="custom-control custom-radio">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customRadio"
                                name="example1"
                                checked={this.state.rememberme}
                                onChange={this.remeberMe}
                              />
                              <label
                                className="custom-control-label remember"
                                htmlFor="customRadio"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="custom-control forgot_pass">
                              <label
                                onClick={() =>
                                  this.openModal("openForgotEmailModal")
                                }
                                htmlFor="forgot"
                              >
                                Forgot Password
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="login_social_login">
                          <label>Login with:</label>
                          <button className="btn btn-default login_google_btn">
                            <img
                              src="images/google.png"
                              className="img-fluid float-left"
                              alt="Google Login"
                            />{" "}
                            Google
                          </button>
                          <button className="btn btn-default login_fb_btn">
                            <img
                              src="images/fb.png"
                              className="img-fluid float-left"
                              alt="Facebook Login"
                            />{" "}
                            Facebook
                          </button>
                        </div>
                        <a
                          href="#"
                          onClick={this.login}
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
        />
            <Message
openModal = {this.state.openMessageModal}
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
  signoutresult: arg.result.signoutresult
});
export default connect(
  mapStateToProps,
  {
    signupfunc,
    signinfunc,
    currentsessioncheck,
    checkindynamosignin,
    signinout,
    clearStates
  }
)(Login);
