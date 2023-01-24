import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import MultiSelect from "@khanacademy/react-multi-select";
import "./EditProject.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { API } from "aws-amplify";
import Message from "../../message/message";
import DeleteModal from "../Delete/Delete";
import $ from "jquery";
const uuidv1 = require("uuid/v1");

class EditProjectModal extends Component {
  constructor() {
    super();
    this.state = {
        system_columns:[],
        project_access:[],
      pivotData:[],
      pivotDataForSelect:[],
      new_columns_position: [],
      newColumns: [], //it contains all new column by new temlates guids
      template_columns: [], //it contains all previous column get by temlates guids
      guid: "",
      show: false,
      isLoading: false,
      showConfirm: false,
      openMessageModal: false,
message_heading: "",
message_desc:"",
required_messages:[],
openDeleteModal: false,
      templatesSelection: [],
      templatesOptions: [],
      projectName: "",
      dataConnection: "Select",
      url: "",
      apiKey: "",
      apiPassword: "",
      project: "", //name of the select box
      projects: [], //all options show in select box
      CSV: "",
      formErrors: {
        projectName: "",
        dataConnection: "",
        url: "",
        apiKey: "",
        apiPassword: "",
        project: "",
        templates: ""
      }
    };
  }

  async componentWillReceiveProps() {
    let singleProject = this.props.singleProject;
    let projects = this.props.projects;
        if (singleProject) {
      await this.setState({
        guid: singleProject.guid,
       project_access: this.props.project_access_user,
        templatesSelection: [],
        projectName: singleProject.Name,
        dataConnection: singleProject.Connection,
        url: singleProject.URL,
        apiKey: singleProject.APIKey,
        apiPassword: singleProject.APIPassword,
        CSV: singleProject.CSVFilename1,
        projects: projects && projects.filter(p => p.guid != singleProject.guid), //contain projects except selected project
        required_messages: this.props.required_messages
      });
        
        
        
    }
  }

  handleInputFields = event => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.setState({
      [event.target.name]: event.target.value
    });
    this.validateField(fieldName, fieldValue);
  };

  validateField = async (name, value) => {
    var formErrors = this.state.formErrors;
    switch (name) {
      case "projectName":
        if (value.length < 1) {
          formErrors.projectName = "This Field is Required.";
        } else {
          formErrors.projectName = "";
        }
        break;
      case "dataConnection":
        if (value === "Select") {
          formErrors.dataConnection = "This Field is Required.";
        } else {
          formErrors.dataConnection = "";
        }
        break;
      case "url":
        if (value.length < 1) {
          formErrors.url = "This Field is Required.";
        } else {
          formErrors.url = "";
        }
        break;
      case "apiKey":
        if (value.length < 1) {
          formErrors.apiKey = "This Field is Required.";
        } else {
          formErrors.apiKey = "";
        }
        break;
      case "apiPassword":
        if (value.length < 1) {
          formErrors.apiPassword = "This Field is Required.";
        } else {
          formErrors.apiPassword = "";
        }
        break;
        // case "project":
        //   if (!value) {
        //     formErrors.project = "This Field is Required.";
        //   } else {
        //     formErrors.project = "";
        //   }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };

  onSaveXero = async event => {
    let tenantguid = localStorage.getItem("tenantguid");

    event.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.projectName) {
      formErrors.projectName = "This Field is Required.";
    }
    if (!this.state.dataConnection) {
      formErrors.dataConnection = "This Field is Required.";
    }
    if (!this.state.url) {
      formErrors.url = "This Field is Required.";
    }
    if (!this.state.apiKey) {
      formErrors.apiKey = "This Field is Required.";
    }
    if (!this.state.apiPassword) {
      formErrors.apiPassword = "This Field is Required.";
    }
    // if (!this.state.project) {
    //   formErrors.project = "This Field is Required.";
    // }
    // if (!this.state.templatesSelection.length) {
    //   formErrors.templates = "This Field is Required.";
    // }
    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.projectName &&
      !formErrors.dataConnection &&
      !formErrors.url &&
      !formErrors.apiKey &&
      !formErrors.apiPassword
      // !formErrors.project &&
      // !formErrors.templates
    ) {
      let {
        projectName,
        dataConnection,
        url,
        apiKey,
        apiPassword,
        guid,
        project,
        templatesSelection
      } = this.state;
      await this.setState({
        isLoading: true
      });

      //Add Project
      await API.post("pivot", "/addProject", {
        body: {
          guid: guid,
          projectName: projectName,
          dataConnection: dataConnection,
          url: url,
          apikey: apiKey,
          apiPassword: apiPassword,
          createdAt: new Date(),
          tenantGuid: tenantguid
        }
      })
        .then(async data => {
          toast.success("Project Edited Successfully");

          await this.props.getprojects();
        })
        .catch(err => {
          toast.error("Project Not Edited Successfully");
        });
      await this.copyTemplates(templatesSelection, guid);

      await this.props.closeModal("closeAll");
      this.setState({
        isLoading: false,
        project: ""
      });
    }
  };
  onSaveCSV = async event => {
    let tenantguid = localStorage.getItem("tenantguid");
    event.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.projectName) {
      formErrors.projectName = "This Field is Required.";
    }
    if (!this.state.dataConnection) {
      formErrors.dataConnection = "This Field is Required.";
    }

    // if (!this.state.project) {
    //   formErrors.project = "This Field is Required.";
    // }
    // if (!this.state.templatesSelection.length) {
    //   formErrors.templates = "This Field is Required.";
    // }
    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.projectName &&
      !formErrors.dataConnection
      // !formErrors.project &&
      // !formErrors.templates
    ) {
      let {
        projectName,
        dataConnection,
        project,
        projects,
        templatesSelection,
        CSV,
        guid,
        templates
      } = this.state;
      await this.setState({
        isLoading: true
      });

      //Add Project
      await API.post("pivot", "/addProject", {
        body: {
          guid,
          projectName: projectName,
          dataConnection: dataConnection,
          CSV: CSV,
          createdAt: new Date(),
          tenantGuid: tenantguid
        }
      })
        .then(async data => {
          toast.success("Project Edited Successfully");

          await this.props.getprojects();
        })
        .catch(err => {
          toast.error("Project Not Edited Successfully");
        });
      await this.copyTemplates(templatesSelection, guid);

      await this.props.closeModal("closeAll");
      this.setState({
        isLoading: false,
        project: ""
      });
    }
  };

  copyTemplates = async (templatesSelection, guid) => {
   
           var getsystemcolumns=[];
      //getting system columns of currently edit project from any one of its templates(every template have same system columns)
      await API.post("pivot", "/getTemplate", {
      body: {
        buguid: this.state.guid
      }
    }).then(data=>{
          getsystemcolumns=data[0].Columns;
      }).catch(err=>{
          console.log("error occured");
      })
      
      //getting sytem columns by guid
        await API.post("pivot", "/getColumsbyMultipleTemplates", {
        body: {
          templates: getsystemcolumns
        }
      })
        .then(async data => {
            var tmpcolumn=data.result.Items.filter(da=>da.Type==="System");
        var sortedcolumns=[];
        getsystemcolumns.map(u=>{
            var j="";
            j=tmpcolumn.find(f=>f.guid===u);
            if(j!==""&&j!=undefined){
            sortedcolumns.push(j);}
        })
        
          this.setState({
 system_columns:sortedcolumns
})
              
              }).catch(err=>{
            console.log("error occured");
        });
   
    if (templatesSelection.length > 0) {
      let temp = []; //it contains only templates guids i.e ['95c80-f1d3-1e9-b971-e5e5c', '9580-f1d3-11e9-b971-16745c]
       templatesSelection.map((t, i) => {
       t.Columns.map(x=>{
           temp.push(x);
       })
      });
      //get columns by multiple templates guids
      await API.post("pivot", "/getColumsbyMultipleTemplates", {
        body: {
          templates: temp
        }
      })
        .then(async data => {
          await this.setState({
            template_columns: data.result.Items
          });
          toast.success("Get Columns By Multiple Templates Successfully");
        })
        .catch(err => {
          toast.error("Get Columns By Multiple Templates Error");
        });

      //add templates to current selected project
      let templateArray = [];
      let selectedTemp = templatesSelection;
      let newTemplate = []; //contains templates that are created by addTemplateBatch api
      let columns = this.state.template_columns; //contains previous columns with previpus temp guid
      var newColumns = [];
      selectedTemp.map((st, i) => {
        //first remove guids and add 'BusinessUnitGuid' of current project
        let newGuid = uuidv1();
        let data = {
          guid: newGuid,
          BusinessUnitGuid: guid, //guid of current selected project
          Columns: st.Columns,
          Exclude: st.Exclude,
          FontSize: st.FontSize,
          TemplateName: st.TemplateName,
          TenantGuid: localStorage.getItem("tenantguid")
        };
        templateArray.push(data);
        let sortedColumn = [];
        let c = columns.filter(c => st.Columns.indexOf(c.guid)>-1); //getting all columns with previous temp guid
        st &&
          st.Columns &&
          st.Columns.map((cl, i) => {
            //loop on previous template columns to get order
            let cd = c.find(c => c.guid.trim() === cl);
            if (cd && cd.ColumnName) {
              //if there is column data against template guid
              sortedColumn.push(cd);
            }
          });
        sortedColumn.map((col, i) => {
          col.TemplateGuid = newGuid; //replace column tempGuid with new comming temp guid
          delete col["guid"]; //to remove column guid from the column
          newColumns.push(col);
        });
      });
      await this.setState({ newColumns });
      await API.post("pivot", "/addTemplateBatch", {
        body: {
          templates: templateArray
        }
      })
        .then(async data => {
          let tempArr = [];
          data &&
            data.RequestItems &&
            data.RequestItems.PivotTemplates &&
            data.RequestItems.PivotTemplates.map((t, i) => {
              tempArr.push(t.PutRequest.Item);
            });
          newTemplate = tempArr;
          toast.success("Templates Added Successfully");
        })
        .catch(err => {
          toast.error("Templates Adding Error");
        });

      //add column against new template
      await Promise.all(
        newTemplate.map(async (newTemp, i) => {
          let temp_columns = this.state.newColumns.filter(
            c => c.TemplateGuid === newTemp.guid&&c.Type!=="System"
          ); //it contains all columns against one template
             temp_columns.map(e=>{
              e.TenantGuid=localStorage.getItem("tenantguid");  
            })
          if (temp_columns.length > 0) {
            await API.post("pivot", "/addColumnBatch", {
              body: {
                columns: temp_columns
              }
            })
              .then(async data => {
                    var gg= this.state.new_columns_position;
                    data.map(s=>{
                           gg.push(s);
                    })
             
                this.setState({
                  new_columns_position: gg
                })
                toast.success("Columns Added Successfully");
                //update column field in template
        
              for(var i=this.state.system_columns.length-1; i>=0;i-- ){
                  data.unshift(this.state.system_columns[i].guid);
              }
                await this.updateColumns(newTemp.guid, data);
              })
              .catch(err => {
                toast.error("Columns Adding Error");
              });
          }
        })
      );

await this.getPivotDataByTandBforNew();

this.state.pivotData.map(x=>{
    
    if(x.Type!=="Blank"){
       this.state.new_columns_position.map(y=>{
            x.Columns.push({AmountValue:null,TextValue:null,ColumnGuid:y});
       }) 
    }
});

 await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: this.state.pivotData
          }
        }).then(data => {
          toast.success("data added")
        }).catch(err => {
          toast.error("copydata request failed");
        });

/*      await this.getPivotDataByTandBforNew();
      await this.getPivotDataByTandBforSelect();
      var finalArray =[];
      templatesSelection.map(ts=>{
        var selected_temp_guids = ts.guid;
          var selected_temp_columns = ts.Columns;
          this.state.pivotDataForSelect.map((pd,inde) => {
            if (pd.Type !== 'Blank') {
              selected_temp_columns.map((stc, index) => {

                var oldcolumn = pd.Columns.find((f) => stc == f.ColumnGuid);
                if (oldcolumn && oldcolumn.ColumnGuid) {
                var objj ={"recordguid":pd.guid,"data":{
                  AmountValue: oldcolumn.AmountValue,
                  ColumnGuid: this.state.new_columns_position[index],
                  TextValue: oldcolumn.TextValue
                } }
                finalArray.push(objj);
                }

              })
            }
          })
        // console.log(ts,'tssssssssssssssssssssssssssssssssssss')
      })*/

    }
  };
  getPivotDataByTandBforNew = async () =>{
    let projectGuid = this.state.guid; //it contains project guid of selected project
    let tenantguid = localStorage.getItem("tenantguid");
    await API.post("pivot", "/getPivotDataByTandB", {
      body: { buguid: projectGuid, tenantguid: tenantguid }
    })
      .then(data => {
        toast.success("Pivot Data Fetched Successfully");
        this.setState({
          pivotData: data
        })
        console.log(data, "------------ pivot data response")
      })
      .catch(err => {
        toast.error("Pivot Data Fetched Failed");
      });
  }
  updateColumns = async (guid, value) => {
    //update column in new copied template for ordering
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotTemplates",
        guid,
        fieldname: "Columns",
        value
      }
    })
      .then(async data => {
        toast.success("Update Columns Added Successfully");
      })
      .catch(err => {
        toast.error("Update Columns Adding Error");
      });
  };
   
  closeModal = async (name) => { 
    this.setState({ openDeleteModal: false });
    // await this.props.closeModal("closeAll");
    await this.clearStates();
  };
  closeModalDelete = name => {
    this.setState({ [name]: false });
  };
  clearStates = async () => {
    await this.setState({
      newColumns: [], //it contains all new column by new temlates guids
      template_columns: [], //it contains all previous column get by temlates guids
      guid: "",
      show: false,
      isLoading: false,
      showConfirm: false,
      templatesSelection: [],
      templatesOptions: [],
      projectName: "",
      dataConnection: "Select",
      url: "",
      apiKey: "",
      apiPassword: "",
      project: "", //name of the select box
      projects: [], //all options show in select box
      CSV: "",
      formErrors: {
        projectName: "",
        dataConnection: "",
        url: "",
        apiKey: "",
        apiPassword: "",
        project: "",
        templates: ""
      }
    });
  };
  onDelete = async guid => {
    if(guid){
      await this.setState({ isLoading: true });
      let templates = [];
      //getting templates of selected project
      await API.post("pivot", "/getTemplate", {
        body: {
          buguid: guid,
          tenantguid: localStorage.getItem("tenantguid")
        }
      })
        .then(data => {
          templates = data;
          toast.success("Templates Get Successfully");
        })
        .catch(err => {
          toast.error("Templates Not Found");
        });
      let tempGuids = []; //it contains only templates guids i.e ['95c80-f1d3-1e9-b971-e5e5c', '9580-f1d3-11e9-b971-16745c]
      let templateColumns = [];
        let deletetempids=[];//it contains all columns of templates
      templates.map((t, i) => {
          deletetempids.push(t.guid);
          t.Columns.map(s=>{
              tempGuids.push(s);
          })

      });

      if (tempGuids.length > 0) {
        //get all columns of templates
        await API.post("pivot", "/getColumsbyMultipleTemplates", {
          body: {
            templates: tempGuids
          }
        })
          .then(async data => {
            templateColumns = data.result.Items;
            toast.success("Get Columns By Multiple Templates Successfully");
          })
          .catch(err => {
            toast.error("Get Columns By Multiple Templates Error");
          });
      }
      //delete all columns of templates
      if (templates.length > 0 && templateColumns.length > 0) {
        await Promise.all(
          templates.map(async (temp, i) => {
            //delete column of template one by one template because in Batch more than 20(columns) not deleted
            let temp_columns = templateColumns.filter(
              c => temp.Columns.indexOf(c.guid)>-1
            );
              
             
            var columnsGuids = [];
            temp_columns.map(val => {
              columnsGuids.push(val.guid);
            });
            //it contains all columns against one template
            if (columnsGuids.length > 0) {
              await API.post("pivot", "/deletecolumns", {
                body: {
                  finaldata: columnsGuids
                }
              })
                .then(data => {
                  toast.success(
                    "columns deleted successfully against the templates"
                  );
                })
                .catch(error => {
                  toast.error("columns not deleted");
                });
            }
          })
        );
      }
        //delete templates
      if (deletetempids.length > 0) {
        await API.post("pivot", "/deleteTemplatesBatch", {
          body: {
            templateGuids: deletetempids
          }
        })
          .then(data => {
            toast.success("Templates deleted successfully");
          })
          .catch(err => {
            toast.error("Templates not delete");
          });
      }
  
      //delete project
      await API.post("pivot", "/deleteProject", {
        body: {
          guid
        }
      })
        .then(async data => {
          toast.success("Project Deleted Successfully");
          
        })
        .catch(err => {
          toast.error("Error While Deleting Project!");
        });
        let userGuid = localStorage.getItem('guid');
var project_access_update = this.state.project_access.filter(pa => pa !== guid);
await API.post("pivot", "/updatefields", {
  body: {
    table: "PivotUser",
    guid: userGuid,
    fieldname: "projectAccess",
    value: project_access_update
  }
})
  .then(async data => {
    toast.success("project access updated successfully");
  })
  .catch(err => {
    toast.error("Exclude Not Updated!");
  });
 
await this.props.getUserByGuid();
        await this.setState({ isLoading: false });
  
      await this.props.getprojects();
  
       await this.props.closeModal("closeAll");
      await this.closeModalDelete('openDeleteModal')
  }
    else{
      toast.error("Project Guid Not Found!");
    }
   
  };
  handleInputProjects = async event => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    this.setState({
      project: event.target.value
    });
    this.validateField(fieldName, fieldValue);

    await this.getTemplates(fieldValue);
  };
  getTemplates = async guid => {
    await this.setState({
      isLoading: true
    });
    await API.post("pivot", "/getTemplate", {
      body: {
        buguid: guid,
        tenantguid: localStorage.getItem("tenantguid")
      }
    })
      .then(data => {
        var xy = data;
data=xy.sort(function (a, b) {
var nameA = (a.TemplateName.toUpperCase());
var nameB = (b.TemplateName.toUpperCase());
if (nameA < nameB) {
return -1;
}
if (nameA > nameB) {
return 1;
}
// names must be equal
return 0;
})
        toast.success("Templates Get Successfully");
        const template_options = data.map((value, index) => {
          return { label: value["TemplateName"], value: value };
        });
        this.setState({ template_options, templates: data });
      })
      .catch(err => {
        toast.error("Templates Not Found");
      });
    await this.setState({
      isLoading: false,
      templatesSelection: []
    });
  };
  handleTemplatesSelection = templatesSelection => {
    let formErrors = this.state.formErrors;
    formErrors.templates = "";
    this.setState({ templatesSelection });
  };
  openModal = name => {
    if(name == "openDeleteModal"){
      this.setState({ openDeleteModal: true });
      $(document).ready(function(){
        $(this).find('#projects_sub_del').focus();
  })
    }
    this.setState({ [name]: true });
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
    e.preventDefault();
    e.stopPropagation();
    if ($('.multi-select .dropdown').is(":focus") || $('.multi-select .dropdown').focus()) {

    } else {
      if (this.state.dataConnection == "CSV") {

        document.getElementById('SubmitButtonCSV').click();
      }
      else if (this.state.dataConnection == "XERO") {

        document.getElementById('SubmitButtonXERO').click();
      }
    }
  }
}
multiSelectEnter = (e) => {

  $('.multi-select .dropdown').keydown(function (a) {
    if ($('.multi-select .dropdown').is(":focus")) {
      if (a.keyCode == 13) {
        a.preventDefault();
        $('.multi-select .dropdown-content').show();
        $('.multi-select .dropdown').attr('aria-expanded', "true");
      }
    }
  });
  $('.multi-select .dropdown-content label.select-item').keydown(function (v) {
    v.preventDefault();
    if (v.keyCode == 13) {
      v.preventDefault();
      v.stopPropagation();
      $('.multi-select .dropdown-content').hide();
      $('.multi-select .dropdown').attr('aria-expanded', "false");
      $('.multi-select .dropdown').focus();
    } else if (e.keyCode == 32) {
      e.preventDefault();
      e.stopPropagation();
      $('.multi-select .dropdown-content').show();
      $('.multi-select .dropdown').attr('aria-expanded', "true");
    }
  })
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
          onHide={this.closeModal}
          className="au_modal"
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="au_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center au_form_mx_width">
                    <div className="au_signup_form_main">
                      <div className="au_signup_header">
                        <div className="row">
                        <img src="/images/2/close.png" onClick={this.props.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 au_order-xs-2">
                            <h4>Edit Project</h4>
                          </div>
                          <div className="col-12 col-sm-3 au_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="au_signup_body">
                        <div className="row">
                          <div className="col-12">
                            <div onKeyUp ={this.formSubmitHandler} id="FormSubmit"  className="au_signup_form">
                              <div className="form-group">
                                <label htmlFor="p-name_edit_project">Project Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="p-name_edit_project"
                                  placeholder="The Butcher Series 1"
                                  name="projectName"
                                  value={this.state.projectName}
                                  onChange={this.handleInputFields}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.projectName !== ""
                                    ? this.state.formErrors.projectName
                                    : ""}
                                </div>
                              </div>
                              <div className={this.state.formErrors.dataConnection !== ""
                                    ? "form-group au_select mb-0"
                                    : "form-group au_select"}>
                                <label className="pb-3 w-100">
                                  <u>Intergration</u>
                                </label>
                                <br />
                                <label>Data Connection</label>
                                <select
                                  className="form-control ap_custom_select"
                                  name="dataConnection"
                                  value={this.state.dataConnection}
                                  onChange={this.handleInputFields}
                                >
                                  <option value="Select">Select</option>
                                  <option value="XERO">Xero</option>
                                  <option value="CSV">CSV</option>
                                </select>
                                
                                <span className="au_custom_caret"></span>
                              </div>
                              <div className="text-danger error-12">
                                  {this.state.formErrors.dataConnection !== ""
                                    ? this.state.formErrors.dataConnection
                                    : ""}
                                </div>
                              {this.state.dataConnection !== "Select" &&
                              this.state.dataConnection == "XERO" ? (
                                <>
                                  <div className="form-group">
                                    <label htmlFor="URL">URL</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="URL"
                                      placeholder="https://api.xero.com/api.xro/2.0/iprofitandloss"
                                      name="url"
                                      value={this.state.url}
                                      onChange={this.handleInputFields}
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.url !== ""
                                        ? this.state.formErrors.url
                                        : ""}
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="key">API Key</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="key"
                                      placeholder="The Butcher Series 1"
                                      name="apiKey"
                                      value={this.state.apiKey}
                                      onChange={this.handleInputFields}
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.apiKey !== ""
                                        ? this.state.formErrors.apiKey
                                        : ""}
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="api-pass">
                                      API Password
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="api-pass"
                                      placeholder="SJBBWWPCG4E9ZE4NB4REX10BYBCDJ"
                                      name="apiPassword"
                                      value={this.state.apiPassword}
                                      onChange={this.handleInputFields}
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.apiPassword !== ""
                                        ? this.state.formErrors.apiPassword
                                        : ""}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                              {this.state.dataConnection !== "Select" &&
                              this.state.dataConnection == "CSV" ? (
                                <div className="form-group">
                                  <label htmlFor="api-pass">CSV</label>
                                  <div className="row no-gutters input-group mb-2 mt-1">
                                    <div className="au_form_upload_message col-12">
                                      <Dropzone onDrop={this.fileUpload}>
                                        {({ getRootProps, getInputProps }) => (
                                          <div {...getRootProps()}>
                                            <input {...getInputProps()} />

                                            {/* <img
                                      alt="send_msg"
                                      src={attachUserIcPng}
                                      width="23"
                                      height="43"
                                    /> */}
                                            <p>Paste Pad</p>
                                          </div>
                                        )}
                                      </Dropzone>
                                    </div>
                                    <div className="input-group-prepend au_paste_btn">
                                      <div className="input-group-text">
                                        <img
                                          src="images/download.png"
                                          className="w-50"
                                          alt="download"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="form-group"> 
                                  <button
                                    type="button"
                                    className="au_theme_btn au_back mt-0"
                                  >Test
                                  </button> 
                                <br />
                              </div>
                              <div className="form-group au_select">
                                <label className="pb-3 w-100">
                                  <u>Import Templates</u>
                                </label>
                                <br />
                                <label>Project</label>
                                <select
                                  className="form-control au_custom_select"
                                  name="project"
                                  value={this.state.project}
                                  onChange={this.handleInputProjects}
                                >
                                  <option value="">Select</option>
                                  {this.state.projects.map((p, i) => {
                                    return (
                                      <option key={i} value={p.guid}>
                                        {p.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <div className="text-danger error-12">
                                  {this.state.formErrors.project !== ""
                                    ? this.state.formErrors.project
                                    : ""}
                                </div>
                                <span className="au_custom_caret"></span>
                              </div>
                              <div onKeyDown={(e)=>this.multiSelectEnter(e)} className="form-group au_select dropup-s">
                                <label>Templates</label>
                                <MultiSelect
                                  options={
                                    this.state.template_options
                                      ? this.state.template_options
                                      : this.state.templatesOptions
                                  }
                                  selected={this.state.templatesSelection}
                                  onSelectedChanged={templatesSelection =>
                                    this.handleTemplatesSelection(
                                      templatesSelection
                                    )
                                  }
                                  overrideStrings={{
                                    selectSomeItems: "Select",
                                    allItemsAreSelected:
                                      "All Items are Selected",
                                    selectAll: `${
                                      this.state.template_options &&
                                      this.state.template_options.length
                                        ? "All"
                                        : "Template Not Found"
                                    }`,
                                    search: "Search"
                                  }}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.templates !== ""
                                    ? this.state.formErrors.templates
                                    : ""}
                                </div>
                              </div>

                              <button
                                
                                onClick={() => this.openModal("openDeleteModal")}
                                onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.openModal("openDeleteModal")
                                  }}}
                                type="button"
                                className="au_theme_btn au_back"
                              >
                                Delete
                              </button>

                              {this.state.dataConnection === "CSV" ? (
                                <button
                                  type="button"
                                  id="SubmitButtonCSV"
                                  className="au_theme_btn"
                                  onClick={event => {
                                    this.onSaveCSV(event);
                                  }}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.onSaveCSV(e)
                                  }}}
                                >
                                  Save
                                </button>
                              ) : this.state.dataConnection === "XERO" ? (
                                <button
                                  type="button"
                                  id="SubmitButtonXERO"
                                  className="au_theme_btn"
                                  onClick={event => {
                                    this.onSaveXero(event);
                                  }}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                  onKeyUp={(e) =>{if(e.keyCode===13){
                                    e.stopPropagation();
                                    this.onSaveXero(e)
                                  }}}
                                >
                                  Save
                                </button>
                              ) : (
                                ""
                              )}
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
        <DeleteModal
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          confirmDelete={() => {
            this.onDelete(this.state.guid);
          }}
        />
        {/* <Message
          openModal = {this.state.openMessageModal}
          closeModal={() => this.closeModalDelete("openMessageModal")}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message> */}
      </>
    );
  }
}

export default EditProjectModal;
