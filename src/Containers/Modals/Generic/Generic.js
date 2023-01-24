import React, { Component } from 'react'
import './Generic.css'
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery';

class Generic extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

  componentWillReceiveProps =()=>{
    $(document).ready(function () {
      $("#gm_theme_btn").focus();
    });
  }

  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={() => this.props.closeModal('openGenericModal')}
        className="gm_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="gm_main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 gm_form_mx_width">
                  <div className="gm_signup_form_main">
                    <div className="gm_signup_header">
                      <div className="row">
                        <img src="/images/2/close.png" onClick={() =>this.props.closeModal("openGenericModal") } className="d-block img-fluid modal_closed_btn" alt="close" />
                        <div className="col-12 col-sm-8 gm_order-xs-2">
                          <h4>Delete</h4>
                        </div>
                        <div className="col-12 col-sm-3 gm_order-xs-1">
                          <img src='/images/pivot.png' className="img-fluid float-right" alt="Logo" />
                        </div>
                      </div>
                    </div>
                    <div className="gm_signup_body">
                      <div className="col-12">
                        <div className="gm_body">
                          <p className="gm_text">Are you sure you want to delete this column?</p>
                          <button 
                            onClick={this.props.deleteColumn}
                            onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.props.deleteColumn()
                              }}}
                            type="button" 
                            className="gm_theme_btn"
                            id="gm_theme_btn"
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

    );
  }
}

export default Generic;