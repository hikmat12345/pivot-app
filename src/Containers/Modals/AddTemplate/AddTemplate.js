import React, { Component } from "react";
import "./AddTemplate.css";
import Modal from "react-bootstrap/Modal";
import Message from "../message/message";

class AddTemplate extends Component {
  constructor() {
    super();
    this.state = {
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      show: true,
      showConfirm: false,
      templateName: "",
      formErrors: {
        templateName: "",
      }
    };

    // initial state
    this.baseState = this.state;
  }
  componentDidMount(){
    var that = this;
    // this.getConfigEmail()
    window.addEventListener('keydown',async function(e){  
      if (e.keyCode === 27) {    
      await  that.setState({ 
          counter: 1,
          formErrors: {
            templateName: "",
          }
        })  
      }
    })
  }
  // reset state
  resetState = () => {
    this.setState(this.baseState);
  }

  handleFieldChange = event => {
    var fieldValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
    this.validateField(fieldValue);
  };

  validateField = async (value) => {
    var formErrors = this.state.formErrors;
    if (value.length < 1) {
      formErrors.templateName = "This Field is Required.";
    } else {
      formErrors.templateName = "";
    }
    this.setState({
      formErrors: formErrors
    });
  };

  onSave = async () => {
    var formErrors = this.state.formErrors;
    if (!this.state.templateName) {
      formErrors.templateName = "This Field is Required.";
      this.props.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    await this.setState({
      formErrors: formErrors
    });
    if (!formErrors.templateName) {

      // send new template name back to dashboard.
      this.props.addTemplateModalHandler(this.state.templateName);

      // reset state
      this.resetState();

    }
  };
  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      document.getElementById('SubmitButton_addTemplate').click();
    }
    else if (e.keyCode == 27) {
      this.clearStates();
    }
  }
  clearStates = () => {
    this.setState({
      templateName: "",
      formErrors: {
        templateName: "",
      }
    })
  }
  closeModal = (name) => {
    if (name == 'openAddTemplateModal') {
      this.props.closeModal();
      this.clearStates();
    }
    else if(name == 'openMessageModal'){
      this.setState({
        openMessageModal: false
      })
    }
    else{
      this.setState({ [name]: false })
    }

  }

  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className="atm_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="atm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center atm_form_mx_width">
                    <div className="atm_signup_form_main">
                      <div className="atm_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={() => this.closeModal('openAddTemplateModal')} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 atm_order-xs-2">
                            <h4>Add Template</h4>
                          </div>
                          <div className="col-12 col-sm-3 atm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="atm_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyDown={this.formSubmitHandler} className="atm_signup_form">
                              {/* <i className="fa fa-plus"></i>
                      <i className="fa fa-times atm_modal_closed"></i>   */}
                              {/* <img src="images/quest.png" className="img-fluid float-right" alt="Question-mark" /> */}

                              <div className="form-group">
                                <label htmlFor="key">Template Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="key"

                                  name="templateName"
                                  value={this.state.templateName}
                                  onChange={this.handleFieldChange}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.templateName !== ""
                                    ? this.state.formErrors.templateName
                                    : ""}
                                </div>
                              </div>
                              <div className="atm_save-btn-center">
                                <button
                                  type="button"
                                  onClick={this.onSave}
                                  id="SubmitButton_addTemplate"
                                  className="atm_theme_btn "
                                >
                                  Save
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

export default AddTemplate;
