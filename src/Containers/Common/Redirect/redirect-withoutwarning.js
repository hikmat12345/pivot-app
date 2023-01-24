import React, {Component} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Message from "../../Modals/message/message";
  import { API } from "aws-amplify";
const base64url = require('base64url');

class Redirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMessageModal: "",
      message_heading: "",
      message_desc: ""
    };
  }

  componentDidMount = async () => {
    let access_token = localStorage.getItem('access_token');
    let refresh_token = localStorage.getItem('refresh_token'); 
   
   // if(access_token === null && refresh_token === null) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const page_type = urlParams.get('code')
      localStorage.setItem("token",page_type);

      if(page_type) {
        var data="grant_type=authorization_code&code="+localStorage.getItem('token')+"&redirect_uri=" + process.env.REACT_APP_XERO_APP_URL+ "redirect"
        await this.getToken(data);
      }
  //  }
    let guid = localStorage.getItem('selectedProjectId');
    access_token = JSON.parse(localStorage.getItem('access_token'));
    await this.buildConnection(access_token, guid);
  };

  getToken = async (data) => {
    let code = localStorage.getItem("token");
    await axios({
      method: 'post',
      url: 'https://identity.xero.com/connect/token',
      data: data,
      headers: {
        "authorization": "Basic " + base64url(process.env.REACT_APP_XERO_APP_CLIENTID + ":" + process.env.REACT_APP_XERO_APP_SECRET_KEY),
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': '*',
        "Accept": "*/*"
        }
      })
      .then((response) => {
        localStorage.setItem("access_token",JSON.stringify(response.data.access_token));
        localStorage.setItem("refresh_token",JSON.stringify(response.data.refresh_token));
      })
      .catch(async () => {
        // await this.getToken(data);
        this.setState({
          message_desc: 'Token request failed. Please try again.',
          message_heading: "Xero",
          openMessageModal: true,
        });
      });
  }

  buildConnection = async (access_token, guid) => {
    await axios
    .get(
      'https://cors-anywhere.herokuapp.com/https://api.xero.com/connections',
      {
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(async (response) => {
      localStorage.setItem('xeroTenantId', response.data[0].tenantId);
      localStorage.setItem('xeroTenantName', response.data[0].tenantName);
      await this.updatexerodbname();
      let lastLocation = localStorage.getItem('lastLocation');
      switch(lastLocation) {
        case '/projects':
          this.props.history.push(lastLocation);
          break;
        case '/dashboard':
          this.props.history.push(lastLocation, {
            guid,
          });
          break;
        default:
          this.props.history.push('/login');
          break;
      }
    })
    .catch(async (error) => {
      await this.refreshXeroToken(access_token, guid);
      // await this.buildConnection(access_token, guid);
      this.setState({
        message_desc: 'Connection request failed. Please try again.',
        message_heading: "Xero",
        openMessageModal: true,
      });
    });
  }
updatexerodbname=async()=>{
     
    let pid = localStorage.getItem("selectedProjectId");
     await API.post('pivot', '/updatefields', {
    body: {
    table: 'PivotBusinessUnit',
    guid: pid,
    fieldname: 'XeroDB',
    value: localStorage.getItem("xeroTenantName"),
    },
    })
    .then(async (data) => {
  
    // toast.success("Columns Updated Successfully.");
    })
    .catch((err) => {

    });
}
  refreshXeroToken = async (access_token, guid) => {
    let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    var data = 'grant_type=refresh_token&refresh_token=' + refresh_token;

    await axios({
      method: 'POST',
      url: 'https://identity.xero.com/connect/token',
      data: data,
      headers: {
        authorization: 'Basic ' + base64url(process.env.REACT_APP_XERO_APP_CLIENTID + ":" + process.env.REACT_APP_XERO_APP_SECRET_KEY),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(async (response) => {
        localStorage.setItem('access_token', JSON.stringify(response.data.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
        await this.buildConnection(access_token, guid);
      })
      .catch((myBlob) => {
        this.setState({
          message_desc: 'Refresh token request failed. Please try again.',
          message_heading: "Xero",
          openMessageModal: true,
        });
        let lastLocation = localStorage.getItem('lastLocation');
        switch(lastLocation) {
          case '/projects':
            this.props.history.push(lastLocation);
            break;
          case '/dashboard':
            this.props.history.push(lastLocation, {
              guid,
            });
            break;
          default:
            this.props.history.push('/login');
            break;
        }
        this.closeModal("openMessageModal");
      });
  };

  closeModal = async name => {
    if (name == "openMessageModal") {
      this.setState({
        openMessageModal: false
      });
    }
  };

  render() {
    return (
      <>
        <div className="se-pre-con"></div>
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    );
  }
}
export default Redirect;
