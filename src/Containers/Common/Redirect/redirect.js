import React, { Component } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../../Modals/message/message.css'
import $ from 'jquery'
import Modal from 'react-bootstrap/Modal'
import { API } from 'aws-amplify'
const base64url = require('base64url')

class Redirect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openMessageModal: '',
      isLoading: true,
      message_heading: '',
      message_desc: ''
    }
  }

  componentDidMount = async () => {
    //    let access_token = localStorage.getItem("access_token");
    //    let refresh_token = localStorage.getItem("refresh_token");

    // if(access_token === null && refresh_token === null) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const page_type = urlParams.get('code')
    localStorage.setItem('token', page_type)

    if (page_type) {
      var data =
        'grant_type=authorization_code&code=' +
        localStorage.getItem('token') +
        '&redirect_uri=' +
        process.env.REACT_APP_XERO_APP_URL +
        'redirect'
      await this.getToken(data)
    }
    //  }
    let guid = localStorage.getItem('selectedProjectId')
    var access_token = JSON.parse(localStorage.getItem('access_token'))
    await this.buildConnection(access_token, guid)
  }

  getToken = async data => {
    let code = localStorage.getItem('token')
    await axios({
      method: 'post',
      url: 'https://identity.xero.com/connect/token',
      data: data,
      headers: {
        authorization:
          'Basic ' +
          base64url(
            process.env.REACT_APP_XERO_APP_CLIENTID +
              ':' +
              process.env.REACT_APP_XERO_APP_SECRET_KEY
          ),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        Accept: '*/*'
      }
    })
      .then(response => {
        localStorage.setItem(
          'access_token',
          JSON.stringify(response.data.access_token)
        )
        localStorage.setItem(
          'refresh_token',
          JSON.stringify(response.data.refresh_token)
        )
      })
      .catch(async () => {
        // await this.getToken(data);
        this.setState({
          message_desc: 'Token request failed. Please try again.',
          message_heading: 'Xero',
          openMessageModal: true
        })
      })
  }

  buildConnection = async (access_token, guid) => {
    await axios
      .get('https://cors-anywhere.herokuapp.com/https://api.xero.com/connections', {
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        }
      })
      .then(async response => {
        console.log("buildConnection ------------ ", response)
        var olddb = localStorage.getItem('xeroSelectedProjectXeroDB')
        localStorage.setItem('xeroTenantId', response.data[0].tenantId)
        localStorage.setItem('xeroTenantName', response.data[0].tenantName)

        let xeroActivity = await localStorage.getItem('xeroActivity')
        xeroActivity = JSON.parse(xeroActivity)
        xeroActivity = {
          projectName: xeroActivity.projectName,
          projectGuid: xeroActivity.projectGuid,
          connectedCompany: '' + response.data[0].tenantName
        }
        localStorage.setItem('xeroActivity', JSON.stringify(xeroActivity))

        let lastLocation = localStorage.getItem('lastLocation')
        if (olddb !== 'null' && olddb !== response.data[0].tenantName) {
          this.setState({
            isLoading: false,
            message_desc:
              'You are attempting to connect a different database to this project.  This will update the chart and data from the new database. Click X to abort or OK to continue.',
            message_heading: 'Warning',
            openMessageModal: true
          })
        } else {
          await this.updatexerodbname()
          this.redirectme(lastLocation, guid)
        }
      })
      .catch(async error => {
        await this.refreshXeroToken(access_token, guid)
        // await this.buildConnection(access_token, guid);
        this.setState({
          message_desc: 'Connection request failed. Please try again.',
          message_heading: 'Xero',
          openMessageModal: true
        })
      })
  }

  buildConnection1 = async (access_token, guid) => {
    await API
      .post('pivot', '/xerogetconnections', {
        body: {
          access_token: access_token
        }
      })
      .then(async response => {
        console.log("buildConnection response ------------ ", response)
      })
      .catch(async error => {
        console.log("buildConnection error ------------ ", error)
      })
  }


  redirectme = (lastLocation, guid) => {
    switch (lastLocation) {
      case '/projects':
        this.props.history.push(lastLocation, {
          from: '/redirect'
        })
        break
      case '/dashboard':
        this.props.history.push(lastLocation, {
          guid,
          from: '/redirect'
        })
        break
      default:
        this.props.history.push('/login', {
          from: '/redirect'
        })
        break
    }
  }
  revert = async (locat, guid) => {
    localStorage.removeItem('access_token')

    // localStorage.removeItem("refresh_token");
    localStorage.removeItem('xeroTenantId')
    localStorage.removeItem('xeroTenantName')
    this.redirectme(locat, guid)
    // window.location.assign(
    //   "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=" +
    //     process.env.REACT_APP_XERO_APP_CLIENTID +
    //     "&redirect_uri=" +
    //     process.env.REACT_APP_XERO_APP_URL +
    //     "redirect&scope=openid profile email accounting.reports.read accounting.transactions accounting.settings accounting.reports.read projects offline_access&state=123"
    // );
  }
  updatexerodbname = async () => {
    let pid = localStorage.getItem('selectedProjectId')
    await API.post('pivot', '/updatefields', {
      body: {
        table: 'PivotBusinessUnit',
        guid: pid,
        fieldname: 'XeroDB',
        value: localStorage.getItem('xeroTenantName')
      }
    })
      .then(async data => {
        // toast.success("Columns Updated Successfully.");
      })
      .catch(err => {})
  }
  refreshXeroToken = async (access_token, guid) => {
    let refresh_token = JSON.parse(localStorage.getItem('refresh_token'))
    var data = 'grant_type=refresh_token&refresh_token=' + refresh_token

    await axios({
      method: 'POST',
      url: 'https://identity.xero.com/connect/token',
      data: data,
      headers: {
        authorization:
          'Basic ' +
          base64url(
            process.env.REACT_APP_XERO_APP_CLIENTID +
              ':' +
              process.env.REACT_APP_XERO_APP_SECRET_KEY
          ),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(async response => {
        localStorage.setItem(
          'access_token',
          JSON.stringify(response.data.access_token)
        )
        localStorage.setItem(
          'refresh_token',
          JSON.stringify(response.data.refresh_token)
        )
        await this.buildConnection(access_token, guid)
      })
      .catch(myBlob => {
        this.setState({
          message_desc: 'Refresh token request failed. Please try again.',
          message_heading: 'Xero',
          openMessageModal: true
        })
        let lastLocation = localStorage.getItem('lastLocation')
        switch (lastLocation) {
          case '/projects':
            this.props.history.push(lastLocation, {
              from: '/redirect'
            })
            break
          case '/dashboard':
            this.props.history.push(lastLocation, {
              guid,
              from: '/redirect'
            })
            break
          default:
            this.props.history.push('/login', {
              from: '/redirect'
            })
            break
        }
        this.closeModal('openMessageModal')
      })
  }

  closeModal = async name => {
    if (name == 'openMessageModal') {
      this.setState({
        openMessageModal: false
      })
    }
  }

  render () {
    return (
      <>
        {this.state.isLoading === true ? (
          <div className='se-pre-con'></div>
        ) : (
          ''
        )}
        <Message1
          openModal={this.state.openMessageModal}
          updatedbname={this.updatexerodbname}
          closeModal={() => this.closeModal('openMessageModal')}
          heading={this.state.message_heading}
          redirect={this.redirectme}
          revert={this.revert}
          locat={localStorage.getItem('lastLocation')}
          guid={localStorage.getItem('selectedProjectId')}
        >
          {this.state.message_desc}
        </Message1>
      </>
    )
  }
}
export default Redirect

class Message1 extends Component {
  constructor () {
    super()
    this.state = {
      show: false,
      showConfirm: false,
      isLoading: false
    }
  }

  message = async () => {
    //  await this.props.deletetemplate();
    await this.setState({ isLoading: true })
    await this.props.updatedbname()
    await this.props.redirect(this.props.locat, this.props.guid)
    await this.setState({ isLoading: false })
  }
  componentWillReceiveProps = () => {
    $(document).ready(function () {
      $('#ok_button').focus()
    })
  }

  render () {
    return (
      <>
        {this.state.isLoading === true ? (
          <div className='se-pre-con'></div>
        ) : (
          ''
        )}
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={this.props.openModal}
          onHide={this.message}
          className='dm_modal'
        >
          <Modal.Body>
            <div className='container-fluid'>
              <div className='dm_main_wrapper'>
                <div className='row d-flex h-100'>
                  <div className='col-12 dm_form_mx_width'>
                    <div className='dm_signup_form_main'>
                      <div className='dm_signup_header'>
                        <div className='row'>
                          <img
                            src='/images/2/close.png'
                            onClick={() =>
                              this.props.revert(
                                this.props.locat,
                                this.props.guid
                              )
                            }
                            className='d-block img-fluid modal_closed_btn'
                            alt='close'
                          />

                          <div className='col-12 col-sm-8 dm_order-xs-2'>
                            <h4>{this.props.heading}</h4>
                          </div>
                          <div className='col-12 col-sm-3 dm_order-xs-1'>
                            <img
                              src='/images/pivot.png'
                              className='img-fluid float-right'
                              alt='Logo'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='dm_signup_body'>
                        <div className='row'>
                          <div className='col-12'>
                            <div className='dm_body'>
                              <p className='dm_text'>{this.props.children}</p>
                              <button
                                type='button'
                                onClick={this.message}
                                // onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                // onKeyUp={(e) =>{if(e.keyCode===13){
                                //   e.stopPropagation();
                                //   this.message()
                                // }}}
                                className='dm_theme_btn'
                                id='ok_button'
                              >
                                Ok
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
      </>
    )
  }
}
