import React, { Component } from "react";
import "./Import.css";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";

class Import extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillReceiveProps =()=>{
    $(document).ready(function () {
      $("#febtn").focus();
    });
  }
  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="im_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="im_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 im_form_mx_width">
                  <div className="im_signup_form_main">
                    <div className="im_signup_header">
                      <div className="row">
                      <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 im_order-xs-2">
                          <h4>Import</h4>
                        </div>
                        <div className="col-12 col-sm-3 im_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="im_signup_body">
                      <div className="col-12">
                        <div className="im_body">
                          <p className="im_text">
                            This Will Overwrite the data in the work table.
                            <br></br> Do you wish to proceed?
                          </p>
                          <button
                          id="febtn" 
                            type="button"
                            className="im_theme_btn"
                            onClick={() => this.props.closeModal("openImportModal")}
                          >
                            OK
                          </button>
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

export default Import;
