import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./ForgotSecurity.css";
import $ from "jquery";
import ForgotChangePassword from "../ForgotChangePassword/ForgotChangePassword";
import Message from "../message/message";
import Tooltip from "../../Common/Tooltip/Tooltip";
import { async } from "q";

class ForgotSecurity extends Component {
  constructor() {
    super();
    this.state = {
      openForgotChangePasswordModal: false,
      accessCode: "",
      required_messages: [],
      required_tips: [],
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      formErrors: {
        accessCode: ""
      }
    };
  }

  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  };

  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
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
  componentWillReceiveProps = () => {
    this.setState({
      required_messages: this.props.required_messages,
      required_tips: this.props.required_tips
    })
    $(document).ready(function () {
      $("#code").focus();
    });
  
    }

  onNext = event => {
    event.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.accessCode) {
      formErrors.accessCode = "This Field is Required.";
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
    if (!formErrors.accessCode) {
      this.setState({
        //accessCode: "",
        formErrors: { accessCode: "" }
      });
      this.openModal("openForgotChangePasswordModal");
    }
  };

  openModal = name => {
    this.setState({ [name]: true });
  };

  closeModal = name => {
    if (name === "closeAll") {
      this.setState({ openForgotChangePasswordModal: false });
      this.props.closeModal("closeAll");
    } else {
      this.setState({ [name]: false });
    }
  };
  submitSecurity=(e)=>{
   
    if(e.keyCode==13){
     e.preventDefault();
     document.getElementById('febtn').click();
    }
    else if(e.keyCode == 27) {
      this.closebutton();
    }
 
  }
  closebutton = async()=>{
    var formErrors = this.state.formErrors;
    formErrors.accessCode = ""
    await this.setState({formErrors: formErrors});
    this.props.closeModal("openForgotSecurityModal");
    this.props.props.closeModal("openForgotEmailModal");
  }
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={() => this.props.closeModal("openForgotSecurityModal")}
          className="forgot_email_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="fs_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center fs_form_mx_width">
                    <div className="fs_signup_form_main">
                      <div className="fs_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={
                            this.closebutton                            
                          } className="d-block img-fluid modal_closed_btn" alt="close" />
                          <div className="col-12 col-sm-8 fs_order-xs-2">
                            <h4>Forgot - Security</h4>
                          </div>
                          <div className="col-12 col-sm-3 fs_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="fs_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.submitSecurity} className="fs_signup_form">
                              {/* <div className="tooltip_pivot float-right"> */}


                              {/* <span class="tooltiptext">{this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}</span> */}
                              {/* </div> */}
                              <div className="form-group pt-2">
                                <p className="exclaim_img">
                                  <Tooltip placement="right" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 1 ? e.Desc : '')}>

                                    <img
                                      src="images/quest.png"
                                      className="img-fluid float-right"
                                      alt="Question-mark"
                                    />

                                  </Tooltip>
                                </p>
                                <label htmlFor="code">Emailed Access Code</label>
                                <input
                                
                                  type="text"
                                  className="form-control"
                                  id="code"
                                  name="accessCode"
                                  onChange={this.handleFieldChange}
                                  value={this.state.accessCode}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.accessCode !== ""
                                    ? this.state.formErrors.accessCode
                                    : ""}
                                </div>
                              </div>
                              <div className="fs_bottom_btn">
                                <button
                                  onClick={this.closebutton
                                  }
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                               this.closebutton();
                              }}}
                                  type="button"
                                  className="fs_theme_btn fs_back"
                                >
                                  Back
                                </button>
                                <button
                                id="febtn"
                                  onClick={this.onNext}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onNext(e)
                              }}}
                                  type="button"
                                  className="fs_theme_btn"
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
        <ForgotChangePassword
          openModal={this.state.openForgotChangePasswordModal}
          closeModal={this.closeModal}
          email={this.props.email}
          code={this.state.accessCode}
          required_messages={this.props.required_messages}
          props={this.props}
        />
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

export default ForgotSecurity;
