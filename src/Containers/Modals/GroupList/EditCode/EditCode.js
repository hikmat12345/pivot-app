import React, {Component} from 'react';
import './EditCode.css';
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import DeleteModal from '../../Projects/Delete/Delete';
import {API} from 'aws-amplify';
import {toast} from 'react-toastify';
import Message from '../../message/message';

class EditCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openDeleteModal: false,
      code: '',
      description: '',
      counter: 1,
      hide_check: false,
      openMessageModal: false,
      message_heading: '',
      required_messages: [],
      message_desc: '',
      formErrors: {
        code: '',
        description: '',
      },
    };
  }

  closeModal = name => {
    if (name === 'closeAll') {
      this.setState({openDeleteModal: false});
      this.props.closeModal('closeAll');
      this.clearStates();
    } else if (name == 'openMessageModal') {
      this.setState({openMessageModal: false});
    } else {
      this.setState({[name]: false});
      this.props.closeModal();
      this.setState({counter: 1});
    }
  };
  fieldChangeHandler = e => {
    var value = e.target.value;
    var name = e.target.name;
    if(!value.includes(',')) {
      this.setState({
        [name]: value,
      });
    }
    this.validateField(name, value);
  };
  validateField = (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case 'code':
        if (value === '') {
          formErrors.code = 'This Field is Required.';
        } else if(value.includes(',')) {
          formErrors.code = "Comma isn't allowed.";
        } else {
          formErrors.code = '';
        }
        break;
      case 'description':
        if (value === '') {
          formErrors.description = 'This Field is Required.';
        } else {
          formErrors.description = '';
        }
        break;
    }
  };
  onSaveHandler = async e => {
    e.preventDefault();
    this.setState({counter: 1});
    var formErrors = this.state.formErrors;
    if (this.state.code == '') {
      formErrors.code = 'This Field is Required.';
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ''
      );
    }
    if(this.state.code.includes(',')) {
      formErrors.code = "Comma isn't allowed.";
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ''
      );
    }

    if (this.state.description == '') {
      formErrors.description = 'This Field is Required.';
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ''
      );
    }
    this.setState({
      formErrors: formErrors,
    });
    if (this.state.code !== '' && this.state.description !== '') {
      const oldData = {
        code: this.props.selected_code,
        description: this.props.selected_description,
        hide_check: this.props.selected_hide,
      };
      const newData = {
        code: this.state.code,
        description: this.state.description,
        hide_check: this.state.hide_check,
      };
      await this.setState({isLoading: true});
      let tenantguid = localStorage.getItem('tenantguid');
      await API.post('pivot', '/addgroupcode', {
        body: {
          guid: this.state.selected_guid,
          Code: this.state.code,
          Description: this.state.description,
          Hide: this.state.hide_check,
          TemplateGuid: this.props.template_guid,
          PivotBusinessUnit: this.props.selectedProject.guid,
          TenantGuid: tenantguid,
        },
      })
        .then(async data => {
          let dateTime = new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Groups List",
              "Description": "Edit Code - Code",
              "ProjectName": this.props.selectedProject.Name,
              "Projectguid": this.props.selectedProject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.selected_code,
              "ValueTo": this.state.code,
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Groups List",
              "Description": "Edit Code - Description",
              "ProjectName": this.props.selectedProject.Name,
              "Projectguid": this.props.selectedProject.guid,
              "ColumnName": "",
              "ValueFrom": this.props.selected_description,
              "ValueTo": this.state.description,
              "Tenantid": localStorage.getItem('tenantguid')
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Groups List",
              "Description": "Edit Code - Hide",
              "ProjectName": this.props.selectedProject.Name,
              "Projectguid": this.props.selectedProject.guid,
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": this.props.selected_hide,
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);

          this.props.closeModal();
          this.clearStates();
          this.props.getGroupsHandler();
          this.props.updateGroups(oldData, newData);
        })
        .catch(err => {
          this.setState({
            message_desc: "Do not add group code.",
            message_heading: "Group Code",
            openMessageModal: true,
          })
          // toast.error('do not add group code');
        });

      await this.setState({isLoading: false});
      await this.props.replaceHistory(this.props.finaldata);
    }
  };

  deleteUserHandler = async () => {
    const oldData = {
      code: this.props.selected_code,
      description: this.props.selected_description,
      hide_check: this.props.selected_hide,
    };
    const newData = {
      code: '',
      description: '',
      hide_check: false,
    };
    await this.setState({isLoading: true});
    await API.post('pivot', '/deletegroup', {
      body: {
        guid: this.state.selected_guid,
      },
    })
      .then(async data => {
        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Groups List",
            "Description": "Edit Code - Delete",
            "ProjectName": this.props.selectedProject.Name,
            "Projectguid": this.props.selectedProject.guid,
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": this.props.selected_code,
            "Tenantid": localStorage.getItem('tenantguid')
          }
        ]);

        this.setState({openDeleteModal: false});
        this.props.closeModal('closeAll');
        this.clearStates();
        this.props.getGroupsHandler();
        this.props.updateGroups(oldData, newData);
      })
      .catch(err => {
        this.setState({
          message_desc: "Can't deleted group.",
          message_heading: "Group",
          openMessageModal: true,
        })
        // toast.error('cant deleted group');
      });

    await this.setState({isLoading: false});
  };

  openModal = name => {
    this.setState({[name]: true});
  };

  onPressEnter = e => {
    // e.rpreventDefault();
    var keys = this.state.counter;
    if (keys <= 1) {
      var key = keys + 1;
      this.setState({counter: key});
      if (e.keyCode === 27) {
        this.clearStates();
        this.setState({counter: 1});
      }
    } else {
      if (e.keyCode === 13) {
        this.setState({counter: 1});
        document.getElementById('save_edit_code').click();
      } else if (e.keyCode === 27) {
        this.clearStates();
        this.setState({counter: 1});
      }
    }
  };

  clearStates = () => {
    this.setState({
      code: '',
      description: '',
      hide_check: false,
      formErrors: {
        code: '',
        description: '',
      },
    });
  };

  checkboxHandler = e => {
    this.setState({
      hide_check: e.target.checked,
    });
  };

  componentWillReceiveProps = () => {
    this.setState({
      selected_guid: this.props.selected_guid,
      code: this.props.selected_code,
      hide_check: this.props.selected_hide,
      description: this.props.selected_description,
      required_messages: this.props.required_messages,
    });
  };

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
        {this.state.isLoading ? <div className="se-pre-con"></div> : ''}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className="ec_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="ec_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 ec_form_mx_width">
                    <div className="ec_signup_form_main">
                      <div className="ec_signup_header">
                        <div className="row">
                          <img
                            src="/images/2/close.png"
                            onClick={this.closeModal}
                            className="d-block img-fluid modal_closed_btn"
                            alt="close"
                          />

                          <div className="col-12 col-sm-8 ec_order-xs-2">
                            <h4>Edit Code</h4>
                          </div>
                          <div className="col-12 col-sm-3 ec_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ec_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div
                              onKeyUp={this.onPressEnter}
                              className="ec_signup_form"
                            >
                              <div className="form-group">
                                <label htmlFor="p-name">Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Editcode"
                                  name="code"
                                  value={this.state.code}
                                  onChange={this.fieldChangeHandler}
                                  placeholder="NZQ"
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.code !== ''
                                    ? this.state.formErrors.code
                                    : ''}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="p-name">Description</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="description"
                                  value={this.state.description}
                                  id="p-name"
                                  onChange={this.fieldChangeHandler}
                                  placeholder="New Zealand QAPE"
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.description !== ''
                                    ? this.state.formErrors.description
                                    : ''}
                                </div>
                              </div>

                              <div className="">
                                <label className="ec_container ec_remember">
                                  Hide
                                  <input
                                    type="checkbox"
                                    name="type"
                                    checked={this.state.hide_check}
                                    onChange={this.checkboxHandler}
                                  />
                                  <span className="ec_checkmark"></span>
                                </label>
                              </div>
                              <div className="ec_bottom_btn">
                                <button
                                  onClick={() =>
                                    this.openModal('openDeleteModal')
                                  }
                                  onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={e => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.openModal('openDeleteModal');
                                      $(document).ready(function() {
                                        $('#projects_sub_del').focus();
                                      });
                                    }
                                  }}
                                  type="button"
                                  className="ec_theme_btn ec_back"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={this.onSaveHandler}
                                  onKeyDown={e => {
                                    if (e.keyCode === 13) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  onKeyUp={e => {
                                    if (e.keyCode === 13) {
                                      e.stopPropagation();
                                      this.onSaveHandler(e);
                                    }
                                  }}
                                  type="button"
                                  id="save_edit_code"
                                  className="ec_theme_btn"
                                >
                                  Save
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
            </div>
          </Modal.Body>
        </Modal>
        <DeleteModal
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          confirmDelete={this.deleteUserHandler}
        />
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal('openMessageModal')}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    );
  }
}

export default EditCode;
