import "./PeriodClose.css";

import React, { Component } from "react";

import $ from "jquery";
import Modal from "react-bootstrap/Modal";

class PeriodClose extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillReceiveProps = () => {
    $(document).ready(function () {
      $("#febtn").focus();
    });
  }

  submit = async (e) => {
    let { selectedProject, periodClose, closeModal } = this.props;
    if (e.keyCode === 40) {
      e.preventDefault();
      await periodClose(selectedProject.guid);

      closeModal("openPeriodCloseModal")
    }

  }
  
  submit1 = async (e) => {
    let { selectedProject, periodClose, closeModal } = this.props;


    await periodClose(selectedProject.guid);


    closeModal("openPeriodCloseModal")
  }

  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="pcm_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="pcm_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 pcm_form_mx_width">
                  <div className="pcm_signup_form_main">
                    <div className="pcm_signup_header">
                      <div className="row">
                        <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 pcm_order-xs-2">
                          <h4>Period Close</h4>
                        </div>
                        <div className="col-12 col-sm-3 pcm_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pcm_signup_body">
                      <div className="col-12">
                        <div className="pcm_body">
                          <p className="pcm_text">
                            Period cost will be updated <br></br> Continue?
                          </p>
                          <button
                            onKeyDown={this.submit}
                            id="febtn"
                            type="button"
                            className="pcm_theme_btn"
                            onClick={this.submit1}
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

export default PeriodClose;
