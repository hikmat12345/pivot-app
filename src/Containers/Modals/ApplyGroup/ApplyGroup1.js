import React, { Component } from "react";
import "./ApplyGroup.css";
import Modal from "react-bootstrap/Modal";

class ApplyGroup extends Component {
  constructor() {
    super();
    this.state = {
      checkall:false,
      check: false,
      groupData:[]
    };
  }
  componentWillReceiveProps= async ()=>{
    if(this.props.getGroupsData.length > 0){
    
    var v= this.props.getGroupsData;
    console.log(this.props.getGroupsData,"-------groups data")
    v.map(e=>{
    e.checkbox = false
    })
    await this.setState({
    groupData: v,
    groupsLength:this.props.getGroupsData.length
    })
    }
    
    if(this.props.gvalue){
    var arr = this.props.gvalue.split(',');
    arr.map(e=>{
    var x = this.state.groupData.find(u=>u.Code == e);
    if(x){
    x.checkbox = true;
    }
    
    
    })
    await this.setState({groupData:this.state.groupData})
    
    }
    
    
    
    }

  selectAll = async(e)=>{

var x = this.state.groupData;
var y = e.target.checked;
await this.setState({checkall:e.target.checked})
if(x.length>0){
  x.map(ee=>{
    ee.checkbox = y;
  })
  await this.setState({groupData:x})
}


  }
  checkHandler=async(e)=>{
    var name=e.target.name;
    var value = e.target.checked;
    var x = this.state.groupData;
    x.map(e=>{
      if(e.guid == name){
        console.log("shit")
        
        e.checkbox = value
      }
    })
  await  this.setState({groupData:x})
  }
  apply = async ()=>{
    var x = this.state.groupData;
    var data = x.filter(u=>u.checkbox==true);
    var final_code = "";
    data.map((d,i)=> {
    if(final_code == ""){
    final_code = d.Code
    }else{
    final_code = final_code+","+d.Code;
    } })
    this.props.getGroupCheckedValue(final_code)
    this.props.closeModal();
    }
  render() {
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.openModal}
        onHide={this.props.closeModal}
        className="agm_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="agm_main_wrapper pxl-5">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center agm_form_mx_width">
                  <div className="agm_signup_form_main">
                    <div className="agm_signup_header">
                      <div className="row">
                      <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                        <div className="col-12 col-sm-8 agm_order-xs-2">
                          <h4>Apply Groups</h4>
                          <span>{this.state.groupsLength} Row(s) Selected</span>
                        </div>
                        <div className="col-12 col-sm-3 agm_order-xs-1">
                          <img
                            src="/images/pivot.png"
                            className="img-fluid float-right"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="agm_signup_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="agm_project_scroll">
                            <table className="table table-striped table-sm table-responsive agm_fixed_headers">
                              <thead>
                                <tr>
                                  <th scope="col">
                                    <label className="agm_container agm_remember">
                                      <input
                                        type="checkbox"
                                        name="type"
                                        onClick={this.selectAll}
                                        checked = {this.state.checkall}
                                      />
                                      <span className="agm_checkmark header_checkBox"></span>
                                    </label>
                                  </th>
                                  <th scope="col">Code</th>
                                  <th scope="col">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.groupData.length>0?
                                  this.state.groupData.map(u=>(
                                    <tr>
                                    <th scope="row">
                                          <label className="agm_container agm_remember">
                                            <input type="checkbox" name={u.guid}  checked = {u.checkbox} onChange={this.checkHandler} />
                                            <span className="agm_checkmark"></span>
                                          </label>
                                        </th>
                                        <td>{u.Code}</td>
                                        <td>{u.Description}</td>
                                      </tr>
                                    
                                  )

                                  )
                                  
                                  :"no groups"}
                                </tbody>
                            </table>
                            {/* <div class="form-group agm_select">
                          <div className="row no-gutters">
                            <div className="col-12 col-md-3">
                              <label>Type:</label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">Owner
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">Edit
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                            <div className="col-12 col-md-3">
                              <label className="agm_container agm_remember">View
                                <input type="radio" name="type"/>
                                <span className="agm_checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div> */}
                            <div className="clearfix"></div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="text-center border-top">
                            <button
                              type="button"
                              onClick={this.apply}
                              onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.apply()
                              }}}
                              className="agm_theme_btn"
                            >
                              Apply
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

export default ApplyGroup;
