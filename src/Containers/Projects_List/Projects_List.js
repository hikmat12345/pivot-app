import React, { Component } from "react";
import "./Projects_List.css";
import ProjectsModal from "../Modals/Projects/Projects";
import UsersModal from "../Modals/Users/Users";

class Projects_List extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showConfirm: false,
      openProjectsModal: false,
      openUsersModal: false
    };
  }
  openModal = name => {
    this.setState({ [name]: true });
  };
  closeModal = name => {
    this.setState({ [name]: false });
  };
  render() {
    return (
      <div className="container-fluid">
        <div className="pl_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center pl_form_mx_width">
              <div className="pl_signup_form_main">
                <div className="pl_signup_header">
                  <div className="row">
                    <div className="col-12 col-sm-9 pl_order-xs-2">
                      <h4>Projects</h4>
                    </div>
                    <div className="col-12 col-sm-3 pl_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 no-padding">
                  <div className="pl_project_modals">
                    <ul>
                      <li>
                        <button
                          onClick={() => this.openModal("openProjectsModal")}
                          type="button"
                          className="pl_theme_btn pl_modal_btn"
                        >
                          <i className="fa fa-plus"></i> Project
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => this.openModal("openUsersModal")}
                          type="button"
                          className="pl_theme_btn pl_modal_btn"
                        >
                          <i className="fa fa-pencil"></i> Users
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="pl_theme_btn pl_modal_btn"
                        >
                          <i className="fa fa-pencil"></i> Entity
                        </button>
                      </li>
                      <li>
                        <button type="button" className="pl_theme_btn pl_sub">
                          Subscription
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pl_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div className="pl_project_scroll">
                        <ul className="pl_project">
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list pl_red">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="pl_projects_list">
                              <i className="fa fa-pencil"></i>
                              <h4>The Butcher Series 1 </h4>
                              <p>
                                Created on 5-Jul-19. Last activity Kevin Plummer
                                7-Jul-19
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-12">
                      <form className="pl_signup_form">
                        <div className="form-group">
                          <label htmlFor="company">Switch Entity:</label>
                          <div className="pl_select-box">
                            <div
                              className="pl_select-box__current"
                              tabindex="1"
                            >
                              <div className="pl_select-box__value">
                                <input
                                  className="pl_select-box__input"
                                  type="radio"
                                  id="0"
                                  value="1"
                                  name="Ben"
                                  checked="checked"
                                />
                                <p className="pl_select-box__input-text">
                                  Trevascus Group Pty Ltd
                                </p>
                              </div>
                              <div className="pl_select-box__value">
                                <input
                                  className="pl_select-box__input"
                                  type="radio"
                                  id="1"
                                  value="2"
                                  name="Ben"
                                  checked="checked"
                                />
                                <p className="pl_select-box__input-text">
                                  Individual
                                </p>
                              </div>
                              <img
                                className="pl_select-box__icon"
                                src="images/arrow.png"
                                alt="Arrow Icon"
                                aria-hidden="true"
                              />
                            </div>
                            <ul className="pl_select-box__list">
                              <li>
                                <label
                                  className="pl_select-box__option"
                                  htmlFor="0"
                                  aria-hidden="aria-hidden"
                                >
                                  Trevascus Group Pty Ltd
                                </label>
                              </li>
                              <li>
                                <label
                                  className="pl_select-box__option"
                                  htmlFor="1"
                                  aria-hidden="aria-hidden"
                                >
                                  Individual
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="pl_custom-radio">
                          <label className="pl_remember w-100 text-center">
                            Terms of use. Privacy policy
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
        <ProjectsModal
          openModal={this.state.openProjectsModal}
          closeModal={() => this.closeModal("openProjectsModal")}
        />

        <UsersModal
          openModal={this.state.openUsersModal}
          closeModal={() => this.closeModal("openUsersModal")}
        />
        {/* modal end */}
      </div>
    );
  }
}

export default Projects_List;
