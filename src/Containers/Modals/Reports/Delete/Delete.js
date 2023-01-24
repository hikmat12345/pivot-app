import './Delete.css'

import { API, JS, Storage } from 'aws-amplify'
import React, { Component } from 'react'

import Message from "../../message/message";
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'

class DeleteModal extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      openMessageModal: false,
      message_heading: '',
      message_desc: ''
    }
  }

  componentWillReceiveProps = async () => {
    if (this.props.guid) {
      await this.setState({ guid: this.props.guid })
    }
  }

  closeModal = async (name) => {
    this.setState({ [name]: false });
  };

  deleteLayout = async () => {
    if (this.state.guid) {
      var guid = this.state.guid
      let { layoutName } = this.props
      this.setState({ isLoading: true })
      await API.post('pivot', '/deletelayout', {
        body: {
          guid: guid
        }
      })
        .then(async data => {
          this.setState({ guid: '' })

          let dateTime = new Date().getTime()
          this.activityRecord([
            {
              User: localStorage.getItem('Email'),
              Datetime: dateTime,
              Module: 'Reports',
              Description: 'Delete Layout',
              Projectguid: this.props.currentproject.guid,
              ProjectName: '',
              ColumnName: '',
              ValueFrom: '',
              ValueTo: layoutName,
              Tenantid: localStorage.getItem('tenantguid')
            }
          ])

          // toast.success("delete layout successfully");
        })
        .catch(err => {
          this.setState({
            message_desc: 'Error While deleting layout',
            message_heading: 'Layout',
            openMessageModal: true
          })
          // toast.error("Error While deleting layout")
        })
    }
    await this.props.getLayouts()

    this.setState({ isLoading: false })
    this.props.closeModal('openDeleteModal')

    this.props.editCloseModal('openEditLayoutModal')
  }

  activityRecord = async finalarray => {
    await API.post('pivot', '/addactivities', {
      body: {
        activities: finalarray
      }
    })
      .then(async data => {
        // toast.success('Activity successfully recorded.')
      })
      .catch(err => {
        this.setState({
          message_desc: 'Activity failed to record.',
          message_heading: 'Activity',
          openMessageModal: true
        })
        // toast.error('Activity failed to record.')
      })
  }

  render () {
    return (
      <>
        {' '}
        {this.state.isLoading ? <div className='se-pre-con'></div> : ''}
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className='dlm_modal'
        >
          <Modal.Body>
            <div className='container-fluid'>
              <div className='dlm_main_wrapper'>
                <div className='row d-flex h-100'>
                  <div className='col-12 dlm_form_mx_width'>
                    <div className='dlm_signup_form_main'>
                      <div className='dlm_signup_header'>
                        <div className='row'>
                          <img
                            src='/images/2/close.png'
                            onClick={this.props.closeModalwd}
                            className='d-block img-fluid modal_closed_btn'
                            alt='close'
                          />

                          <div className='col-12 col-sm-8 dlm_order-xs-2'>
                            <h4>Delete</h4>
                          </div>
                          <div className='col-12 col-sm-3 dlm_order-xs-1'>
                            <img
                              src='/images/pivot.png'
                              className='img-fluid float-right'
                              alt='Logo'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='dlm_signup_body'>
                        <div className='col-12'>
                          <div className='dlm_body'>
                            <p className='dlm_text'>
                              Are You Sure You Want To Delete?
                            </p>
                            <button
                              onClick={this.deleteLayout}
                              type='button'
                              className='dlm_theme_btn'
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
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    )
  }
}

export default DeleteModal
