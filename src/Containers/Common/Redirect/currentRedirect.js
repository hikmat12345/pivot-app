import '../../Modals/message/message.css'

import { API } from 'aws-amplify'
import React from 'react'
import { toast } from 'react-toastify'

class Redirect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount = async () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const page_type = urlParams.get('error')
    if (page_type) {
      localStorage.removeItem('xero')
      this.redirectMe()
    } else {
      await this.getXeroToken()
    }
  }

  getXeroToken = async () => {
    await API.post('pivot', '/xerogettoken', {
      body: {
        clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
        clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
        redirectUris: process.env.REACT_APP_XERO_APP_URL,
        scopes: process.env.REACT_APP_XERO_APP_SCOPES,
        url: window.location.href
      }
    })
      .then(async token => {
        this.updateUserToken(token)
      })
      .catch(error => {
        toast.error('/xerogettoken: Failed')
      })
  }

  redirectMe = () => {
    this.props.history.push('/projects', {
      from: '/redirect'
    })
    // this.updatexerodbname()
  }

  updateUserToken = async token => {
    /**
     * To save selected xero tenant in project
     */
    // let pid = localStorage.getItem('selectedProjectId')
    // await API.post('pivot', '/updatefields', {
    //   body: {
    //     table: 'PivotBusinessUnit',
    //     guid: pid,
    //     fieldname: 'XeroDB',
    //     value: JSON.parse(localStorage.getItem('connectedTenant'))
    //   }
    // })
    //   .then(async data => {
    //     // toast.success("Columns Updated Successfully.");
    //   })
    //   .catch(err => {})

    let xero = JSON.parse(localStorage.getItem('xero'))
    if (xero.loggedInUserGuid) {
      await API.post('pivot', '/updatefields', {
        body: {
          table: 'PivotUser',
          guid: xero.loggedInUserGuid,
          fieldname: 'XeroTokenObject',
          value: token
        }
      }).catch(err => {
        toast.error('Xero token failed to assign to user.')
      })

      this.redirectMe()
    } else {
      toast.error('Xero token failed to assign to user.')
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
      </>
    )
  }
}
export default Redirect
