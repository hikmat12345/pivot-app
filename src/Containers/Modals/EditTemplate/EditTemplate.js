import "./EditTemplate.css";

import React, { Component } from "react";

import DeleteModal from "../Delete/Delete";
import Modal from "react-bootstrap/Modal";

class EditTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      showConfirm: false,
      openDeleteModal: false,
      templateName: "",
      onlyExpenseAcc: false,

      formErrors: {
        templateName: "",
      },
    };

    // initial state
    this.baseState = this.state;
  }

  componentDidUpdate(prevProps, prevState) {
    let currentState = this.state;
    let currentProps = this.props;
    if (prevState === currentState) {
      this.setState({ templateName: currentProps.templateName });
    }
  }

  componentWillReceiveProps() {
    this.setState({
      templateName: this.props.completedata.TemplateName,
      onlyExpenseAcc: this.props.completedata.ExpenseOnly ? this.props.completedata.ExpenseOnly : true
      // onlyExpenseAcc: this.props.completedata.ExpenseOnly

    })
  }

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    if (name === "closeAll") {
      this.props.closeModal();
      this.setState({
        openDeleteModal: false,
      });
    } else {
      this.setState({ [name]: false });
    }
    this.setState({ [name]: false });
  };

  // reset state
  resetState = () => {
    this.setState(this.baseState);
  };

  handleFieldChange = (event) => {
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
      formErrors: formErrors,
    });
  };

  handleChangeCheckbox = async (checkBoxName, isChecked) => {
    if (checkBoxName === 'onlyExpenseAcc') {
      this.setState({
        onlyExpenseAcc: isChecked,
      });
    }
  }

  onSave = async () => {
    var formErrors = this.state.formErrors;
    if (!this.state.templateName) {
      formErrors.templateName = "This Field is Required.";
    }
    await this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.templateName) {
      // send edited template name back to dashboard.
      this.props.updateTemplate(this.state.templateName, this.state.onlyExpenseAcc)

      // reset state
      this.resetState();
      this.props.closeModal();
    }
  };
  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("SubmitButton_editTemplate").click();
    }
  };
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className={
            this.state.openDeleteModal
              ? "etm_modal modal-backdrop"
              : "etm_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="etm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 etm_form_mx_width">
                    <div className="etm_signup_form_main">
                      <div className="etm_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={this.props.closeModal}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 etm_order-xs-2">
                            <h4>Edit Template</h4>
                          </div>
                          <div className="col-12 col-sm-3 etm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="etm_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyUp={this.formSubmitHandler}
                              className="etm_signup_form"
                            >
                              {/* <i className="fa fa-plus"></i>
                      <i className="fa fa-times etm_modal_closed"></i>   */}
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
                              <div className="etm_bottom_btn">
                                <div className="r-c-style">
                                  <p>
                                    <label className="dash_container dash_remember">
                                      <p>Expense Accounts Only</p>
                                      <input

                                        type="checkbox"
                                        id="onlyExpenseAcc"
                                        name="onlyExpenseAcc"
                                        checked={this.state.onlyExpenseAcc}
                                        disabled={true}
                                        onChange={e =>

                                          this.handleChangeCheckbox(

                                            "onlyExpenseAcc",

                                            e.target.checked

                                          )

                                        }

                                      />
                                      <span className="dash_checkmark"></span>

                                    </label>

                                  </p>

                                </div>
                              </div>
                              <div className="etm_bottom_btn">
                                <button
                                  onClick={() =>
                                    this.openModal("openDeleteModal")
                                  }
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.openModal("openDeleteModal");
                                    }
                                  }}
                                  type="button"
                                  className="etm_theme_btn etm_back"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={this.onSave}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.onSave();
                                    }
                                  }}
                                  type="button"
                                  className="etm_theme_btn "
                                  id="SubmitButton_editTemplate"
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
        <DeleteModal
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          deletetemplate={this.props.deletetemplate}
        />
      </>
    );
  }
}

export default EditTemplate;
