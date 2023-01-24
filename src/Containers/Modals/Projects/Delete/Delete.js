import React, { Component } from "react";
import "./Delete.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import $ from 'jquery';

class Delete extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showConfirm: false
    };
  }
  componentDidMount(){
    $('#projects_sub_del').focus();
  }
    
    
  delete=async()=>{
     await this.props.confirmDelete();
      // await  this.props.closeModal("closeAll");
  }  
    
  render() {
    
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={() => this.props.closeModal("openDeleteModal")}
        className="dm_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="dm_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 dm_form_mx_width">
                  <div className="dm_signup_form_main">
                    <div className="dm_signup_header">
                      <div className="row">
                      <img src="/images/2/close.png" onClick={() => this.props.closeModal("openDeleteModal") } className="d-block img-fluid modal_closed_btn" alt="close" />
 
                        <div className="col-12 col-sm-8 dm_order-xs-2">
                          <h4>Delete</h4>
                        </div>
                        <div className="col-12 col-sm-3 dm_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="dm_signup_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="dm_body">
                            <p className="dm_text">
                              Are you sure you want to delete?
                            </p>
                            <button
                            id="projects_sub_del"
                              type="button"
                              onClick={this.delete}
                              onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.delete()
                              }}}
                              className="dm_theme_btn"
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
    );
  }
}

export default Delete;
