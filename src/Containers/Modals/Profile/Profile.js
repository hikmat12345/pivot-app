import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { Storage, API } from 'aws-amplify';
import $ from "jquery";
import "./Profile.css";
import Modal from "react-bootstrap/Modal";
import Message from "../message/message";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword/ChangePassword";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openChangePasswordModal: false,
      uploadS3: false,
      isLoading: false,
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
    };
  }
  openModal = name => {
    this.setState({ [name]: true }); 
    $(document).ready(function () {
    $('.chngpass_password_eye>input[name="oldPassword"]').focus();
    });
  };
  closeModal = name => {
    this.setState({ [name]: false });
  };
  fileUpload = async (e) => {
    // await Storage.vault.get('download.png')
    // .then(result => {
    //   console.log(result,'await Storage.vault.put(filename, e[0])')
    //   this.setState({image: result})
    // })
    // console.log(e[0], 'fileUploadfileUpload')
    let type = e[0].type;
    if (type == 'image/jpg' || type == 'image/jpeg' || type == 'image/png') {
     await this.setState({
        isLoading :true
      })
      // console.log(e[0],'eeeeeeeeeeeeeeeeeeee')
      // var d = new Date();
      // var date = d.getTime()
      // var filename = e[0].name+date;
      // console.log(filename,'filenamefilenamefilenamefilename')
        var d = new Date();
      var date22 = d.getTime()
      var filename = date22 + ".png"
      console.log("e[0]", e[0])
      console.log("filename", filename)
      await Storage.put("profileimages/"+filename, e[0], { contentType: 'image/png' })
        .then(async result => {
          this.setState({
            uploadS3: true
          })
          // toast.success("Success! Uploaded in s3 bucket");
    
          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Icons",
              "Description": "Profile change image",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": "",
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);
        })
        .catch(err => {
          this.setState({
            message_desc: err,
            message_heading: "Profile",
            openMessageModal: true,
          })
          // toast.error(err);
        });

      if (this.state.uploadS3) {
        await this.updateprofile(filename);
      }
      await this.props.getUserByGuid();
      this.setState({
        isLoading :false
      })
    }
    else {
      this.setState({
        message_desc: "Please Select only Images of type: 'PNG, JPG, JPEG'",
        message_heading: "Profile",
        openMessageModal: true,
      })
      // toast.error("Please Select only Images of type: 'PNG, JPG, JPEG'");
    }
  }
  updateprofile = async (event) => {
    let user_guid = localStorage.getItem('guid')
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotUser",
        guid: user_guid,
        fieldname: "Avatar",
        value: event
      }
    }).then(data => {
      // toast.success("Upload Successfully in Dynamodb");

    }).catch(error => {
      this.setState({
        message_desc: "Not Uploaded to Dynamodb",
        message_heading: "Profile",
        openMessageModal: true,
      })
      // toast.error("Not Uploaded to Dynamodb");
    });
  }

  activityRecord = async (finalarray) => {
    await API.post("pivot", "/addactivities", {
      body: {
          activities: finalarray
      }
    })
      .then(async data => {
        // toast.success('Activity successfully recorded.')
      })
      .catch(err => {
        this.setState({
          message_desc: "Activity failed to record.",
          message_heading: "Activity",
          openMessageModal: true,
        })
        // toast.error('Activity failed to record.')
      });
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
          className={
            this.state.openChangePasswordModal
              ? "profile_modal modal-backdrop"
              : "profile_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="profile_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center profile_form_mx_width">
                    <div className="profile_signup_form_main">
                      <div className="profile_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 profile_order-xs-2">
                            <h4>Profile</h4>
                          </div>
                          <div className="col-12 col-sm-3 profile_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="profile_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <form className="profile_signup_form">
                              <div className="form-group pt-2">
                                <label htmlFor="tex">Email</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="tex"
                                  placeholder="pplummer@pivotreports.com"
                                  value={localStorage.getItem('Email')}
                                  disabled
                                />
                              </div>
                              <div className="form-group pt-2">
                                <div className="profile_image">
                                  <img
                                    src={this.props.profile_image ? this.props.profile_image : "/images/avatar.png"}
                                    className="img-fluid float-left"
                                    alt="Profile"
                                  />
                                </div>
                              </div>
                              <div className="row no-gutters d-flex h-100 input-group mb-2 mt-1">
                                <label htmlFor="tex">Image</label>
                                <div  id="profile_focus"  className="profile_form_upload_message col-12 justify-content-center align-self-center">
                                  <Dropzone  onDrop={this.fileUpload}>
                                    {({ getRootProps, getInputProps }) => (
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />

                                        {/* <img
                                      alt="send_msg"
                                      src={attachUserIcPng}
                                      width="23"
                                      height="43"
                                    /> */}
                                        <p>
                                          <img
                                            src="images/download.png"
                                            className="profile_upload"
                                            alt="download"
                                          />
                                          &nbsp;&nbsp;Drag and drop or click to
                                          upload new file
                                        </p>
                                      </div>
                                    )}
                                  </Dropzone>
                                </div>
                              </div>
                              <div className="profile_bottom_btn">
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.openModal("openChangePasswordModal")
                                  }
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.openModal("openChangePasswordModal")
                                  }}}
                                  className="profile_theme_btn profile_back"
                                >
                                  Change Password
                                </button>
                                <button
                                  type="button"
                                  onClick={this.props.closeModal}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.props.closeModal()
                                  }}}
                                  className="profile_theme_btn"
                                >
                                  Save
                                </button>
                              </div>
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

        <ChangePassword
          openModal={this.state.openChangePasswordModal}
          closeModal={() => this.closeModal("openChangePasswordModal")}
        />
        <Message
          openModal = {this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    );
  }
}

export default Profile;
