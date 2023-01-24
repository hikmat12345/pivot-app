import "react-tagsinput/react-tagsinput.css";
import "./AddEditColumn.css";

import React, { Component } from "react";

import $ from "jquery";
import { API } from "aws-amplify";
import GenericModal from "../Generic/Generic";
import { Link } from "react-router-dom";
import Message from "../../Modals/message/message"
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";

class AddEditColumn extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      selectedTemp: "",
      columnsOfTemplate: [], //it contains all columns of one template
      columnData: "", //it contains the data of column which going to edit
      template_list: [],
      tags: [],
      pivot_orignal_data: [],
      openGenericModal: false,

      default: true,
      DataIntegration: false,
      Entry: false,
      Calculation: false,
      PreviousPeriod: false,
      System: false,
      type: "default",
      openMessageModal: false,
      message_heading: "",
      message_desc: "",
      required_messages: [],
      selected: [],
      options: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 },

        { label: "11", value: 11 },
        { label: "12", value: 12 },
        { label: "13", value: 13 },
        { label: "14", value: 14 },
        { label: "15", value: 15 },
        { label: "16", value: 16 },
        { label: "17", value: 17 },
        { label: "18", value: 18 },
        { label: "19", value: 19 },
        { label: "20", value: 20 },

        { label: "21", value: 21 },
        { label: "22", value: 22 },
        { label: "23", value: 23 },
        { label: "24", value: 24 },
        { label: "25", value: 25 },
        { label: "26", value: 26 },
        { label: "27", value: 27 },
        { label: "28", value: 28 },
        { label: "29", value: 29 },
        { label: "30", value: 30 },

        { label: "31", value: 31 },
        { label: "32", value: 32 },
        { label: "33", value: 33 },
        { label: "34", value: 34 },
        { label: "35", value: 35 },
        { label: "36", value: 36 },
        { label: "37", value: 37 },
        { label: "38", value: 38 },
        { label: "39", value: 39 },
        { label: "40", value: 40 },

        { label: "41", value: 41 },
        { label: "42", value: 42 },
        { label: "43", value: 43 },
        { label: "44", value: 44 },
        { label: "45", value: 45 },
        { label: "46", value: 46 },
        { label: "47", value: 47 },
        { label: "48", value: 48 },
        { label: "49", value: 49 },
        { label: "50", value: 50 }
      ],

      //data integration states DI==> Data Integration
      DI_guid: "",
      DI_trackingCodeText: "",
      DI_trackingCategoryText: "",
      DI_addMoveColumn: "",
      DI_columnName: "",
      DI_format: "",
      DI_width: "",
      DI_alignment: "",
      DI_returnData: "",
      DI_trackingCategory: "",
      DI_trackingCode: "",
      DI_hide: false,
      DI_totalThiscolumn: false,

      //Enry states
      entry_guid: "",
      entry_addMoveColumn: "",
      entry_columnName: "",
      entry_format: "",
      entry_width: "",
      entry_alignment: "",

      entry_hide: false,
      entry_periodClear: false,
      entry_totalThiscolumn: false,

      //Previous Period
      pp_guid: "",
      prevPeriod_addMoveColumn: "",
      prevPeriod_columnName: "",
      prevPeriod_format: "",
      prevPeriod_width: "",
      prevPeriod_alignment: "",
      prevPeriod_template: "",
      prevPeriod_colNam: "",

      prevPeriod_hide: false,
      prevPeriod_totalThiscolumn: false,

      //calculations
      cal_guid: "",
      Ca_columnName: "",
      Ca_format: "",
      Ca_width: "",
      Ca_alignment: "",
      Ca_addMoveColumn:"",
      Ca_template: "",
      Ca_columnNameSelect: "",
      ca_hide_check: false,
      ca_total_column_check: false,
      ca_dont_calculate_check: false,

      //System
      system_guid: "",
      system_columnName: "",
      system_width: "",
      system_alignment: "",
      system_hide: false,


      typeFieldObject: "",

      formErrors: {
        //data integration
        DI_addMoveColumn: "",
        DI_columnName: "",
        DI_format: "",
        DI_width: "",
        DI_alignment: "",
        DI_returnData: "",
        DI_trackingCategory: "",
        DI_trackingCode: "",

        //entry
        entry_addMoveColumn: "",
        entry_columnName: "",
        entry_format: "",
        entry_width: "",
        entry_alignment: "",

        //previous period
        prevPeriod_addMoveColumn: "",
        prevPeriod_columnName: "",
        prevPeriod_format: "",
        prevPeriod_width: "",
        prevPeriod_alignment: "",
        prevPeriod_template: "",
        prevPeriod_colNam: "",
        //calculations
        Ca_width: "",
        Ca_columnName: "",
        Ca_format: "",
        Ca_alignment: "",
        Ca_template: "",
        Ca_columnNameSelect: "",
        //system
        system_columnName: "",
        system_width: "",
        system_alignment: ""
      }
    };
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      // columnsOfTemplate: this.props.allColumns,
      template_list: this.props.templateList, //contains all templates of a project
      selectedTemp: this.props.selectedTemp,
      columnData: nextProps.editColumn ? this.props.columnData : "",//it contains the data of column which going to edit
      pivot_orignal_data: this.props.orignalData,
      required_messages: this.props.required_messages
    });
    if (!nextProps.editColumn) {
      this.setState({
        DI_returnData:
          this.props.currentproject && this.props.currentproject.Connection
            ? this.props.currentproject.Connection
            : ""
      });
    }

    if (
      this.props.columnData &&
      this.props.columnData.Type === "System" &&
      nextProps.editColumn
    ) {
      this.setState({
        type: "System",
        default: false,
        DataIntegration: false,
        Entry: false,
        Calculation: false,
        PreviousPeriod: false,
        System: true,
        system_guid: this.props.columnData.guid || "",
        system_columnName: this.props.columnData.ColumnName || "",
        system_width: this.props.columnData.Width || "",
        system_alignment: this.props.columnData.Alignment || "",
        system_hide: this.props.columnData.Hide || false
      });
    } else if (
      this.props.columnData &&
      this.props.columnData.Type === "PreviousPeriod" &&
      nextProps.editColumn
    ) {
      this.setState({
        type: "PreviousPeriod",
        default: false,
        DataIntegration: false,
        Entry: false,
        Calculation: false,
        PreviousPeriod: true,
        System: false,
        pp_guid: this.props.columnData.guid || "",
        prevPeriod_columnName: this.props.columnData.ColumnName || "",
        prevPeriod_format: this.props.columnData.Format || "",
        prevPeriod_width: this.props.columnData.Width || "",
        prevPeriod_alignment: this.props.columnData.Alignment || "",
        prevPeriod_hide: this.props.columnData.Hide || false,
        prevPeriod_totalThiscolumn: this.props.columnData.TotalColumn || false
      });
    } else if (
      this.props.columnData &&
      this.props.columnData.Type === "Calculation" &&
      nextProps.editColumn
    ) {
      this.setState({
        type: "Calculation",
        default: false,
        DataIntegration: false,
        Entry: false,
        Calculation: true,
        PreviousPeriod: false,
        System: false,
        cal_guid: this.props.columnData.guid || "",
        Ca_columnName: this.props.columnData.ColumnName || "",
        Ca_format: this.props.columnData.Format || "",
        Ca_width: this.props.columnData.Width || "",
        Ca_alignment: this.props.columnData.Alignment || "",
        tags: this.props.columnData.Formula || [],
        ca_hide_check: this.props.columnData.Hide || false,
        ca_total_column_check: this.props.columnData.TotalColumn || false,
        ca_dont_calculate_check: this.props.columnData.DoNotCalculate || false
      });
    } else if (
      this.props.columnData &&
      this.props.columnData.Type === "Entry" &&
      nextProps.editColumn
    ) {
      this.setState({
        type: "Entry",
        default: false,
        DataIntegration: false,
        Entry: true,
        Calculation: false,
        PreviousPeriod: false,
        System: false,
        entry_guid: this.props.columnData.guid || "",
        entry_columnName: this.props.columnData.ColumnName || "",
        entry_format: this.props.columnData.Format || "",
        entry_width: this.props.columnData.Width || "",
        entry_alignment: this.props.columnData.Alignment || "",
        entry_hide: this.props.columnData.Hide || false,
        entry_periodClear: this.props.columnData.PeriodClear || false,
        entry_totalThiscolumn: this.props.columnData.TotalColumn || false
      });
    } else if (
      this.props.columnData &&
      this.props.columnData.Type === "DataIntegration" &&
      nextProps.editColumn
    ) {
      this.setState({
        type: "DataIntegration",
        default: false,
        DataIntegration: true,
        Entry: false,
        Calculation: false,
        PreviousPeriod: false,
        System: false,
        DI_guid: this.props.columnData.guid || "",
        DI_returnData: this.props.columnData.API[0].APICall,
        DI_trackingCategoryText: this.props.columnData.API[0].TrackingCat || "",
        DI_trackingCategory: this.props.columnData.API[0].TrackingCatID || "",
        DI_trackingCodeText: this.props.columnData.API[0].TrackingCode || "",
        DI_trackingCode: this.props.columnData.API[0].TrackingCodeID || "",

        DI_columnName: this.props.columnData.ColumnName || "",
        DI_format: this.props.columnData.Format || "",
        DI_width: this.props.columnData.Width || "",
        DI_alignment: this.props.columnData.Alignment || "",
        DI_hide: this.props.columnData.Hide || false,
        DI_totalThiscolumn: this.props.columnData.TotalColumn || false
      });
    }
  };
  componentDidMount() {
    if(this.state.DataIntegration){
      this.typeFieldObject.focus();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {   
    let { DataIntegration, Entry, Calculation, PreviousPeriod, System } = this.state;
    if(document.getElementById('type_add_edit') &&
      (prevState.DataIntegration !== DataIntegration ||
      prevState.Entry !== Entry ||
      prevState.Calculation !== Calculation ||
      prevState.PreviousPeriod !== PreviousPeriod ||
      prevState.System !== System)){
      document.getElementById('type_add_edit').focus();
    }
  }

  openModal = name => {
    if (name === "openGenericModal") {
      this.setState({ [name]: true });
    }
  };
  closeGenericModal = async name => {
    if (name === "closeAll") {
      await this.clearAllStates();
      this.setState({ openGenericModal: false });
      this.props.closeModal();
    } else {
      this.setState({ [name]: false });
    }
  };
  clearAllStates = async () => {
    await this.setState({
      columnsOfTemplate: [],
      selectedTemp: "",
      columnData: "",
      //data integration states DI==> Data Integration
      DI_guid: "",
      DI_trackingCodeText: "",
      DI_trackingCategoryText: "",
      DI_addMoveColumn: "",
      DI_columnName: "",
      DI_format: "",
      DI_width: "",
      DI_alignment: "",
      DI_returnData: "",
      DI_trackingCategory: "",
      DI_trackingCode: "",
      DI_hide: false,
      DI_totalThiscolumn: false,
      //Enry states
      entry_guid: "",
      entry_addMoveColumn: "",
      entry_columnName: "",
      entry_format: "",
      entry_width: "",
      entry_alignment: "",

      entry_hide: false,
      entry_periodClear: false,
      entry_totalThiscolumn: false,

      //Previous Period
      pp_guid: "",
      prevPeriod_addMoveColumn: "",
      prevPeriod_columnName: "",
      prevPeriod_format: "",
      prevPeriod_width: "",
      prevPeriod_alignment: "",
      prevPeriod_template: "",
      prevPeriod_colNam: "",

      prevPeriod_hide: false,
      prevPeriod_totalThiscolumn: false,

      //calculations
      cal_guid: "",
      Ca_columnName: "",
      Ca_format: "",
      Ca_width: "",
      Ca_alignment: "",
      Ca_template: "",
      Ca_columnNameSelect: "",
      tags: [],
      ca_hide_check: false,
      ca_total_column_check: false,
      ca_dont_calculate_check: false,

      //System
      system_guid: "",
      system_columnName: "",
      system_width: "",
      system_alignment: "",
      system_hide: false,

      default: true,
      DataIntegration: false,
      Entry: false,
      Calculation: false,
      PreviousPeriod: false,
      System: false,
      type: "default",

      formErrors: {
        //data integration
        DI_addMoveColumn: "",
        DI_columnName: "",
        DI_format: "",
        DI_width: "",
        DI_alignment: "",
        DI_returnData: "",
        DI_trackingCategory: "",
        DI_trackingCode: "",

        //entry
        entry_addMoveColumn: "",
        entry_columnName: "",
        entry_format: "",
        entry_width: "",
        entry_alignment: "",

        //previous period
        prevPeriod_addMoveColumn: "",
        prevPeriod_columnName: "",
        prevPeriod_format: "",
        prevPeriod_width: "",
        prevPeriod_alignment: "",
        prevPeriod_template: "",
        prevPeriod_colNam: "",
        //calculations
        Ca_width: "",
        Ca_columnName: "",
        Ca_format: "",
        Ca_alignment: "",
        Ca_template: "",
        Ca_columnNameSelect: "",
        //system
        system_columnName: "",
        system_width: "",
        system_alignment: ""
      }
    });
  };
  handleChangeType = async e => {
    let value = e.target.value;
    this.setState({
      default: false,
      DataIntegration: false,
      Entry: false,
      Calculation: false,
      PreviousPeriod: false,
      System: false,
      type: "default"
    });
    this.setState({ type: value, [value]: true });
  };
  handleChangeTag = tags => {
      this.setState({ tags });
  
  };
  closeModal = async (name) => {
    if(name == "openMessageModal"){
      this.setState({
        openMessageModal: false
      })
    }
    else{
    await this.clearAllStates();
    await this.props.closeModal();
    this.setState({
      [name]: false
    })
    }
  };

  validateField = async (name, value, event) => {
    var formErrors = this.state.formErrors;
    switch (name) {
      case "type":
        if (value === "Select") {
          formErrors.type = "This Field is Required.";
        } else {
          formErrors.type = "";
          this.handleChangeType(event);
        }
        break;
      // data integration
      case "DI_columnName":
        if (value.length < 1) {
          formErrors.DI_columnName = "This Field is Required.";
        } else {
          formErrors.DI_columnName = "";
        }
        break;
      // case "DI_addMoveColumn":
      //   if (!value) {
      //     formErrors.DI_addMoveColumn = "This Field is Required.";
      //   } else {
      //     formErrors.DI_addMoveColumn = "";
      //   }

      //   break;
      case "DI_format":
        if (!value) {
          formErrors.DI_format = "This Field is Required.";
        } else {
          formErrors.DI_format = "";
        }

        break;
      // case "DI_alignment":
      //   if (!value) {
      //     formErrors.DI_alignment = "This Field is Required.";
      //   } else {
      //     formErrors.DI_alignment = "";
      //   }

      // break;
      // case "DI_returnData":
      //   if (!value) {
      //     formErrors.DI_returnData = "This Field is Required.";
      //   } else {
      //     formErrors.DI_returnData = "";
      //   }

      //   break;
      // case "DI_trackingCategory":
      //   if (!value) {
      //     formErrors.DI_trackingCategory = "This Field is Required.";
      //   } else {
      //     formErrors.DI_trackingCategory = "";
      //   }

      //   break;
      // case "DI_trackingCode":
      //   if (!value) {
      //     formErrors.DI_trackingCode = "This Field is Required.";
      //   } else {
      //     formErrors.DI_trackingCode = "";
      //   }

      //   break;
      case "DI_width":
        if (value.length < 1) {
          formErrors.DI_width = "This Field is Required.";
        } else {
          formErrors.DI_width = "";
        }
        break;
      // Entry
      // case "entry_addMoveColumn":
      //   if (!value) {
      //     formErrors.entry_addMoveColumn = "This Field is Required.";
      //   } else {
      //     formErrors.entry_addMoveColumn = "";
      //   }

      //   break;
      case "entry_columnName":
        if (value.length < 1) {
          formErrors.entry_columnName = "This Field is Required.";
        } else {
          formErrors.entry_columnName = "";
        }
        break;
      case "entry_format":
        if (!value) {
          formErrors.entry_format = "This Field is Required.";
        } else {
          formErrors.entry_format = "";
        }

        break;
      // case "entry_alignment":
      //   if (!value) {
      //     formErrors.entry_alignment = "This Field is Required.";
      //   } else {
      //     formErrors.entry_alignment = "";
      //   }

      //   break;
      case "entry_width":
        if (value.length < 1) {
          formErrors.entry_width = "This Field is Required.";
        } else {
          formErrors.entry_width = "";
        }
        break;
      //Previous Period
      // case "prevPeriod_addMoveColumn":
      //   if (!value) {
      //     formErrors.prevPeriod_addMoveColumn = "This Field is Required.";
      //   } else {
      //     formErrors.prevPeriod_addMoveColumn = "";
      //   }

      //   break;
      case "prevPeriod_columnName":
        if (value.length < 1) {
          formErrors.prevPeriod_columnName = "This Field is Required.";
        } else {
          formErrors.prevPeriod_columnName = "";
        }
        break;
      case "prevPeriod_format":
        if (!value) {
          formErrors.prevPeriod_format = "This Field is Required.";
        } else {
          formErrors.prevPeriod_format = "";
        }

        break;
      // case "prevPeriod_alignment":
      //   if (!value) {
      //     formErrors.prevPeriod_alignment = "This Field is Required.";
      //   } else {
      //     formErrors.prevPeriod_alignment = "";
      //   }

      //   break;
      case "prevPeriod_width":
        if (value.length < 1) {
          formErrors.prevPeriod_width = "This Field is Required.";
        } else {
          formErrors.prevPeriod_width = "";
        }
        break;
      // case "prevPeriod_template":
      //   if (!value) {
      //     formErrors.prevPeriod_template = "This Field is Required.";
      //   } else {
      //     formErrors.prevPeriod_template = "";
      //   }

      //   break;
      // case "prevPeriod_colNam":
      //   if (!value) {
      //     formErrors.prevPeriod_colNam = "This Field is Required.";
      //   } else {
      //     formErrors.prevPeriod_colNam = "";
      //   }

      //   break;
      //System

      case "system_columnName":
        if (value.length < 1) {
          formErrors.system_columnName = "This Field is Required.";
        } else {
          formErrors.system_columnName = "";
        }
        break;

      // case "system_alignment":
      //   if (!value) {
      //     formErrors.system_alignment = "This Field is Required.";
      //   } else {
      //     formErrors.system_alignment = "";
      //   }

      //   break;
      case "system_width":
        if (value.length < 1) {
          formErrors.system_width = "This Field is Required.";
        } else {
          formErrors.system_width = "";
        }
        break;
      //Calculation Errors
      // case "Ca_addMoveColumn":
      //   if (!value) {
      //     formErrors.Ca_addMoveColumn = "This Field is Required.";
      //   } else {
      //     formErrors.Ca_addMoveColumn = "";
      //   }

      //   break;
      case "Ca_columnName":
        if (!value) {
          formErrors.Ca_columnName = "This Field is Required.";
        } else {
          formErrors.Ca_columnName = "";
        }

        break;
      case "Ca_width":
        if (value.length < 1) {
          formErrors.Ca_width = "This Field is Required.";
        } else {
          formErrors.Ca_width = "";
        }
        break;
      case "Ca_format":
        if (!value) {
          formErrors.Ca_format = "This Field is Required.";
        } else {
          formErrors.Ca_format = "";
        }

        break;

        // case "Ca_alignment":
        //   if (!value) {
        //     formErrors.Ca_alignment = "This Field is Required.";
        //   } else {
        //     formErrors.Ca_alignment = "";
        //   }

        //   break;

        case "Ca_template":
          if (!value) {
            formErrors.Ca_template = "This Field is Required.";
          } else {
            formErrors.Ca_template = "";
          }

          break;

        case "Ca_columnNameSelect":
          if (!value) {
            formErrors.Ca_columnNameSelect = "This Field is Required.";
          } else {
            formErrors.Ca_columnNameSelect = "";
          }

        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };
  //Data Integration handle fields
  handleFieldChange_DI = e => {
    var fieldName = e.target.name;
    var fieldValue = e.target.value;

    if (fieldName == "DI_trackingCategory") {
      var a = document.getElementById("tracking-cat");
      var text = a.options[a.selectedIndex].text;
      this.setState({
        DI_trackingCategoryText: text,
        DI_trackingCategory: fieldValue
      });
      this.validateField(fieldName, fieldValue, e);
    } else if (fieldName == "DI_trackingCode") {
      var tc = document.getElementById("track-code");
      var text = tc.options[tc.selectedIndex].text;
      this.setState({
        DI_trackingCodeText: text,
        DI_trackingCode: fieldValue
      });
      this.validateField(fieldName, fieldValue, e);
    } else {
      this.setState({ [fieldName]: fieldValue });
      this.validateField(fieldName, fieldValue, e);
    }
  };
  handleSelectWidth_DI = v => {
    this.setState({ DI_width: v.target.value });
    this.validateField("DI_width", v.target.value);
  };
  //entry handle fields
  handleFieldChange_entry = async e => {
      
    var fieldName = e.target.name;
    var fieldValue = e.target.value;
     
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue, e);
  };
  handleSelectWidth_entry = v => {
    this.setState({ entry_width: v.target.value });
    this.validateField("entry_width", v.target.value);
  };
  //Previous Period
  handleFieldChange_PrevPeriod = e => {
    var fieldName = e.target.name;
    var fieldValue = e.target.value;

    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue, e);
  };
  handleSelectWidth_PrevPeriod = v => {
    this.setState({ prevPeriod_width: v.target.value });
    this.validateField("prevPeriod_width", v.target.value);
  };
  handleTemplateSelect_Preperiod = async e => {
    var fieldName = e.target.name; //Ca_template
    var fieldValue = e.target.value; //guid of template
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue, e);
     var columnstmp=this.props.templateList.find(t=>t.guid===fieldValue)
    if (fieldValue) {
      this.setState({ isLoading: true });
      let tenantguids = localStorage.getItem("tenantguid");
      await API.post("pivot", "/getColumnByTemplateGuid", {
        body: { guid: columnstmp.Columns, tenantguid: tenantguids }
      })
        .then(data => {
          // toast.success("Columns Fetched Successfully");
          let filteredData = data.filter(d => d.Type !== "System");
          this.setState({ columnsOfTemplate: filteredData });
        })
        .catch(err => {
          toast.error("Columns Fetched Failed");
        });
      this.setState({ isLoading: false });
    }
  };
  //calculation
  handleFieldChange_Ca = e => {
    var fieldName = e.target.name;
    var fieldValue = e.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue, e);
  };

  handleSelectWidth_Ca = v => {
    this.setState({ Ca_width: v.target.value });
    this.validateField("Ca_width", v.target.value);
  };
  //when template is selected then get column by template guid
  handleTemplateSelect_Ca = async e => {
    var fieldName = e.target.name; //Ca_template
    var fieldValue = e.target.value; //guid of template
    console.log(this.state.template_list, "-------------list of all tlemplates")
    var tem = this.state.template_list.find(u => u.guid == fieldValue)
    this.setState({ [fieldName]: fieldValue });

    this.validateField(fieldName, fieldValue, e);

    if (fieldValue) {
      this.setState({ isLoading: true });
      let tenantguids = localStorage.getItem("tenantguid");
      await API.post("pivot", "/getColumnByTemplateGuid", {
        body: { guid: tem.Columns, tenantguid: tenantguids }
      })
        .then(data => {
          // toast.success("Columns Fetched Successfully");
          let filteredData = data.filter(d => d.Type !== "System");
          this.setState({ columnsOfTemplate: filteredData });
        })
        .catch(err => {
          toast.error("Columns Fetched Failed");
        });
      this.setState({ isLoading: false });
    }
  };
  //System
  handleFieldChange_System = e => {
    var fieldName = e.target.name;
    var fieldValue = e.target.value;

    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue, e);
  };
  handleSelectWidth_System = v => {
    this.setState({ system_width: v.target.value });
    this.validateField("system_width", v.target.value);
  };
  handleCheckbox = async e => {
    let name = e.target.name;
    await this.setState({ [name]: e.target.checked });
  };

  AddNewColumnData = async (guid) => {
    var columnObject = {
       AmountValue: "0",
              TextValue: null,
      "ColumnGuid": guid
    };
    var newArray = [];
    this.state.pivot_orignal_data.map(pod => {
      if (pod.Type !== "Blank") {
        pod.Columns.push(columnObject)
      }
    })
    var lofdata = Math.ceil(this.state.pivot_orignal_data.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = this.state.pivot_orignal_data.slice(i, i + 20);
    await API.post("pivot", "/copypivotdata", {
      body: {
        pivotdata: arraytosend
      }
    }).then(data => {
      // toast.success("data added")
    }).catch(err => {
      toast.error("copydata request failed");
    });
  }
    console.log(this.state.pivot_orignal_data, '======<<<<<<=======newArray')
  }

  findGuid = ({ type = "" }) => {
    if(this.props.columnData !== undefined && this.props.columnData !== "") {
      return this.props.columnData.guid;
    } else {
      if(type === "DataIntegration")
        return this.state.DI_guid ? this.state.DI_guid : null;
      if(type === "Entry")
        return this.state.entry_guid ? this.state.entry_guid : null;
      if(type === "Calculation")
        return this.state.cal_guid ? this.state.cal_guid : null;
      if(type === "PreviousPeriod")
        return this.state.pp_guid ? this.state.pp_guid : null;
      if(type === "System")
        return this.state.system_guid ? this.state.system_guid : null;
    }
  }

  // Add/Edit Data Integration Handler
  onSaveDataIntegration = async e => {
    e.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (this.props.editColumn) {
    //   if (!this.state.DI_addMoveColumn) {
    //     formErrors.DI_addMoveColumn = "This Field is Required.";
    //   }
    // } else {
    //   formErrors.DI_addMoveColumn = "";
    // }
    if (!this.state.DI_columnName) {
      formErrors.DI_columnName = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.DI_format) {
      formErrors.DI_format = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.DI_width) {
      formErrors.DI_width = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (!this.state.DI_returnData) {
    //   formErrors.DI_returnData = "This Field is Required.";
    // }
    // if (!this.state.DI_trackingCategory) {
    //   formErrors.DI_trackingCategory = "This Field is Required.";
    // }
    // if (!this.state.DI_trackingCode) {
    //   formErrors.DI_trackingCode = "This Field is Required.";
    // }
    // if (!this.state.DI_alignment) {
    //   formErrors.DI_alignment = "This Field is Required.";
    // }

    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      // !formErrors.DI_addMoveColumn &&
      !formErrors.DI_columnName &&
      !formErrors.DI_format &&
      !formErrors.DI_width

      // !formErrors.DI_returnData &&
      // !formErrors.DI_trackingCategory &&
      // !formErrors.DI_trackingCode &&
      // !formErrors.DI_alignment
    ) {
      let {
        type,
        DI_addMoveColumn,
        DI_columnName,
        DI_format,
        DI_width,
        DI_alignment,
        DI_returnData,
        DI_trackingCategory, //select option value
        DI_trackingCode, //select option value
        DI_trackingCodeText, // //select option text
        DI_hide,
        DI_totalThiscolumn,
        DI_trackingCategoryText // //select option text
      } = this.state;

      await this.props.isLoading(true);

      //call api here
      let tenantguid = localStorage.getItem("tenantguid");
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;
      let updateTemp = false;
      let columnData = "";
      await API.post("pivot", "/addeditColumn", {
        body: {
          Type: "DataIntegration",
          guid: this.findGuid({ type: "DataIntegration" }),
          API: [
            {
              APICall: DI_returnData,
              TrackingCat: DI_trackingCategoryText || null,
              TrackingCatID: DI_trackingCategory || null,
              TrackingCode: DI_trackingCodeText || null,
              TrackingCodeID: DI_trackingCode || null
            }
          ],
          ColumnName: DI_columnName.trim(),
          Format: DI_format,
          Width: DI_width,
          Alignment: DI_alignment || null,
          Hide: DI_hide,
          TotalColumn: DI_totalThiscolumn,
          TemplateGuid: selectedTempGuid,
          TenantGuid: tenantguid
        }
      })
        .then(async data => {
          columnData = data;
          updateTemp = true;
          console.log(">>>>add edit column data integration", data)
          let check = this.props.editColumn ? "Edited" : "Added";
          // toast.success("Column" + check + "Successfully");
        })
        .catch(err => {
          let checkErr = this.props.editColumn ? "Editing" : "Adding";
          toast.error(`There is an Error while ${checkErr} Column`);
        });
      //update template to newly created column
      if (
        updateTemp &&
        columnData &&
        columnData.guid &&
        !this.props.editColumn
      ) {
        let columns = this.state.selectedTemp.Columns;
        var arr=[];

        if(this.state.DI_addMoveColumn==="addToEnd" ||this.state.DI_addMoveColumn===""){
          
          columns.push(columnData.guid) 
             arr=columns;
     
   }else{

        columns.map(a=>{


        if(this.state.DI_addMoveColumn === a){
        arr.push(columnData.guid);
        }
        arr.push(a);
        })
      }
        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: arr
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }
      if (this.props.editColumn == false) {
        await this.AddNewColumnData(columnData.guid);
      }

      //update dashboaed
      await this.props.gettemplateanddata(selectedTempGuid);

      await this.closeModal();

      await this.props.isLoading(false);
    }
    // await this.clearAllStates();
  };


  // Add/Edit Entry Handler
  onSaveEntry = async e => {
    e.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
    }
    // if (this.props.editColumn) {
    //   if (!this.state.entry_addMoveColumn) {
    //     formErrors.entry_addMoveColumn = "This Field is Required.";
    //   }
    // } else {
    //   formErrors.entry_addMoveColumn = "";
    // }
    if (!this.state.entry_columnName) {
      formErrors.entry_columnName = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.entry_width) {
      formErrors.entry_width = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.entry_format) {
      formErrors.entry_format = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (!this.state.entry_alignment) {
    //   formErrors.entry_alignment = "This Field is Required.";
    // }

    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      // !formErrors.entry_addMoveColumn &&
      !formErrors.entry_columnName &&
      !formErrors.entry_format &&
      !formErrors.entry_width
      // !formErrors.entry_alignment
    ) {
      let {
        type,
        entry_addMoveColumn,
        entry_columnName,
        entry_format,
        entry_width,
        entry_alignment,
        entry_hide,
        entry_periodClear,
        entry_totalThiscolumn
      } = this.state;
      await this.props.isLoading(true);

      //call api here
      let tenantguid = localStorage.getItem("tenantguid");
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;
      let updateTemp = false;
      let columnData = "";
      await API.post("pivot", "/addeditColumn", {
        body: {
          Type: "Entry",
          guid: this.findGuid({ type: "Entry" }),
          ColumnName: entry_columnName.trim(),
          Format: entry_format,
          Width: entry_width,
          Alignment: entry_alignment || null,
          Hide: entry_hide,
          PeriodClear: entry_periodClear,
          TotalColumn: entry_totalThiscolumn,
          TemplateGuid: selectedTempGuid,
          TenantGuid: tenantguid
        }
      })
        .then(async data => {
          columnData = data;
          updateTemp = true;
        
          let check = this.props.editColumn ? "Edited" : "Added";
          // toast.success("Column" + check + "Successfully");
        })
        .catch(err => {
          let checkErr = this.props.editColumn ? "Editing" : "Adding";
          toast.error("There is an Error while " + checkErr + "Column");
        });

      //update template to newly created column
      if (
        updateTemp &&
        columnData &&
        columnData.guid &&
        !this.props.editColumn
      ) {
          //add column update template case
        let columns = this.state.selectedTemp.Columns;
        var arr=[];
        
          if(this.state.entry_addMoveColumn==="addToEnd" || this.state.entry_addMoveColumn===""){
          
                 columns.push(columnData.guid) 
                    arr=columns;
            
          }else{
              
        columns.map(a=>{


        if(this.state.entry_addMoveColumn === a){
        arr.push(columnData.guid);
        }
        arr.push(a);
        })
          }


        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: arr
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }else if(updateTemp &&
        columnData &&
        columnData.guid &&
        this.props.editColumn){
          
           //edit column update template case
           let columns = this.state.selectedTemp.Columns;
        var arr=[];
        
          if(this.state.entry_addMoveColumn==="addToEnd"){
         
                 columns.push(columnData.guid) 
                    arr=columns;
            
          }else{
             
        columns.map(a=>{


        if(this.state.entry_addMoveColumn === a){
        arr.push(columnData.guid);
        }
            if(columnData.guid!==a){
        arr.push(a);
            
            }
        })
          }


        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: arr
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
          
      }
      if (this.props.editColumn == false) {
        await this.AddNewColumnData(columnData.guid);
      }
      await this.props.gettemplateanddata(selectedTempGuid);

      await this.closeModal();

      await this.props.isLoading(false);
    }
    // await this.clearAllStates();
  };
  // Add/Edit Calculation Handler

  onSaveCalculation = async e => {
    e.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (this.props.editColumn) {
    //   if (!this.state.Ca_addMoveColumn) {
    //     formErrors.Ca_addMoveColumn = "This Field is Required.";
    //   }
    // } else {
    //   formErrors.Ca_addMoveColumn = "";
    // }
    if (!this.state.Ca_columnName) {
      formErrors.Ca_columnName = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.Ca_format) {
      formErrors.Ca_format = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (!this.state.Ca_alignment) {
    //   formErrors.Ca_alignment = "This Field is Required.";
    // }
    // if (!this.state.Ca_template) {
    //   formErrors.Ca_template = "This Field is Required.";
    // }
    // if (!this.state.Ca_columnNameSelect) {
    //   formErrors.Ca_columnNameSelect = "This Field is Required.";
    // }
    if (!this.state.Ca_width) {
      formErrors.Ca_width = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }

    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      !formErrors.Ca_columnName &&
      !formErrors.Ca_format &&
      // !formErrors.Ca_alignment &&
      // !formErrors.Ca_template &&
      !formErrors.Ca_width
      // !formErrors.Ca_columnNameSelect &&
      // !formErrors.Ca_addMoveColumn
    ) {
      let {
        Ca_columnName,
        Ca_format,
        Ca_alignment,
        Ca_template,
        Ca_addMoveColumn,
        Ca_columnNameSelect,
        tags,
        Ca_width,
        ca_hide_check,
        ca_total_column_check,
        ca_dont_calculate_check
      } = this.state;
      await this.props.isLoading(true);

      //call api here
      let tenantguid = localStorage.getItem("tenantguid");
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;
      let updateTemp = false;
      let columnData = "";
      await API.post("pivot", "/addeditColumn", {
        body: {
          guid: this.findGuid({ type: "Calculation" }),
          Type: "Calculation",
          ColumnName: Ca_columnName.trim(),
          Format: Ca_format,
          Width: Ca_width,
          Alignment: Ca_alignment || null,
          Formula: tags.length ? tags : null,
          Hide: ca_hide_check,
          TotalColumn: ca_total_column_check,
          DoNotCalculate: ca_dont_calculate_check,
          TemplateGuid: selectedTempGuid,
          TenantGuid: tenantguid
        }
      })
        .then(async data => {
          columnData = data;
          updateTemp = true;
          // console.log(">>>>add edit column calc", data)
          let check = this.props.editColumn ? "Edited" : "Added";
          // toast.success("Column" + check + "Successfully");
        })
        .catch(err => {
          let checkErr = this.props.editColumn ? "Editing" : "Adding";
          toast.error("There is an Error while " + checkErr + "Column");
        });
      //update template to newly created column
      if (
        updateTemp &&
        columnData &&
        columnData.guid &&
        !this.props.editColumn
      ) {
        let columns = this.state.selectedTemp.Columns;
        var arr=[];

        if(this.state.Ca_addMoveColumn==="addToEnd" || this.state.Ca_addMoveColumn===""){
          
          columns.push(columnData.guid) 
             arr=columns;
     
   }else{

        columns.map(a=>{


        if(this.state.Ca_addMoveColumn === a){
        arr.push(columnData.guid);
        }
        arr.push(a);
        })
      }
        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: arr
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }
      if (this.props.editColumn == false) {
        await this.AddNewColumnData(columnData.guid);
      }
      await this.props.gettemplateanddata(selectedTempGuid);

      await this.closeModal();

      await this.props.isLoading(false);
    }
    // await this.clearAllStates();
  };
  // Add/Edit Previous Period Handler

  onSavePreviousPeriod = async e => {
    e.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (this.props.editColumn) {
    //   if (!this.state.prevPeriod_addMoveColumn) {
    //     formErrors.prevPeriod_addMoveColumn = "This Field is Required.";
    //   }
    // } else {
    //   formErrors.prevPeriod_addMoveColumn = "";
    // }
    if (!this.state.prevPeriod_columnName) {
      formErrors.prevPeriod_columnName = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.prevPeriod_width) {
      formErrors.prevPeriod_width = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.prevPeriod_format) {
      formErrors.prevPeriod_format = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    // if (!this.state.prevPeriod_alignment) {
    //   formErrors.prevPeriod_alignment = "This Field is Required.";
    // }
    // if (!this.state.prevPeriod_template) {
    //   formErrors.prevPeriod_template = "This Field is Required.";
    // }
    // if (!this.state.prevPeriod_colNam) {
    //   formErrors.prevPeriod_colNam = "This Field is Required.";
    // }

    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      // !formErrors.prevPeriod_addMoveColumn &&
      !formErrors.prevPeriod_columnName &&
      !formErrors.prevPeriod_format &&
      !formErrors.prevPeriod_width
      // !formErrors.prevPeriod_alignment &&
      // !formErrors.prevPeriod_template &&
      // !formErrors.prevPeriod_colNam
    ) {
      let {
        type,
        prevPeriod_addMoveColumn,
        prevPeriod_columnName,
        prevPeriod_format,
        prevPeriod_width,
        prevPeriod_alignment,
        prevPeriod_hide,
        prevPeriod_totalThiscolumn,
        prevPeriod_template,
        prevPeriod_colNam
      } = this.state;
      await this.props.isLoading(true);

      //call api here
      let tenantguid = localStorage.getItem("tenantguid");
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;
      let updateTemp = false;
      let columnData = "";
      await API.post("pivot", "/addeditColumn", {
        body: {
          Type: "PreviousPeriod",
          guid: this.findGuid({ type: "PreviousPeriod" }),
          ColumnName: prevPeriod_columnName.trim(),
          Format: prevPeriod_format,
          Width: prevPeriod_width,
          Alignment: prevPeriod_alignment || null,
          Hide: prevPeriod_hide,
          TotalColumn: prevPeriod_totalThiscolumn,
          TemplateGuid: selectedTempGuid,
          TenantGuid: tenantguid
        }
      })
        .then(async data => {
          columnData = data;
          updateTemp = true;
          // console.log(">>>>add edit column Previous Peroid", data);
          let check = this.props.editColumn ? "Edited" : "Added";
          // toast.success("Column" + check + " Successfully");
        })
        .catch(err => {
          let checkErr = this.props.editColumn ? "Editing" : "Adding";
          toast.error('There is an Error while' + checkErr + 'Column');
        });

      //update template to newly created column
      if (
        updateTemp &&
        columnData &&
        columnData.guid &&
        !this.props.editColumn
      ) {
        let columns = this.state.selectedTemp.Columns;
        var arr=[];


        if(this.state.prevPeriod_addMoveColumn==="addToEnd" || this.state.prevPeriod_addMoveColumn===""){
          
          columns.push(columnData.guid) 
             arr=columns;
     
   }else{

        columns.map(a=>{


        if(this.state.prevPeriod_addMoveColumn === a){
        arr.push(columnData.guid);
        }
        arr.push(a);
        })
      }
        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: arr
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }
      if (this.props.editColumn == false) {
        await this.AddNewColumnData(columnData.guid);
      }
      await this.props.gettemplateanddata(selectedTempGuid);

      await this.closeModal();

      await this.props.isLoading(false);
    }
    await this.clearAllStates();
  };
  // Add/Edit System Handler

  onSaveSystem = async e => {
    e.preventDefault();
    var formErrors = this.state.formErrors;
    if (!this.state.type) {
      formErrors.type = "This Field is Required.";
    }

    if (!this.state.system_columnName) {
      formErrors.system_columnName = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }
    if (!this.state.system_width) {
      formErrors.system_width = "This Field is Required.";
      this.state.required_messages.map(e => e.ID == 1 ?
        this.setState({
          message_desc: e.Desc,
          message_heading: e.Heading,
          openMessageModal: true
        }) : '')
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
    }

    // if (!this.state.system_alignment) {
    //   formErrors.system_alignment = "This Field is Required.";
    // }

    this.setState({
      formErrors: formErrors
    });
    if (
      !formErrors.type &&
      !formErrors.system_columnName &&
      !formErrors.system_width
      // !formErrors.system_alignment
    ) {
      let {
        type,
        system_columnName,
        system_width,
        system_alignment,
        system_hide
      } = this.state;

      // await this.setState({
      //   isLoading: true
      // });
      await this.props.isLoading(true);

      //call api here
      let tenantguid = localStorage.getItem("tenantguid");
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;
      let updateTemp = false;
      let columnData = "";
      await API.post("pivot", "/addeditColumn", {
        body: {
          guid: this.findGuid({ type: "System" }),
          Type: "System",
          ColumnName: system_columnName.trim(),
          Width: system_width,
          Hide: system_hide,
          Alignment: system_alignment || null,
          TemplateGuid: selectedTempGuid,
          TenantGuid: tenantguid
        }
      })
        .then(async data => {
          columnData = data;
          updateTemp = true;
          // console.log(">>>>add edit column system", data);
          let check = this.props.editColumn ? "Edited" : "Added";
          // toast.success('Column ' + check + 'Successfully');
        })
        .catch(err => {
          let checkErr = this.props.editColumn ? "Editing" : "Adding";
          toast.error('There is an Error while' + checkErr + ' Column');
        });
      //update template to newly created column
      if (
        updateTemp &&
        columnData &&
        columnData.guid &&
        !this.props.editColumn
      ) {
        let columns = this.state.selectedTemp.Columns;
        columns.push(columnData.guid);

        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: columns
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }
      if (this.props.editColumn == false) {
        await this.AddNewColumnData(columnData.guid);
      }
      await this.props.gettemplateanddata(selectedTempGuid);

      await this.closeModal();

      // await this.setState({
      //   isLoading: false
      // });
      await this.props.isLoading(false);
    }
    await this.clearAllStates();
  };
  onDeleteColumnData = async (guid) => {
    var newArray = this.state.pivot_orignal_data;
    newArray.map(pod => {
      if (pod.Type !== "Blank") {
        pod.Columns = pod.Columns.filter(c => c.ColumnGuid !== guid);
      }
    })
    var lofdata = Math.ceil(newArray.length / 20);
          for (var i = 0; i < lofdata * 20; i = i + 20) {
            var arraytosend = newArray.slice(i, i + 20);
    await API.post("pivot", "/copypivotdata", {
      body: {
        pivotdata: arraytosend
      }
    }).then(data => {
      // toast.success("data added")
    }).catch(err => {
      toast.error("copydata request failed");
    });
  }
  }
  //on delete columns
  deleteColumn = async () => {
    let columnData = this.state.columnData; //contains single column data

    if (columnData && columnData.guid) {
      let deleteColumn = false;
      let selectedTempGuid = this.state.selectedTemp
        ? this.state.selectedTemp.guid
        : null;

      await this.props.isLoading(true);

      //call api here
      await API.post("pivot", "/deleteColumnByGuid", {
        body: {
          columnGuid: columnData.guid
        }
      })
        .then(async data => {
          deleteColumn = true;
          // toast.success("Column Deleted Successfully");
        })
        .catch(err => {
          toast.error("There is an Error whileDeleting Column");
        });
      if (deleteColumn) {
        let columns = this.state.selectedTemp.Columns;
        let filterdColumns = columns.filter(c => c != columnData.guid);

        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.selectedTemp.guid,
            fieldname: "Columns",
            value: filterdColumns
          }
        })
          .then(async data => {
            // toast.success("Template Updated Successfully.");
          })
          .catch(err => {
            toast.error("Template Not Updated!");
          });
      }
      await this.onDeleteColumnData(columnData.guid);

      await this.props.gettemplateanddata(selectedTempGuid);
      await this.clearAllStates();

      await this.closeModal();

      await this.setState({
        // isLoading: false,
        openGenericModal: false
      });
      await this.props.isLoading(false);
    } else {
      toast.error("Column Guid Not Found!");
    }
  };
  formSubmitHandler = (e) => {
    if (e.keyCode == 13) {
      if (this.state.DataIntegration == true) {

        document.getElementById('SubmitButton_DataIntegration').click();
      }
      else if (this.state.Entry == true) {

        document.getElementById('SubmitButton_Entry').click();
      }
      else if (this.state.Calculation == true) {

        document.getElementById('SubmitButton_Calculation').click();
      }
      else if (this.state.PreviousPeriod == true) {

        document.getElementById('SubmitButton_PreviousPeriod').click();
      }
      else if (this.state.System == true) {

        document.getElementById('SubmitButton_System').click();
      }
    }
  }
  addFormulaHandler =async (e) =>{
    // e.preventDefault()
    var new_tag =  this.state.tags;
    await this.setState({
      tags: [...new_tag, this.state.Ca_columnNameSelect]
    });
    this.addTagsInFormulaBar({ guid: this.state.Ca_columnNameSelect });
  }

  /**
   * Get options for {{Move column name}} selection field.
   */
  getColumnsName = () => {
let options = [];
this.props.allColumns.map((column, index) => {
if(index === 0) {
options.push(<option value="">{'Select'}</option>);
}
if(column.Type !== "System") {
options.push(<option value={column.guid}>{column.ColumnName}</option>);
}
if(index === this.props.allColumns.length - 1)
options.push(<option value="addToEnd">Add to end</option>);
})
return options;
}
  /**
   * Creating ui for formula bar.
   */
  addTagsInFormulaBar = ({guid = ""}) =>  {
    if(guid !== undefined && guid !== "") {
      let formulaBar = document.getElementById("formulaBar");
      let newTag = document.createElement("span");
      newTag.setAttribute('class', "react-tagsinput-tag");
      newTag.setAttribute('contenteditable', "false");
      newTag.innerText = this.state.columnsOfTemplate.filter(column => column.guid === guid)[0].ColumnName;
      let removeAnchor = document.createElement('a');
      removeAnchor.setAttribute('class', 'react-tagsinput-remove');

      newTag.appendChild(removeAnchor);
      if(this.checkTagsAreMultiple(formulaBar))
        formulaBar.innerHTML += "=";
      formulaBar.appendChild(newTag);
      console.log('hello');
    } else {
      let formErrors = this.state.formErrors;
      if (!this.state.Ca_template) {
        formErrors.Ca_template = "This Field is Required.";
      }
      if (!this.state.Ca_columnNameSelect) {
        formErrors.Ca_columnNameSelect = "This Field is Required.";
      }
      this.setState({
        formErrors
      });
    }
  }

  checkTagsAreMultiple(formulaBar) {
    var counter = 0;
    formulaBar.childNodes.forEach(node => { 
      if(node.constructor.name !== "Text") {
        counter++;
      }
    });
    return counter === 0;
  }

  /**
   * Validate entered input in formula bar.
   */
  formulaBarValidation = ({ element = {} }) => {
    var keycode = element.which ? element.which : element.keyCode;
    var formulaBar = document.getElementById("formulaBar");
  
    if (
      (keycode >= 48 && keycode <= 57) ||
      keycode === 61 ||
        keycode === 40 ||
        keycode === 41 ||
        keycode === 47 ||
        keycode === 43 ||
        keycode === 45 ||
        keycode === 42
    ) {
      // console.log("OK!");
    } else {
      element.preventDefault();
      // console.log("FAIL");
      return false;
    }
  };

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
          className={
            this.state.openGenericModal
              ? "ecm_modal modal-backdrop"
              : "ecm_modal"
          }
        >
          <Modal.Body>
            <div className="container-fluid">
              <div className="ecm_main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center ecm_form_mx_width">
                    <div onKeyUp={this.formSubmitHandler} className="ecm_signup_form_main">
                      <div className="ecm_signup_header">
                        <div className="row">
                          <img src="/images/2/close.png" onClick={this.closeModal} className="d-block img-fluid modal_closed_btn" alt="close" />

                          <div className="col-12 col-sm-8 ecm_order-xs-2">
                            <h4>
                              {this.props.editColumn
                                ? "Edit Column"
                                : "Add Column"}
                            </h4>
                          </div>
                          <div className="col-12 col-sm-3 ecm_order-xs-1">
                            <img
                              src="/images/pivot.png"
                              className="img-fluid float-right"
                              alt="Logo"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Default */}
                      {this.state.default && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">
                                <div className="form-group ecm_select">
                                    {/* {this.props.editColumn ? "" : <img src="/images/1/Path 129.png" class="img-fluid fa move-column-style" alt=""></img>} */}
                                    <label>{this.props.editColumn ? 'Move' : 'Add'} column before</label>
                                    <select 
                                      className="form-control ecm_custom_select"
                                      name="entry_addMoveColumn"
                                      value={this.state.entry_addMoveColumn}
                                      onChange={this.handleFieldChange_entry}
                                      >
                                      {
                                        this.getColumnsName()
                                      }
                                    </select>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .entry_addMoveColumn !== ""
                                        ? this.state.formErrors
                                          .entry_addMoveColumn
                                        : ""}
                                    </div>
                                    <span className="ecm_custom_caret"></span>
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Type</label>
                                  <select
                                    className="form-control ecm_custom_select column_select_focus"
                                    name="type"
                                    value={this.state.type}
                                    id="type_add_edit"
                                    onChange={this.handleChangeType}
                                    ref={(input) => { this.typeFieldObject = input; }}
                                  >
                                    <option value="default">Select</option>
                                    <option value="DataIntegration">
                                      Data Integration
                                    </option>
                                    <option value="Entry">Entry</option>
                                    <option value="Calculation">
                                      Calculation
                                    </option>
                                    <option value="PreviousPeriod">
                                      Previous Period 
                                    </option>
                                    {this.props.columnData.type === "System" ?
                                      <option value="System">System</option>
                                      : ""}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    placeholder=""
                                  />
                                </div>
                                <div className="form-group ecm_select">
                                  <label>Format</label>
                                  <select className="form-control ecm_custom_select">
                                    <option selected>Select</option>
                                    {
                                      this.props.config &&
                                      this.props.config.Formats.map((f, i) => {
                                        return <option key={i}>{f}</option>
                                      })
                                    }
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className={this.state.formErrors.DI_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* <Select
                                    className="width-selector"
                                    // defaultValue={this.state.options[24]}
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  /> */}
                                  <select className="form-control filter_custom_select">
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select className="form-control ecm_custom_select">
                                    <option value=''>Select</option>
                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="account"
                                      defaultChecked
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                {/* <div className="ecm_bottom_btn"> */}
                                {/* </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Data Integraation */}
                      {this.state.DataIntegration && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">

                            <div className="form-group ecm_select">
                                    {/* {this.props.editColumn ? "" : <img src="/images/1/Path 129.png" class="img-fluid fa move-column-style" alt=""></img>} */}
                                    <label>{this.props.editColumn ? 'Move' : 'Add'} column before</label>
                                    <select 
                                      className="form-control ecm_custom_select"
                                      name="entry_addMoveColumn"
                                      value={this.state.entry_addMoveColumn}
                                      onChange={this.handleFieldChange_entry}
                                      >
                                      {
                                        this.getColumnsName()
                                      }
                                    </select>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .entry_addMoveColumn !== ""
                                        ? this.state.formErrors
                                          .entry_addMoveColumn
                                        : ""}
                                    </div>
                                    <span className="ecm_custom_caret"></span>
                                  </div>

                                <div className="form-group ecm_select">
                                  <label>Type</label>
                                  <select
                                    className="form-control ecm_custom_select column_select_focus"
                                    id="type_add_edit"
                                    name="type"
                                    value={this.state.type}
                                    onChange={this.handleChangeType}
                                  >
                                    <option value="default">Select</option>

                                    <option value="DataIntegration">
                                      Data Integration
                                    </option>
                                    <option value="Entry">Entry</option>
                                    <option value="Calculation">
                                      Calculation
                                    </option>
                                    <option value="PreviousPeriod">
                                      Previous Period
                                    </option>
                                    {this.props.columnData.type === "System" ?
                                      <option value="System">System</option>
                                      : ""}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    name="DI_columnName"
                                    onChange={this.handleFieldChange_DI}
                                    value={this.state.DI_columnName}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.DI_columnName !== ""
                                      ? this.state.formErrors.DI_columnName
                                      : ""}
                                  </div>
                                </div>
                                <div className={this.state.formErrors.DI_format !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Format</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="DI_format"
                                    value={this.state.DI_format}
                                    onChange={this.handleFieldChange_DI}
                                  >
                                    <option value="">Select</option> {
                                      this.props.config &&
                                      this.props.config.Formats.map((f, i) => {
                                        return <option key={i}>{f}</option>
                                      })
                                    }
                                  </select>
                                  
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.DI_format !== ""
                                      ? this.state.formErrors.DI_format
                                      : ""}
                                  </div>
                                <div className={this.state.formErrors.DI_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* {<Select
                                    name="DI_width"
                                    defaultValue={
                                      this.state.options[
                                        this.state.DI_width - 1
                                      ]
                                    }
                                    onChange={this.handleSelectWidth_DI}
                                    className="width-selector"
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  />} */}
                                  <select
                                    className="form-control filter_custom_select"
                                    name="DI_width" onChange={this.handleSelectWidth_DI} value={this.state.DI_width}>
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                 
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.DI_width !== ""
                                      ? this.state.formErrors.DI_width
                                      : ""}
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="DI_alignment"
                                    value={this.state.DI_alignment}
                                    onChange={this.handleFieldChange_DI}
                                  >
                                    <option value="">Select</option>

                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.DI_alignment !== ""
                                      ? this.state.formErrors.DI_alignment
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>

                                <div className="form-group ecm_select">
                                  <label>Return Data</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="DI_returnData"
                                    value={this.state.DI_returnData}
                                    onChange={this.handleFieldChange_DI}
                                  >
                                    {/* <option value="">Select</option> */}
                                    {this.props.editColumn ? (
                                      <option>
                                        {this.state.DI_returnData}
                                      </option>
                                    ) : this.props.currentproject &&
                                      this.props.currentproject.Connection ===
                                      "XERO" ? (
                                          <option>Xero</option>
                                        ) : (
                                          <option>CSV</option>
                                        )}
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.DI_returnData !== ""
                                      ? this.state.formErrors.DI_returnData
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                {
                                  this.props.currentproject &&
                                  this.props.currentproject.Connection ===
                                  "XERO" && (
                                    <>
                                      <div className="form-group ecm_select">
                                        <label>Tracking Category</label>
                                        <select
                                          id="tracking-cat"
                                          className="form-control ecm_custom_select"
                                          name="DI_trackingCategory"
                                          value={
                                            this.state.DI_trackingCategory
                                          }
                                          onChange={this.handleFieldChange_DI}
                                        >
                                          <option value="">Select</option>
                                          <option value="1">Region1</option>
                                          <option value="2">Region2</option>
                                          <option value="3">Region3</option>
                                        </select>
                                        <div className="text-danger error-12">
                                          {this.state.formErrors
                                            .DI_trackingCategory !== ""
                                            ? this.state.formErrors
                                              .DI_trackingCategory
                                            : ""}
                                        </div>
                                        <span className="ecm_custom_caret"></span>
                                      </div>
                                      <div className="form-group ecm_select">
                                        <label>Tracking Code</label>
                                        <select
                                          id="track-code"
                                          className="form-control ecm_custom_select"
                                          name="DI_trackingCode"
                                          value={this.state.DI_trackingCode}
                                          onChange={this.handleFieldChange_DI}
                                        >
                                          <option value="">Select</option>
                                          <option value="1">FedRbt1</option>
                                          <option value="2">FedRbt2</option>
                                          <option value="3">FedRbt3</option>
                                        </select>
                                        <div className="text-danger error-12">
                                          {this.state.formErrors
                                            .DI_trackingCode !== ""
                                            ? this.state.formErrors
                                              .DI_trackingCode
                                            : ""}
                                        </div>
                                        <span className="ecm_custom_caret"></span>
                                      </div>
                                    </>
                                  )}

                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="DI_hide"
                                      checked={this.state.DI_hide}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Total this column
                                    <input
                                      type="checkbox"
                                      name="DI_totalThiscolumn"
                                      checked={this.state.DI_totalThiscolumn}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                {this.props.editColumn ? (
                                  <button
                                    onClick={() =>
                                      this.openModal("openGenericModal")
                                    }
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.openModal("openGenericModal")
                              }}}
                                    type="button"
                                    className="ecm_theme_btn ecm_back"
                                  >
                                    Delete
                                  </button>
                                ) : (
                                    ""
                                  )}

                                <button
                                  onClick={this.onSaveDataIntegration}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onSaveDataIntegration(e)
                              }}}
                                  type="button"
                                  className="ecm_theme_btn float-right mb-5"
                                  id="SubmitButton_DataIntegration"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Entry */}

                      {this.state.Entry && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">

                                  <div className="form-group ecm_select">
                                    {/* {this.props.editColumn ? "" : <img src="/images/1/Path 129.png" class="img-fluid fa move-column-style" alt=""></img>} */}
                                    <label>{this.props.editColumn ? 'Move' : 'Add'} column before</label>
                                    <select 
                                      className="form-control ecm_custom_select"
                                      name="entry_addMoveColumn"
                                      value={this.state.entry_addMoveColumn}
                                      onChange={this.handleFieldChange_entry}
                                      >
                                      {
                                        this.getColumnsName()
                                      }
                                    </select>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .entry_addMoveColumn !== ""
                                        ? this.state.formErrors
                                          .entry_addMoveColumn
                                        : ""}
                                    </div>
                                    <span className="ecm_custom_caret"></span>
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Type</label>
                                  <select
                                    className="form-control ecm_custom_select column_select_focus"
                                    name="type"
                                    id="type_add_edit"
                                    value={this.state.type}
                                    onChange={this.handleChangeType}
                                  >
                                    <option value="default">Select</option>
                                    <option value="DataIntegration">
                                      Data Integration
                                    </option>
                                    <option value="Entry">Entry</option>
                                    <option value="Calculation">
                                      Calculation
                                    </option>
                                    <option value="PreviousPeriod">
                                      Previous Period
                                    </option>
                                    {this.props.columnData.type === "System" ?
                                      <option value="System">System</option>
                                      : ""}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    defaultValue="Actual to Date"
                                    name="entry_columnName"
                                    onChange={this.handleFieldChange_entry}
                                    value={this.state.entry_columnName}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.entry_columnName !==
                                      ""
                                      ? this.state.formErrors.entry_columnName
                                      : ""}
                                  </div>
                                </div>
                                <div className={this.state.formErrors.entry_format !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Format</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="entry_format"
                                    value={this.state.entry_format}
                                    onChange={this.handleFieldChange_entry}
                                  >
                                    <option value="">Select</option> {
                                      this.props.config &&
                                      this.props.config.Formats.map((f, i) => {
                                        return <option key={i}>{f}</option>
                                      })
                                    }
                                  </select>
                                  
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.entry_format !== ""
                                      ? this.state.formErrors.entry_format
                                      : ""}
                                  </div>
                                <div className={this.state.formErrors.entry_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* { <Select
                                    name="entry_width"
                                    defaultValue={
                                      this.state.options[
                                        this.state.entry_width - 1
                                      ]
                                    }
                                    onChange={this.handleSelectWidth_entry}
                                    className="width-selector"
                                    // defaultValue={
                                    //   this.state.options[0]
                                    // }
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  />} */}
                                  <select className="form-control filter_custom_select" name="entry_width" onChange={this.handleSelectWidth_entry} value={this.state.entry_width}>
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                  
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.entry_width !== ""
                                      ? this.state.formErrors.entry_width
                                      : ""}
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="entry_alignment"
                                    value={this.state.entry_alignment}
                                    onChange={this.handleFieldChange_entry}
                                  >
                                    <option value="">Select</option>

                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.entry_alignment !==
                                      ""
                                      ? this.state.formErrors.entry_alignment
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="entry_hide"
                                      checked={this.state.entry_hide}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Period Clear
                                    <input
                                      type="checkbox"
                                      name="entry_periodClear"
                                      checked={this.state.entry_periodClear}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Total this column
                                    <input
                                      type="checkbox"
                                      name="entry_totalThiscolumn"
                                      checked={this.state.entry_totalThiscolumn}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                {this.props.editColumn ? (
                                  <button
                                    onClick={() =>
                                      this.openModal("openGenericModal")
                                    }
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                                    onKeyUp={(e) =>{if(e.keyCode===13){
                                      e.stopPropagation();
                                      this.openModal("openGenericModal")
                                    }}}
                                    type="button"
                                    className="ecm_theme_btn ecm_back"
                                  >
                                    Delete
                                  </button>
                                ) : (
                                    ""
                                  )}

                                <button
                                  onClick={this.onSaveEntry}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onSaveEntry(e)
                              }}}
                                  type="button"
                                  className="ecm_theme_btn float-right mb-5"
                                  id="SubmitButton_Entry"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Calculations */}
                      {this.state.Calculation && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">
                                  
                                <div className="form-group ecm_select">
                                    {/* {this.props.editColumn ? "" : <img src="/images/1/Path 129.png" class="img-fluid fa move-column-style" alt=""></img>} */}
                                    <label>{this.props.editColumn ? 'Move' : 'Add'} column before</label>
                                    <select 
                                      className="form-control ecm_custom_select"
                                      name="entry_addMoveColumn"
                                      value={this.state.entry_addMoveColumn}
                                      onChange={this.handleFieldChange_entry}
                                      >
                                      {
                                        this.getColumnsName()
                                      }
                                    </select>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .entry_addMoveColumn !== ""
                                        ? this.state.formErrors
                                          .entry_addMoveColumn
                                        : ""}
                                    </div>
                                    <span className="ecm_custom_caret"></span>
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Type</label>
                                  <select
                                    className="form-control ecm_custom_select column_select_focus"
                                    name="type"
                                    value={this.state.type}
                                    id="type_add_edit"
                                    onChange={this.handleChangeType}
                                  >
                                    <option value="default">Select</option>
                                    <option value="DataIntegration">
                                      Data Integration
                                    </option>
                                    <option value="Entry">Entry</option>
                                    <option value="Calculation">
                                      Calculation
                                    </option>
                                    <option value="PreviousPeriod">
                                      Previous Period
                                    </option>
                                    {this.props.columnData.type === "System" ?
                                      <option value="System">System</option>
                                      : ""}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    name="Ca_columnName"
                                    defaultValue="Estimate to Complete"
                                    onChange={this.handleFieldChange_Ca}
                                    value={this.state.Ca_columnName}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_columnName !== ""
                                      ? this.state.formErrors.Ca_columnName
                                      : ""}
                                  </div>
                                </div>
                                <div className={this.state.formErrors.Ca_format !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Format</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="Ca_format"
                                    value={this.state.Ca_format}
                                    onChange={this.handleFieldChange_Ca}
                                  >
                                    <option value="">Select</option> {
                                      this.props.config &&
                                      this.props.config.Formats.map((f, i) => {
                                        return <option key={i}>{f}</option>
                                      })
                                    }
                                  </select>
                                  
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_format !== ""
                                      ? this.state.formErrors.Ca_format
                                      : ""}
                                  </div>
                                <div className={this.state.formErrors.Ca_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* <Select
                                    className="width-selector"
                                    defaultValue={
                                      this.state.options[
                                        this.state.Ca_width - 1
                                      ]
                                    }
                                    name="Ca_width"
                                    onChange={this.handleSelectWidth_Ca}
                                    // defaultValue={
                                    //   this.state.options[0]
                                    // }
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  /> */}
                                  <select className="form-control filter_custom_select" name="Ca_width" onChange={this.handleSelectWidth_Ca} value={this.state.Ca_width}>
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                  
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_width !== ""
                                      ? this.state.formErrors.Ca_width
                                      : ""}
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="Ca_alignment"
                                    value={this.state.Ca_alignment}
                                    onChange={this.handleFieldChange_Ca}
                                  >
                                    <option value="">Select</option>
                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_alignment !== ""
                                      ? this.state.formErrors.Ca_alignment
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select pt-3">
                                  <label className="pb-3 w-100">
                                    <u>Add Formula Reference</u>
                                  </label>
                                  <br />
                                  <label>Template</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="Ca_template"
                                    value={this.state.Ca_template}
                                    onChange={this.handleTemplateSelect_Ca}
                                  >
                                    <option value="">Select</option>
                                    {this.state.template_list &&
                                      this.state.template_list.map(t => {
                                        return (
                                          <option value={t.guid}>
                                            {t.TemplateName}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_template !== ""
                                      ? this.state.formErrors.Ca_template
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label>Column Name</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="Ca_columnNameSelect"
                                    value={this.state.Ca_columnNameSelect}
                                    onChange={this.handleFieldChange_Ca}
                                  >
                                    <option value="">Select</option>
                                    {this.state.columnsOfTemplate &&
                                      this.state.columnsOfTemplate.map(c => {
                                        return (
                                          <option value={c.guid}>
                                            {c.ColumnName}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.Ca_columnNameSelect !== ""
                                      ? this.state.formErrors.Ca_columnNameSelect
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <button
                                    type="button"
                                    className="ecm_theme_btn ecm_back ecm_modal_btn mt-2 float-left add_formula"
                                    onClick={this.addFormulaHandler}
                                    >
                                    <img alt="add" src="/images/p3.png" class="img-fluid float-left w-13" /> Add
                                  </button>
                                  <br />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="api-pass" className="w-100">
                                    Formula Bar
                                  </label>
                                  <div className="input-group mb-2">
                                    <div className="form-control ecm_paste_taginput font-weight-bold text-black" contenteditable="true" 
                                    onKeyPress={(e) => this.formulaBarValidation({ element: e })}
                                    id="formulaBar">
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="ca_hide_check"
                                      checked={this.state.ca_hide_check}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Total this column
                                    <input
                                      type="checkbox"
                                      name="ca_total_column_check"
                                      checked={this.state.ca_total_column_check}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Don't calculate on blanks
                                    <input
                                      type="checkbox"
                                      name="ca_dont_calculate_check"
                                      checked={
                                        this.state.ca_dont_calculate_check
                                      }
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                {this.props.editColumn ? (
                                  <button
                                    onClick={() =>
                                      this.openModal("openGenericModal")
                                    }
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.openModal("openGenericModal")
                              }}}
                                    type="button"
                                    className="ecm_theme_btn ecm_back"
                                  >
                                    Delete
                                  </button>
                                ) : (
                                    ""
                                  )}
                                <button
                                  onClick={this.onSaveCalculation}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onSaveCalculation(e)
                              }}}
                                  type="button"
                                  className="ecm_theme_btn float-right mb-5"
                                  id="SubmitButton_Calculation"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Previous Period */}
                      {this.state.PreviousPeriod && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">
                                  
                             <div className="form-group ecm_select">
                                    {/* {this.props.editColumn ? "" : <img src="/images/1/Path 129.png" class="img-fluid fa move-column-style" alt=""></img>} */}
                                    <label>{this.props.editColumn ? 'Move' : 'Add'} column before</label>
                                    <select 
                                      className="form-control ecm_custom_select"
                                      name="entry_addMoveColumn"
                                      value={this.state.entry_addMoveColumn}
                                      onChange={this.handleFieldChange_entry}
                                      >
                                      {
                                        this.getColumnsName()
                                      }
                                    </select>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .entry_addMoveColumn !== ""
                                        ? this.state.formErrors
                                          .entry_addMoveColumn
                                        : ""}
                                    </div>
                                    <span className="ecm_custom_caret"></span>
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Type</label>
                                  <select
                                    className="form-control ecm_custom_select column_select_focus"
                                    name="type"
                                    id="type_add_edit"
                                    value={this.state.type}
                                    onChange={this.handleChangeType}
                                  >
                                    <option value="default">Select</option>
                                    <option value="DataIntegration">
                                      Data Integration
                                    </option>
                                    <option value="Entry">Entry</option>
                                    <option value="Calculation">
                                      Calculation
                                    </option>
                                    <option value="PreviousPeriod">
                                      Previous Period
                                    </option>
                                    {this.props.columnData.type === "System" ?
                                      <option value="System">System</option>
                                      : ""}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    name="prevPeriod_columnName"
                                    onChange={this.handleFieldChange_PrevPeriod}
                                    value={this.state.prevPeriod_columnName}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors
                                      .prevPeriod_columnName !== ""
                                      ? this.state.formErrors
                                        .prevPeriod_columnName
                                      : ""}
                                  </div>
                                </div>
                                <div className={this.state.formErrors.prevPeriod_format !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Format</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="prevPeriod_format"
                                    value={this.state.prevPeriod_format}
                                    onChange={this.handleFieldChange_PrevPeriod}
                                  >
                                    <option value="">Select</option> {
                                      this.props.config &&
                                      this.props.config.Formats.map((f, i) => {
                                        return <option key={i}>{f}</option>
                                      })
                                    }
                                  </select>
                                  
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.prevPeriod_format !==
                                      ""
                                      ? this.state.formErrors.prevPeriod_format
                                      : ""}
                                  </div>
                                <div className={this.state.formErrors.prevPeriod_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* <Select
                                    className="width-selector"
                                    defaultValue={
                                      this.state.options[
                                        this.state.prevPeriod_width - 1
                                      ]
                                    }
                                    name="prevPeriod_width"
                                    onChange={this.handleSelectWidth_PrevPeriod}
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  /> */}
                                  <select className="form-control filter_custom_select" name="prevPeriod_width" onChange={this.handleSelectWidth_PrevPeriod} value={this.state.prevPeriod_width}>
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                  
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.prevPeriod_width !==
                                      ""
                                      ? this.state.formErrors.prevPeriod_width
                                      : ""}
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="prevPeriod_alignment"
                                    value={this.state.prevPeriod_alignment}
                                    onChange={this.handleFieldChange_PrevPeriod}
                                  >
                                    <option value="">Select</option>
                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors
                                      .prevPeriod_alignment !== ""
                                      ? this.state.formErrors
                                        .prevPeriod_alignment
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label>Template</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="prevPeriod_template"
                                    value={this.state.prevPeriod_template}
                                    onChange={
                                      this.handleTemplateSelect_Preperiod
                                    }
                                  >
                                    <option value="">Select</option>
                                    {this.state.template_list &&
                                      this.state.template_list.map(t => {
                                        return (
                                          <option value={t.guid}>
                                            {t.TemplateName}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors
                                      .prevPeriod_template !== ""
                                      ? this.state.formErrors
                                        .prevPeriod_template
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label>Column Name</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="prevPeriod_colNam"
                                    value={this.state.prevPeriod_colNam}
                                    onChange={this.handleFieldChange_PrevPeriod}
                                  >
                                    <option value="">Select</option>

                                    {this.state.columnsOfTemplate &&
                                      this.state.columnsOfTemplate.map(c => {
                                        return (
                                          <option value={c.guid}>
                                            {c.ColumnName}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.prevPeriod_colNam !==
                                      ""
                                      ? this.state.formErrors.prevPeriod_colNam
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="prevPeriod_hide"
                                      checked={this.state.prevPeriod_hide}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                  <label className="ecm_container ecm_remember">
                                    Total this column
                                    <input
                                      type="checkbox"
                                      name="prevPeriod_totalThiscolumn"
                                      checked={
                                        this.state.prevPeriod_totalThiscolumn
                                      }
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                {this.props.editColumn ? (
                                  <button
                                    onClick={() =>
                                      this.openModal("openGenericModal")
                                    }
                                    onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.openModal("openGenericModal")
                              }}}
                                    type="button"
                                    className="ecm_theme_btn ecm_back"
                                  >
                                    Delete
                                  </button>
                                ) : (
                                    ""
                                  )}
                                <button
                                  onClick={this.onSavePreviousPeriod}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onSavePreviousPeriod(e)
                              }}}
                                  type="button"
                                  className="ecm_theme_btn float-right mb-5"
                                  id="SubmitButton_PreviousPeriod"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* System */}

                      {this.state.System && (
                        <div className="ecm_signup_body">
                          <div className="row">
                            <div className="col-12">
                              <div className="ecm_signup_form">
                                <div className="form-group">
                                  <label htmlFor="p-name">Type</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    placeholder="System"
                                    disabled
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="p-name">Column Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="p-name"
                                    name="system_columnName"
                                    onChange={this.handleFieldChange_System}
                                    value={this.state.system_columnName}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.system_columnName !==
                                      ""
                                      ? this.state.formErrors.system_columnName
                                      : ""}
                                  </div>
                                </div>
                                <div className={this.state.formErrors.system_width !== ""
                                      ? "form-group ecm_select mb-0"
                                      : "form-group ecm_select"}>
                                  <label>Width</label>
                                  {/* <Select
                                    className="width-selector"
                                    defaultValue={
                                      this.state.options[
                                        this.state.system_width - 1
                                      ]
                                    }
                                    name="system_width"
                                    onChange={this.handleSelectWidth_System}
                                    classNamePrefix="ecm_width-selector-inner"
                                    options={this.state.options}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  /> */}
                                  <select className="form-control filter_custom_select" name="system_width" onChange={this.handleSelectWidth_System} value={this.state.system_width}>
                                    <option value="">Select</option>
                                    {this.state.options.map(e => {
                                      return (

                                        <option value={e.value}>{e.label}</option>
                                      )
                                    })}
                                  </select>
                                  <span className="ecm_custom_caret"></span>
                                  
                                </div>
                                <div className="text-danger error-12">
                                    {this.state.formErrors.system_width !== ""
                                      ? this.state.formErrors.system_width
                                      : ""}
                                  </div>
                                <div className="form-group ecm_select">
                                  <label>Alignment</label>
                                  <select
                                    className="form-control ecm_custom_select"
                                    name="system_alignment"
                                    value={this.state.system_alignment}
                                    onChange={this.handleFieldChange_System}
                                  >
                                    <option value="">Select</option>

                                    <option>Left</option>
                                    <option>Center</option>
                                    <option>Right</option>
                                  </select>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.system_alignment !==
                                      ""
                                      ? this.state.formErrors.system_alignment
                                      : ""}
                                  </div>
                                  <span className="ecm_custom_caret"></span>
                                </div>
                                <div className="form-group ecm_select">
                                  <label className="ecm_container ecm_remember">
                                    Hide
                                    <input
                                      type="checkbox"
                                      name="system_hide"
                                      checked={this.state.system_hide}
                                      onChange={this.handleCheckbox}
                                    />
                                    <span className="ecm_checkmark"></span>
                                  </label>
                                </div>
                                <button
                                  onClick={this.onSaveSystem}
                                  onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault(); e.stopPropagation()}} }
                              onKeyUp={(e) =>{if(e.keyCode===13){
                                e.stopPropagation();
                                this.onSaveSystem(e)
                              }}}
                                  type="button"
                                  className="ecm_theme_btn float-right mb-5"
                                  id="SubmitButton_System"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <GenericModal
          openModal={this.state.openGenericModal}
          closeModal={this.closeGenericModal}
          deleteColumn={this.deleteColumn}
        />
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

export default AddEditColumn;
