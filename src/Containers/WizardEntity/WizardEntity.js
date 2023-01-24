import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./WizardEntity.css";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";
import {
  signupfunc,
  clearallstates,
  clearStates
} from "../../actions/loginactions";
import Message from "../Modals/message/message";
import Tooltip from "../Common/Tooltip/Tooltip";
import { API } from "aws-amplify";
class WizardEntity extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      type: "",
      name: "",
      required_tips: [],
      taxId: "",
      address: "",
      message_heading: "",
      message_desc: "",
      two_factor: false,
      openMessageModal: false,
      required_messages: [],
      authRadioBtn: false,
      formErrors: {
        type: "",
        name: "",
        taxId: "",
        address: ""
      }
    };
  }
  // componentDidUpdate() {
  //   console.log(this.props.dynamocheckemail)
  // }

  componentWillMount = () => {

    if ((this.props.location.state === undefined) || (this.props.location.state !== undefined && this.props.location.state.usersuccess !== true)) {
      this.props.history.push("/wizard-login");
    }
    else{
     var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
     var tips = JSON.parse(localStorage.getItem("ToolTip"));
    //  JSON.parse(messages);

     this.setState({
      required_messages: messages,
      required_tips: tips
     })
    }

  }
  closeModal = name => {
    this.setState({ [name]: false });
  };
  handleInputFields = async (event) => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
   await this.setState({ [event.target.name]: event.target.value });
    this.validateField(fieldName, fieldValue);
  };
  validateField = async (name, value) => {
    var formErrors = this.state.formErrors;
    switch (name) {
      case "type":
        if (value.length < 1) {
          formErrors.type = "This Field is Required.";
        } else {
          formErrors.type = "";
        }
        break;
      case "name":
        if (value.length < 1) {
          formErrors.name = "This Field is Required.";
        } else {
          formErrors.name = "";
        }
        break;
      case "taxId":
        if (value.length < 1) {
          formErrors.taxId = "This Field is Required.";
        } else {
          formErrors.taxId = "";
        }
        break;
      case "address":
        if (value.length < 1) {
          formErrors.address = "This Field is Required.";
        } else {
          formErrors.address = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };
  onNext = async (event) => {
    event.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    if (!this.state.name) {
      formErrors.name = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    if (!this.state.taxId) {
      formErrors.taxId = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    if (!this.state.address) {
      formErrors.address = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
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
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      !formErrors.name &&
      !formErrors.taxId &&
      !formErrors.address
    ) {
      await this.setState({ isLoading: true })
      // change password over here
      var entity = {
        "two_factor": this.state.two_factor,
        "entitytype": this.state.type,
        "name": this.state.name,
        "taxId": this.state.taxId,
        "address": this.state.address,
        "guid": localStorage.getItem("tenantguid")
      };

      await API.post('pivot', '/updateentity', {
        body: entity
      }).then(data => {
        // toast.success('entity update in dynamo');
      }).catch(err => {
        this.setState({
          message_desc: "Entity not update in dynamo",
          message_heading: "Entity",
          openMessageModal: true,
        })
        // toast.error('entity not update in dynamo');
      })

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Wizard",
          "Description": "Entity - Type",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": JSON.parse(JSON.stringify(this.state.type)),
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Wizard",
          "Description": "Entity - Name",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": JSON.parse(JSON.stringify(this.state.name)),
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Wizard",
          "Description": "Entity - Tax ID",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": JSON.parse(JSON.stringify(this.state.taxId)),
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Wizard",
          "Description": "Entity - Address",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": JSON.parse(JSON.stringify(this.state.address)),
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Wizard",
          "Description": "Entity - 2 Factor",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": JSON.parse(JSON.stringify(this.state.two_factor)),
          "Tenantid": localStorage.getItem('tenantguid')
        }
      ]);
       
      this.props.history.push("/reset-password", { entity })


    }
  };
  onPressEnter_WizardEntity = (e) =>{
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
        <div className="we_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center we_form_mx_width">
              <div className="we_signup_form_main">
                <div className="we_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 we_order-xs-2">
                      <h4>Wizard Setup - Entity</h4>
                    </div>
                    <div className="col-12 col-sm-3 we_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="we_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div id="FormNext" onKeyUp={this.onPressEnter_WizardEntity} className="we_signup_form">
                        <div className="form-group we_select">
                          <label>Type</label>
                          <select
                            className="form-control we_custom_select"
                            name="type"
                            onChange={this.handleInputFields}
                            value={this.state.type}
                            autoFocus
                          >
                            <option value="">Select</option>
                            <option value="Company">Company</option>
                            <option value="Individual">Individual</option>
                          </select>
                          <span className="we_custom_caret"></span>
                          <div className="text-danger error-12">
                            {this.state.formErrors.type !== ""
                              ? this.state.formErrors.type
                              : ""}
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="tex">Name</label>
                          <input
                            autocomplete="off"
                            type="text"
                            className="form-control"
                            id="tex"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleInputFields}
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.name !== ""
                              ? this.state.formErrors.name
                              : ""}
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="tex">Tax ID</label>
                          <input
                            autocomplete="off"
                            type="text"
                            className="form-control"
                            id="tex"
                            name="taxId"
                            value={this.state.taxId}
                            onChange={this.handleInputFields}
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.taxId !== ""
                              ? this.state.formErrors.taxId
                              : ""}
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="address">Address line</label>
                          <input
                            autocomplete="off"
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={this.state.address}
                            onChange={this.handleInputFields}
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.address !== ""
                              ? this.state.formErrors.address
                              : ""}
                          </div>
                        </div>
                        <div className="custom-radio"> 
                                  <label
                                      className="we_container remember"
                                      htmlFor="customRadio"
                                    >
                          <Tooltip placement="right" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 2 ? e.Desc : '')}>
                                    2 Factor Authetication
                                          </Tooltip> 
                                          <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="customRadio"
                                      name="authRadioBtn"
                                      checked={this.state.two_factor}
                                      onChange={() => {
                                        this.setState({
                                          two_factor: !this.state.two_factor
                                        });
                                      }}
                                    />
                                       <span className="we_checkmark"></span>
                                  </label>  
                                </div> 
                        <Link to="/wizard-login" className="we_bottom_btn">
                          <button
                            type="button"
                            className="we_theme_btn we_back"
                          >
                            Back
                          </button>
                        </Link>
                        <div className="we_bottom_btn">
                          <button
                            onClick={this.onNext}
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onNext(e)
                              }}}
                            id="NextButton"
                            type="button"
                            className="we_theme_btn"
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
  signupresult: arg.result.signupresult,
  errorsignup: arg.result.errorsignup,
  dynamocheckemail: arg.result.dynamocheckemail,
  dynamoerror: arg.result.dynamoerror
});

export default connect(
  mapStateToProps, { signupfunc, clearStates, clearallstates }
)(WizardEntity);
