import "./message.css";

import React, { Component } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showConfirm: false
    };
  }
    
  message = async (e) => {
    // await this.props.deletetemplate();
    await  this.props.closeModal("closeAll");
    await setTimeout(() => { $(document).ready(function () { 
        $("#user_tab_index").focus(); 
      },
    )},200);
    
    if(this.props.onSaveDataIntegration) {
      this.props.onSaveDataIntegration(e)
    }

    if(!this.props.continueSaveXero && this.props.changeState) {
      await this.props.changeState({ continueSaveXero: true })
      this.props.onSaveXero(e)
    }    

    if(this.props.optionalOkFunction !== undefined) {
      await this.props.optionalOkFunction()
      this.props.clearStates({ optionalOkFunction: undefined })
    }
  }
  componentWillReceiveProps =()=>{
    $(document).ready(function () {
      $("#ok_button").focus(); 
    });
 
  }

  render() {
    
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={() => this.props.closeModal("openMessageModal")}
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
                      <img 
                        src="/images/2/close.png" 
                        onClick={() =>  {
                          if(this.props.optionalCloseFunction) {
                            this.props.optionalCloseFunction()
                            this.props.clearStates({ optionalCloseFunction: undefined })
                          }
                          this.props.closeModal("openMessageModal")
                        }}
                        className="d-block img-fluid modal_closed_btn" 
                        alt="close" />
 
                        <div className="col-12 col-sm-8 dm_order-xs-2">
                          <h4>{this.props.heading}</h4>
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
                              {this.props.children}
                            </p>
                            <button 
                              type="button"
                              onClick={this.message}
                              // onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              // onKeyUp={(e) =>{if(e.keyCode===13){
                              //   e.stopPropagation();
                              //   this.message()
                              // }}}
                              className="dm_theme_btn"
                              id="ok_button"
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

export default Message;
