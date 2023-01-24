import "./Refresh.css";

import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";

class RefreshModal extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showConfirm: false
    };
  }
  
  runRefresh = () => {
    this.props.closeModal();
    this.props.handleRefresh();
  }

  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="refresh_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="refresh_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 refresh_form_mx_width">
                  <div className="refresh_signup_form_main">
                    <div className="refresh_signup_header">
                      <div className="row">
                        <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 refresh_order-xs-2">
                          <h4>Refresh</h4>
                        </div>
                        <div className="col-12 col-sm-3 refresh_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="refresh_signup_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="refresh_body">
                            <p className="refresh_text">
                              Actuals and commitments will be updated via the API connection. <br />{" "} Do you want to continue?
                            </p>
                            <button
                              onClick={this.runRefresh}
                              onKeyDown={(e) => { if (e.keyCode === 13) { e.preventDefault(); e.stopPropagation() } }}
                              onKeyUp={(e) => {
                                if (e.keyCode === 13) {
                                  e.stopPropagation();
                                  this.runRefresh()
                                }
                              }}
                              type="button"
                              id="refresh_btn_ok"
                              className="refresh_theme_btn"
                            >
                              Ok
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
        </Modal.Body>
      </Modal>
    );
  }
}

export default RefreshModal;
