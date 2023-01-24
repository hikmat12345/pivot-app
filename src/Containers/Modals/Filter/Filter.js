import "./Filter.css";

import React, { Component } from "react";

import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import { async } from "q";

class FilterModal extends Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      formErrors: {
        columnValue: "",
        comparsionValue: "",
        value: ""
      }
    };
  }
  
  componentWillReceiveProps = () => {
    this.setState({
      columns: this.props.columns
    });

  }

  handleSubmit = async () => {
    this.props.filterdata();

  }

  validateField = async (name, value) => {
    let filter_formErrors = this.props.filter_formErrors;
    switch (name) {
      case "columnValue":
        if (value.length < 1) {
          filter_formErrors.columnValue = "This Field is Required.";
        } else {
          filter_formErrors.columnValue = "";
        }
        break;
      case "comparsionValue":
        if (value.length < 1) {
          filter_formErrors.comparsionValue = "This Field is Required.";
        } else {
          filter_formErrors.comparsionValue = "";
        }
        break;
      // case "value":
      // if (value.length < 1) {
      //   filter_formErrors.value = "This Field is Required.";
      // } else {
      //   filter_formErrors.value = "";
      // }
      // break;
      default:
        break;
    }
    this.setState({
      filter_formErrors: filter_formErrors
    });
  };

  onBlurHandle = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.validateField(fieldName, fieldValue);
  }

  inputHandler = async (event) => {
    if (event.target.name == "value") {
      this.props.handlevalue(event);
      this.onBlurHandle(event)
    }
    else if (event.target.name == "columnValue") {
      this.props.handleColumnvalue(event)
      this.onBlurHandle(event)
    }
    else if (event.target.name == "comparsionValue") {
      this.onBlurHandle(event)
      this.props.handleComparisonValue(event)
    }

  }

  onPressEnter = (e) => {

    if (e.keyCode == 13) {
      e.preventDefault();
      document.getElementById('apply').click()
    }
    if (e.keyCode == 27) {
      this.clearbutton();
    }
  }

  closebutton = async () => {
    this.clearbutton();
    this.props.closeFilterModal();
  }

  clearbutton = async () => {
    var formErrors = this.state.formErrors;
    formErrors.columnValue = ""
    formErrors.comparsionValue = ""
    formErrors.value = ""
    await this.setState({ formErrors: formErrors })
    this.props.clearfilter();
  }

  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        // className="filter_modal"
        className={
          this.state.openDeleteModal
            ? "filter_modal modal-backdrop"
            : "filter_modal"
        }
      >
        <Modal.Body>

          <div className="container-fluid">
            <div className="filter_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center filter_form_mx_width">
                  <div onKeyUp={(e) => this.onPressEnter(e)} className="filter_signup_form_main">
                    <div className="filter_signup_header">
                      <div className="row">
                        <img src="/images/2/close.png" onClick={this.closebutton} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 filter_order-xs-2">
                          <h4>Filter</h4>
                        </div>
                        <div className="col-12 col-sm-3 filter_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="filter_signup_body">
                      <div className="row">
                        <div className="col-12">

                          <div className="filter_signup_form">
                            <div>
                              <div className={this.props.filter_formErrors.columnValue !== ""
                                ? "form-group filter_select mb-0"
                                : "form-group filter_select"}>
                                <label>Column Name</label>
                                <select
                                  id="filter"
                                  value={this.props.columnValue}
                                  name="columnValue"
                                  className="form-control filter_custom_select"
                                  onChange={this.inputHandler}

                                >
                                  <option value="">select</option>
                                  {this.state.columns.map((e, index) => (
                                    <option value={e.guid}>{e.ColumnName}</option>
                                  ))}
                                </select>

                                <span className="filter_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12 dropDownError">
                                {this.props.filter_formErrors.columnValue !== ""
                                  ? this.props.filter_formErrors.columnValue
                                  : ""}
                              </div>
                              <div className={this.props.filter_formErrors.comparsionValue !== ""
                                ? "form-group filter_select mb-0"
                                : "form-group filter_select"}>
                                <label>Comparison</label>
                                <select
                                  value={this.props.comparsionValue}
                                  name="comparsionValue"
                                  className="form-control filter_custom_select"
                                  onChange={this.inputHandler}

                                >
                                  <option value="">select</option>
                                  <option value="greater">Greater Than</option>
                                  <option value="less">Less than</option>
                                  <option value="equal">Equal</option>
                                  <option value="notequal">Doesn't Equal</option>
                                  <option value="contain">Contain</option>
                                  <option value="notcontain">Doesn't Contain</option>


                                </select>

                                <span className="filter_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12 dropDownError">
                                {this.props.filter_formErrors.comparsionValue !== ""
                                  ? this.props.filter_formErrors.comparsionValue
                                  : ""}
                              </div>
                              <div className={this.props.filter_formErrors.value !== ""
                                ? "form-group filter_select mb-0"
                                : "form-group filter_select"}>
                                <label htmlFor="p-name">Value</label>
                                <input
                                  value={this.props.value}
                                  type="text"
                                  className="form-control"
                                  id="p-name"
                                  name="value"
                                  onChange={this.inputHandler}

                                />

                              </div>
                              {/* <div className="text-danger error-12 dropDownError">
                                {this.props.filter_formErrors.value !== ""
                                  ? this.props.filter_formErrors.value
                                  : ""}
                              </div> */}
                            </div>

                            <div className="filter_bottom_btn">
                              <button
                                onClick={this.clearbutton}
                                type="button"
                                className="filter_theme_btn filter_back"
                              >
                                Clear
                              </button>
                              <button
                                id="apply"
                                onClick={this.handleSubmit}
                                onKeyDown={(e) => { if (e.keyCode === 13) { e.preventDefault(); e.stopPropagation() } }}
                                onKeyUp={(e) => {
                                  if (e.keyCode === 13) {
                                    e.stopPropagation();
                                    this.handleSubmit()
                                  }
                                }}
                                type="button"
                                className="filter_theme_btn"
                              >
                                Apply
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
    );
  }
}

export default FilterModal;
