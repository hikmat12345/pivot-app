import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../WizardSecurity/WizardSecurity.css";
import { connect } from "react-redux";
import { signupconfirmcog, clearallstates, clearStates, signinfunc } from "../../actions/loginactions";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import Message from "../Modals/message/message";
import Tooltip from "../Common/Tooltip/Tooltip";
import $ from "jquery";
class signup_security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessCode: "",
      userEmail: "",
      openMessageModal: false,
      required_messages: [],
      required_tips: [],
      message_desc: "",
      message_heading: "",
      formErrors: {
        accessCode: ""
      }
    }
  }
  componentWillMount = async () => {
 
    // console.log(this.props.location.state.email,'this.props.location.state.email')
    if ((this.props.location.state === undefined) || (this.props.location.state !== undefined && !this.props.location.state.signup)) {

      this.props.history.push("/login");
    }
    var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
    var tips = JSON.parse(localStorage.getItem("ToolTip"));
    await this.setState({
      required_messages: messages,
      required_tips: tips,
      userEmail: this.props.location.state && this.props.location.state.email
    })

  }
  
  componentDidMount =() =>{ 
    $(document).ready(function () { 
      $('#code').focus();
    });
  }
  handleAccessCode = (event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.setState({ accessCode: event.target.value })
    this.validateField(fieldName, fieldValue);
  }
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
  onFinish = async (event) => {

    event.preventDefault();
    await this.setState({ isLoading: true })
    var formErrors = this.state.formErrors;
    if (!this.state.accessCode) {
      formErrors.accessCode = 'This Field is Required.';
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.accessCode) {

      var userAvailEmail = this.props.dynamocheckemail[0] && this.props.dynamocheckemail[0].Email ? this.props.dynamocheckemail[0].Email : this.state.userEmail;

      await this.props.signupconfirmcog(userAvailEmail, this.state.accessCode);

      if (this.props.confirmsignupdata !== "") {
        //sign-in auto after successfully sugnup


        await this.props.signinfunc(this.props.location.state.email, this.props.location.state.password);
        if (this.props.errsignin === "") {
          // toast.success("confirm signup successfully ")
          await API.post("pivot", "/updatefields", {
            body: {
            table: "PivotUser",
            guid: this.props.location.state.guid,
            fieldname: "cognitoSignup",
            value: true
            }
            })
            .then(async data => {
            // toast.success("Exclude Updated Successfully.");
            })
            .catch(err => {
            // toast.error("Exclude Not Updated!");
            });
          await this.props.clearallstates();
          this.props.history.push("/projects");
        } else {
          // toast.success("failed to login");
          this.props.history.push("/login");
        }

      }

      if (this.props.signuperr !== '') {
        // toast.error("confirm signup failed");
        this.state.required_messages.map(e => e.ID == 2 ?
          this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          }) : '')
        await this.props.clearStates();

      }


    }
    await this.setState({ isLoading: false })
  }
  closeModal = name => {
    this.setState({ [name]: false });
  };
  onPressEnter = (e) =>{
    if(e.which == 13){
      e.preventDefault()
      document.getElementById('SubmitButton').click();
    } 
  }
  render() {
    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="ws_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center ws_form_mx_width">
              <div onKeyUp={this.onPressEnter} className="ws_signup_form_main">
                <div className="ws_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 ws_order-xs-2">
                      <h4>Login Setup - Security</h4>
                    </div>
                    <div className="col-12 col-sm-3 ws_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="ws_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div id="FormSubmit" className="ws_signup_form">
                        {/* <div className="tooltip_pivot float-right"> */}
                        <p className="exclaim_img">
                          <Tooltip placement="left" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}>

                            <img
                              src="images/quest.png"
                              className="img-fluid float-right"
                              alt="Question-mark"
                            />
                          </Tooltip>
                        </p>
                        <div className="clearfix"></div>
                        {/* <span class="tooltiptext">{this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}</span> */}
                        {/* </div> */}
                        <div className="form-group pt-2">
                          <label htmlFor="code">Emailed Access Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="code"
                            onChange={this.handleAccessCode}
                            value={this.state.accessCode}
                            name="accessCode"
                          />
                          <div className="text-success error-12 mt-1">
                          ‘Please check spam folder if access code is not in your inbox’
                          </div>
                          <div className="text-danger error-12">
                            {this.state.formErrors.accessCode !== ""
                              ? this.state.formErrors.accessCode
                              : ""}
                          </div>
                        </div>
                        <Link to="/login" className="back_btn_ss" tabIndex="-1">
                          <button
                            type="button"
                            className="ws_theme_btn ws_back"
                          >
                            Back
                          </button>
                        </Link> 
                          <button 
                            id="SubmitButton" 
                            onClick={this.onFinish}
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                            onKeyUp={(e) =>{if(e.keyCode===13){
                              e.stopPropagation();
                              this.onFinish(e)
                            }}} 
                            type="button" 
                            className="ws_theme_btn"
                          >
                            Finish
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
  confirmsignupdata: arg.result.confirmsignupdata,
  signuperr: arg.result.confirmsignuperr,
  dynamocheckemail: arg.result.dynamocheckemail,
  dynamoerror: arg.result.dynamoerror,
  signindetails: arg.result.signinresult,
  errsignin: arg.result.errorsignin
});

export default connect(mapStateToProps, { signupconfirmcog, clearallstates, clearStates, signinfunc })(signup_security);
