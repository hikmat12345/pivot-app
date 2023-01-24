import React, { Component } from "react";
import $ from "jquery";
import "./AddCode.css";
import Modal from "react-bootstrap/Modal";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import Message from "../../message/message";

class AddCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      code: "",
      counter:1,
      description: "",
      hide_check: false,
      openMessageModal: false,
      message_heading: "",
      required_messages: [],
      message_desc: "",
      formErrors: {
        code: "",
        description: ""
      }
    };
  }
  componentWillReceiveProps = () =>{
    this.setState({
      required_messages: this.props.required_messages
    })
  }
  fieldChangeHandler = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    if(!value.includes(',')) {
      this.setState({
        [name]: value,
      });
    }
    this.validateField(name, value)
  }
  checkboxHandler = (e) => {
    this.setState({
      hide_check: e.target.checked
    })
  }
  validateField = (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "code":
        if (value === "") {
          formErrors.code = "This Field is Required.";
        } else if(value.includes(',')) {
          formErrors.code = "Comma isn't allowed.";
        } else {
          formErrors.code = ""
        }
        break;
      case "description":
        if (value === "") {
          formErrors.description = "This Field is Required.";
        } else {
          formErrors.description = ""
        }
        break;
    }

  }
  onSaveHandler = async (e) => {
    e.preventDefault();
    this.setState({ counter: 1})
    var formErrors = this.state.formErrors;
    if (this.state.code == "") {
      formErrors.code = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
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

    if (this.state.description == "") {
      formErrors.description = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
    }
    this.setState({
      formErrors: formErrors
    });
    if (this.state.code !== "" && this.state.description !== "") {
      var groups = this.props.groupList;
      var same = [];
      same = groups.filter(g => g.Code == this.state.code);
      if (same.length > 0) {
        toast.error('This Code is already Exist')
        this.state.required_messages.map(e => e.ID == 1 ?
          this.setState({
            message_desc: "This Code is already Exist",
            message_heading: "Code Exist",
            openMessageModal: true
          }) : '')
      }
      else {
        await this.setState({ isLoading: true })
        let tenantguid = localStorage.getItem("tenantguid");
        await API.post("pivot", "/addgroupcode", {
          body: {
            Code: this.state.code,
            Description: this.state.description,
            Hide: this.state.hide_check,
            TemplateGuid: this.props.template_guid,
            TenantGuid: tenantguid
          }
        })
          .then(async data => {
            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Groups List",
                "Description": "Add Code - Code",
                "ProjectName": this.props.selectedProject.Name,
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.code,
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Groups List",
                "Description": "Add Code - Description",
                "ProjectName": this.props.selectedProject.Name,
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.description,
                "Tenantid": localStorage.getItem('tenantguid')
              }, {
                "User": localStorage.getItem('Email'),
                "Datetime": dateTime,
                "Module": "Groups List",
                "Description": "Add Code - Hide",
                "ProjectName": this.props.selectedProject.Name,
                "ColumnName": "",
                "ValueFrom": "",
                "ValueTo": this.state.hide_check,
                "Tenantid": localStorage.getItem('tenantguid')
              }
            ]);

            this.props.closeModal();
            this.clearStates()  
          })
          .catch(err => {
            toast.error("do not add group code");
          });
         await this.props.getGroupsHandler()
          $(document).ready(function () {
            $("#gListEdit_51").focus();
          })

        await this.setState({ isLoading: false })
      }
    }
    
  }
  clearStates = () => {
    this.setState({
      code: "",
      description: "",
      hide_check: false,
      formErrors: {
        code: "",
        description: ""
      }
    })
  }
  
  onPressEnter = (e) => {
    // e.preventDefault(); 
    var keys = this.state.counter; 
    if(keys <= 1 ){
      var key = keys + 1 ;
      this.setState({ counter: key })
      if (e.keyCode === 27) {
        this.clearStates(); 
        this.setState({ counter: 1 }) 
      }
    }else{
      if (e.keyCode === 13) { 
        this.setState({ counter: 1 }) 
        document.getElementById('save_add_code').click()
      }
      else if (e.keyCode === 27) {
        this.clearStates(); 
        this.setState({ counter: 1 }) 
      }
    }
    
  }

  closeModal = (name) => {
    if (name == "openMessageModal"){
      this.setState({
        openMessageModal: false
      })
      this.setState({ counter: 1 })
    }
    else{
      this.props.closeModal();
      this.clearStates()
      this.setState({ counter: 1 })
    }
  }

  activityRecord = async (finalarray) => {
    await API.post("pivot", "/addactivities", {
      body: {
          activities: finalarray
      }
    })
      .then(async data => {
        toast.success('Activity successfully recorded.')
      })
      .catch(err => {
        toast.success('Activity failed to record.')
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
          className="ac_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="ac_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 ac_form_mx_width">
                    <div className="ac_signup_form_main">
                      <div className="ac_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 ac_order-xs-2">
                            <h4>Add Code</h4>
                          </div>
                          <div className="col-12 col-sm-3 ac_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ac_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp={this.onPressEnter} className="ac_signup_form">
                              <div className="form-group">
                                <label htmlFor="p-name">Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="code"
                                  value={this.state.code}
                                  name="code"
                                  onChange={this.fieldChangeHandler} 
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.code !== ""
                                    ? this.state.formErrors.code
                                    : ""}
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="p-name">Description</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.description}
                                  name="description"
                                  onChange={this.fieldChangeHandler}
                                  id="p-name" 
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.description !== ""
                                    ? this.state.formErrors.description
                                    : ""}
                                </div>
                              </div>

                              <div className="">
                                <label className="ac_container ac_remember">
                                  Hide
                                <input
                                    type="checkbox"
                                    name="hide_check"
                                    onChange={this.checkboxHandler}
                                    checked={this.state.hide_check}
                                  />
                                  <span className="ac_checkmark"></span>
                                </label>
                              </div>
                              <div className="col-12">
                                <div className="ac_body">
                                  <button
                                    onClick={this.onSaveHandler}
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){ 
                                e.stopPropagation();
                                this.onSaveHandler(e)
                              }}}
                                    id="save_add_code"
                                    type="button"
                                    className="ac_theme_btn"
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

export default AddCode;
