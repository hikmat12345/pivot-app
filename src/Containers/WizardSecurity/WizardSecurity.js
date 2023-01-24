import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./WizardSecurity.css";
import { connect } from "react-redux";
import { signupconfirmcog, clearallstates, clearStates } from "../../actions/loginactions";
import { toast } from "react-toastify";
import { updatefield, getUserEntities } from "../../actions/generalfuntions"
import { API } from "aws-amplify";
import Message from "../Modals/message/message";
import Tooltip from "../Common/Tooltip/Tooltip";
import $ from "jquery";
class WizardSecurity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessCode: "",
      required_messages: [],
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      formErrors: {
        accessCode: ""
      }
    }
  }
  componentWillMount = () => {

    if ((this.props.location.state === undefined) || (this.props.location.state !== undefined && !this.props.location.state.entity)) {
      this.props.history.push("/wizard-login");
    }
    var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
    var tips = JSON.parse(localStorage.getItem("ToolTip"));
     this.setState({
      required_messages: messages,
      required_tips: tips
     })

  }

  handleAccessCode = (event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.setState({ accessCode: event.target.value })
    // this.validateField(fieldName, fieldValue);
  }
  onBlurHandle = (event) => {  
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
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
    await this.setState({ isLoading: true });
    var twofac = "";
    var guid = "";
    var confirmGuid = this.props.location.state.guid;
    var formErrors = this.state.formErrors;
    if (!this.state.accessCode) {
      formErrors.accessCode = 'This Field is Required.';
      this.state.required_messages.map(e=> e.ID == 2 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.accessCode) {


      await this.props.signupconfirmcog(this.props.location.state.dynamouser.Email, this.state.accessCode);

      if (this.props.confirmsignupdata !== "") {
        await API.post("pivot", "/updatefields", {
          body: {
          table: "PivotUser",
          guid: confirmGuid,
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
        await this.props.getUserEntities(this.props.location.state.dynamouser.tenantguid);

        if (this.props.getuserentity !== "") {
          // toast.success("succesfully get user entity")
          var guid;
          var twofac;
          //  update user entity in dynamo
          var entity = this.props.location.state.entity;

          var tenant = JSON.parse(localStorage.getItem("temptenant")).Item.guid;
          entity.guid = tenant;
          guid = entity.guid
          twofac = entity.two_factor
          // await API.post('pivot', '/updateentity', {
          //   body: entity
          // }).then(data => {



          //   // toast.success('entity update in dynamo');
          // }).catch(err => {
          //   toast.error('entity not update in dynamo');
          // })

          await API.post('pivot', '/updateadminuser', {
            body: {
              guid: this.props.location.state.dynamouser.guid,
              two_factor: twofac,
              tenantguid: guid,
              totp_setup_required: twofac
            }
          }).then(data => {
            // toast.success("success")
            console.log(data, "-----")
          }).catch(err => {
            this.setState({
              message_desc: err,
              message_heading: "Admin User",
              openMessageModal: true,
            })
            // toast.error(err, "err has been occured")
          });



          // toast.success("confirm signup successfully")
          await this.props.clearallstates();
          this.props.history.push("/login");

        }
        if (this.props.getuserentityerr !== "") {
          this.setState({
            message_desc: "Failed to get user entity",
            message_heading: "User Entity",
            openMessageModal: true,
          })
          // toast.error("Failed to get user entity")
        }






      }

      if (this.props.signuperr !== '') {
        // toast.error("confirm signup failed");
        this.state.required_messages.map(e=> e.ID == 2 ? 
          this.setState({
           message_desc : e.Desc,
           message_heading: e.Heading,
           openMessageModal : true
         })  :'')
         $(document).ready(function(){
          $(this).find('#ok_button').focus();
    })
        await this.props.clearStates();

      }


    }
    await this.setState({ isLoading: false })
  }
  closeModal = name => {
    this.setState({ [name]: false });
  };
  onPressEnter_WizardSecurity = (e) =>{
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
              <div className="ws_signup_form_main">
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
                      <div onKeyUp={this.onPressEnter_WizardSecurity} id="FormSubmit" className="ws_signup_form">
                      {/* <div className="tooltip_pivot float-right"> */}
                      <p className="exclaim_img">
                          <Tooltip placement="left" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}>

                        <img
                          src="images/quest.png"
                          className="img-fluid float-right"
                          alt="Question-mark"
                        />
                        {/* <span class="tooltiptext">{this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}</span> */}
                        {/* </div> */}
                        </Tooltip>
                        </p>
                        <div className="form-group pt-2">
                          <label htmlFor="code">Access Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="code"
                            onChange={this.handleAccessCode}
                            onBlur={this.onBlurHandle}
                            value={this.state.accessCode}
                            name="accessCode"
                            autoFocus
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.accessCode !== ""
                              ? this.state.formErrors.accessCode
                              : ""}
                          </div>
                        </div>
                        {/* <Link to="/wizard-entity" className="log_secure">
                          <button
                            type="button"
                            tabIndex="-1"
                            className="ws_theme_btn ws_back"
                          >
                            Back
                          </button>
                        </Link> */}
                        
                          <button 
                            id="SubmitButton" 
                            onClick={this.onFinish} 
                            tabIndex="0"
                            type="button" 
                            className="ws_theme_btn"
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                            onKeyUp={(e) =>{if(e.keyCode===13){
                              e.stopPropagation();
                              this.onFinish(e)
                            }}}
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
  confirmsignupdata: arg.result.confirmsignupdata,
  signuperr: arg.result.confirmsignuperr,
  dynamocheckemail: arg.result.dynamocheckemail,
  dynamoerror: arg.result.dynamoerror,
  getuserentity: arg.commonRresult.getUserEntity,
  getuserentityerr: arg.commonRresult.getUserEntityErr
});

export default connect(mapStateToProps, { signupconfirmcog, getUserEntities, clearallstates, clearStates, updatefield })(WizardSecurity);
