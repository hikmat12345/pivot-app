import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login_l3.css";

class Login_l3 extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showConfirm: false
    };
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="l3_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center l3_form_mx_width">
              <div className="l3_signup_form_main">
                <div className="l3_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 l3_order-xs-2">
                      <h4>Login - Change Password</h4>
                    </div>
                    <div className="col-12 col-sm-3 l3_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="l3_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <form className="l3_signup_form">
                        <div className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="l3_password_eye">
                            <input
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control"
                              value="pplummer@pivotreports"
                            />
                            <span
                              className="l3_hidden_pass"
                              onClick={() =>
                                this.setState({ show: !this.state.show })
                              }
                            >
                              <img
                                src={
                                  this.state.show
                                    ? "images/eye-off.png"
                                    : "images/eye.png"
                                }
                                className="img-fluid"
                                alt="Show Password"
                              />
                            </span>
                          </div>
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="password">Confirm Password</label>
                          <div className="l3_password_eye">
                            <input
                              type={
                                this.state.showConfirm ? "text" : "password"
                              }
                              id="password"
                              className="form-control"
                              value="pplummer@pivotreports"
                            />
                            <span
                              className="l3_hidden_pass"
                              onClick={() =>
                                this.setState({
                                  showConfirm: !this.state.showConfirm
                                })
                              }
                            >
                              <img
                                src={
                                  this.state.showConfirm
                                    ? "images/eye-off.png"
                                    : "images/eye.png"
                                }
                                className="img-fluid"
                                alt="Show Password"
                              />
                            </span>
                          </div>
                        </div>
                        <Link to="/login-2">
                          <button
                            type="button"
                            className="l3_theme_btn l3_back"
                          >
                            Back
                          </button>
                        </Link>
                        <Link to="/projects">
                          <button type="button" className="l3_theme_btn">
                            Next
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
    );
  }
}

export default Login_l3;
