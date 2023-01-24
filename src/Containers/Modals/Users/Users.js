import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Users.css";
import Modal from "react-bootstrap/Modal";

class Users extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="um_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="um_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 um_form_mx_width">
                  <div className="um_signup_form_main">
                    <div className="um_signup_header">
                      <div className="row">
                      <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 um_order-xs-2">
                          <h4>Add Users</h4>
                        </div>
                        <div className="col-12 col-sm-3 um_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="um_signup_body">
                      <div className="row">
                        <div className="col-12">
                          <form className="um_signup_form">
                            <div className="form-group">
                              <label htmlFor="p-name">Project Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="p-name"
                                placeholder="The Butcher Series 1"
                              />
                            </div>
                            <div class="form-group um_select">
                              <label className="pb-3 w-100">
                                <u>Intergration</u>
                              </label>
                              <br />
                              <label>Data Connection</label>
                              <select class="form-control um_custom_select">
                                <option selected>Xero</option>
                                <option>Xero1</option>
                                <option>Xero2</option>
                                <option>Xero3</option>
                              </select>
                              <span className="um_custom_caret"></span>
                            </div>
                            <div className="form-group">
                              <label htmlFor="URL">URL</label>
                              <input
                                type="text"
                                className="form-control"
                                id="URL"
                                placeholder="https://api.xero.com/api.xro/2.0/iprofitandloss"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="key">API Key</label>
                              <input
                                type="text"
                                className="form-control"
                                id="key"
                                placeholder="The Butcher Series 1"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="api-pass">API Password</label>
                              <input
                                type="text"
                                className="form-control"
                                id="api-pass"
                                placeholder="SJBBWWPCG4E9ZE4NB4REX10BYBCDJ"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="api-pass">csv</label>
                              <div class="input-group mb-2">
                                <input
                                  type="text"
                                  class="form-control um_paste_input"
                                  placeholder="Paste Pad"
                                />
                                <div class="input-group-prepend um_paste_btn">
                                  <div class="input-group-text">
                                    <img
                                      src="images/download.png"
                                      className="w-50"
                                      alt="download"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Link to="/projects">
                              <button
                                type="button"
                                className="um_theme_btn um_back"
                              >
                                Test
                              </button>
                            </Link>
                            <br />
                            <div class="form-group um_select">
                              <label className="pb-3 w-100">
                                <u>Import Templates</u>
                              </label>
                              <br />
                              <label>Project</label>
                              <select class="form-control um_custom_select">
                                <option selected>Great Wall</option>
                                <option>Great Wall1</option>
                                <option>Great Wall2</option>
                                <option>Great Wall3</option>
                              </select>
                              <span className="um_custom_caret"></span>
                            </div>
                            <div class="form-group um_select">
                              <label>Templates</label>
                              <select class="form-control um_custom_select">
                                <option selected>Cost Report</option>
                                <option>Cost Report1</option>
                                <option>Cost Report2</option>
                                <option>Cost Report3</option>
                              </select>
                              <span className="um_custom_caret"></span>
                            </div>
                            <Link to="/projects">
                              <button type="button" className="um_theme_btn">
                                Save
                              </button>
                            </Link>
                          </form>
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

export default Users;
