import React, { Component } from "react";
import "./LoginSecurity.css";
import { signinconfirm, signinout, clearStates, currentsessioncheck, clearallstates } from "../../actions/loginactions";
import { updatefield, clearStatesCommon } from "../../actions/generalfuntions";
import { connect } from "react-redux";
import QRCode from 'qrcode.react';
import { Auth } from "aws-amplify";
import { toast } from "react-toastify";
import Tooltip from "../Common/Tooltip/Tooltip";
import Message from "../Modals/message/message";
import { Link } from "react-router-dom";
import $ from "jquery";
class LoginSecurity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      required_tips: [],
      required_messages: [],
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      accessCode: "",
      formErrors: {
        accessCode: "",
        codetotp: "",
        isLoading: false
      }
    };
  }
  componentWillMount = async () => {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.email !== undefined && this.props.dynamocheckemail[0]
    ) {
      this.setState({
        email: this.props.location.state.email,
        codetotp: this.props.location.state.code
      });

    } 
    else {
      this.props.history.push("/login");
    }
      // console.log(this.props.location.state.code,'asasasas')
    var tips = JSON.parse(localStorage.getItem("ToolTip"));
    var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
    await this.setState({
      required_messages: messages,
      required_tips: tips,
    })
  };
  handleAccessCode = async event => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    await this.setState({ accessCode: event.target.value });
    this.validateField(fieldName, fieldValue);
  };

  validateField = async (name, value) => {
    var formErrors = this.state.formErrors;
    switch (name) {
      case "accessCode":
        if (value.length < 1) {
          formErrors.accessCode = "This Field is Required.";
        } else {
          formErrors.accessCode = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };

  onNext = async event => {
    var formErrors = this.state.formErrors;
    if (!this.state.accessCode) {
      formErrors.accessCode = "This Field is Required.";
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
    if (!formErrors.accessCode) {
      await this.setState({
        isLoading: true
      });
      if (this.state.codetotp !== "code") {
        await Auth.verifyTotpToken(this.props.signindetails, this.state.accessCode).then(() => {

          // toast.success("setting Totp");
          Auth.setPreferredMFA(this.props.signindetails, 'TOTP').then(data => {
            this.props.updatefield("PivotUser", this.props.dynamocheckemail[0].guid, "totp_setup_required", false);
          });
          // ...
        }).catch(e => {
          this.setState({
            message_desc: "Token is not verified.",
            message_heading: "Token",
            openMessageModal: true,
          })
          // toast.error("Token is not verified");
        });


        if (this.props.fieldupdateerr !== "") {
          this.setState({
            message_desc: "Flag is not updated in dynamo.",
            message_heading: "Token",
            openMessageModal: true,
          })
          // toast.error('Flag is not updated in dynamo');
          await this.props.clearStates();
          await this.props.clearStatesCommon();
        }
      } else {

        await this.props.signinconfirm(
          this.props.signindetails,
          this.state.accessCode,
          "SOFTWARE_TOKEN_MFA"
        );

        if (this.props.confirmsigninerr !== "") {
          this.setState({
            message_desc: this.props.confirmsigninerr,
            message_heading: "Configuration",
            openMessageModal: true,
          })
          // toast.error(this.props.confirmsigninerr)
        }
        if (this.props.dynamocheckemail[0].two_factor === false) {
          await Auth.setPreferredMFA(this.props.signindetails, 'NOMFA')

        }
      }
        var thatq=this;
      await this.props.currentsessioncheck();
      if (this.props.isAuthenticated) {
        this.props.signindetails.setDeviceStatusRemembered({
          onSuccess: function (result) {
            console.log('call result: ' + result);
          },

          onFailure: function (err) {
            // alert(err);
            // this.state.required_messages.map(e => e.ID == 2 ?
              thatq.setState({
                message_desc: err,
                message_heading: "Error",
                openMessageModal: true
              }) 
              $(document).ready(function(){
                $(this).find('#ok_button').focus();
          })
              // : '')
          }
        });     

        this.props.history.push("/projects");
        this.props.clearStates();
        this.props.clearStatesCommon();
        this.props.clearallstates();
      } else {
        this.setState({
          message_desc: 'code not verified',
          message_heading: "Code",
          openMessageModal: true,
        })
        // toast.error("code not verified");
        this.state.required_messages.map(e => e.ID == 2 ?
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
  onClickBack = async ()=>{
    await this.props.signinout();
    if (this.props.signoutresult !== "") {
      localStorage.removeItem("guid");
      localStorage.removeItem("tenantguid");
      localStorage.removeItem("Email");
      this.props.history.push("/login");
    }
  }
  onPressNext = (e) =>{
if (e.keyCode == 13){
document.getElementById('next_btn').click()
}
  }
  render() {
    const str = "otpauth://totp/AWSCognito:" + this.state.email + "?secret=" + this.state.codetotp + "&issuer=" + "Pivot";

    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="ls_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center ls_form_mx_width">
              <div className="ls_signup_form_main">
                <div className="ls_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 ls_order-xs-2">
                      <h4>Login - Security</h4>
                    </div>
                    <div className="col-12 col-sm-3 ls_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="ls_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div onKeyDown={this.onPressNext} className="ls_signup_form">
                        <p className="exclaim_img">
                          <Tooltip placement="left" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}>

                            <img
                              src="images/quest.png"
                              className="img-fluid float-right"
                              alt="Question-mark"
                            />
                          </Tooltip>
                        </p>
                        {this.state.codetotp !== "code" ?
                          <QRCode value={str} />
                          : ""}
                        <div className="form-group pt-2">
                          <label htmlFor="code">2 Factor Authenticator Access Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="code"
                            // placeholder="3 5 7 8 4 9 9 7"
                            autoFocus
                            name="accessCode"
                            onChange={this.handleAccessCode}
                            value={this.state.accessCode}
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.accessCode !== ""
                              ? this.state.formErrors.accessCode
                              : ""}
                          </div>
                        </div>
                        {/* <Link to="/login"> */}
                          <button onClick={this.onClickBack} type="button" className="ls_theme_btn ls_back">
                            Back
                        </button>
                        {/* </Link> */}
                        <button
                          type="button"
                          id="next_btn"
                          className="ls_theme_btn"
                          onClick={this.onNext}
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
  confirmsignin: arg.result.confirmsignin,
  confirmsigninerr: arg.result.confirmsigninerr,
  signindetails: arg.result.signinresult,
  signoutresult: arg.result.signoutresult,
  isAuthenticated: arg.result.isAuthenticated,
  fieldupdatestatus: arg.commonRresult.fieldupdatestatus,
  fieldupdateerr: arg.commonRresult.fieldupdateerr,
  dynamocheckemail: arg.result.dynamocheckemail
});
export default connect(
  mapStateToProps,
  { signinconfirm, signinout, currentsessioncheck, clearStates, updatefield, clearStatesCommon, clearallstates }
)(LoginSecurity);
