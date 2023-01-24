import "./UsersList.css";

import React, { Component, Fragment } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import AddUserModal from "../AddUser/AddUser";
import EditUserModal from "../EditUser/EditUser";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { toast } from "react-toastify";

class UsersListModal extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openAddUserModal: false,
      openEditUserModal: false,
      openMessageModal: false,
      message_heading: '',
      message_desc: '',
      user_type: "",
      users: [], //all user
      singleUser: "" //contains user data to edit
    };
  }

  async componentWillReceiveProps() {
    await this.setState({
      users: this.props.userslist,
      user_type: this.props.user_type
    });
  }

  openModal = name => {
    if (name === 'openAddUserModal') {
      this.setState({ openAddUserModal: true })
      $(document).ready(function () {
        $(this).find('#email_add_user').focus();
        $(".multi-select .dropdown").attr('tabindex', 0);
      })
    }
    else {
      this.setState({ [name]: true });
    }
  };

  closeModal = name => {
    if (name === "closeAll") {
      this.setState({ openEditUserModal: false });
      this.props.closeModal();
    } else {
      this.setState({ [name]: false });
    }
  };

  editUser = async guid => {
    let loginUserGuid = localStorage.getItem('guid')
    let flag = guid === loginUserGuid;
    if (loginUserGuid) {
      if (!flag) {
        await this.setState({
          isLoading: true
        });
        await API.post("pivot", "/getUserByGuid", {
          body: { guid }
        })
          .then(data => {
            this.setState({
              singleUser: data,
              openEditUserModal: true
            });
            $(document).ready(function () {

              $(this).find('#message_edit_user').focus();
            })
          })
          .catch(err => {
            this.setState({
              message_desc: "User Not Found",
              message_heading: "User",
              openMessageModal: true,
            })
            // toast.error("User Not Found");
          });
        await this.setState({
          isLoading: false
        });
      } else {
        await this.setState({
          openMessageModal: true
        })
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
      }
    } else {
      this.setState({
        message_desc: "Login User's Guid Not Found!",
        message_heading: "User",
        openMessageModal: true,
      })
      // toast.error("Login User's Guid Not Found!");

    }
  };

  onTabCloseHandler = (e) => {
    if (e.keyCode == 9) {
      e.preventDefault();
      $('#user_tab_index').focus();
    }
  }

  onEnterKeyUser = (e, v) => {

    // e.preventDefault(); 
    if (e.which === 13) {
      this.editUser(v)
    }
  }

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          // className="ul_modal"
          className={
            this.state.openAddUserModal || this.state.openEditUserModal
              ? "ul_modal modal-backdrop"
              : "ul_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="ul_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center ul_form_mx_width">
                    <div className="ul_signup_form_main">
                      <div className="ul_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 ul_order-xs-2">
                            <h4>User List</h4>
                          </div>
                          <div className="col-12 col-sm-3 ul_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 no-padding">
                        <div className="ul_project_modals">
                          <ul>
                            <li>
                              <button
                                id="user_tab_index"
                                tabIndex={this.props.projectslength + 5}
                                onClick={() =>
                                  this.openModal("openAddUserModal")
                                }
                                type="button"
                                className="ul_theme_btn ul_modal_btn"
                              >
                                {/* <i className="fa fa-plus"></i> User */}
                                <img alt="add" src="/images/p3.png" class="img-fluid float-left width-13" /> User
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="ul_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div className="ul_project_scroll">
                              <ul className="ul_project user_Lists">
                                {/*this.state.users.map((user, key) => (
                                  <li key={key}>
                                  </li>
                                ))}
                                {this.state.users.map((user, key) => (
                                  <li key={key}>
                                  </li>
                                ))*/}
                                {this.props.userslist.map((user, key) => (
                                  <Fragment key={key}>
                                    {/* user.type == "SYSTEM" ? '': this.state.user_type == "SYSTEM" ?  */}
                                    {user.Disabled ? (
                                      <li onKeyDown={(e) => this.onEnterKeyUser(e, user.guid)} tabIndex={this.props.projectslength + 6} id={'userFocus_' + (this.props.projectslength + 6)}>
                                        <div className="ul_projects_list ul_red">
                                          {/* <i
                                            onClick={() =>
                                              this.editUser(user.guid)
                                            }
                                            className="fa fa-pencil"
                                          ></i> */}
                                          <img
                                            alt="add"
                                            src="/images/p2.png"
                                            class="ul_project_list_img"
                                            onClick={() => this.editUser(user.guid)} />
                                          <i
                                            onClick={() =>
                                              this.editUser(user.guid)
                                            }
                                            className="fa fa-times ul_user_label"
                                          ></i>
                                          <div className="row no-gutters d-flex h-100">
                                            <div className="col-12 col-sm-2 justify-content-center align-self-center">
                                              <img
                                                src={user.Avatar == "filename" ? "/images/avatar.jpg" : user.Avatar.includes("http") == true ? user.Avatar : `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/public/profileimages/${user.Avatar}`}
                                                className="img-fluid"
                                                alt="user image"
                                              />
                                            </div>
                                            <div onClick={() => this.editUser(user.guid)} className="col-10 justify-content-center align-self-center">
                                              <h4>{user.Email}</h4>
                                              <p>{"Type:" + " " + user.type}</p>
                                              <div className="ul_user_status">
                                                <span>{user.Disabled == true ? 'Disabled' : '-'}</span>
                                                <span>
                                                  {"Invitation sent" + " " + moment(user.InvitationSent).format("DD-MMM-YY")}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ) : user.LockedOut ? (
                                      <li onKeyDown={(e) => this.onEnterKeyUser(e, user.guid)} tabIndex={this.props.projectslength + 6} id={'userFocus_' + (this.props.projectslength + 6)}>
                                        <div className="ul_projects_list ul_orange">
                                          {/* <i
                                            onClick={() =>
                                              this.editUser(user.guid)
                                            }
                                            className="fa fa-pencil"
                                          ></i> */}
                                          <img
                                            alt="add"
                                            src="/images/p2.png"
                                            class="ul_project_list_img"
                                            onClick={() => this.editUser(user.guid)} />
                                          <i
                                            onClick={() =>
                                              this.editUser(user.guid)
                                            }
                                            className="fa fa-asterisk ul_user_label"
                                          ></i>
                                          <div className="row no-gutters d-flex h-100">
                                            <div className="col-12 col-sm-2 justify-content-center align-self-center">
                                              <img
                                                src={user.Avatar == "filename" ? "/images/avatar.jpg" : user.Avatar.includes("http") == true ? user.Avatar : `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/public/profileimages/${user.Avatar}`}
                                                className="img-fluid"
                                                alt="user image"
                                              />
                                            </div>
                                            <div onClick={() => this.editUser(user.guid)} className="col-10 justify-content-center align-self-center">
                                              <h4>{user.Email}</h4>
                                              <p>{"Type:" + " " + user.type}</p>
                                              <div className="ul_user_status">
                                                <span>{user.LockedOut == true ? 'Locked out' : '-'}</span>
                                                <span>
                                                  {"Invitation sent" + " " + moment(user.InvitationSent).format("DD-MMM-YY")}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ) : (
                                          <li onKeyDown={(e) => this.onEnterKeyUser(e, user.guid)} tabIndex={this.props.projectslength + 6} id={'userFocus_' + (this.props.projectslength + 6)}>
                                            <div className="ul_projects_list">
                                              {/* <i
                                                onClick={() =>
                                                  this.editUser(user.guid)
                                                }
                                                className="fa fa-pencil"
                                              ></i> */}

                                              <img
                                                alt="add"
                                                src="/images/p2.png"
                                                class="ul_project_list_img"
                                                onClick={() => this.editUser(user.guid)} />
                                              <i
                                                onClick={() =>
                                                  this.editUser(user.guid)
                                                }
                                                className="fa fa-check ul_user_label"
                                              ></i>
                                              <div className="row no-gutters d-flex h-100">
                                                <div className="col-12 col-sm-2 justify-content-center align-self-center">
                                                  <img
                                                    src={user.Avatar == "filename" ? "/images/avatar.jpg" : user.Avatar.includes("http") == true ? user.Avatar : `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/public/profileimages/${user.Avatar}`}
                                                    className="img-fluid"
                                                    alt="user image"
                                                  />
                                                </div>
                                                <div onClick={() => this.editUser(user.guid)} className="col-10 justify-content-center align-self-center">
                                                  <h4>{user.Email}</h4>
                                                  <p>{"Type:" + " " + (user.type === "View" ? "Read Only" : user.type)}</p>
                                                  <div className="ul_user_status">
                                                    <span>{user.Disabled == false && user.LockedOut == false ? 'Enabled' : '-'}</span>
                                                    <span>
                                                      {"Invitation sent" + " " + moment(user.InvitationSent).format("DD-MMM-YY")}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        )}
                                  </Fragment>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="text-center">
                              <button
                                onKeyDown={(e) => this.onTabCloseHandler(e)}
                                id="closed_user"
                                tabIndex=""
                                type="button"
                                onClick={this.props.closeModal}
                                className="ul_theme_btn"
                              >
                                Close
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

        <AddUserModal
          login_user_type={this.props.user_type}
          openModal={this.state.openAddUserModal}
          closeModal={() => this.closeModal("openAddUserModal")}
          getUsers={this.props.getUsers}
          projectList={this.props.projectsList}
          required_messages={this.props.required_messages}
          subscriptions={this.props.subscriptions}
        />

        <EditUserModal
          openModal={this.state.openEditUserModal}
          closeModal={this.closeModal}
          userData={this.state.singleUser}
          getUsers={this.props.getUsers}
          projectList={this.props.projectsList}
          required_messages={this.props.required_messages}
          login_user_type={this.props.user_type}
          login_user_email={this.props.login_user_email}
          subscriptions={this.props.subscriptions}
        />

        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading ? this.state.message_heading : 'Attention !'}
        >{this.state.message_desc ? this.state.message_desc : "You Can't Edit Yourself"}</Message>
      </>
    );
  }
}

export default UsersListModal;
