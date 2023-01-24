import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Signup_s1.css";

class Signup_s1 extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="s1_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center s1_form_mx_width">
              <div className="s1_signup_form_main">
                <div className="s1_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 s1_order-xs-2">
                      <h4>Wizard Setup – Login Details</h4>
                    </div>
                    <div className="col-12 col-sm-3 s1_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="s1_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <form className="s1_signup_form">
                        <div className="form-group">
                          <label for="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="pplummer@pivotreports.com"
                          />
                        </div>
                        <div className="form-group pt-2">
                          <label htmlFor="password">Password</label>
                          <div className="s1_password_eye">
                            <input
                              type={this.state.show ? "text" : "password"}
                              id="password"
                              className="form-control"
                              value="pplummer@pivotreports"
                            />
                            <span
                              className="s1_hidden_pass"
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
                        <div className="custom-control custom-radio">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customRadio"
                            name="example1"
                          />
                          <label
                            className="custom-control-label remember"
                            for="customRadio"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="s1_social_login">
                          <label>Login with:</label>
                          <button className="btn btn-default s1_google_btn">
                            <img
                              src="images/google.png"
                              className="img-fluid float-left"
                              alt="Google Login"
                            />{" "}
                            Google
                          </button>
                          <button className="btn btn-default s1_fb_btn">
                            <img
                              src="images/fb.png"
                              className="img-fluid float-left"
                              alt="Facebook Login"
                            />{" "}
                            Facebook
                          </button>
                        </div>
                        <Link to="/signup-2">
                          <button type="button" className="s1_theme_btn">
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

export default Signup_s1;
