import React, { Component } from "react";
import "./EditEntity.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { getUserEntities } from "../../../../actions/generalfuntions";
import { API } from "aws-amplify";
import { connect } from "react-redux";
import Message from "../../message/message";
import Tooltip from "../../../Common/Tooltip/Tooltip";
import $ from "jquery";
class Entity extends Component {
  constructor() {
    super();
    this.state = {
      company: "",
      name: "",
      taxid: "",
      isLoading: false,
      required_tips: [],
      address: "",
      twofactor: false,
      required_messages: [],
      message_desc: "",
message_heading: "",
openMessageModal: false,
      formErrors: {
        company: "",
        name: ""
      },
      show: false,
      showConfirm: false
    };
  }

  componentWillReceiveProps = async () => {
    // console.log(this.props,'this.props.getUserEntity===============')
    var entity = this.props.entityresult;
    if (entity.Item) {
      entity = entity.Item;
      this.setState({
        name: entity.name,
        taxid: entity.taxId,
        address: entity.address,
        company: entity.entitytype,
        twofactor: entity.two_factor,
        oldEntity: this.props.entityresult,
        required_messages: this.props.required_messages,
        required_tips: this.props.required_tips,
           formErrors: {
        company: "",
        name: ""
      },
      });
    }
  };
  handleInputFields = event => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.setState({ [event.target.name]: event.target.value });
    if (fieldName === "company" || fieldName === "name") {
      this.validateField(fieldName, fieldValue);
    }
  };
  validateField = async (na, value) => {
    var formErrors = this.state.formErrors;
    switch (na) {
      case "company":
        if (value.length < 1) {
          formErrors.company = "This Field is Required.";
        } else {
          formErrors.company = "";
        }
        break;
      case "name":
        if (value.length < 1) {
          formErrors.name = "This Field is Required.";
        } else {
          formErrors.name = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };

  savehandler = async (event, closeModal) => {
    console.log(event,'event')
    var formErrors = this.state.formErrors;
    if (!this.state.company) {
      formErrors.company = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }
    if (!this.state.name) {
      formErrors.name = "This Field is Required.";
      this.state.required_messages.map(e=> e.ID == 1 ? 
        this.setState({
         message_desc : e.Desc,
         message_heading: e.Heading,
         openMessageModal : true
       })  :'')
       $(document).ready(function(){
        $(this).find('#ok_button').focus();
  })
    }

    this.setState({ formErrors: formErrors });
    if (!formErrors.company && !formErrors.name) {
      let guid = JSON.parse(localStorage.getItem("completetenent")).Item.guid;
      let tenantguid = localStorage.getItem("tenantguid");

      var obj = {
        name: this.state.name,
        guid: guid,
        tenantguid: tenantguid,
        entitytype: this.state.company,
        taxid: this.state.taxid === "" ? null : this.state.taxid,
        address: this.state.address === "" ? null : this.state.address,
        twofactor: this.state.twofactor
      };
      this.setState({ isLoading: true });

      await API.post("pivot", "/changeEntity", {
        body: obj
      })
        .then(async data => {

          this.updateusertwofactor();
          
        })
        .catch(err => {
          console.log(err);
        });
     
      closeModal();
      
      let entity = this.state.oldEntity.Item;
      let { company, name, taxid, address, twofactor } = this.state;
      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Edit Entity - Type",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": entity.entitytype,
          "ValueTo": company,
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Edit Entity - Name",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": entity.name,
          "ValueTo": name,
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Edit Entity - Tax ID",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": entity.taxId,
          "ValueTo": taxid,
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Edit Entity - Address",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": entity.address,
          "ValueTo": address,
          "Tenantid": localStorage.getItem('tenantguid')
        }, {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Edit Entity - 2 Factor",
          "ProjectName": "",
          "ColumnName": "",
          "ValueFrom": entity.two_factor,
          "ValueTo": twofactor,
          "Tenantid": localStorage.getItem('tenantguid')
        }
      ]);

      let option = [{label: obj.name, value: obj.guid}]
      this.props.entityValue(option);
           await this.props.getUserEntities(tenantguid);
      if (this.props.getUserEntityErr) {
        this.setState({
          message_desc: "Error While Getting Messages",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Entities");
      }
      if (this.props.getUserEntity) {
        localStorage.setItem(
          "completetenent",
          JSON.stringify(this.props.getUserEntity)
        );
      }
      this.setState({ isLoading: false });
    } else {
//      toast.error("please enter the required fields");
    }
  };
  updateusertwofactor=async()=>{
      
      this.props.usersfortwofactor.map(value=>{
          value.two_factor=this.state.twofactor;
          value.totp_setup_required=this.state.twofactor;
              
      });
      
      await API.post('pivot','/updatetwofactor',{
          body:{
              users:this.props.usersfortwofactor,
              
          }
      }).then(data=>{
          console.log(data);
      }).catch(error=>{
          console.log(error);
      })
  }
  closeModal = name => {
    this.setState({ [name]: false });
  };
//   componentDidUpdate =() =>{
//     $(document).ready(function () {
//     $('#FormSubmit').keydown(function (e) {
//       if(e.which == 13){
//         e.preventDefault()
//         document.getElementById('SubmitButton').click();
//       } });
//   });
// }
  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
        document.getElementById('SubmitButton_editEntity').click();
    }
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
          className="em_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="em_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center em_form_mx_width">
                    <div className="em_signup_form_main">
                      <div className="em_signup_header">
                        <div className="row">
                        <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 em_order-xs-2">
                            <h4>Edit Entity</h4>
                          </div>
                          <div className="col-12 col-sm-3 em_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="em_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.formSubmitHandler} id="FormSubmit" className="em_signup_form">
                              <div className={this.state.formErrors.company !== ""
                                    ? "form-group em_select mb-0"
                                    : "form-group em_select"}>
                                <label>Type</label>
                                <select
                                  className="form-control we_custom_select"
                                  name="company"
                                  onChange={this.handleInputFields}
                                  value={this.state.company}
                                  id="company_edit_entity"
                                >
                                  <option value="">Select</option>
                                  <option value="Company">Company</option>
                                  <option value="Individual">Individual</option>
                                </select>
                                {/* <span className="we_custom_caret"></span> */}
                                
                                <span className="em_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12">
                                  {this.state.formErrors.company !== ""
                                    ? this.state.formErrors.company
                                    : ""}
                                </div>
                              <div className="form-group">
                                <label htmlFor="p-name">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="p-name"
                                  placeholder="keanu Reeves"
                                  onChange={this.handleInputFields}
                                  value={this.state.name}
                                  name="name"
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.name !== ""
                                    ? this.state.formErrors.name
                                    : ""}
                                </div>
                                <div className="form-group">
                                  <label htmlFor="URL">Tax ID</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="URL"
                                    onChange={this.handleInputFields}
                                    value={this.state.taxid}
                                    name="taxid"
                                    placeholder="99 784 457 457"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="key">Address line</label>
                                  <input
                                    type="text"
                                    onChange={this.handleInputFields}
                                    value={this.state.address}
                                    name="address"
                                    className="form-control"
                                    id="key"
                                    placeholder="99 Smith, Collingwood Vic 3015"
                                  />
                                </div> 
                                <div className="custom-radio"> 
                                  <label
                                      className="em_container em_remember"
                                      htmlFor="customRadio"
                                    >
 <Tooltip placement="right" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 2 ? e.Desc : '')}>
                                    2 Factor Authetication
                                          </Tooltip> 
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customRadio"
                                    name="example1"
                                    checked={this.state.twofactor}
                                    onChange={() => {
                                      this.setState({
                                        twofactor: !this.state.twofactor
                                      });
                                    }}
                                  /> 
                                       <span className="em_checkmark"></span>
                                  </label>  
                                </div>
                                <div className="text-center">
                                  <button
                                    onClick={event => this.savehandler(event, this.props.closeModal)}
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                    onKeyUp={(e) =>{if(e.keyCode===13){
                                      e.stopPropagation();
                                      this.savehandler(e, this.props.closeModal)
                                    }}}
                                    type="button"
                                    id="SubmitButton_editEntity"
                                    className="em_theme_btn"
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
            </div>
          </Modal.Body>
        </Modal>
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
const mapStateToProps = arg => ({

  getUserEntity: arg.commonRresult.getUserEntity,
  getUserEntityErr: arg.commonRresult.getUserEntityErr
});
export default connect(
  mapStateToProps,
  { getUserEntities }
)(Entity);
