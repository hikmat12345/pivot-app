import React, { Component } from "react";
import "./ForgotEmail.css";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import ForgotSecurity from "../ForgotSecurity/ForgotSecurity";

import { forgotPasswordFun, clearStates } from "../../../actions/loginactions";
import Message from "../message/message";
import { async } from "q";

class ForgotEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      openForgotSecurityModal: false,
      email: "",
      required_messages: [],
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      forgot_email_type: "",
      formErrors: {
        email: "",
      },
    };
  }
  componentWillReceiveProps = () => {
    this.setState({
      required_messages: this.props.required_messages,
      
    });
  };
  handleFieldChange = (event) => {
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
    // let email_pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
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
      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    if (name === "closeAll") {
      this.setState({ openForgotSecurityModal: false });
      this.props.closeModal("closeAll");
    } else {
      this.setState({ [name]: false });
      this.props.props.history.push("/");
    }
  };


  clearStates = async () =>{
   await this.setState({
     // email: "",
      formErrors: {
        email: ""
      }
    })
  }

  onNext = async (event) => {
    event.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
      this.state.required_messages.map((e) =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
    } else if (formErrors.email == "Please enter valid email format.") {
      this.state.required_messages.map((e) =>
        e.ID == 10
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
    }

    this.setState({
      formErrors: formErrors,
    });
    await this.setState({
      isLoading: true,
    });
    await this.checkbyemail();
    if (!formErrors.email && !formErrors.password) {
      this.setState({
        formErrors: { email: "" },
      });
      if (
        this.state.email == "plumafish@gmail.com" ||
        this.state.forgot_email_type == "SYSTEM"
      ) {
        this.setState({
          message_desc: "You cannot make this Email Forgot",
          message_heading: "Error",
          openMessageModal: true,
        });
      } else {
        // forgot password

        await this.props.forgotPasswordFun(this.state.email);
        if (this.props.forgotPasswordErr) {
          // toast.error(this.props.forgotPasswordErr.message);
          // this.state.required_messages.map(e=> e.ID == 10 ?
          this.setState({
            message_desc: "Attempt limit exceeded, please try after some time.",
            message_heading: "Limit exceeded",
            openMessageModal: true,
          });
          //  :'')
        }

        if (this.props.forgotPassword) {
          this.openModal("openForgotSecurityModal");
        }
        await this.props.clearStates();
        await this.clearStates();
      }
    }
    await this.setState({
      isLoading: false,
    });
  };
  checkbyemail = async () => {
    await API.post("pivot", "/usergetbyemailonly", {
      body: {
        email: this.state.email,
      },
    })
      .then((data) => {
        if (data.Count > 0) {
          this.setState({
            forgot_email_type: data.Items[0].type,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  submitEmail = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      document.getElementById("texbtn").click();
    } else if (e.keyCode == 27) {
      this.closebutton();
    }
  };
  closebutton = async () => {
    var formErrors = this.state.formErrors;
    formErrors.email = "";
    await this.setState({ formErrors: formErrors });
    this.props.closeModal();
  };
  backbutton = async (e) => {
    await this.closebutton();
  };
  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className="forgot_email_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="forgot_email_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center forgot_email_form_mx_width">
                    <div className="forgot_email_signup_form_main">
                      <div className="forgot_email_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={this.closebutton}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />
                          <div className="col-12 col-sm-8 forgot_email_order-xs-2">
                            <h4>Forgot - Email</h4>
                          </div>
                          <div className="col-12 col-sm-3 forgot_email_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="forgot_email_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyUp={this.submitEmail}
                              className="forgot_email_signup_form"
                            >
                              <div className="form-group pt-2">
                                <label htmlFor="tex">Email</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="tex"
                                  name="email"
                                  value={this.state.email}
                                  onChange={this.handleFieldChange}
                                  onBlur={this.onBlurHandle}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.email !== ""
                                    ? this.state.formErrors.email
                                    : ""}
                                </div>
                              </div>
                              <div className="forgot_email_bottom_btn">
                                <button
                                  type="button"
                                  onClick={this.backbutton}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.backbutton();
                                    }
                                  }}
                                  className="forgot_email_theme_btn forgot_email_back"
                                >
                                  Back
                                </button>
                                <button
                                  id="texbtn"
                                  type="button"
                                  onClick={this.onNext}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.onNext(e);
                                    }
                                  }}
                                  className="forgot_email_theme_btn"
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

        <ForgotSecurity
          openModal={this.state.openForgotSecurityModal}
          closeModal={this.closeModal}
          props={this.props}
          email={this.state.email}
          required_messages={this.props.required_messages}
          required_tips={this.props.required_tips}
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

const mapStateToProps = (state) => ({
  forgotPassword: state.result.forgotPassword,
  forgotPasswordErr: state.result.forgotPasswordErr,
});
export default connect(mapStateToProps, {
  forgotPasswordFun,
  clearStates,
})(ForgotEmail);
