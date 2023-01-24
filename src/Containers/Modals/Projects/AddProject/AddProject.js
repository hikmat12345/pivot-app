import './AddProject.css'

import React, { Component } from 'react'

import $ from 'jquery'
import { API } from 'aws-amplify'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router-dom'
import Message from '../../message/message'
import Modal from 'react-bootstrap/Modal'
import MultiSelect from '@khanacademy/react-multi-select'
import Papa from 'papaparse'
import axios from 'axios'
import { toast } from 'react-toastify'

const uuidv1 = require('uuid/v1')

class AddProjectModal extends Component {
  constructor() {
    super()
    this.state = {
      new_columns_position: [],
      show: false,
      newColumns: [], //it contains all new column by new temlates guids
      template_columns: [], //it contains all previous column get by temlates guids
      businessGuid: '',
      showConfirm: false,
      CSV: 'testFile.csv',
      csvFileName: '',
      templatesSelection: [],
      templatesOptions: [],
      message_desc: '',
      message_heading: '',
      openMessageModal: false,

      // templatesOptions: [
      //   { label: "Cost Report", value: "Cost Report" },
      //   { label: "Snowden", value: "Snowden" },
      //   { label: "Chopper Series 1", value: "Chopper Series 1" },
      //   {
      //     label: "The Great Chase Series 10",
      //     value: "The Great Chase Series 10"
      //   }
      // ],
      projectName: '',
      dataConnection: '',
      selectedOrganization: '',
      // url: "",
      // apiKey: "",
      // apiPassword: "",
      project: '',
      projects: [], //all options show in select box
      required_messages: [],
      formErrors: {
        projectName: '',
        dataConnection: '',
        // url: "",
        // apiKey: "",
        // apiPassword: "",
        project: '',
        templates: ''
      }
    }
    // MultiSelect.hasFocus=undefined;
  }

  async componentWillReceiveProps() {
    let xero = JSON.parse(localStorage.getItem('xero'))
    let { projects } = this.props
    let { projectName, dataConnection, project } = this.state
    let newTenants = []
    if (xero && xero.tenantsIds) {
      newTenants = this.props.tenants.filter(tenant => !xero.tenantsIds.includes(tenant.tenantId))
    }
    await this.setState({
      projects: projects,
      required_messages: this.props.required_messages,
      // selectedOrganization: connectedXeroTenant ? connectedXeroTenant.tenantId : 'Select',
      projectName: xero && xero.projectName ? xero.projectName : projectName,
      dataConnection: xero && xero.dataConnection
        ? xero.dataConnection
        : dataConnection,
      project: xero && xero.project ? xero.project : project,
      selectedOrganization: newTenants && newTenants.length > 0 ? newTenants[0].tenantId : '',
    })
    //   var that=this;
    //   $(document).ready(function () {
    //   if(that.state.dataConnection == "CSV"){
    //     $('#FormSubmit_addProject').keydown(function (e) {
    //       if(e.which == 13){
    //         e.preventDefault()
    //         document.getElementById('SubmitButtonCSV').click();
    //       } });
    //   }
    //   else if(that.state.dataConnection == "XERO"){
    //       $('#FormSubmit_addProject').keydown(function (e) {
    //         if(e.which == 13){
    //           e.preventDefault()
    //           document.getElementById('SubmitButtonXERO').click();
    //         } });
    //   }
    // });

    // $(document).ready(function () {
    //   $('.multi-select ul>li>label').keydown(function(){
    //     alert('OK')
    //     if(e.keyCode == 13){
    //       e.preventDefault();
    //       alert('enter')
    //       $('.multi-select .dropdown-content').hide();
    //     }
    //   });
    // });
  }

  handleInputFields = event => {
    var fieldName = event.target.name
    var fieldValue = event.target.value
    this.setState({ [event.target.name]: event.target.value })
    this.validateField(fieldName, fieldValue)
  }
  //when project is selected from dropdown then call api to get templates according to that project
  handleProjectsSelection = async event => {
    var fieldName = event.target.name
    var fieldValue = event.target.value
    let tenantguid = localStorage.getItem('tenantguid')
    this.setState({ [event.target.name]: event.target.value })
    this.validateField(fieldName, fieldValue)
    if (fieldValue) {
      await this.setState({
        isLoading: true
      })

      //get templates
      await API.post('pivot', '/getTemplate', {
        body: {
          buguid: fieldValue,
          tenantguid: tenantguid
        }
      })
        .then(data => {
          var xy = data
          data = xy.sort(function (a, b) {
            var nameA = a.TemplateName.toUpperCase()
            var nameB = b.TemplateName.toUpperCase()
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            // names must be equal
            return 0
          })
          // toast.success("Templates Get Successfully");
          this.setState({ templates: data, templatesSelection: data })
        })
        .catch(err => {
          this.setState({
            message_desc: 'An Error Occured While Getting Templates!',
            message_heading: 'Templates',
            openMessageModal: true
          })
          // toast.error("An Error While Getting Templates!");
        })
      await this.setState({
        isLoading: false
      })
    }
  }

  validateField = async (name, value) => {
    var formErrors = this.state.formErrors
    switch (name) {
      case 'projectName':
        if (value.length < 1) {
          formErrors.projectName = 'This Field is Required.'
        } else {
          formErrors.projectName = ''
        }
        break
      case 'dataConnection':
        if (!value) {
          formErrors.dataConnection = 'This Field is Required.'
        } else {
          formErrors.dataConnection = ''
        }
        break
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
      //   break;
      case 'project':
        if (!value) {
          formErrors.project = 'This Field is Required.'
        } else {
          formErrors.project = ''
        }
        break
      default:
        break
    }
    this.setState({
      formErrors: formErrors
    })
  }

  onSaveXero = async (event, closeModal) => {
    let tenantguid = localStorage.getItem('tenantguid')
    event.preventDefault()
    var formErrors = this.state.formErrors
    if (!this.state.projectName) {
      formErrors.projectName = 'This Field is Required.'
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    if (!this.state.dataConnection) {
      formErrors.dataConnection = 'This Field is Required.'
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    // if (!this.state.url) {
    //   formErrors.url = "This Field is Required.";
    //   this.state.required_messages.map(e => e.ID == 1 ?
    //     this.setState({
    //       message_desc: e.Desc,
    //       message_heading: e.Heading,
    //       openMessageModal: true
    //     }) : '')
    //   $(document).ready(function () {
    //     $(this).find('#ok_button').focus();
    //   })
    // }
    // if (!this.state.apiKey) {
    //   formErrors.apiKey = "This Field is Required.";
    //   this.state.required_messages.map(e => e.ID == 1 ?
    //     this.setState({
    //       message_desc: e.Desc,
    //       message_heading: e.Heading,
    //       openMessageModal: true
    //     }) : '')
    //   $(document).ready(function () {
    //     $(this).find('#ok_button').focus();
    //   })
    // }
    // if (!this.state.apiPassword) {
    //   formErrors.apiPassword = "This Field is Required.";
    //   this.state.required_messages.map(e => e.ID == 1 ?
    //     this.setState({
    //       message_desc: e.Desc,
    //       message_heading: e.Heading,
    //       openMessageModal: true
    //     }) : '')
    //   $(document).ready(function () {
    //     $(this).find('#ok_button').focus();
    //   })
    // }
    if (!this.state.project) {
      formErrors.project = 'This Field is Required.'
      $('#pp_list').toggleClass('mb-0')
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    // if (!this.state.templatesSelection.length) {
    //   formErrors.templates = 'This Field is Required.'
    //   this.state.required_messages.map(e =>
    //     e.ID == 1
    //       ? this.setState({
    //           message_desc: e.Desc,
    //           message_heading: e.Heading,
    //           openMessageModal: true
    //         })
    //       : ''
    //   )
    //   $(document).ready(function () {
    //     $(this)
    //       .find('#ok_button')
    //       .focus()
    //   })
    // }

    this.setState({
      formErrors: formErrors
    })

    let projectNameUsed = this.props.projectsForAddEdit.find(
      project => project.Name === this.state.projectName
    )
      ? true
      : false
    if (
      !formErrors.projectName &&
      !formErrors.dataConnection &&
      !projectNameUsed &&
      // !formErrors.url &&
      // !formErrors.apiKey &&
      // !formErrors.apiPassword &&
      !formErrors.project
      // && !formErrors.templates
    ) {
      let {
        projectName,
        dataConnection,
        selectedOrganization,
        url,
        apiKey,
        apiPassword,
        projects,
        project,
        businessGuid,
        templatesSelection
      } = this.state

      let copiedProject = projects.find(pro => pro.guid === project)
      await this.setState({
        isLoading: true
      })
      let dateTime = new Date().getTime()
      let activities = [
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Project Name',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: projectName,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Data Connection',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: dataConnection,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Connect',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: localStorage.getItem('xeroTenantName'),
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Import Project',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: projects.find(pro => pro.guid === project).Name,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        }
      ]
      // var new_project = projectName;

      // Add Project
      await API.post('pivot', '/addProject', {
        body: {
          projectName: projectName,
          dataConnection: dataConnection,
          url: null,
          apikey: null,
          apiPassword: null,
          createdAt: new Date(),
          tenantGuid: tenantguid,
          FontSize: copiedProject.FontSize,
          XeroDB: this.state.selectedOrganization !== '' ?
            this.props.tenants.find(tenant => tenant.tenantId === selectedOrganization) : 
            null,
          OnConflict: copiedProject.OnConflict
        }
      })
        .then(async data => {
          // console.log(data,'businessGuidbusinessGuidbusinessGuid')
          localStorage.removeItem('xero')


          await this.setState({
            businessGuid: data.params.Item.guid
          })
          this.props.onAddNewProject(this.state.businessGuid)
          // toast.success("Project Added Successfully");
          closeModal()
          this.props.getprojects()
        })
        .catch(err => {
          this.setState({
            message_desc: 'Project Not Added Successfully',
            message_heading: 'Project',
            openMessageModal: true
          })
          // toast.error("Project Not Added Successfully");
        })
      await this.copyTemplates(templatesSelection, this.state.businessGuid)
      console.log(
        'template_columns',
        JSON.parse(JSON.stringify(this.state.template_columns))
      )

      this.activityRecord(activities)
      await this.clearStates()
      await this.props.addActivities(activities)
      localStorage.removeItem('xero')
      this.setState({
        isLoading: false
      })
    }

    if (projectNameUsed) {
      this.setState({
        message_desc: 'Project name already exists, change and try again.',
        message_heading: 'Project Name',
        openMessageModal: true
      })
    }
  }

  onSaveCSV = async (event, closeModal) => {
    let tenantguid = localStorage.getItem('tenantguid')

    event.preventDefault()
    var formErrors = this.state.formErrors
    if (!this.state.projectName) {
      formErrors.projectName = 'This Field is Required.'
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    if (!this.state.dataConnection) {
      formErrors.dataConnection = 'This Field is Required.'
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }

    if (!this.state.project) {
      formErrors.project = 'This Field is Required.'
      $('#pp_list').toggleClass('mb-0')
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    if (!this.state.templatesSelection.length) {
      formErrors.templates = 'This Field is Required.'
      this.state.required_messages.map(e =>
        e.ID == 1
          ? this.setState({
            message_desc: e.Desc,
            message_heading: e.Heading,
            openMessageModal: true
          })
          : ''
      )
      $(document).ready(function () {
        $(this)
          .find('#ok_button')
          .focus()
      })
    }
    this.setState({
      formErrors: formErrors
    })
    let projectNameUsed = this.props.projectsForAddEdit.find(
      project => project.Name === this.state.projectName
    )
      ? true
      : false
    if (
      !formErrors.projectName &&
      !projectNameUsed &&
      !formErrors.dataConnection &&
      !formErrors.project &&
      !formErrors.templates
    ) {
      let {
        projectName,
        dataConnection,
        CSV,
        projects,
        project,
        businessGuid,
        templatesSelection
      } = this.state

      let copiedProject = projects.find(pro => pro.guid === project)
      await this.setState({
        isLoading: true
      })
      let dateTime = new Date().getTime()
      let activities = [
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Project Name',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: projectName,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Data Connection',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: dataConnection,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Connect',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: localStorage.getItem('xeroTenantName'),
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        },
        {
          User: localStorage.getItem('Email'),
          Datetime: dateTime,
          Module: 'Project List',
          Description: 'Add Project - Import Project',
          ProjectName: '',
          ColumnName: '',
          ValueFrom: '',
          ValueTo: projects.find(pro => pro.guid === project).Name,
          Tenantid: localStorage.getItem('tenantguid'),
          guid: uuidv1()
        }
      ]
      // var new_project = projectName;

      //Add Project
      await API.post('pivot', '/addProject', {
        body: {
          projectName: projectName,
          dataConnection: dataConnection,
          CSV: CSV,
          createdAt: new Date(),
          tenantGuid: tenantguid,
          FontSize: copiedProject.FontSize,
          XeroDB: null,
          OnConflict: copiedProject.OnConflict
        }
      })
        .then(async data => {

          await this.setState({
            businessGuid: data.params.Item.guid
          })
          this.props.onAddNewProject(this.state.businessGuid)

          // toast.success("Project Added Successfully");
          closeModal()

          this.props.getprojects()
        })
        .catch(err => {
          this.setState({
            message_desc: 'Project Not Added Successfully',
            message_heading: 'Project',
            openMessageModal: true
          })
          // toast.error("Project Not Added Successfully");
        })
      await this.copyTemplates(templatesSelection, this.state.businessGuid)
      await this.clearStates()
      this.activityRecord(activities)
      await this.props.addActivities(activities)
      localStorage.removeItem('xero')
      this.setState({
        isLoading: false
      })
    }

    // if (projectNameUsed) {
    //   this.setState({
    //     message_desc: 'Project name already exists, change and try again.',
    //     message_heading: 'Project Name',
    //     openMessageModal: true
    //   })
    // }
  }

  closeModal = name => {
    this.setState({ [name]: false })
  }
  
  clearStates = () => {
    this.setState({
      // url: "",
      // apiKey: "",
      // apiPassword: "",
      templatesSelection: [],
      projectName: '',
      dataConnection: '',
      project: '',
      CSV: 'test.csv',
      newColumns: [], //it contains all new column by new temlates guids
      template_columns: [], //it contains all previous column get by temlates guids
      templatesOptions: []
    })
  }

  CSVfileUpload = async e => {
    if (e.target.files[0]) {
      let file = e.target.files[0]
      let type = file.type
      if (type === 'application/vnd.ms-excel') {
        this.setState({ csvFileName: file.name, CSV: file })
        Papa.parse(file, {
          complete: this.updateCSVFileData
        })
      } else {
        this.setState({
          message_desc: 'Please Select CSV File Only!',
          message_heading: 'File',
          openMessageModal: true
        })
        // toast.error("Please Select CSV File Only!");
      }
    }
  }

  updateCSVFileData = result => {
    let data = result.data
    console.log('complete', data)
    //data contains: [['Account', 'Description], ['Account value, 'Description Value']]
    if (data.length == 2) {
      //Header must contains Account and Description and its length be 2 e.g ['Account', 'Description]
      let header = data[0]
      //Row must Contains Account value and Description value and its length be 2 e.g ['Account value, 'Description Value']
      let row = data[1]

      //in-case header contains more than Account and Description OR it contains empty string
      //in-case rows contains more than Account and Description Values OR it contains empty string
      if (header && header.length == 2 && row && row.length == 2) {
        if (
          header[0] &&
          header[0].trim() === 'Account' &&
          header[1] &&
          header[1].trim() === 'Description' &&
          row[0] &&
          row[0].trim() &&
          row[1] &&
          row[1].trim()
        ) {
          // toast.success("CSV File Format Is  Correct!");
          // console.log(">>>>c", this.state.CSV);
        } else {
          this.setState({
            message_desc: 'CSV File Format Is Not Correct!',
            message_heading: 'File Format',
            openMessageModal: true
          })
          // toast.error("CSV File Format Is Not Correct!");
        }
      } else {
        this.setState({
          message_desc: 'CSV File Format Is Not Correct!',
          message_heading: 'File Format',
          openMessageModal: true
        })
        // toast.error("CSV File Format Is Not Correct!");
      }
    } else {
      this.setState({
        message_desc: 'CSV File Format Is Not Correct!',
        message_heading: 'File Format',
        openMessageModal: true
      })
      // toast.error("CSV File Format Is Not Correct!");
    }
  }

  // Making all previous period values to "0"
  previousPeriodValues = async () => {}

  copyTemplates = async (templatesSelection, guid) => {
    var oldandnewtempids = []
    let oldAndNewColumnsGuids = []
    // var guid = guid;
    var guidss = guid
    let reports = []
    if (templatesSelection.length > 0) {
      let temp = [] //it contains only templates guids i.e ['95c80-f1d3-1e9-b971-e5e5c', '9580-f1d3-11e9-b971-16745c]
      templatesSelection.map(async (t, i) => {
        t.Columns.map(x => {
          temp.push(x)
        })
      })
      

      // //get columns by multiple templates guids
      // await API.post("pivot", "/getColumsbyMultipleTemplates", {
      //   body: {
      //     templates: temp
      //   }
      // })
      //   .then(async data => {
      //     await this.setState({
      //       template_columns: data.result.Items
      //     });
      //     // toast.success("Get Columns By Multiple Templates Successfully");
      //   })
      //   .catch(err => {
      //     toast.error("Get Columns By Multiple Templates Error");
      //   });

      let tempcolumns = await this.props.getColumsByMultipleTemplates(temp)
      await this.setState({
        template_columns: tempcolumns
      })

      // //add templates to current selected project
      let templateArray = []
      let selectedTemp = templatesSelection
      let newTemplate = [] //contains templates that are created by addTemplateBatch api
      let columns = this.state.template_columns //contains previous columns with previpus temp guid
      var newColumns = []
      var systemcolumns_new = []
      selectedTemp.map((st, i) => {
        //first remove guids and add 'BusinessUnitGuid' of current project
        let newGuid = uuidv1()

        let data = {
          guid: newGuid,
          BusinessUnitGuid: guidss, //guid of current selected project
          Columns: [],
          Exclude: st.Exclude,
          FontSize: st.FontSize,
          TemplateName: st.TemplateName,
          ExpenseOnly: st.ExpenseOnly,
          TenantGuid: localStorage.getItem('tenantguid')
        }
        oldandnewtempids.push({ old: st.guid, newguid: newGuid })

        let sortedColumn = []
        //let c = columns.filter(c => c.TemplateGuid === st.guid); //getting all columns with previous temp guid
        let c = columns.filter(c => st.Columns.indexOf(c.guid) > -1) //getting all columns with previous temp guid
        st &&
          st.Columns &&
          st.Columns.map((cl, i) => {
            //loop on previous template columns to get order
            let cd = c.find(c => c.guid.trim() === cl)
            if (cd && cd.ColumnName) {
              //if there is column data against template guid
              sortedColumn.push(cd)
            }
          })
        sortedColumn.map((col, i) => {
          var colguid = uuidv1()
          col.TemplateGuid = newGuid //replace column tempGuid with new comming temp guid
          oldAndNewColumnsGuids.push({ old: col.guid, newguid: colguid })
          col.guid = colguid //to remove column guid from the column
          // col.Formula = null;
          col.Formula = col.Formula ? col.Formula : null
          newColumns.push(col)
          //replacing columns ids in template column access
          if (col.Type === 'System') {
            systemcolumns_new.push(colguid)
          } else {
            data.Columns.push(colguid)
          }
        })
        //adding system columns in those templates who have not system columns
        for (var i = systemcolumns_new.length - 1; i >= 0; i--) {
          data.Columns.unshift(systemcolumns_new[i])
        }

        templateArray.push(data)
      })

      oldandnewtempids.map(async templateGuid => {
        await API.post('pivot', '/getReportdata', {
          body: {
            guid: templateGuid.old    
          }
        }).then(async report => {
          if(report && report.length > 0) {
            await API.post("pivot", "/addreports", {
              body: {
                FooterNote: report[0].FooterNote,
                HeaderNote: report[0].HeaderNote,
                Hide: report[0].Hide,
                LayoutGuid: report[0].LayoutGuid,
                Level: report[0].Level,
                Template: templateGuid.newguid,
                Report: report[0].Report,
                TenantGuid: localStorage.getItem('tenantguid'),
                Title: report[0].Title,
                UserID: report[0].UserID,
                guid: uuidv1(),
                Projectid: this.state.businessGuid,
              },
            }).catch((error) => {
                console.log(error)
              });
          }
        }).catch(error => {
          console.log(error)
        })
      })


      if(reports) {
        reports.map(async report => {
          let templateGuid = oldandnewtempids.find(guid => guid.old === report.Template)
          if(templateGuid && templateGuid.newGuid) {
            await API.post("pivot", "/addreports", {
              body: {
                FooterNote: report.FooterNote,
                HeaderNote: report.HeaderNote,
                Hide: report.Hide,
                LayoutGuid: report.LayoutGuid,
                Level: report.Level,
                Template: templateGuid.newGuid,
                Report: report.Report,
                TenantGuid: localStorage.getItem('tenantguid'),
                Title: report.Title,
                UserID: report.UserID,
                guid: uuidv1(),
                Projectid: this.state.businessGuid,
              },
            })
              .then(async (data) => {
              })
              .catch((error) => {
                console.log(error)
              });
          } else {
            console.log("Error at copyTemplates => /addreports => ", templateGuid)
          }
        });
      }

      await this.setState({ newColumns })
      await API.post('pivot', '/addTemplateBatch', {
        body: {
          templates: templateArray
        }
      })
        .then(async data => {
          let tempArr = []
          data &&
            data.RequestItems &&
            data.RequestItems.PivotTemplates &&
            data.RequestItems.PivotTemplates.map((t, i) => {
              tempArr.push(t.PutRequest.Item)
            })
          newTemplate = tempArr
          // toast.success("Templates Added Successfully");
        })
        .catch(error => {
          console.log(error)
          this.setState({
            message_desc: 'Templates Adding Error',
            message_heading: 'Templates',
            openMessageModal: true
          })
          // toast.error("Templates Adding Error");
        })

      //add column against new template
      await Promise.all(
        newTemplate.map(async (newTemp, i) => {
          let temp_columns = this.state.newColumns.filter(
            c => newTemp.Columns.indexOf(c.guid) > -1
          ) //it contains all columns against one template
          temp_columns.map(tempColumn => {
            oldandnewtempids.map(template => {
              if (tempColumn.SelectedTemplateGuid === template.old) {
                tempColumn.SelectedTemplateGuid = template.newguid
              }
            })
            oldAndNewColumnsGuids.map(column => {
              if (
                tempColumn.Formula &&
                tempColumn.Formula.includes(column.old)
              ) {
                tempColumn.Formula = tempColumn.Formula.replace(
                  column.old,
                  column.newguid
                )
              }
              if (tempColumn.SelectedColumnGuid === column.old) {
                tempColumn.SelectedColumnGuid = column.newguid
              }
            })
          })
          if (temp_columns.length > 0) {
            var lofcols = Math.ceil(temp_columns.length / 20);
            for (var i = 0; i < lofcols * 20; i = i + 20) {
              var arraytosend = temp_columns.slice(i, i + 20);
              await API.post('pivot', '/addColumnBatch', {
                body: {
                  columns: arraytosend
                },
              })
              .then(async data => {
                var positions = this.state.new_columns_position
                positions.push({ data: newTemp.Columns, newid: newTemp.guid })
                this.setState({
                  new_columns_position: positions
                })
                // toast.success("Columns Added Successfully");
                //update column field in template
                //await this.updateColumns(newTemp.guid, data);
              })
              .catch(error => {
                console.log(error)
                this.setState({
                  message_desc: 'Columns Adding Error',
                  message_heading: 'Columns',
                  openMessageModal: true
                })
                // toast.error("Columns Adding Error");
              })
            }
          }
        })
      )

      //gte pivot data
      let pivotData = []
      let guid = this.state.businessGuid //it contains guid of newly created project
      let projectGuid = this.state.project //it contains project guid of selected project (not newly created project guid)
      let tenantguid = localStorage.getItem('tenantguid')
      // await API.post("pivot", "/getPivotDataByTandB", {
      //   body: { buguid: projectGuid, tenantguid: tenantguid }
      // })
      //   .then(data => {
      //     // toast.success("Pivot Data Fetched Successfully");
      //     pivotData = data;

      //   })
      //   .catch(err => {
      //     toast.error("Pivot Data Fetched Failed");
      //   });
      // // console.log(">>>>pivot data orignal::::::", pivotData);

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
              message_desc: 'Pivot Data Fetched Failed',
              message_heading: 'Pivot Data',
              openMessageModal: true
            })
            // toast.error('Pivot Data Fetched Failed')
          })
      }

      var clonedPivotData = pivotData //copy data by value (not by reference)
      // begin
      let finalPivotData = []

      var columnguid = ''
      if (clonedPivotData.length > 0) {
        await this.setState({ isLoading: true })

        var mainarray = []
        var temparray = []
        var guidarray = []

        var root = JSON.parse(
          JSON.stringify(clonedPivotData.find(d => d.ParentGuid == 'root'))
        )

        temparray.push(root)
        var newguids = []
        var newids = uuidv1()
        var guids = root.guid

        newguids.push({
          oldguid: JSON.parse(JSON.stringify(guids)),
          newguid: JSON.parse(JSON.stringify(newids))
        })

        var findex = clonedPivotData.findIndex(d => d.guid == guids)
        clonedPivotData[findex].guid = newids

        clonedPivotData.map((value, index) => {
          newids = uuidv1()

          if (value.ParentGuid == root.guid) {
            if (value.Type == 'Header') {
              guidarray.push(JSON.parse(JSON.stringify(value.guid)))

              var findex = clonedPivotData.findIndex(d => d.guid == value.guid)
              newguids.push({
                oldguid: JSON.parse(JSON.stringify(value.guid)),
                newguid: JSON.parse(JSON.stringify(newids))
              })

              var idindex = newguids.find(d => d.oldguid == value.ParentGuid)

              value.ParentGuid = idindex.newguid
              value.guid = newids

              temparray.push(value)
            } else if (value.Type != 'Header') {
              var idindex = newguids.find(d => d.oldguid == value.ParentGuid)
              value.ParentGuid = idindex.newguid

              value.guid = newids
              temparray.push(value)
            }
          }
        })

        //do changes
        var iy = newguids.find(d => (d.oldguid = guids))
        var newd = ''

        guidarray = guidarray.filter(d => d != guids)
        //newguids = newguids.filter(d => d.oldguid !=guids);

        //console.log(guidarray,"------array",newguids)
        temparray = []
        var jjj = false

        while (guidarray.length != 0) {
          guids = guidarray[0]
          clonedPivotData.map((value, index) => {
            if (value.ParentGuid == guids) {
              newd = uuidv1()
              if (value.Type == 'Header') {
                guidarray.push(JSON.parse(JSON.stringify(value.guid)))

                newguids.push({
                  oldguid: JSON.parse(JSON.stringify(value.guid)),
                  newguid: JSON.parse(JSON.stringify(newd))
                })

                value.guid = newd
                var idindex = newguids.find(d => d.oldguid == value.ParentGuid)
                value.ParentGuid = idindex.newguid
                temparray.push(value)
              } else {
                newd = uuidv1()
                var idindex = newguids.find(d => d.oldguid == value.ParentGuid)

                value.ParentGuid = idindex.newguid

                value.guid = newd
              }
            }
          })

          temparray = []

          guidarray = guidarray.filter(d => d != guids)

          jjj = true
        }
        clonedPivotData.sort(function (a, b) {
          var nameA = a.Position
          var nameB = b.Position
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })

        let tenantguid = localStorage.getItem('tenantguid')
        var x = JSON.parse(JSON.stringify(clonedPivotData))
        x.map(value => {
          value.BusinessUnitGuid = guidss
          value.TenantGuid = tenantguid
        })
        clonedPivotData = x

        //linking new column and data start====

        templatesSelection.map(e => {
          var selected_temp_guids = e.guid
          var selected_temp_columns = e.Columns
          var getnewidbyold = oldandnewtempids.find(
            h => h.old == selected_temp_guids
          )

          var databyid = this.state.new_columns_position.find(
            f => f.newid == getnewidbyold.newguid
          )

          x.map(vl => {
            if (vl.Type !== 'Blank') {
              selected_temp_columns.map((stc, index) => {
                var oldcolumn = vl.Columns.find(f => stc == f.ColumnGuid)
                if (oldcolumn && oldcolumn.ColumnGuid) {
                  oldcolumn.ColumnGuid = databyid.data[index]
                }
              })
            }
          })
        })
        console.log(
          'x-------------xxxxxxxxxxxxxxxxx------xxxxxx-xxxxxxxxxx: ',
          x
        )
        let preivousPeriodColumns = columns.filter(
          column => column.Type.toUpperCase() === 'PREVIOUSPERIOD'
        )
        if (preivousPeriodColumns) {
          x.map(row => {
            preivousPeriodColumns.map(column => {
              row.Columns.map(cell => {
                if (cell.ColumnGuid === column.guid) {
                  cell.AmountValue = '0'
                  cell.TextValue = null
                }
              })
            })
          })
        }

        //linking new column and data end====
        var temploftemp = x.length / 20
        for (var i = 0; i < Math.ceil(temploftemp) * 20; i = i + 20) {
          var arraytosend = x.slice(i, i + 20)
          await API.post('pivot', '/copypivotdata', {
            body: {
              pivotdata: arraytosend
            }
          })
            .then(data => {
              // toast.success("data added")
            })
            .catch(err => {
              this.setState({
                message_desc: 'Copydata request failed',
                message_heading: 'Pivot Data',
                openMessageModal: true
              })
              // toast.error("copydata request failed");
            })
        }
        await this.setState({ isLoading: false })
      }
    }
  }

  updateColumns = async (guid, value) => {
    //update column in new copied template for ordering
    await API.post('pivot', '/updatefields', {
      body: {
        table: 'PivotTemplates',
        guid,
        fieldname: 'Columns',
        value
      }
    })
      .then(async data => {
        // toast.success("Update Columns Added Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: 'Update Columns Adding Error',
          message_heading: 'Columns',
          openMessageModal: true
        })
        // toast.error("Update Columns Adding Error");
      })
  }

  formSubmitHandler = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
      e.stopPropagation()

      if ($('.multi-select .dropdown').is(':focus')) {
        alert('in')
      } else {
        if (this.state.dataConnection == 'CSV') {
          document.getElementById('SubmitButtonCSV').click()
        } else if (this.state.dataConnection == 'XERO') {
          document.getElementById('SubmitButtonXERO').click()
        }
      }
    } else if (e.keyCode == 27) {
      var formErrors = this.state.formErrors
      formErrors.projectName = ''
      // formErrors.url= ""
      formErrors.dataConnection = ''
      // formErrors.apiKey= ""
      // formErrors.apiPassword= ""
      formErrors.project = ''
      formErrors.templates = ''
      this.setState({ formErrors: formErrors })
    }
  }

  multiSelectEnter = e => {
    e.preventDefault()
    e.stopPropagation()
    $('.multi-select .dropdown').keydown(function (a) {
      if ($('.multi-select .dropdown').is(':focus')) {
        if (a.keyCode == 13) {
          a.preventDefault()
          $('.multi-select .dropdown-content').show()
          $('.multi-select .dropdown').attr('aria-expanded', 'true')
        }
      }
    })
    $('.multi-select .dropdown-content label.select-item').keydown(function (
      v
    ) {
      v.preventDefault()
      if (v.keyCode == 13) {
        v.preventDefault()
        v.stopPropagation()
        $('.multi-select .dropdown-content').hide()
        $('.multi-select .dropdown').attr('aria-expanded', 'false')
        $('.multi-select .dropdown').focus()
      } else if (e.keyCode == 32) {
        e.preventDefault()
        e.stopPropagation()
        $('.multi-select .dropdown-content').show()
        $('.multi-select .dropdown').attr('aria-expanded', 'true')
      }
    })
  }

  closebutton = async () => {
    let { selectedOrganization, projectName, dataConnection, project, formErrors } = this.state
    selectedOrganization = ''
    projectName = ''
    dataConnection = ''
    project = ''
    formErrors.projectName = ''
    // formErrors.url= ""
    formErrors.dataConnection = ''
    // formErrors.apiKey= ""
    // formErrors.apiPassword= ""
    formErrors.project = ''
    formErrors.templates = ''
    await this.setState({
      selectedOrganization,
      projectName,
      dataConnection,
      project,
      formErrors
    })
    localStorage.removeItem('xero')
    this.props.closeModal()
  }

  xeroCallTest = async () => {
    let { clientID, xeroAppUrl } = this.props
    localStorage.setItem('lastLocation', '/projects')
    window.location.assign(
      'https://login.xero.com/identity/connect/authorize?response_type=code&client_id=' +
      clientID +
      '&redirect_uri=' +
      xeroAppUrl +
      'redirect&scope=openid profile email accounting.reports.read accounting.transactions accounting.settings accounting.reports.read projects offline_access&state=123'
    )
  }

  xeroConnection = async () => {
    let { projectName, dataConnection, project } = this.state
    let { allusers, login_user_email, tenants } = this.props
    if (dataConnection === 'XERO') {
      await this.setState({
        isLoading: true
      })

      localStorage.setItem("xero", JSON.stringify({
        tenantsIds: tenants ? tenants.map(tenant => tenant.tenantId) : [],
        selectedProjectId: undefined,
        lastLocation: 'AddProject',
        loggedInUserGuid: allusers.find(user => user.Email === login_user_email).guid,
        projectName: projectName,
        dataConnection: dataConnection,
        project: project,
      }))

      await API.post('pivot', '/xerogetconnections', {
        body: {
          clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
          clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
          redirectUris: process.env.REACT_APP_XERO_APP_URL,
          scopes: process.env.REACT_APP_XERO_APP_SCOPES
        }
      })
        .then(data => {
          window.location.assign(data)
        })
        .catch(s => { })
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

  activityRecord = async finalarray => {
    await API.post('pivot', '/addactivities', {
      body: {
        activities: finalarray
      }
    })
      .then(async data => {
        // toast.success('Activity successfully recorded.')
      })
      .catch(err => {
        this.setState({
          message_desc: 'Activity failed to record.',
          message_heading: 'Activity',
          openMessageModal: true
        })
        // toast.error('Activity failed to record.')
      })
  }

  render () {
    let dropdownHeaderFocuseds = {
      borderColor: 'red',
      boxShadow: 'none'
    }
    let xeroTenantName = localStorage.getItem('xeroTenantName')
      ? localStorage.getItem('xeroTenantName')
      : ''

    return (
      <>
        {this.state.isLoading ? <div className='se-pre-con'></div> : ''}

        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={this.props.openModal}
          onHide={this.closebutton}
          className='ap_modal'
        >
          <Modal.Body>
            <div className='container-fluid'>
              <div className='ap_main_wrapper'>
                <div className='row d-flex h-100'>
                  <div className='col-12 ap_form_mx_width'>
                    <div className='ap_signup_form_main'>
                      <div className='ap_signup_header'>
                        <div className='row'>
                          <img
                            src='/images/2/close.png'
                            onClick={this.closebutton}
                            className='d-block img-fluid modal_closed_btn'
                            alt='close'
                          />

                          <div className='col-12 col-sm-8 ap_order-xs-2'>
                            <h4>Add Project</h4>
                          </div>
                          <div className='col-12 col-sm-3 ap_order-xs-1'>
                            <img
                              src='/images/pivot.png'
                              className='img-fluid float-right'
                              alt='Logo'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='ap_signup_body'>
                        <div className='row'>
                          <div className='col-12'>
                            <div
                              onKeyUp={this.formSubmitHandler}
                              id='FormSubmit_addProject'
                              className='ap_signup_form'
                            >
                              <div className='form-group'>
                                <label htmlFor='p-name'>Project Name</label>
                                <input
                                  type='text'
                                  className='form-control'
                                  id='p-name'
                                  name='projectName'
                                  autoFocus
                                  value={this.state.projectName}
                                  onChange={this.handleInputFields}
                                />
                                <div className='text-danger error-12'>
                                  {this.state.formErrors.projectName !== ''
                                    ? this.state.formErrors.projectName
                                    : ''}
                                </div>
                              </div>
                              <div className='form-group ap_select'>
                                <label className='pb-3 w-100'>
                                  <u>Intergration</u>
                                </label>
                                <br />
                                <label>Data Connection</label>
                                <select
                                  className='form-control ap_custom_select'
                                  name='dataConnection'
                                  value={this.state.dataConnection}
                                  onChange={this.handleInputFields}
                                >
                                  <option value='Select'>Select</option>
                                  <option value='XERO'>Xero</option>
                                  <option value='CSV'>CSV</option>
                                </select>
                                <div className='text-danger error-12'>
                                  {this.state.formErrors.dataConnection !== ''
                                    ? this.state.formErrors.dataConnection
                                    : ''}
                                </div>
                                <span className='ap_custom_caret'></span>
                              </div>
                              {this.state.dataConnection !== 'Select' &&
                              this.state.dataConnection == 'XERO' ? (
                                <>
                                  <div
                                    className={
                                      this.state.formErrors.dataConnection !==
                                      ''
                                        ? 'form-group au_select mb-0'
                                        : 'form-group au_select'
                                    }
                                  >
                                    <label>Organization</label>
                                    <button
                                      type='button'
                                      class='au_theme_btn au_back'
                                      style={{ float: 'right', margin: '5px' }}
                                      onClick={this.xeroConnection}
                                    >
                                      Add
                                    </button>
                                    <select
                                      className='form-control ap_custom_select'
                                      name='selectedOrganization'
                                      value={this.state.selectedOrganization}
                                      onChange={this.handleInputFields}
                                    >
                                      <option value=''>Select</option>
                                      {
                                        this.props.tenants && this.props.tenants.map(tenant => (
                                          <option value={tenant.tenantId}>
                                            {tenant.tenantName}
                                          </option>
                                        ))
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
                                      Connect
                                      </button>
                                      <br />
                                      </div>
                                      <div>
                                      <p style={{fontSize: "11px", fontFamily: "Montserrat"}}>{}</p>
                                    </div>*/}
                                  {/* <div className="form-group">
                                      <label htmlFor="URL">URL</label>
                                      <input
                                        disabled
                                        type="text"
                                        className="form-control"
                                        id="URL"
                                        name="url"
                                        value="https://api.xero.com/connections"
                                        // onChange={this.handleInputFields}
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
                                ''
                              )}
                              {this.state.dataConnection !== 'Select' &&
                              this.state.dataConnection == 'CSV' ? (
                                <>
                                  {/* <div className="form-group">
                                      <label htmlFor="api-pass">CSV</label>
                                      <div className="row no-gutters input-group mb-2 mt-1">
                                        <div className="ap_form_upload_message col-12">

                                          <input
                                            type="file"
                                            id="csv_upload"
                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            onChange={this.CSVfileUpload}
                                          />
                                          <label
                                            className="past_pad"
                                            htmlFor="csv_upload"
                                          >
                                            {this.state.csvFileName || "Paste Pad"}
                                          </label>
                                        </div>
                                        <div className="input-group-prepend ap_paste_btn">
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
                                ''
                              )}
                              <div
                                id='pp_list'
                                className='form-group ap_select'
                              >
                                <label className='pb-3 w-100'>
                                  <u>Copy Project</u>
                                </label>
                                <br />
                                <label>Project</label>
                                <select
                                  className='form-control ap_custom_select'
                                  name='project'
                                  value={this.state.project}
                                  onChange={this.handleProjectsSelection}
                                >
                                  <option value=''>Select</option>
                                  {this.state.projects.map((p, i) => {
                                    return (
                                      <option key={i} value={p.guid}>
                                        {p.Name}
                                      </option>
                                    )
                                  })}
                                </select>
                                <span className='ap_custom_caret'></span>
                              </div>
                              <div className='text-danger error-12'>
                                {this.state.formErrors.project !== ''
                                  ? this.state.formErrors.project
                                  : ''}
                              </div>

                              <div className='text-center'>
                                {this.state.dataConnection === 'CSV' ? (
                                  <button
                                    type='button'
                                    className='ap_theme_btn ap_save_btn'
                                    id='SubmitButtonCSV'
                                    onClick={event => {
                                      this.onSaveCSV(
                                        event,
                                        this.props.closeModal
                                      )
                                    }}
                                    onKeyDown={e => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }
                                    }}
                                    onKeyUp={e => {
                                      if (e.keyCode === 13) {
                                        e.stopPropagation()
                                        this.onSaveCSV(e, this.props.closeModal)
                                      }
                                    }}
                                  >
                                    Add
                                  </button>
                                ) : this.state.dataConnection === 'XERO' ? (
                                  <button
                                    type='button'
                                    id='SubmitButtonXERO'
                                    onKeyDown={e => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }
                                    }}
                                    onKeyUp={e => {
                                      if (e.keyCode === 13) {
                                        e.stopPropagation()
                                        this.onSaveXero(
                                          e,
                                          this.props.closeModal
                                        )
                                      }
                                    }}
                                    className='ap_theme_btn ap_save_btn'
                                    onClick={event => {
                                      this.onSaveXero(
                                        event,
                                        this.props.closeModal
                                      )
                                    }}
                                  >
                                    Add
                                  </button>
                                ) : (
                                  ''
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
            </div>
          </Modal.Body>
        </Modal>
        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal('openMessageModal')}
          heading={this.state.message_heading}
        >
          {this.state.message_desc}
        </Message>
      </>
    )
  }
}

export default AddProjectModal
