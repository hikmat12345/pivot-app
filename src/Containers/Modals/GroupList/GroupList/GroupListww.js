import React, { Component } from "react";
import "./GroupList.css";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import AddCodeModal from "../AddCode/AddCode";
import EditCodeModal from "../EditCode/EditCode";

class GroupList extends Component {
  constructor() {
    super();
    this.state = {
      openAddCodeModal: false,
      openEditCodeModal: false,
      selected_guid:"",
      selected_code:"",
      selected_hide:"",
      selected_description:""
    };
  }
  openModal = name => {
    if (name === 'openAddCodeModal') {
      this.setState({ openAddCodeModal: true });
      $(document).ready(function () {
        $("#code").focus();
      })
    }
    if (name === 'openEditCodeModal') {
      this.setState({ openEditCodeModal: true });
      $(document).ready(function () {
        $("#Editcode").focus();
      })
    }
    this.setState({ [name]: true });

  };
  closeModal = name => {
    this.setState({ [name]: false });
  };
  editCodeHandler = async (gg)=>{
    
await this.setState({
      selected_guid: gg.guid,
      selected_code: gg.Code,
      selected_hide: gg.Hide,
      selected_description: gg.Description
    })
    this.openModal("openEditCodeModal");

  }
  componentWillReceiveProps = ()=> {
    // tabing code
    $(document).ready(function () {
      $(".onEnterPress").keydown(function(v){  
        var id = $(this).attr('id');
        var ti = $(this).attr('tabindex');
 
        if(v.keyCode == 9){  
          v.preventDefault();
          var y = parseInt(ti);
          var z = y + 1;  
          var r = `gListEdit_${z}`;   
          $('#'+r).focus(); 
        }
        if(v.shiftKey){ 
            v.preventDefault(); 
           if(v.keyCode == 9){ 
            var y = parseInt(ti);
            var z = y - 1;  
            var r = `gListEdit_${z}`; 
            document.getElementById(r).focus(); 
            } 
          }else if(v.keyCode == 13){ 
          var g = `${id}`;   
          document.getElementById(g).click();
        } 
      }); 
      $('tbody tr:last-child td>img').keydown(function(a){ 
        var id = $(this).attr('id');
        var ti = $(this).attr('tabindex');
        if(a.shiftKey){ 
          a.preventDefault(); 
         if(a.keyCode == 9){ 
          var y = parseInt(ti);
          var z = y - 1;  
          var r = `gListEdit_${z}`; 
          document.getElementById(r).focus(); 
          } 
        }else if(a.keyCode == 13){ 
          var g = `${id}`;   
          document.getElementById(g).click();
        }else{  
          $("button#groupClose").focus();  
      }
      
      });
    });
//  end
  }
  submit=(e,b)=>{ 

    if(e.shiftKey){ 
      e.preventDefault(); 
     if(e.keyCode == 9){  
       var c = parseInt(b); 
       var z = c + 2; 
       var d = `gListEdit_5${z}`;  
      document.getElementById(d).focus(); 
      } 
    }else if(e.keyCode == 13){ 
      e.preventDefault();
      if(this.props.getGroups.length>0){
        document.getElementById('groupClose').click();
      }else{
        document.getElementById('gListEdit_53').click();
      } 
      
     } else if(e.keyCode == 9){ 
      e.preventDefault();
      $("button#gListEdit_51").focus(); 
     }
  }
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={this.props.closeModal}
          className={
            this.state.openAddCodeModal || this.state.openEditCodeModal
              ? "glm_modal modal-backdrop"
              : "glm_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="glm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center glm_form_mx_width">
                    <div className="glm_signup_form_main">
                      <div className="glm_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 glm_order-xs-2">
                            <h4>Groups List</h4>
                          </div>
                          <div className="col-12 col-sm-3 glm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 no-padding">
                        <div className="glm_project_modals">
                          <ul>
                            <li>
                              <button
                              id="gListEdit_51"
                              tabindex="51"
                                type="button"
                                onClick={() =>
                                  this.openModal("openAddCodeModal")
                                }
                                onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.openModal("openAddCodeModal")
                              }}}
                                className="glm_theme_btn glm_modal_btn onEnterPress"
                              >
                                <i className="fa fa-plus"></i> Code
                              </button>
                            </li>
                            <li>
                              <label className="glm_container glm_remember glm_conflict onEnterPress" tabindex="52">
                                On conflict hide
                                <input type="checkbox" name="type" id="gListEdit_52"/>
                                <span className="glm_checkmark"></span>
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="glm_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div className="glm_project_scroll">
                              <table className="table table-striped table-sm table-responsive glm_fixed_headers">
                                <thead>
                                  <tr>
                                    <th scope="col">Code</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Report Total</th>
                                    <th scope="col">Rows</th>
                                    <th scope="col">Hide Rows</th>
                                    <th scope="col" className="text-center">Edit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.props.getGroups && this.props.getGroups.map((gg,key) => (
                                    
                                    <tr key={key}>
                                    <th scope="row">{gg.Code}</th>
                                    <td>{gg.Description}</td>
                                    <td>{'-'}</td>
                                    <td>{'-'}</td>
                                    <td>{gg.Hide == true ? "Y":" "}</td>
                                    <td>
                                      <img 
                                        onClick={()=>this.editCodeHandler(gg)} 
                                        id={'gListEdit_'+(key+53)} tabindex={key+53} 
                                        alt="edit" 
                                        src="/images/p2.png" 
                                      className={key==this.props.getGroups.length-1?"img-fluid point-c font_18":"img-fluid point-c font_18 onEnterPress"} 
                                      />
                                    </td>
                                  </tr>
                                  
                                  )
                                  
                                    
                                  )}

                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="text-center">
                              <button
                              id={this.props.getGroups.length>0?"groupClose":"gListEdit_53"}
                              tabIndex={this.props.getGroups.length>0?"":"3"}  
                              onKeyDown={(e)=>this.submit(e,(this.props.getGroups.length))}
                                type="button"
                                onClick={this.props.closeModal}
                                className="glm_theme_btn"
                              >
                                Close
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

        <AddCodeModal
          openModal={this.state.openAddCodeModal}
          closeModal={() => this.closeModal("openAddCodeModal")}
          template_guid={this.props.template_guid}
          getGroupsHandler={this.props.getGroupsHandler}
          groupList={this.props.getGroups}
        />

        <EditCodeModal
          openModal={this.state.openEditCodeModal}
          closeModal={() => this.closeModal("openEditCodeModal")}
          getGroupsHandler={this.props.getGroupsHandler}
          selected_guid={this.state.selected_guid}
          selected_code={this.state.selected_code}
          selected_hide={this.state.selected_hide}
          selected_description={this.state.selected_description}
        />
      </>
    );
  }
}

export default GroupList;
