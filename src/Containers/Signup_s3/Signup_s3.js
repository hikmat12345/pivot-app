import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Signup_s3.css";

class Signup_s3 extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="s3_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center s3_form_mx_width">
              <div className="s3_signup_form_main">
                <div className="s3_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 s3_order-xs-2">
                      <h4>Wizard Setup - Security</h4>
                    </div>
                    <div className="col-12 col-sm-3 s3_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="s3_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <form className="s3_signup_form">
                        <img
                          src="images/quest.png"
                          className="img-fluid float-right"
                          alt="Question-marks"
                        />
                        <div className="form-group pt-2">
                          <label htmlFor="code">Access Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="code"
                            placeholder="3 5 7 8 4 9 9 7"
                          />
                        </div>
                        <Link to="/signup-2">
                          <button
                            type="button"
                            className="s3_theme_btn s3_back"
                          >
                            Back
                          </button>
                        </Link>
                        <Link to="/login">
                          <button type="button" className="s3_theme_btn">
                            Finish
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

export default Signup_s3;
