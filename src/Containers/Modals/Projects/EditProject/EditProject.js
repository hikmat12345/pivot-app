import "./EditProject.css";

import React, { Component } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import DeleteModal from "../Delete/Delete";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import Message from "../../message/message";
import Modal from "react-bootstrap/Modal";
import MultiSelect from "@khanacademy/react-multi-select";
import axios from 'axios';
import { toast } from "react-toastify";

const uuidv1 = require("uuid/v1");

class EditProjectModal extends Component {
  constructor() {
    super();
    this.state = {
      system_columns: [],
      XeroDB: null,
      project_access: [],
      pivotData: [],
      pivotDataForSelect: [],
      new_columns_position: [],
      newColumns: [], //it contains all new column by new temlates guids
      template_columns: [], //it contains all previous column get by temlates guids
      guid: "",
      show: false,
      isLoading: false,
      showConfirm: false,
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      required_messages: [],
      openDeleteModal: false,
      templatesSelection: [],
      templatesOptions: [],
      projectName: "",
      previousConnectedTenant: "",
      dataConnection: "Select",
      selectedOrganization: '',
      continueSaveXero: false,
      // url: "",
      // apiKey: "",
      // apiPassword: "",
      project: "", //name of the select box
      projects: [], //all options show in select box
      CSV: "",
      periodcount: 0,
      formErrors: {
        projectName: "",
        dataConnection: "",
        // url: "",
        // apiKey: "",
        // apiPassword: "",
        project: "",
        templates: ""
      }
    };
  }

  async componentWillReceiveProps() {
    // console.log("RUN COMPONENT WILL RECIVE PROPS")
    let xero = JSON.parse(localStorage.getItem('xero'))
    let { singleProject, projects, connectedXeroTenant } = this.props
    let newTenants = []
    if (xero && xero.tenantsIds) {
      newTenants = this.props.tenants && this.props.tenants.filter(tenant => !xero.tenantsIds.includes(tenant.tenantId))
    }
    if (singleProject) {
      await this.setState({
        periodcount: singleProject.periodcount,
        XeroDB: singleProject.XeroDB,
        guid: singleProject.guid,
        project_access: this.props.project_access_user,
        templatesSelection: [],
        projectName: singleProject.Name,
        dataConnection: singleProject.Connection,
        previousConnectedTenant: localStorage.getItem('xeroTenantName'),
        // selectedOrganization: connectedXeroTenant ? connectedXeroTenant.tenantId : 'Select',
        // url: singleProject.URL,
        // apiKey: singleProject.APIKey,
        // apiPassword: singleProject.APIPassword,
        CSV: singleProject.CSVFilename1,
        projects: projects && projects.filter(p => p.guid != singleProject.guid), //contain projects except selected project
        required_messages: this.props.required_messages,
        selectedOrganization: newTenants && newTenants.length > 0 ?
          newTenants[0].tenantId :
          singleProject.XeroDB ? singleProject.XeroDB.tenantId : '',
      });
    }
  }

  changeState = async (state) => {
    await this.setState(state)
  }

  handleInputFields = async event => {
    var fieldName = event.target.name;
    var fieldValue = event.target.value;
    await this.setState({
      [fieldName]: fieldValue
    });
    this.validateField(fieldName, fieldValue);
  }

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
        // case "url":
        //   if (value.length < 1) {
        //     formErrors.url = "This Field is Required.";
        //   } else {
        //     formErrors.url = "";
        //   }
        //   break;
        // case "apiKey":
        //   if (value.length < 1) {
        //     formErrors.apiKey = "This Field is Required.";
        //   } else {
        //     formErrors.apiKey = "";
        //   }
        //   break;
        // case "apiPassword":
        //   if (value.length < 1) {
        //     formErrors.apiPassword = "This Field is Required.";
        //   } else {
        //     formErrors.apiPassword = "";
        //   }
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
  }

  onSaveXero = async event => {
    event.preventDefault();
    let tenantguid = localStorage.getItem("tenantguid");
    let { singleProject } = this.props;
    let {
      projectName,
      dataConnection,
      selectedOrganization,
      url,
      // apiKey,
      // apiPassword,
      guid,
      projects,
      project,
      templatesSelection,
      continueSaveXero,
      templates
    } = this.state;
    var formErrors = this.state.formErrors;

    if (!this.state.projectName) {
      formErrors.projectName = "This Field is Required.";
    }
    if (!this.state.dataConnection) {
      formErrors.dataConnection = "This Field is Required.";
    }
    // if (!this.state.url) {
    //   formErrors.url = "This Field is Required.";
    // }
    // if (!this.state.apiKey) {
    //   formErrors.apiKey = "This Field is Required.";
    // }
    // if (!this.state.apiPassword) {
    //   formErrors.apiPassword = "This Field is Required.";
    // }
    // if (!this.state.project) {
    //   formErrors.project = "This Field is Required.";
    // }
    // if (!this.state.templatesSelection.length) {
    //   formErrors.templates = "This Field is Required.";
    // }
    this.setState({
      formErrors: formErrors
    });
    // let projectNameUsed = this.props.projectsForAddEdit.find(
    //     project => project.Name === this.state.projectName && this.props.singleProject.guid !== project.guid
    // ) ? true : false;

    if (
      !formErrors.projectName &&
      // !projectNameUsed &&
      !formErrors.dataConnection
      // !formErrors.url &&
      // !formErrors.apiKey &&
      // !formErrors.apiPassword
      // !formErrors.project &&
      // !formErrors.templates
    ) {

      if (singleProject.XeroDB !== undefined && singleProject.XeroDB !== null && singleProject.XeroDB.tenantId !== selectedOrganization && !continueSaveXero) {
        this.setState({
          message_desc: 'You are attempting to connect a different organization to this project. This will scramble the data in your worktable if changed by accident. Click OK to continue or X to abort.',
          message_heading: 'Warning',
          openMessageModal: true,
        })
        return false
      }

      await this.setState({
        isLoading: true
      });

      //Add Project
      await API.post("pivot", "/addProject", {
        body: {
          guid: guid,
          periodcount: this.state.periodcount,
          projectName: projectName,
          dataConnection: dataConnection,
          url: null,
          apikey: null,
          apiPassword: null,
          createdAt: new Date(),
          tenantGuid: tenantguid,
          FontSize: singleProject.FontSize,
          // XeroDB: singleProject.XeroDB,
          XeroDB: this.state.selectedOrganization !== '' ?
            this.props.tenants.find(tenant => tenant.tenantId === selectedOrganization) :
            null,
          OnConflict: singleProject.OnConflict ? singleProject.OnConflict : false
        }
      })
        .then(async data => {
          let singleProject = this.props.singleProject;
          let dateTime = new Date().getTime();
          let selectedProjectGuid = project;
          let selectedProjectName = "";
          if (project.length > 0) {
            let matchedProject = projects.find(pro => pro.guid === selectedProjectGuid);
            if (matchedProject) {
              selectedProjectName = matchedProject.Name
            }
          }
          let activities = [
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Edit Project - Project Name",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": singleProject.Name,
              "ValueTo": projectName,
              "Tenantid": localStorage.getItem('tenantguid'),
              "guid": uuidv1()
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Edit Project - Data Connection",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": singleProject.Connection,
              "ValueTo": dataConnection,
              "Tenantid": localStorage.getItem('tenantguid'),
              "guid": uuidv1()
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Edit Project - Connect",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": this.state.previousConnectedTenant,
              "ValueTo": localStorage.getItem('xeroTenantName'),
              "Tenantid": localStorage.getItem('tenantguid'),
              "guid": uuidv1()
            }, {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Edit Project - Import Project",
              "ProjectName": "",
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": selectedProjectName,
              "Tenantid": localStorage.getItem('tenantguid'),
              "guid": uuidv1()
            }
          ]
          await this.activityRecord(activities)

          // toast.success("Project Edited Successfully");
          await this.props.getprojects()
          await this.props.addActivities(activities)
          localStorage.removeItem('xero')
        })
        .catch(err => {
          this.setState({
            message_desc: "Project Not Edited Successfully",
            message_heading: "Project",
            openMessageModal: true,
          })
          // toast.error("Project Not Edited Successfully");
        });
      if (this.state.project) {
        let singleProjectTemplates = []
        await API.post("pivot", "/getTemplate", {
          body: {
            buguid: this.props.singleProject.guid,
            tenantguid: localStorage.getItem("tenantguid")
          }
        })
          .then(data => {
            var xy = data;
            singleProjectTemplates = xy.sort(function (a, b) {
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
          })
          .catch(err => {
            this.setState({
              message_desc: "Templates Not Found",
              message_heading: "Templates",
              openMessageModal: true,
            })
          });
        await this.copyTemplates(templatesSelection, guid, singleProjectTemplates)
      }

      await this.props.closeModal("closeAll");
      this.setState({
        isLoading: false,
        project: ""
      });
    }

    // if(projectNameUsed) {
    //   this.setState({
    //     message_desc: "Project name already exists, change and try again.",
    //     message_heading: "Project Name",
    //     openMessageModal: true
    //   })
    // }
  }

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
    // let projectNameUsed = this.props.projectsForAddEdit.find(
    //     project => project.Name === this.state.projectName && this.props.singleProject.guid !== project.guid
    // ) ? true : false;
    if (
      !formErrors.projectName &&
      // !projectNameUsed &&
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
        templates,
      } = this.state;
      let { singleProject } = this.props;
      await this.setState({
        isLoading: true
      });

      //Add Project
      await API.post("pivot", "/addProject", {
        body: {
          guid,
          periodcount: this.state.periodcount,
          projectName: projectName,
          dataConnection: dataConnection,
          CSV: CSV,
          createdAt: new Date(),
          tenantGuid: tenantguid,
          FontSize: singleProject.FontSize,
          periodcount: singleProject.periodcount,
          // XeroDB: singleProject.XeroDB,
          XeroDB: null,
          OnConflict: singleProject.OnConflict ? singleProject.OnConflict : false
        }
      })
        .then(async data => {
          let singleProject = this.props.singleProject;
          let dateTime = new Date().getTime();
          let selectedProjectGuid = project;
          let selectedProjectName = "";
          if (project.length > 0) {
            let matchedProject = projects.find(pro => pro.guid === selectedProjectGuid);
            if (matchedProject) {
              selectedProjectName = matchedProject.Name
            }
          }
          let activities = [{
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Edit Project - Project Name",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": singleProject.Name,
            "ValueTo": projectName,
            "Tenantid": localStorage.getItem('tenantguid'),
            "guid": uuidv1()
          }, {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Edit Project - Data Connection",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": singleProject.Connection,
            "ValueTo": dataConnection,
            "Tenantid": localStorage.getItem('tenantguid'),
            "guid": uuidv1()
          }, {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Edit Project - Connect",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": this.state.previousConnectedTenant,
            "ValueTo": localStorage.getItem('xeroTenantName'),
            "Tenantid": localStorage.getItem('tenantguid'),
            "guid": uuidv1()
          }, {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Edit Project - Import Project",
            "ProjectName": "",
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": selectedProjectName,
            "Tenantid": localStorage.getItem('tenantguid'),
            "guid": uuidv1()
          }
          ]
          await this.activityRecord(activities)

          // toast.success("Project Edited Successfully");

          await this.props.getprojects()
          await this.props.addActivities(activities)
          localStorage.removeItem('xero')
        })
        .catch(err => {
          this.setState({
            message_desc: "Project Not Edited Successfully",
            message_heading: "Project",
            openMessageModal: true,
          })
          // toast.error("Project Not Edited Successfully");
        });
      let singleProjectTemplates = []
      await API.post("pivot", "/getTemplate", {
        body: {
          buguid: this.props.singleProject.guid,
          tenantguid: localStorage.getItem("tenantguid")
        }
      })
        .then(data => {
          var xy = data;
          singleProjectTemplates = xy.sort(function (a, b) {
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
        })
        .catch(err => {
          this.setState({
            message_desc: "Templates Not Found",
            message_heading: "Templates",
            openMessageModal: true,
          })
        });
      await this.copyTemplates(templatesSelection, guid, singleProjectTemplates);

      await this.props.closeModal("closeAll");
      this.setState({
        isLoading: false,
        project: ""
      });
    }

    // if(projectNameUsed) {
    //   this.setState({
    //     message_desc: "Project name already exists, change and try again.",
    //     message_heading: "Project Name",
    //     openMessageModal: true
    //   })
    // }
  }

  copyTemplates = async (templatesSelection, guid, singleProjectTemplates) => {
    var oldandnewtempids = [];
    let oldAndNewColumnsGuids = [];
    var getsystemcolumns = [];
    //getting system columns of currently edit project from any one of its templates(every template have same system columns)
    await API.post("pivot", "/getTemplate", {
      body: {
        buguid: this.state.guid,
      },
    })
      .then((data) => {
        getsystemcolumns = data[0].Columns;
      })
      .catch((err) => {
        console.log("error occured");
      });

    // //getting sytem columns by guid
    // await API.post("pivot", "/getColumsbyMultipleTemplates", {
    //   body: {
    //     templates: getsystemcolumns,
    //   },
    // })
    //   .then(async (data) => {
    //     var tmpcolumn = data.result.Items.filter((da) => da.Type === "System");
    //     var sortedcolumns = [];
    //     getsystemcolumns.map((u) => {
    //       var j = "";
    //       j = tmpcolumn.find((f) => f.guid === u);
    //       if (j !== "" && j != undefined) {
    //         sortedcolumns.push(j);
    //       }
    //     });

    //     this.setState({
    //       system_columns: sortedcolumns,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("error occured");
    //   });

    let columns = await this.props.getColumsByMultipleTemplates(getsystemcolumns);
    let tmpcolumn = columns.filter((da) => da.Type === "System");
    let sortedcolumns = [];
    getsystemcolumns.map((u) => {
      let j = "";
      j = tmpcolumn.find((f) => f.guid === u);
      if (j !== "" && j != undefined) {
        sortedcolumns.push(j);
      }
    });

    await this.setState({
      system_columns: sortedcolumns,
    });


    if (templatesSelection.length > 0) {
      let temp = []; //it contains only templates guids i.e ['95c80-f1d3-1e9-b971-e5e5c', '9580-f1d3-11e9-b971-16745c]
      templatesSelection.map((t, i) => {
        t.Columns.map((x) => {
          temp.push(x);
        });
      });
      // //get columns by multiple templates guids
      // await API.post("pivot", "/getColumsbyMultipleTemplates", {
      //   body: {
      //     templates: temp,
      //   },
      // })
      //   .then(async (data) => {
      //     await this.setState({
      //       template_columns: data.result.Items,
      //     });
      //     // toast.success("Get Columns By Multiple Templates Successfully");
      //   })
      //   .catch((err) => {
      //     toast.error("Get Columns By Multiple Templates Error");
      //   });

      let tempcolumns = await this.props.getColumsByMultipleTemplates(temp);
      await this.setState({
        template_columns: tempcolumns,
      });


      //add templates to current selected project
      let templateArray = [];
      let selectedTemp = templatesSelection;
      let newTemplate = []; //contains templates that are created by addTemplateBatch api
      let columns = this.state.template_columns; //contains previous columns with previpus temp guid
      var newColumns = [];
      var systemcolumns_new = [];

      singleProjectTemplates.map(singleProjectTemplate => {
        selectedTemp.find(selectedProjectTemplate => {
          if(singleProjectTemplate.TemplateName.toUpperCase() === selectedProjectTemplate.TemplateName.toUpperCase()) {
            selectedProjectTemplate.TemplateName = selectedProjectTemplate.TemplateName + "(1)"
            return true;
          }
        })
      })

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
          TenantGuid: localStorage.getItem("tenantguid"),
        };
        oldandnewtempids.push({ old: st.guid, newguid: newGuid });

        let sortedColumn = [];
        let c = columns.filter((c) => st.Columns.indexOf(c.guid) > -1); //getting all columns with previous temp guid
        st &&
          st.Columns &&
          st.Columns.map((cl, i) => {
            //loop on previous template columns to get order
            let cd = c.find((c) => c.guid.trim() === cl);
            if (cd && cd.ColumnName) {
              //if there is column data against template guid
              sortedColumn.push(cd);
            }
          });
        sortedColumn.map((col, i) => {
          var colguid = uuidv1();
          col.TemplateGuid = newGuid; //replace column tempGuid with new comming temp guid
          oldAndNewColumnsGuids.push({ old: col.guid, newguid: colguid });
          col.guid = colguid //to remove column guid from the column
          // col.Formula = null;
          col.Formula = col.Formula ? col.Formula : null;
          // delete col["guid"]; //to remove column guid from the column
          newColumns.push(col);
          //replacing columns ids in template column access
          if (col.Type === 'System') {
            systemcolumns_new.push(colguid);
          } else {
            data.Columns.push(colguid);

          }
        });
        //adding system columns in those templates who have not system columns 
        for (var i = systemcolumns_new.length - 1; i >= 0; i--) {
          data.Columns.unshift(systemcolumns_new[i]);
        }

        templateArray.push(data);
      });
      await this.setState({ newColumns });
      await API.post("pivot", "/addTemplateBatch", {
        body: {
          templates: templateArray,
        },
      })
        .then(async (data) => {
          let tempArr = [];
          data &&
            data.RequestItems &&
            data.RequestItems.PivotTemplates &&
            data.RequestItems.PivotTemplates.map((t, i) => {
              tempArr.push(t.PutRequest.Item);
            });
          newTemplate = tempArr;
          // toast.success("Templates Added Successfully");
        })
        .catch((err) => {
          this.setState({
            message_desc: "Templates Adding Error",
            message_heading: "Templates",
            openMessageModal: true,
          })
          // toast.error("Templates Adding Error");
        });

      //add column against new template
      await Promise.all(
        newTemplate.map(async (newTemp, i) => {
          let temp_columns = this.state.newColumns.filter(
            (c) => c.TemplateGuid === newTemp.guid && c.Type !== "System"
          ); //it contains all columns against one template
          // temp_columns.map((e) => {
          //   e.TenantGuid = localStorage.getItem("tenantguid");
          // });
          temp_columns.map(tempColumn => {
            tempColumn.TenantGuid = localStorage.getItem("tenantguid");
            oldandnewtempids.map(template => {
              if (tempColumn.SelectedTemplateGuid === template.old) {
                tempColumn.SelectedTemplateGuid = template.newguid;
              }
            });
            oldAndNewColumnsGuids.map(column => {
              if (tempColumn.Formula && tempColumn.Formula.includes(column.old)) {
                tempColumn.Formula = tempColumn.Formula.replace(column.old, column.newguid);
              }
              if (tempColumn.SelectedColumnGuid === column.old) {
                tempColumn.SelectedColumnGuid = column.newguid;
              }
            });
          });
          if (temp_columns.length > 0) {            
            var lofcols = Math.ceil(temp_columns.length / 20);
            for (var i = 0; i < lofcols * 20; i = i + 20) {
              var arraytosend = temp_columns.slice(i, i + 20);
              await API.post('pivot', '/addColumnBatch', {
                body: {
                  columns: arraytosend
                },
              })
              .then(async (data) => {
                var gg = this.state.new_columns_position;
                data.map((s) => {
                  gg.push(s);
                });

                this.setState({
                  new_columns_position: gg,
                });
                // toast.success("Columns Added Successfully");
                //update column field in template

                for (var i = this.state.system_columns.length - 1; i >= 0; i--) {
                  data.unshift(this.state.system_columns[i].guid);
                }
                await this.updateColumns(newTemp.guid, data);
              })
              .catch((err) => {
                this.setState({
                  message_desc: "Columns Adding Error",
                  message_heading: "Columns",
                  openMessageModal: true,
                })
                // toast.error("Columns Adding Error");
              });
            }
          }
        })
      );

      await this.getPivotDataByTandBforNew();

      this.state.pivotData.map((x) => {
        if (x.Type !== "Blank") {
          this.state.new_columns_position.map((y) => {
            x.Columns.push({ AmountValue: "0", TextValue: null, ColumnGuid: y });
          });
        }
      });

      //linking new column and data end====
      let loftemp1 = this.state.pivotData.length / 20;
      for (let i = 0; i < Math.ceil(loftemp1) * 20; i = i + 20) {
        let arraytosend = this.state.pivotData.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend
          }
        }).then(data => {
          // toast.success("data added")
        }).catch(err => {
          this.setState({
            message_desc: "Copydata request failed",
            message_heading: "Pivot Data",
            openMessageModal: true,
          })
          // toast.error("copydata request failed");
        });
      }

      // await API.post("pivot", "/copypivotdata", {
      //   body: {
      //     pivotdata: this.state.pivotData,
      //   },
      // })
      //   .then((data) => {
      //     toast.success("data added");
      //   })
      //   .catch((err) => {
      //     toast.error("copydata request failed");
      //   });

      /* await this.getPivotDataByTandBforNew();
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
  }

  getPivotDataByTandBforNew = async () => {
    let pivotData = [];
    let projectGuid = this.state.guid; //it contains project guid of selected project
    let tenantguid = localStorage.getItem("tenantguid");
    // await API.post("pivot", "/getPivotDataByTandB", {
    //   body: { buguid: projectGuid, tenantguid: tenantguid }
    // })
    //   .then(data => {
    //     // toast.success("Pivot Data Fetched Successfully");
    //     this.setState({
    //       pivotData: data
    //     })
    //     console.log(data, "------------ pivot data response")
    //   })
    //   .catch(err => {
    //     toast.error("Pivot Data Fetched Failed");
    //   });


    let bodypost = {
      buguid: projectGuid,
      tenantguid: tenantguid
    }

    let flag = false
    while (flag === false) {
      await API.post('pivot', '/getPivotDataByTandB', {
        body: bodypost
      })
        .then(data => {
          // toast.success("Pivot Data Fetched Successfully");
          data.Items.map(s => {
            pivotData.push(s)
          })
          if (data.LastEvaluatedKey) {
            bodypost.LastEvaluatedKey = data.LastEvaluatedKey
          } else {
            flag = true
          }
        })
        .catch(err => {
          this.setState({
            message_desc: "Pivot Data Fetched Failed",
            message_heading: "Pivot Data",
            openMessageModal: true,
          })
          // toast.error('Pivot Data Fetched Failed')
        })
    }

    this.setState({
      pivotData: pivotData
    })
  };

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
        // toast.success("Update Columns Added Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Update Columns Adding Error",
          message_heading: "Columns",
          openMessageModal: true,
        })
        // toast.error("Update Columns Adding Error");
      });
  };

  closeModal = async (name) => {
    this.setState({ openDeleteModal: false });
    // await this.props.closeModal("closeAll");
    // await this.clearStates();
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
      // url: "",
      // apiKey: "",
      // apiPassword: "",
      project: "", //name of the select box
      projects: [], //all options show in select box
      CSV: "",
      formErrors: {
        projectName: "",
        dataConnection: "",
        // url: "",
        // apiKey: "",
        // apiPassword: "",
        project: "",
        templates: ""
      }
    });
  };

  onDelete = async guid => {
    if (guid) {
      await this.setState({ isLoading: true });
      let pivotData = [];
      let tenantguids = localStorage.getItem("tenantguid");

      // await API.post("pivot", "/getPivotDataByTandB", {
      //   body: { buguid: guid, tenantguid: tenantguids }
      // })
      // .then(data => {
      //   pivotData = data;
      // })
      // .catch(err => {
      //   toast.error("Pivot Data Fetched Failed");
      // });


      let bodypost = {
        buguid: guid,
        tenantguid: tenantguids
      }

      let flag = false
      while (flag === false) {
        await API.post('pivot', '/getPivotDataByTandB', {
          body: bodypost
        })
          .then(data => {
            // toast.success("Pivot Data Fetched Successfully");
            data.Items.map(s => {
              pivotData.push(s)
            })
            if (data.LastEvaluatedKey) {
              bodypost.LastEvaluatedKey = data.LastEvaluatedKey
            } else {
              flag = true
            }
          })
          .catch(err => {
            this.setState({
              message_desc: "Pivot Data Fetched Failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            })
            // toast.error('Pivot Data Fetched Failed')
          })
      }


      var pivotDataGuidsArray = [];
      pivotData.map(pivotDataGuids => {
        pivotDataGuidsArray.push(pivotDataGuids.guid);
      })


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
          // toast.success("Templates Get Successfully");
        })
        .catch(err => {
          this.setState({
            message_desc: "Templates Not Found",
            message_heading: "Templates",
            openMessageModal: true,
          })
          // toast.error("Templates Not Found");
        });
      let tempGuids = []; //it contains only templates guids i.e ['95c80-f1d3-1e9-b971-e5e5c', '9580-f1d3-11e9-b971-16745c]
      let templateColumns = [];
      let deletetempids = []; //it contains all columns of templates
      templates.map((t, i) => {
        deletetempids.push(t.guid);
        t.Columns.map(s => {
          tempGuids.push(s);
        })

      });

      if (tempGuids.length > 0) {
        //get all columns of templates
        // await API.post("pivot", "/getColumsbyMultipleTemplates", {
        //   body: {
        //     templates: tempGuids
        //   }
        // })
        //   .then(async data => {
        //     templateColumns = data.result.Items;
        //     // toast.success("Get Columns By Multiple Templates Successfully");
        //   })
        //   .catch(err => {
        //     toast.error("Get Columns By Multiple Templates Error");
        //   });

        let columns = await this.props.getColumsByMultipleTemplates(tempGuids);
        templateColumns = columns;

      }
      //delete all columns of templates
      if (templates.length > 0 && templateColumns.length > 0) {
        await Promise.all(
          templates.map(async (temp, i) => {
            //delete column of template one by one template because in Batch more than 20(columns) not deleted
            let temp_columns = templateColumns.filter(
              c => temp.Columns.indexOf(c.guid) > -1
            );


            var columnsGuids = [];
            temp_columns.map(val => {
              columnsGuids.push(val.guid);
            });
            //it contains all columns against one template
            if (columnsGuids.length > 0) {
              // await API.post("pivot", "/deletecolumns", {
              //   body: {
              //     finaldata: columnsGuids
              //   }
              // })
              //   .then(data => {
              //     // toast.success("columns deleted successfully against the templates");
              //   })
              //   .catch(error => {
              //     toast.error("columns not deleted");
              //   });


              let lofdata = Math.ceil(columnsGuids.length / 20);
              for (let i = 0; i < lofdata * 20; i = i + 20) {
                let arraytosend = columnsGuids.slice(i, i + 20);
                await API.post('pivot', '/deletecolumns', {
                  body: {
                    finaldata: arraytosend,
                  },
                })
                  .then(() => {
                    if (i === ((lofdata * 20) - 20)) {
                      // toast.success('Data replaced successfully.');
                    }
                  })
                  .catch((error) => {
                    this.setState({
                      message_desc: "Data didn't replaced successfully.",
                      message_heading: "Pivot Data",
                      openMessageModal: true,
                    })
                    // toast.error("Data didn't replaced successfully.");
                  });

              }

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
            // toast.success("Templates deleted successfully");
          })
          .catch(err => {
            this.setState({
              message_desc: "Templates not delete",
              message_heading: "Templates",
              openMessageModal: true,
            })
            // toast.error("Templates not delete");
          });
      }

      //delete project
      await API.post("pivot", "/deleteProject", {
        body: {
          guid
        }
      })
        .then(async data => {
          // toast.success("Project Deleted Successfully");

          let dateTime = await new Date().getTime();
          this.activityRecord([
            {
              "User": localStorage.getItem('Email'),
              "Datetime": dateTime,
              "Module": "Project List",
              "Description": "Delete Project",
              "ProjectName": this.props.singleProject.Name,
              "ColumnName": "",
              "ValueFrom": "",
              "ValueTo": "",
              "Tenantid": localStorage.getItem('tenantguid')
            }
          ]);

        })
        .catch(err => {
          this.setState({
            message_desc: "Error While Deleting Project!",
            message_heading: "Project",
            openMessageModal: true,
          })
          // toast.error("Error While Deleting Project!");
        });


      var lofdata = Math.ceil(pivotDataGuidsArray.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = pivotDataGuidsArray.slice(i, i + 20);
        await API.post("pivot", "/deletepivotdata", {
          body: {
            guids: arraytosend
          }
        })
          .then(data => {
            // toast.success("data deleted");
          })
          .catch(err => {
            this.setState({
              message_desc: "Delete data request failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            })
            // toast.error("deletedata request failed");
          });
      }


      this.props.allusers.map(async (user, index) => {
        // var project_access_update = this.state.project_access.filter(pa => pa !== guid);
        user.projectAccess = user.projectAccess.filter(pa => pa !== guid);
        if (user.projectAccess.length > 0) {
          await API.post("pivot", "/updatefields", {
            body: {
              table: "PivotUser",
              guid: user.guid,
              fieldname: "projectAccess",
              value: user.projectAccess
            }
          })
            .then(async data => {
              if (index === (this.props.allusers.length - 1)) {
                // toast.success("project access updated successfully");
              }
            })
            .catch(err => {
              this.setState({
                message_desc: "Project didn't deleted from " + user.Email + " project access",
                message_heading: "Project",
                openMessageModal: true,
              })
            });
        }
      });
      // let userGuid = localStorage.getItem('guid');
      // var project_access_update = this.state.project_access.filter(pa => pa !== guid);
      // await API.post("pivot", "/updatefields", {
      //   body: {
      //     table: "PivotUser",
      //     guid: userGuid,
      //     fieldname: "projectAccess",
      //     value: project_access_update
      //   }
      // })
      // .then(async data => {
      //   toast.success("project access updated successfully");
      // })
      // .catch(err => {
      //   toast.error("Exclude Not Updated!");
      // });

      await this.props.getUserByGuid();
      await this.props.getUsers(false);
      await this.setState({ isLoading: false });

      await this.props.getprojects();

      await this.props.closeModal("closeAll");
      await this.closeModalDelete('openDeleteModal')
    }
    else {
      this.setState({
        message_desc: "Project Guid Not Found!",
        message_heading: "Project",
        openMessageModal: true,
      })
      // toast.error("Project Guid Not Found!");
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
        data = xy.sort(function (a, b) {
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
        // toast.success("Templates Get Successfully");
        this.setState({ templates: data, templatesSelection: data });
      })
      .catch(err => {
        this.setState({
          message_desc: "Templates Not Found",
          message_heading: "Templates",
          openMessageModal: true,
        })
        // toast.error("Templates Not Found");
      });
    await this.setState({
      isLoading: false,
      // templatesSelection: []
    });
  };

  openModal = name => {
    if (name == "openDeleteModal") {
      this.setState({ openDeleteModal: true });
      $(document).ready(function () {
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
      // if ($('.multi-select .dropdown').is(":focus") || $('.multi-select .dropdown').focus()) {

      // } else {
      if (this.state.dataConnection == "CSV") {

        document.getElementById('SubmitButtonCSV').click();
      }
      else if (this.state.dataConnection == "XERO") {

        document.getElementById('SubmitButtonXERO').click();
      }
      // }
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

  xeroCallTest = async () => {
    let { clientID, xeroAppUrl } = this.props;
    localStorage.setItem('lastLocation', '/projects');
    window.location.assign(
      "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=" + clientID + "&redirect_uri=" + xeroAppUrl + "redirect&scope=openid profile email accounting.reports.read accounting.transactions accounting.settings accounting.reports.read projects offline_access&state=123"
    );
  }

  xeroConnection = async () => {
    console.log('xeroConnection')
    let { dataConnection, guid } = this.state;
    let { allusers, login_user_email, tenants } = this.props;
    if (dataConnection === "XERO") {
      await this.setState({
        isLoading: true,
      })

      // await this.deleteXeroApp()
      localStorage.setItem("xero", JSON.stringify({
        tenantsIds: tenants ? tenants.map(tenant => tenant.tenantId) : [],
        selectedProjectId: guid,
        lastLocation: 'EditProject',
        loggedInUserGuid: allusers.find(user => user.Email === login_user_email).guid
      }))

      await API.post("pivot", "/xerogetconnections", {
        body: {
          clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
          clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
          redirectUris: process.env.REACT_APP_XERO_APP_URL,
          scopes: process.env.REACT_APP_XERO_APP_SCOPES,
        }
      })
        .then(data => {
          window.location.assign(data)

        }).catch(s => {

        })
    } else {
      // toast.info('Project Connection must be XERO');
    }
  }

  deleteXeroApp = async () => {
    let { allusers, login_user_email } = this.props;
    let user = allusers.find(user => user.Email === login_user_email)
    await API.post('pivot', '/xerodisconnect', {
      body: {
        clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
        clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
        redirectUris: process.env.REACT_APP_XERO_APP_URL,
        scopes: process.env.REACT_APP_XERO_APP_SCOPES,
        token: user.XeroTokenObject
      },
    })
      .then(async (response) => {
        //toast.success("Xero tenants disconnected.");
      })
      .catch(async (error) => {
        toast.error("Xero tenants didn't disconnect.");
      });
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
    let xeroTenantName = 
      localStorage.getItem("xeroTenantName") ? 
        localStorage.getItem("xeroTenantName") : 
        "";

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openModal}
          onHide={() => {
            localStorage.removeItem('xero')
            this.closeModal()
          }}
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
                        <img 
                          src="/images/2/close.png" 
                          onClick={() => {
                            localStorage.removeItem('xero')
                            this.props.closeModal()
                          }} 
                          className="d-block img-fluid modal_closed_btn" alt="close" />

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
                                  // placeholder="The Butcher Series 1"
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
                                <div className={this.state.formErrors.dataConnection !== ""
                                  ? "form-group au_select mb-0"
                                  : "form-group au_select"}>
                                  <div className='position-relative'>
                                    <label className='position-absolute'>Organization</label>
                                    <button
                                      type='button'
                                      className='au_theme_btn au_back'
                                      style={{float: 'right', margin: '5px'}}
                                      onClick={this.xeroConnection}
                                    >
                                      Add
                                    </button>
                                  </div>
                                  <select
                                    className="form-control ap_custom_select"
                                    name="selectedOrganization"
                                    value={this.state.selectedOrganization}
                                    onChange={this.handleInputFields}
                                    >
                                      <option value=''>Select</option>
                                    {
                                      this.props.tenants && this.props.tenants.map(tenant => <option value={tenant.tenantId}>{tenant.tenantName}</option>)                                          
                                    }
                                  </select>      
                                
                                  <span className="au_custom_caret"></span>                            
                                </div>
                                 {/* <div className="form-group">
                                    <button
                                    type="button"
                                    className="ap_theme_btn ap_back"
                                    onClick={this.xeroCallTest}
                                    >
                                    Connects
                                    </button>
                                    <br />
                                    </div>
                                    <div>
                                    <p style={{fontSize: "11px", fontFamily: "Montserrat"}}>{this.state.XeroDB}</p>
                                  </div>*/}
                                  {/* <div className="form-group">
                                    <label htmlFor="URL">URL</label>
                                    <input
                                    disabled
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
                                  </div> */}
                                  {/* <div className="form-group">
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
                                  </div> */}
                                  {/* <div className="form-group">
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
                                  </div> */}
                                </>
                              ) : (
                                ""
                              )}
                              {this.state.dataConnection !== "Select" &&
                              this.state.dataConnection == "CSV" ? (
                                <>
                                  {/* <div className="form-group">
                                    <label htmlFor="api-pass">CSV</label>
                                    <div className="row no-gutters input-group mb-2 mt-1">
                                      <div className="au_form_upload_message col-12">
                                        <Dropzone onDrop={this.fileUpload}>
                                          {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                              <input {...getInputProps()} /> */}

                                              {/* <img
                                                  alt="send_msg"
                                                  src={attachUserIcPng}
                                                  width="23"
                                                  height="43"
                                                /> */}
                                                
                                              {/* <p>Paste Pad</p>
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
                                  </div> */}
                                </>
                              ) : (
                                ""
                              )}
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
        <Message
          openModal = {this.state.openMessageModal}
          closeModal={() => this.closeModalDelete("openMessageModal")}
          heading={this.state.message_heading}
          changeState={this.changeState}
          continueSaveXero={this.state.continueSaveXero}
          onSaveXero={this.onSaveXero}
        >
          {this.state.message_desc}
        </Message>
      </>
    );
  }
}

export default EditProjectModal;
