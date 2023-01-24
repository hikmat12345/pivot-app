import "./Dashboard.css";

import { API, JS, Storage } from "aws-amplify";
import React, { Component } from "react";

import recalcimg from "./keys.png";

import $ from "jquery";
import AddEditColumnModal from "../Modals/AddEditColumn/AddEditColumn";
import AddTemplateModal from "../Modals/AddTemplate/AddTemplate";
import ApplyGroup from "../Modals/ApplyGroup/ApplyGroup";
import DeleteModal from "../Modals/Projects/Delete/Delete";
import Dropdown from "react-bootstrap/Dropdown";
import Dropzone from "react-dropzone";
import EditProjectModal from "../Modals/Projects/EditProject/EditProject";
import EditTemplateModal from "../Modals/EditTemplate/EditTemplate";
import FilterModal from "../Modals/Filter/Filter";
import GroupListModal from "../Modals/GroupList/GroupList/GroupList";
import ImportModal from "../Modals/Import/Import";
import { Link } from "react-router-dom";
import Message from "../Modals/message/message";
import PeriodClose from "../Modals/PeriodClose/PeriodClose";
import Profile from "../Modals/Profile/Profile";
import ReactExport from "react-export-excel";
import RefreshModal from "../Modals/Refresh/Refresh";
import ReportsModal from "../Modals/Reports/ReportsMain/ReportsMain";
import Select from "react-select";
import ShareModal from "../Modals/Share/Share";
import Tooltip from "../Common/Tooltip/Tooltip";
import axios from "axios";
import { connect } from "react-redux";
import { currentsessioncheck } from "../../actions/loginactions";
import { focusOn } from "../../Utils/helpers";
import readXlsxFile from "read-excel-file";
import { signinout } from "../../actions/loginactions";
import { toast } from "react-toastify";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const uuidv1 = require("uuid/v1");
const base64url = require("base64url");
const sha256 = require("sha256");
var moment = require("moment");
var refreshFunction = undefined;
var refreshCounter = 0;
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recalc: true,
      reportdata: null,
      errorcat: false,
      catagories: [],
      editedflag: false,
      temp_report: "",
      trparent: "",
      exceldata: [],
      sysids: [],
      allcolumnsoftemp: [],
      checkedcount: "",
      originalData: [],
      get_groupsd: [],
      get_groups: [],
      allNodes: false,
      defaultforcurrenttd: "",
      indexfocus: 0,
      selectedcheckbox: [],
      columns_white: [],
      cutfinal: [],
      new_created_temp_guid: "",
      newColumnUploaded: false,
      project_access: [],
      laststateWorktable: [],
      config: "", //it contains formats
      blankrow: false,
      hiddencolumn: false,
      CheckZero: false,
      editCellId: "",
      editCellValue: "",
      value: "",
      columnValue: "",
      comparsionValue: "",
      layouts: "",
      headingTotal: false,
      selectedtempguid: "",
      pivotGroupData: [],
      pivotGroupTag: [],

      pivotGroupTagHiddenRows: [],
      finaldata: [],
      fontsizetemplate: "",
      profile_image: "",
      image_from_bucket: "",
      templateselectvalue: "",
      check_zero_rows: false,
      check_blank_row: false,
      check_heading_totals: false,
      check_hidden_columns: false,
      columnData: "", //to edit column
      editColumn: false, //by default it is false
      pivotData: [],
      columns: [],
      currentproject: "",
      projects: [],
      buguid: "",
      select_all_check: false,
      select_check: false,
      orderColumns: [],
      required_messages: [],
      required_tips: [],
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      optionalOkFunction: undefined,
      optionalCloseFunction: undefined,
      openApplyGroupModal: false,
      openFilterModal: false,
      openAddEditColumn: false,
      openProfileModal: false,
      openRefreshModal: false,
      openAddTemplateModal: false,
      openEditTemplateModal: false,
      openGroupListModal: false,

      openReportsModal: false,
      openPeriodCloseModal: false,
      openImportModal: false,
      openEditCodeModal: false,
      openAddCodeModal: false,
      openShareModal: false,
      openEditProjectModal: false,
      options: [],
      fontOptions: [
        {
          label: 6,
          value: 6,
        },
        {
          label: 8,
          value: 8,
        },
        {
          label: 10,
          value: 10,
        },
        {
          label: 12,
          value: 12,
        },
        {
          label: 20,
          value: 20,
        },
        {
          label: 30,
          value: 30,
        },
      ],
      addTemplateModal: "",
      editTemplateModal: "",
      formErrors: {
        editTemplateModal: "",
      },
      filter_formErrors: {
        columnValue: "",
        comparsionValue: "",
        value: "",
      },
      isChecked: true,
      finalColumnsForDB: [],
      finalTemplatesForDB: [],
      accounts: [],
      disableUser: false,
      undo: [],
    };
  }

  componentDidUpdate() {
    //this.importcsv();
    $(document).ready(function () {
      $("#templates_focus").keydown(function (v) {
        if (v.shiftKey) {
          v.preventDefault();
          if (v.keyCode == 9) {
            document.getElementById("edit_template_sidebar").focus();
          }
        } else if (v.keyCode == 9) {
          v.preventDefault();
          $("#exclude_tab").focus();
        }
      });
      $("#exclude_tab").keydown(function (v) {
        if (v.shiftKey) {
          v.preventDefault();
          if (v.keyCode == 9) {
            document.getElementById("templates_focus").focus();
          }
        }
      });

      $(".width-selector input[type='text']").focus(function () {
        $(".dash_width-selector-inner__control").addClass("active");
      });
      $(".width-selector input[type='text']").focusout(function () {
        $(".dash_width-selector-inner__control").removeClass("active");
      });

      $("td").keydown(function (e) {
        // e.preventDefault();
      });

      // handle arrow navigation
      $("td").keyup(function (e) {
        var currCell = $(this);
        e.preventDefault();

        if (e.which === 9) {
          e.preventDefault();
          //shift+tab
          if (e.shiftKey) {
            // currCell.prev().focus();
            let breaker =
              currCell.prev()[0].getAttribute("tagnext") === null
                ? true
                : currCell.prev()[0].getAttribute("tagnext") === "false"
                ? true
                : false;
            let nexttd = currCell.prev();

            if (breaker) {
              let rowLength =
                document.getElementsByTagName("tr")[0].childElementCount - 1;

              while (breaker) {
                if (nexttd.prev().length > 0) {
                  breaker = !(
                    nexttd.prev()[0].getAttribute("tagnext") === "true"
                  );
                  nexttd = nexttd.prev();
                  if (!breaker) {
                    nexttd.focus();
                  }
                } else {
                  let td = nexttd
                    .closest("tr")
                    .prev()
                    .find("td:eq(" + rowLength + ")")[0];

                  if (td && td.getAttribute("tagnext") === "true") {
                    td.focus();
                    breaker = false;
                  }
                  rowLength--;
                }
              }
            } else {
              currCell.prev().focus();
            }
          } else {
            if (currCell.next().length > 0) {
              let breaker =
                currCell.next()[0].getAttribute("tagnext") === "false";
              let nexttd = currCell.next();
              if (breaker) {
                while (breaker) {
                  if (nexttd.next().length > 0) {
                    breaker = !(
                      nexttd.next()[0].getAttribute("tagnext") === "true"
                    );
                    nexttd = nexttd.next();
                    if (!breaker) {
                      nexttd.focus();
                    }
                  } else {
                    nexttd
                      .closest("tr")
                      .next()
                      .find("td:eq(" + 1 + ")")
                      .focus();
                    breaker = false;
                  }
                }
              } else {
                currCell.next().focus();
              }
            } else {
              currCell
                .closest("tr")
                .next()
                .find("td:eq(" + 1 + ")")
                .focus();
            }
          }
        } else if (e.which == 39) {
          e.preventDefault();
          // Right Arrow or
          currCell.next().focus();
        } else if (e.which == 37) {
          e.preventDefault();
          // Left Arrow
          // document.activeElement.textContent = state.editCellValue
          currCell.prev().focus();
        } else if (e.which == 38) {
          e.preventDefault();
          // Up Arrow

          currCell
            .closest("tr")
            .prev()
            .find("td:eq(" + currCell.index() + ")")
            .focus();
        } else if (e.which == 40 || e.which == 13) {
          e.preventDefault();
          // Down Arrow
          currCell
            .closest("tr")
            .next()
            .find("td:eq(" + currCell.index() + ")")
            .focus();
        }
      });
    });
    $("#test1").hide();

    this.getTableBodyHeight();
  }

  componentDidMount = async () => {
    // $(document).on("click", '.hamburger2[data-toggle="offcanvas2"]', function () {
    //   $("#wrapper2").toggleClass("toggled2");
    // });
    $("#test1").hide();
    $("#closeRightSlider").click(function () {
      $("#closeRightSliderArrow").click();
    });
    $(document).on("focusin", "input.lessbright", function () {
      $("input.lessbright").parent().css("display", "none !important");
    });
    // $(document).on('click','.dash-table > tbody > tr > td', function(){
    // alert("ok");
    // });
    $("#append-row").hide();
    // $("#apply-d").click(function () {
    // window.location.reload();
    // });

    $("#main-row-table").click(function () {
      $("#append-row").toggle();
      $(this).find("img").toggleClass("rotate-icon-90");
    });

    var trigger = $(".hamburger"),
      overlay = $(".overlay"),
      isClosed = false;

    trigger.click(function () {
      hamburger_cross();
    });

    function hamburger_cross() {
      if (isClosed === true) {
        overlay.hide();
        trigger.removeClass("is-closed");
        trigger.addClass("is-closed");
        isClosed = false;
      } else {
        overlay.show();
        trigger.removeClass("is-closed");
        trigger.addClass("is-closed");
        isClosed = true;
      }
    }

    $(document).on("click", '[data-toggle="offcanvas"]', function () {
      $("#wrapper").toggleClass("toggled");
    });

    var trigger = $(".hamburger2"),
      overlay2 = $(".overlay2"),
      isClosed2 = false;

    trigger.click(function () {
      $("#templates_focus").attr("tabindex", 111104).focus();
      hamburger_cross2();
    });

    let that = this;
    function hamburger_cross2() {
      if (isClosed2 === true) {
        $("#wrapper2").removeClass("toggled2");
        overlay2.hide();
        trigger.removeClass("is-closed2 right-bar-btn");
        trigger.addClass("is-closed2 transit");
        isClosed2 = false;

        let { templates, selectedtempguid } = that.state;
        if (templates && selectedtempguid) {
          let selectedTemplate = templates.find(
            (template) => template.guid === selectedtempguid
          );
          that.setState({
            check_zero_rows: selectedTemplate.Exclude[0].ZeroRows,
            check_blank_row: selectedTemplate.Exclude[0].BlankRows,
            check_hidden_columns: selectedTemplate.Exclude[0].HiddenColumns,
            check_heading_totals: selectedTemplate.Exclude[0].HeadingsTotals,
          });
        }
      } else {
        $("#wrapper2").addClass("toggled2");
        overlay2.show();
        trigger.removeClass("is-closed2 transit");
        trigger.addClass("is-closed2 right-bar-btn");
        isClosed2 = true;
      }
    }

    // tabing code
    $(document).ready(function () {
      $(".dashSideTabs").keydown(function (v) {
        var ti = "";
        var id = "";
        var id = $(this).attr("id");
        var ti = $(this).attr("tabindex");

        if (id == "dSide_111116") {
          $("#dSide_111116").attr("tabindex", 111116);
          var ti = "111116";
          var id = "import_pad";
        } else if (id == "dSide_111118") {
          $("#dSide_111118").attr("tabindex", 111118);
          var ti = "111118";
          var id = "csv_pad";
        }

        if (v.keyCode == 9) {
          v.preventDefault();
          var y = parseInt(ti);
          var z = y + 1;
          var r = `dSide_${z}`;
          $("#" + r).focus();
        }
        if (v.shiftKey) {
          v.preventDefault();
          if (v.keyCode == 9) {
            if (id == "dSide_111109") {
              document.getElementById("apply-d").focus();
            } else if (id == "dSide_111110") {
              document.getElementById("react-select-3-input").focus();
            } else {
              var y = parseInt(ti);
              var z = y - 1;
              var r = `dSide_${z}`;
              document.getElementById(r).focus();
            }
          }
        } else if (v.keyCode == 13) {
          var g = `${id}`;
          document.getElementById(g).click();
        }
      });
    });
    //  end

    $("#closeRightSliderArrow").on("keydown", function (f) {
      if (f.keyCode == 9) {
        f.preventDefault();
        f.stopPropagation();
        $("#refresh_modal_btn").focus();
      }
    });

    $(document).keydown(function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.which == 79) {
          $("#closeRightSliderArrow").click();
        }
      }
    });

    await this.props.currentsessioncheck();
    if (!this.props.isAuthenticated) {
      this.props.history.push("/login", {
        from: "/dashboard",
      });
    } else {
      let guid =
        this.props.history.location.state &&
        this.props.history.location.state.guid;
      if (!guid) {
        this.props.history.push("/projects", {
          from: "/dashboard",
        });
      } else {
        var tips = JSON.parse(localStorage.getItem("ToolTip"));
        var messages = JSON.parse(localStorage.getItem("RequiredMessages"));
        await this.setState({
          required_messages: messages,
          required_tips: tips,
        });

        this.setState({
          isLoading: true,
          buguid: guid,
        });
        await this.getUserByGuid();
        await this.getConfigs();

        await this.getProjectByGuid(guid);
        await this.getTemplates();
        await this.getprojects();

        // get groups
        await this.getGroups();

        var guids = localStorage.getItem("templateguid");
        if (guids && guids !== "" && guids !== null && guids.length !== 0) {
          var guids = JSON.parse(localStorage.getItem("templateguid"));
          var exist = guids.filter((e) => {
            return e.project === this.state.selectedProject.guid;
          });
          //get already stored template data
          if (exist[0]) {
            await this.gettemplateanddata(exist[0].template);
          } else {
            //push in array if not exist in array
            await this.updatetemplateinlocal(this.state.templates[0].guid);
            await this.gettemplateanddata(this.state.templates[0].guid);
          }
        } else {
          await this.updatetemplateinlocal(this.state.templates[0].guid);
          var getlocaltemplate = JSON.parse(
            localStorage.getItem("templateguid")
          );
          var exist = getlocaltemplate.filter((e) => {
            return e.project === this.state.selectedProject.guid;
          });
          //get first template data
          await this.gettemplateanddata(exist[0].template);
        }
        await this.getLayouts();
        await this.getReportdata();
        /* let projectid = localStorage.getItem("projectguid");
          
          var exist=guids.filter(e=>{ return e.project===projectid});
          
          if (projectid === null || projectid == "" || !projectid) {
          
          await this.gettemplateanddata(exist[0].template);
          } else {
          
          if (projectid !== exist[0].project) {
          localStorage.setItem("projectguid", "");
          localStorage.setItem("templateguid", []);
          } else {
          if (exist[0].template) {
          await this.gettemplateanddata(exist[0].template);
          }
          else if (!exist[0].template){
          
          }
          }
          }*/
        if (this.state.pivotGroupTag.length === this.state.finaldata.length) {
          this.setState({
            allNodes: true,
          });
        } else {
          this.setState({
            allNodes: false,
          });
        }
        let dateTime = new Date().getTime();
        let templateName = this.state.templates.find(
          (template) => template.guid === this.state.selectedtempguid
        ).TemplateName;
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Worktable Options",
            Description: "Template on Open",
            ProjectName: this.state.selectedProject.Name,
            Projectguid: this.state.selectedProject.guid,
            ColumnName: "",
            ValueFrom: "",
            ValueTo: templateName,
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);
      }

      this.setState({
        isLoading: false,
      });
    }

    let xeroActivity = await localStorage.getItem("xeroActivity");
    if (xeroActivity && xeroActivity !== "null") {
      xeroActivity = JSON.parse(xeroActivity);
      if (
        this.props.location.state &&
        this.props.location.state.from === "/redirect"
      ) {
        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Project List",
            Description: "Connect API",
            ProjectName: xeroActivity["projectName"],
            Projectguid: xeroActivity["projectGuid"],
            ColumnName: "",
            ValueFrom: "",
            ValueTo: xeroActivity["connectedCompany"],
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);
        localStorage.setItem("xeroActivity", null);
      }
    }

    setInterval(async function () {
      await that.props.currentsessioncheck();
      if (!that.props.isAuthenticated) {
        that.props.history.push("/login", {
          from: "/dashboard",
        });
      }
    }, 120 * 60 * 1000);
  };

  getTableBodyHeight = () => {
    if (document.getElementById("table_height")) {
      let children = Array.from(
        document.getElementById("table_height").children
      );
      let childrenHeight = 0;
      children.map((child) => {
        childrenHeight += child.offsetHeight;
      });

      let navHeight = document.getElementById("dash_header_nav").offsetHeight;
      let tableHeaderHeight = $(".he").height();
      let newTableBodyHeight =
        window.innerHeight - (navHeight + tableHeaderHeight + 140);

      if (childrenHeight < newTableBodyHeight) {
        newTableBodyHeight = childrenHeight;
      }
      document.getElementById(
        "table_height"
      ).style.height = `${newTableBodyHeight}px`;
    }
  };

  getTableHeadPadding = () => {
    setTimeout(function () {
      let tableHeight = document.getElementById("table_height");
      if (tableHeight.scrollHeight > tableHeight.clientHeight) {
        document.getElementsByTagName("thead")[0].style.paddingRight = "14px";
      } else {
        document.getElementsByTagName("thead")[0].style.paddingRight = "0px";
      }
    }, 0);
  };

  allColumnsOfTemplates = async (optionalGuid = undefined) => {
    let guids = [];
    let columns = [];

    this.state.templates.map((template) => {
      guids = guids.concat(template.Columns);
    });
    if (optionalGuid) {
      guids.push(optionalGuid);
    }

    columns = await this.getColumnByTemplateGuidcall(guids);

    await this.setState({
      allcolumnsoftemp: columns,
    });

    // return guids;
  };

  getLayouts = async () => {
    let { user } = this.state;
    let tenantguid = localStorage.getItem("tenantguid");
    if (tenantguid) tenantguid = user.tenantguid;

    await API.post("pivot", "/getlayouts", {
      body: {
        templateguid: localStorage.getItem("tenantguid"),
      },
    })
      .then((data) => {
        this.setState({
          layouts: data.sort(function (a, b) {
            var nameA = a.Name.toUpperCase();
            var nameB = b.Name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          }),
        });

        // toast.success('successfully get all layouts');
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error While Getting layouts.",
          message_heading: "Getting Layouts",
          openMessageModal: true,
        });
        // toast.error('Error While Getting layouts')
      });
  };

  getLayoutsFromReports = async (newLayout) => {
    let { layouts } = this.state;
    layouts.push(newLayout);
    this.setState({
      layouts: layouts.sort(function (a, b) {
        var nameA = a.Name.toUpperCase();
        var nameB = b.Name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
    });
  };

  componentWillUnmount = () => {
    $(document).ready(function () {
      $("#append-row").hide();
      //      $("#apply-d").click(function () {
      //        window.location.reload();
      //      });

      $("#main-row-table").click(function () {
        $("#append-row").toggle();
        $(this).addClass("rotate-icon-90");
      });

      var trigger = $(".hamburger"),
        overlay = $(".overlay"),
        isClosed = false;

      trigger.click(function () {
        hamburger_cross();
      });

      function hamburger_cross() {
        if (isClosed === true) {
          overlay.hide();
          trigger.removeClass("is-closed");
          trigger.addClass("is-closed");
          isClosed = false;
        } else {
          overlay.show();
          trigger.removeClass("is-closed");
          trigger.addClass("is-closed");
          isClosed = true;
        }
      }

      $(document).on("click", '[data-toggle="offcanvas"]', function () {
        $("#wrapper").toggleClass("toggled");
      });

      var trigger = $(".hamburger2"),
        overlay2 = $(".overlay2"),
        isClosed2 = false;

      trigger.click(function () {
        $("#templates_focus").attr("tabindex", 111104).focus();
        hamburger_cross2();
      });

      function hamburger_cross2() {
        if (isClosed2 === true) {
          overlay2.hide();
          trigger.removeClass("is-closed2 right-bar-btn");
          trigger.addClass("is-closed2 transit");
          isClosed2 = false;
        } else {
          overlay2.show();
          trigger.removeClass("is-closed2 transit");
          trigger.addClass("is-closed2 right-bar-btn");
          isClosed2 = true;
        }
      }
    });
  };

  gettemplateanddata = async (guid) => {
    this.setState({
      isLoading: true,
    });
    await this.getTemplateByGuid(guid);
    let newguid = this.state.editTemplateModal.guid;

    await this.getcolumnbytemplateguid(newguid);

    this.setState({
      isLoading: false,
    });
  };

  getConfigs = async () => {
    await API.post("pivot", "/getconfig", {
      body: {
        guid: "FORMAT",
      },
    })
      .then((data) => {
        this.setState({
          config: data,
        });
        // toast.success("Formats Get Successfully");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error While Getting Formats.",
          message_heading: "Getting Formats",
          openMessageModal: true,
        });
        // toast.error('Error While Getting Formats')
      });
  };

  getprojects = async () => {
    // await this.setState({
    //   isLoading: true
    // })
    // let tenantguid = localStorage.getItem('tenantguid')
    // var filter_project = []
    // await API.post('pivot', '/getProjects', {
    //   body: {
    //     tenantguid: tenantguid
    //   }
    // })
    //   .then(data => {
    //     var xy = data
    //     let { history } = this.props
    //     let user_type = history.location.state.user_type
    //       ? history.location.state.user_type
    //       : this.state.user_type
    //     console.log(
    //       'getprojects ---------------------------------------- ',
    //       user_type
    //     )

    //     data = xy.sort(function (a, b) {
    //       var nameA = a.Name.toUpperCase()
    //       var nameB = b.Name.toUpperCase()
    //       if (nameA < nameB) {
    //         return -1
    //       }
    //       if (nameA > nameB) {
    //         return 1
    //       }
    //       // names must be equal
    //       return 0
    //     })
    //     var x = data.filter(data => {
    //       return data.guid == this.state.buguid
    //     })
    //     if (user_type == 'SYSTEM') {
    //       // this.setState({
    //       // projects: data
    //       // });
    //       data.sort(function (a, b) {
    //         if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
    //           return -1
    //         }
    //         if (a.Name.toUpperCase() > b.Name.toUpperCase()) {
    //           return 1
    //         }
    //         return 0
    //       })

    //       this.setState({ projects: data })
    //     } else if (user_type == 'Owner') {
    //       // this.setState({
    //       // projects: data.filter((e) => {
    //       // return e.TenantGuid === tenantguid;
    //       // }),
    //       // });

    //       data.sort(function (a, b) {
    //         if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
    //           return -1
    //         }
    //         if (a.Name.toUpperCase() > b.Name.toUpperCase()) {
    //           return 1
    //         }
    //         return 0
    //       })
    //       var tes = []
    //       tes = data.filter(e => {
    //         return e.TenantGuid == tenantguid
    //       })

    //       this.setState({
    //         projects: tes
    //       })
    //     } else {
    //       // for (var p = 0; p < data.length; p++) {
    //       // if (data[p].TenantGuid == tenantguid && data[p].guid != 'DEFAULT') {
    //       // filter_project.push(data[p]);
    //       // }
    //       // }
    //       // this.setState({
    //       // projects: filter_project.filter((e) => {
    //       // return this.state.project_access.indexOf(e.guid) > -1;
    //       // }),
    //       // });

    //       var tes = []
    //       tes = data.filter(e => {
    //         return e.TenantGuid == tenantguid || e.TenantGuid == 'SYSTEM'
    //       })

    //       tes.sort(function (a, b) {
    //         if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
    //           return -1
    //         }
    //         if (a.Name.toUpperCase() > b.Name.toUpperCase()) {
    //           return 1
    //         }
    //         return
    //       })

    //       this.setState({
    //         projects: tes.filter(e => {
    //           return (
    //             this.state.project_access.indexOf(e.guid) > -1 &&
    //             e.guid != 'DEFAULT'
    //           )
    //         })
    //       })
    //     }
    //   })
    //   .catch(err => {
    // this.setState({
    //   message_desc: "Error While Getting Projects.",
    //   message_heading: "Getting Projects",
    //   openMessageModal: true,
    // })
    // toast.error('Error While Getting Projects')
    // })
    // await this.setState({
    //   isLoading: false
    // })
    await this.setState({
      projects: this.props.history.location.state.projects,
    });
  };

  getTemplates = async () => {
    await this.setState({
      isLoading: true,
    });
    await API.post("pivot", "/getTemplate", {
      body: {
        buguid: this.state.selectedProject.guid,
      },
    })
      .then((data) => {
        var xy = data;
        data = xy.sort(function (a, b) {
          var nameA = a.TemplateName.toUpperCase();
          var nameB = b.TemplateName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        const options = data.map((value, index) => {
          return {
            label: value["TemplateName"],
            value: index,
          };
        });
        this.setState({
          options,
          templates: data,
        });
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error While Getting Templates.",
          message_heading: "Getting Templates",
          openMessageModal: true,
        });
        // toast.error('Templates Not Found');
      });
    await this.allColumnsOfTemplates();
    await this.setState({
      isLoading: false,
    });
  };

  updatetemplateinlocal = (tmpid) => {
    var guids = localStorage.getItem("templateguid");

    if (!guids || guids === "" || guids === null || guids.length === 0) {
      var guids = [];

      guids.push({
        project: this.state.selectedProject.guid,
        template: tmpid,
        data: [],
      });
      localStorage.setItem("templateguid", JSON.stringify(guids));
    } else {
      var guids = JSON.parse(localStorage.getItem("templateguid"));

      var selectedhistory = guids.find((e) => {
        return e.project === this.state.selectedProject.guid;
      });

      if (selectedhistory === undefined) {
        guids.push({
          project: this.state.selectedProject.guid,
          template: tmpid,
          data: [],
        });
        localStorage.setItem("templateguid", JSON.stringify(guids));
      } else {
        selectedhistory.template = tmpid;
        localStorage.setItem("templateguid", JSON.stringify(guids));
      }
    }
  };

  removeoldtemplatelocal = async (id) => {
    var guids = localStorage.getItem("templateguid");
    if (guids && guids !== "" && guids !== null && guids.length !== 0) {
      var guids = JSON.parse(localStorage.getItem("templateguid"));
      guids = guids.filter((e) => {
        return e.template !== id;
      });
      localStorage.setItem("templateguid", JSON.stringify(guids));
    }
  };

  getProjectByGuid = async (guid) => {
    await API.post("pivot", "/getProjectByGuid", {
      body: {
        guid: guid,
      },
    })
      .then((data) => {
        this.setState({
          selectedProject: data,
          currentproject: data,
        });
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error While Getting Project.",
          message_heading: "Getting Project",
          openMessageModal: true,
        });
        // toast.error('Projects Fetched Failed');
      });
  };

  getTemplateByGuid = async (guid) => {
    var obj = "";
    // this.setState({
    //   isLoading: true
    // });
    // await API.post('pivot', '/getTemplateByGuid', {
    //     body: {
    //       guid: guid
    //     },
    //   })
    //   .then((data) => {
    //     // toast.success("Template fetched Successfully");
    //     obj = data;
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       message_desc: "Error While Getting Template.",
    //       message_heading: "Getting Template",
    //       openMessageModal: true,
    //     })
    //     // toast.error('template failed');
    //   });

    obj = this.state.templates.find((template) => template.guid === guid);

    // this.setState({
    //   isLoading: false
    // });
    if (obj !== "" && obj !== null) {
      await this.setState({
        editTemplateModal: obj,
      });

      await this.setState({
        check_zero_rows: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].ZeroRows
          : this.state.check_zero_rows,

        check_blank_row: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].BlankRows
          : this.state.check_blank_row,

        check_heading_totals: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].HeadingsTotals
          : this.state.check_heading_totals,

        check_hidden_columns: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].HiddenColumns
          : this.state.check_hidden_columns,

        fontsizetemplate: this.state.selectedProject.FontSize
          ? this.state.selectedProject.FontSize
          : 0,

        templateselectvalue: this.state.editTemplateModal.TemplateName,

        selectedtempguid: this.state.editTemplateModal.guid,

        blankrow: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].BlankRows
          : this.state.check_blank_row,

        hiddencolumn: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].HiddenColumns
          : this.state.check_hidden_columns,

        headingTotal: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].HeadingsTotals
          : this.state.check_heading_totals,

        CheckZero: this.state.editTemplateModal
          ? this.state.editTemplateModal.Exclude[0].ZeroRows
          : this.state.check_zero_rows,

        changeExpenseOnly:
          this.state.editTemplateModal &&
          this.state.editTemplateModal.ExpenseOnly
            ? this.state.editTemplateModal.ExpenseOnly
            : false,
      });
    } else {
      await this.updatetemplateinlocal(this.state.templates[0].guid);
      await this.gettemplateanddata(this.state.templates[0].guid);
    }
  };

  getcolumnbytemplateguid = async (guid) => {
    this.setState({
      isLoading: true,
    });
    var columns = [];
    var guids = this.state.editTemplateModal.Columns;

    // columns = await this.getColumnByTemplateGuidcall(guids);
    guids.map((guid) => {
      let column = this.state.allcolumnsoftemp.find(
        (column) => column.guid === guid
      );
      if (column) {
        columns.push(column);
      }
    });
    await this.setState({
      columns: columns,
    });

    await this.headerColumnsInOrder();
    await this.getPivotData(); //geting rows data

    this.setState({
      isLoading: false,
    });
  };

  getColumnByTemplateGuidcall = async (guids) => {
    let filterGuids = [];
    let columns = [];
    guids.map(function (item) {
      if (filterGuids.find((secitem) => secitem === item) === undefined) {
        filterGuids.push(item);
      }
    });
    guids = filterGuids;

    let loftemp = guids.length / 90;
    for (let i = 0; i < Math.ceil(loftemp) * 90; i = i + 90) {
      let arraytosend = guids.slice(i, i + 90);
      await API.post("pivot", "/getColumnByTemplateGuid", {
        body: {
          guid: arraytosend,
          tenantguid: localStorage.getItem("tenantguid"),
        },
      })
        .then((data) => {
          columns = columns.concat(data.Responses.PivotColumns);
        })
        .catch((error) => {
          this.setState({
            message_desc:
              "Columns didn't fetch. Kindly repeat this process again.",
            message_heading: "Getting Columns",
            openMessageModal: true,
          });
          // toast.error("Columns didn't fetch. Kindly repeat this process again.");
        });
    }
    return columns;
  };

  getColumsByMultipleTemplates = async (guids) => {
    let filterGuids = [];
    let columns = [];
    guids.map(function (item) {
      if (filterGuids.find((secitem) => secitem === item) === undefined) {
        filterGuids.push(item);
      }
    });
    guids = filterGuids;

    let loftemp = guids.length / 90;
    for (let i = 0; i < Math.ceil(loftemp) * 90; i = i + 90) {
      let arraytosend = guids.slice(i, i + 90);
      await API.post("pivot", "/getColumsbyMultipleTemplates", {
        body: {
          templates: arraytosend,
        },
      })
        .then((data) => {
          columns = columns.concat(data.Responses.PivotColumns);
        })
        .catch((error) => {
          this.setState({
            message_desc:
              "Columns didn't fetch. Kindly repeat this process again.",
            message_heading: "Getting Columns",
            openMessageModal: true,
          });
          // toast.error("Columns didn't fetch. Kindly repeat this process again.");
        });
    }
    return columns;
  };

  getPivotData = async () => {
    let pivotData = [];
    let guid = this.state.buguid;
    let tenantguids = localStorage.getItem("tenantguid");
    var bodypost = {
      buguid: guid,
      tenantguid: tenantguids,
    };
    this.setState({
      isLoading: true,
    });

    var flag = false;
    while (flag === false) {
      await API.post("pivot", "/getPivotDataByTandB", {
        body: bodypost,
      })
        .then((data) => {
          // toast.success("Pivot Data Fetched Successfully");
          data.Items.map((s) => {
            pivotData.push(s);
          });
          if (data.LastEvaluatedKey) {
            bodypost.LastEvaluatedKey = data.LastEvaluatedKey;
          } else {
            flag = true;
          }
        })
        .catch((err) => {
          this.setState({
            message_desc: "Pivot Data Fetched Failed.",
            message_heading: "Pivot Data",
            openMessageModal: true,
          });
          // toast.error('Pivot Data Fetched Failed')
        });
    }

    if (pivotData.length > 0) {
      await this.setState({
        originalData: JSON.parse(JSON.stringify(pivotData)),
      });
      await this.orderPivotData(pivotData); //order rows according to table header
    } else {
      await this.setState({
        pivotGroupTag: [],
        finaldata: [],
        pivotData: [],
      });
    }

    this.setState({
      isLoading: false,
    });
  };

  getUserByGuid = async () => {
    let guid = localStorage.getItem("guid");
    await API.post("pivot", "/getUserByGuid", {
      body: {
        guid,
      },
    })
      .then(async (data) => {
        let object = {
          project_access: data.Item.projectAccess,
          image_from_bucket:
            data.Item.Avatar !== "filename" ? data.Item.Avatar : "",
          disableUser: data.Item.type === "View" ? true : false,
          user: data.Item,
          // disableUser: true
        };
        if (this.props.history.location.state.user_type === undefined) {
          object["user_type"] = data.Item.type;
        }
        await this.setState(object);
      })
      .catch((err) => {
        this.setState({
          message_desc: "User Not Found.",
          message_heading: "User",
          openMessageModal: true,
        });
        // toast.error('User Not Found');
        // this.setState({ openMessageModal: true })
      });
    if (
      this.state.image_from_bucket !== "" &&
      this.state.image_from_bucket.includes("http") == false
    ) {
      this.setState({
        profile_image:
          "https://" +
          process.env.REACT_APP_S3_BUCKET +
          ".s3.amazonaws.com/public/profileimages/" +
          this.state.image_from_bucket,
      });
    } else if (this.state.image_from_bucket.includes("http") == true) {
      this.setState({
        profile_image: this.state.image_from_bucket,
      });
    }
  };

  allcheck = async (e) => {
    var x = e.target.checked;
    // console.log(e.target.checked, "3333333333333", e.target.value)
    await this.setState({
      select_all_check: x,
    });
    var y = this.state.finaldata;

    y.map((value) => {
      value.checkbox = x;
      document
        .getElementById(`${value.guid + "_span"}`)
        .classList.remove("span_dim_color");
    });

    var yy = this.state.pivotGroupTag;
    yy.map((value) => {
      value.checkbox = x;
    });

    this.setState({
      finaldata: y,
      pivotGroupTag: yy,
    });
    await this.redRowHandler();
  };

  addTemplate = async ({ body = {} }) => {
    var templateguid = uuidv1();

    const { selectedProject, addTemplateModal } = this.state;
    const exclude = [
      {
        BlankRows: false,
        HeadingsTotals: false,
        HiddenColumns: false,
        ZeroRows: false,
      },
    ];
    if (addTemplateModal !== "") {
      await this.setState({
        isLoading: true,
      });
      var success = false;
      var cols = [];
      this.state.orderColumns.map((u) => {
        if (u.Type == "System") {
          cols.push(u.guid);
        }
      });
      console.log(cols, "-----------------");

      await API.post("pivot", "/addTemplate", {
        body: {
          buguid: selectedProject.guid,
          exclude: exclude,
          fontsize: 0,
          guid: templateguid,
          name: addTemplateModal,
          columns: cols,
          tenantguid: localStorage.tenantguid,
          ExpenseOnly: false,
        },
      })
        .then((data) => {
          // toast.success("Template Added");
          console.log(data);
          this.setState({
            addTemplateModal: "",
            new_created_temp_guid: data.params.guid,
            newColumns: data.params.Columns,
          });
          this.closeModal("openAddTemplateModal");
          success = true;
        })
        .catch((err) => {
          this.setState({
            message_desc: "Templates Not Found.",
            message_heading: "Templates",
            openMessageModal: true,
          });
          // toast.error('Templates Not Found');
        });
      if (success) {
        var columnsArray = [];
        var api = [];
        var obj = {
          APICall: null,
          TrackingCat: null,
          TrackingCatID: null,
          TrackingCode: null,
          TrackingCodeID: null,
        };
        api.push(obj);
        var newguids = [];
        for (var i = 0; i < 10; i++) {
          var guids = uuidv1();

          var objs = {
            API: api,
            Alignment: "Left",
            ColumnName: "Blank",
            DoNotCalculate: false,
            PeriodClear: false,
            TotalColumn: false,
            Format: null,
            Formula: null,
            Hide: false,
            PrevColumnGuid: null,
            TemplateGuid: this.state.new_created_temp_guid,
            TenantGuid: localStorage.tenantguid,
            Type: "Entry",
            Width: 20,
            guid: guids,
          };
          columnsArray.push(objs);
          newguids.push(guids);
        }
        var colguid = newguids;

        await this.addColumnBatch(columnsArray);

        var ss = this.state.newColumns;
        if (colguid.length > 0) {
          colguid.map((u) => {
            ss.push(u);
          });
        }
        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotTemplates",
            guid: this.state.new_created_temp_guid,
            fieldname: "Columns",
            value: ss,
          },
        })
          .then(async (data) => {
            console.log(data, "pakistna");
            // toast.success("Columns Updated Successfully.");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Columns Not Updated!",
              message_heading: "Columns",
              openMessageModal: true,
            });
            // toast.error('Columns Not Updated!');
          });

        var colsArray = [];
        if (colguid.length > 0) {
          colguid.map((u) => {
            var obj = {
              AmountValue: "0",
              TextValue: null,
              ColumnGuid: u,
            };
            colsArray.push(obj);
          });

          var x = this.state.originalData;
          x.map((u) => {
            if (u.Columns && u.Columns.length > 0) {
              colsArray.map((v) => {
                u.Columns.push(v);
              });
            }
          });
          var lofdata = Math.ceil(x.length / 20);
          for (var i = 0; i < lofdata * 20; i = i + 20) {
            var arraytosend = x.slice(i, i + 20);
            await API.post("pivot", "/copypivotdata", {
              body: {
                pivotdata: arraytosend,
              },
            })
              .then((data) => {
                // toast.success('data added');
              })
              .catch((err) => {
                this.setState({
                  message_desc: "Copydata request failed",
                  message_heading: "Pivot Data",
                  openMessageModal: true,
                });
                // toast.error('copydata request failed');
              });
          }
          console.log(x, "=-datas");
        }

        await this.getTemplates();
        await this.updatetemplateinlocal(this.state.new_created_temp_guid);
        await this.gettemplateanddata(this.state.new_created_temp_guid);
      }
      await this.setState({
        isLoading: false,
      });
    }
  };

  postEditedTemplate = async (editTemplateName) => {
    const { selectedProject, editTemplateModal } = this.state;

    await API.post("pivot", "/addTemplate", {
      body: {
        buguid: selectedProject.guid,
        exclude: editTemplateModal.Exclude,
        fontsize: editTemplateModal.FontSize,
        name: editTemplateName,
        tenantguid: localStorage.tenantguid,
        guid: editTemplateModal.guid,
        ExpenseOnly: editTemplateModal.ExpenseOnly,
      },
    })
      .then(async (data) => {
        // toast.success("Template Added");
        await this.setState({
          editTemplateModal: {},
        });
      })
      .catch((err) => {
        this.setState({
          message_desc: "Templates Not Found",
          message_heading: "Templates",
          openMessageModal: true,
        });
        // toast.error('Templates Not Found');
      });
  };

  addTemplateModalHandler = async (addTemplateModal) => {
    await this.setState({
      addTemplateModal,
    });
    this.addTemplate(addTemplateModal);

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Worktable Option",
        Description: "Add Template",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        ValueTo: addTemplateModal,
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);
  };

  editTemplateModalHandler = async (editTemplateName) => {
    this.postEditedTemplate(editTemplateName);
  };

  handleSelectChange = async (event) => {
    await this.setState({ isLoading: true }, async () => {
      await this.clearfilter();
      let fieldValue = event["label"];
      let selectedtempguid = JSON.parse(
        JSON.stringify(this.state.selectedtempguid)
      );
      let tempguid = this.state.templates[event["value"]].guid;

      setTimeout(() => {
        this.updatetemplateinlocal(tempguid);
        // // await this.gettemplateanddata(tempguid);
        this.validateSelectField(fieldValue);
        this.getTemplateDataOnChange(tempguid);

        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                User: localStorage.getItem("Email"),
                Datetime: dateTime,
                Module: "Worktable Option",
                Description: "Change Template",
                ProjectName: this.state.selectedProject.Name,
                Projectguid: this.state.selectedProject.guid,
                ColumnName: "",
                ValueFrom: this.state.templates.find(
                  (temp) => temp.guid === selectedtempguid
                ).TemplateName,
                ValueTo: this.state.templates.find(
                  (temp) => temp.guid === tempguid
                ).TemplateName,
                Tenantid: localStorage.getItem("tenantguid"),
              },
            ]);
          }, 1);
        });
        $("#closeRightSliderArrow").click();
      }, 1);
    });
  };

  validateSelectField = async (value) => {
    var formErrors = this.state.formErrors;
    let valueLength = this.getObjectLength(value);
    if (valueLength < 1) {
      formErrors.editTemplateModal = "This Field is Required.";
    } else if (!value) {
      formErrors.editTemplateModal = "This Field is Required.";
    } else {
      formErrors.editTemplateModal = "";
    }
    await this.setState({
      formErrors: formErrors,
    });
  };

  headerColumnsInOrder = async () => {
    // this.setState({
    //   isLoading: true
    // });
    var col = this.state.columns;
    var tem = this.state.editTemplateModal;
    var arr = [];
    tem &&
      tem.Columns &&
      tem.Columns.map((x, index) => {
        col.map((y) => {
          if (x == y.guid.trim()) {
            arr.push(y);
          }
        });
      });

    await this.setState({
      finaldata: [],
      orderColumns: arr,
      // isLoading: false
    });
  };

  orderPivotData = async (pivotData) => {
    let arr = [];
    // this.setState({
    //   isLoading: true
    // });
    let xs = false;
    let objs = {};
    let jj = [];
    let nam = "";
    pivotData.map((value, index) => {
      //columns and values arrangement get value against the column(sort)
      if (value.Columns) {
        var count = 1;
        this.state.orderColumns.map((x) => {
          nam = x.guid;

          value.Columns.map((y) => {
            if (x.guid.trim() === y.ColumnGuid.trim()) {
              xs = true;
              let uuid = JSON.parse(JSON.stringify(uuidv1()));
              objs = y;

              objs.uniqueCellId = uuid;
              objs.tabId = count;
              count = count + 1;
            }
          });
          if (xs === false) {
            let hh = {
              AmountValue: " ",
              ColumnGuid: nam,
              TextValue: " ",
            };
            arr.push({
              obj: hh,
            });
          }
          if (xs === true) {
            // objs.uniqueCellId = uuid;

            arr.push({
              obj: objs,
            });
            xs = false;
          }
        });
      }

      arr.push("nextrow");
    });

    let up = [];
    let down = [];
    let i = 0;

    for (let j = 0; j < arr.length; j++) {
      if (arr[j] !== "nextrow") {
        let ss = arr[j];
        down.push(arr[j]);
      }
      if (arr[j] === "nextrow") {
        up[i] = down;
        down = [];
        i = i + 1;
      }
    }

    let d = pivotData;
    for (let ii = 0; ii < d.length; ii++) {
      for (let jj = 0; jj < up.length; jj++) {
        if (ii === jj) {
          d[ii].Columns = up[jj];
        }
      }
      if (
        d[ii].Columns[0].obj.TextValue === "" ||
        d[ii].Columns[0].obj.TextValue === null
        // ||
        //   d[ii].Columns[0].obj.TextValue === " ") &&
        // (d[ii].Columns[0].obj.AmountValue === "0" ||
        // d[ii].Columns[0].obj.AmountValue === ""
      ) {
        d[ii].isAccountEmpty = true;
      } else {
        d[ii].isAccountEmpty = false;
      }
    }

    await this.setState({
      pivotData: d.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
    });

    // this.setState({
    //   isLoading: false
    // });

    if (this.state.pivotData.length > 0) {
      await this.groupingLevel(this.state.pivotData);
    }
  };

  groupingLevel = async (pivotdata) => {
    // await this.setState({
    //   isLoading: true
    // })

    var data = pivotdata;
    var columnguid = "";
    var objtmp;

    /**
     * updatedPivotTag.nonHiddenRows: These rows contains those groups whose property {{Hide}} is false.
     * updatedPivotTag.hiddenRows: These rows contains those groups whose property {{Hide}} is true.
     * finaldata.nonHiddenRows: These rows contains those groups whose property {{Hide}} is false.
     * That's why hidden rows need to be hide here.
     */
    let { selectedProject, get_groupsd, orderColumns } = this.state;
    let hiddenGroups = get_groupsd.filter((group) => group.Hide);
    let groupGuid = orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "GROUPS"
    ).guid;
    let updatedPivotTag = await this.removeHideRows(
      data,
      hiddenGroups,
      groupGuid,
      selectedProject.OnConflict ? selectedProject.OnConflict : false
    );

    await this.setState({
      pivotGroupTag: updatedPivotTag.nonHiddenRows,
      pivotGroupTagHiddenRows: updatedPivotTag.hiddenRows,
    });

    data = updatedPivotTag.nonHiddenRows;

    await this.setState({
      pivotGroupTag: data,
    });
    await this.applyColumnFormula();

    /**
     * checkzero: This property determines either row is zero or not.
     *     If template ZeroRows = true then those rows having checkzero = false can display on screen.
     * AmountValue: Have no idea what this property does right now.
     */
    this.state.orderColumns.map((x) => {
      if (x.ColumnName.toUpperCase() == "LEVEL") {
        columnguid = x.guid;
      }
    });

    pivotdata = data;
    var x = this.state.orderColumns;
    pivotdata.map((value, index) => {
      //filterxero rows
      var checkzero = true;
      if (value.Columns && value.Columns.length > 0) {
        value.Columns.map((val, inde) => {
          //setting level as a amunt value
          if (val.obj.ColumnGuid == columnguid) {
            data[index].AmountValue = val.obj.AmountValue;
          }
          //filterxero rows

          //checking system columns
          var issystem = this.state.orderColumns.find(
            (d) => d.guid === val.obj.ColumnGuid
          );
          if (checkzero === true && issystem.Type !== "System") {
            // if (x[inde].Format != "TEXT") {
            // if (
            // (val.obj.TextValue == " " || val.obj.TextValue == null) &&
            // val.obj.AmountValue == 0
            // ) {
            // checkzero = true;
            // }
            // } else if (x[inde].Format == "TEXT") {
            // checkzero = false;
            // }

            if (
              (val.obj.TextValue == " " ||
                val.obj.TextValue == null ||
                val.obj.TextValue == 0) &&
              val.obj.AmountValue == 0
            ) {
              checkzero = true;
            } else {
              checkzero = false;
            }
          }
          data[index].clicked = false;
        });
      }
      if (value.Type !== "Total" && value.Type !== "Header") {
        data[index].checkzero = checkzero;
      } else {
        data[index].checkzero = false;
      }
    });

    var lastlevel = "";

    var rootlastguid;
    var rootindex;
    for (var i = 0; i < data.length; i++) {
      //checking the blank row and setting carrot and data for calculations
      if (data[i].AmountValue) {
        if (data[i].Type === "Header") {
          data[i].carrot = true;
        } else {
          data[i].carrot = false;
        }
        if (data[i].ParentGuid == "root") {
          objtmp = data[i];
          rootindex = i;
          rootlastguid = data[i].guid;
        }
      } else if (data[i].ParentGuid == "root") {
        objtmp = data[i];
        rootindex = i;
        rootlastguid = data[i].guid;
      } else {
        data[i].carrot = false;
      }
    }
    //setting checkboxes
    data.map((e) => {
      e.checkbox = false;
    });

    //
    // // get the first four columns for ignoring them to plus their values;
    // var levelguid = '';
    // var descriptionguid = '';
    // var accountguid = '';
    // var groupguid = '';
    // this.state.orderColumns.map((vals, ind) => {
    // if (vals.ColumnName.toUpperCase() == 'LEVEL') {
    // levelguid = vals.guid;
    // }
    // if (vals.ColumnName.toUpperCase() == 'DESCRIPTION') {
    // descriptionguid = vals.guid;
    // }
    // if (vals.ColumnName.toUpperCase() == 'ACCOUNT') {
    // accountguid = vals.guid;
    // }
    // if (vals.ColumnName.toUpperCase() == 'GROUPS') {
    // groupguid = vals.guid;
    // }
    // });
    //
    // // get the last index of root
    //
    // var lastfindex = '';
    // for (var i = 0; i < this.state.pivotGroupTag.length; i++) {
    // if (this.state.pivotGroupTag[i].ParentGuid === rootlastguid) {
    // lastfindex = i;
    // }
    // }
    //
    // var totalofall = objtmp.Columns; //root object
    // totalofall.map((value, index) => {
    // //setting values of columns to zero for plus the values, exept first 4 columns
    // if (
    // value.obj.ColumnGuid != accountguid &&
    // value.obj.ColumnGuid != levelguid &&
    // value.obj.ColumnGuid != descriptionguid &&
    // value.obj.ColumnGuid != groupguid
    // ) {
    // if (
    // this.state.orderColumns[index].Format != 'TEXT' &&
    // this.state.orderColumns[index].TotalColumn == true
    // ) {
    // totalofall[index].obj.AmountValue = '0';
    // if (value.obj.TextValue == null) {
    // totalofall[index].obj.TextValue = '0';
    // } else {
    // totalofall[index].obj.TextValue = '0';
    // }
    // } else {
    // totalofall[index].obj.AmountValue = '';
    // totalofall[index].obj.TextValue = '';
    // }
    // }
    // });
    //
    // //plus the values
    // for (var i = rootindex + 1; i < lastfindex; i++) {
    // if (
    // this.state.pivotGroupTag[i].Type !== 'Total' &&
    // this.state.pivotGroupTag[i].Type !== 'Header' &&
    // this.state.pivotGroupTag[i].Columns.length > 0
    // ) {
    // totalofall.map((value, index) => {
    // if (
    // this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
    // accountguid &&
    // this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
    // levelguid &&
    // this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
    // descriptionguid &&
    // this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
    // groupguid
    // )
    // if (
    // this.state.orderColumns[index].Format == 'TEXT' ||
    // this.state.orderColumns[index].TotalColumn == false
    // ) {
    // //override value for the text type column (string)
    // if (
    // this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
    // ' ' ||
    // this.state.pivotGroupTag[i].Columns[index].obj.TextValue == null
    // ) {
    // value.obj.AmountValue =
    // '';
    // /*this.state.pivotGroupTag[i].Columns[
    // index
    // ].obj.AmountValue;*/
    // } else {
    // value.obj.TextValue =
    // '';
    // /*this.state.pivotGroupTag[i].Columns[
    // index
    // ].obj.TextValue;*/
    // }
    // }
    // //plus the values other than text
    // else if (
    // this.state.pivotGroupTag[i].Columns[index].obj.TextValue == ' ' ||
    // this.state.pivotGroupTag[i].Columns[index].obj.TextValue == null
    // ) {
    // value.obj.AmountValue =
    // parseFloat(JSON.parse(JSON.stringify(value.obj.AmountValue))) +
    // parseFloat(
    // JSON.parse(
    // JSON.stringify(
    // this.state.pivotGroupTag[i].Columns[index].obj.AmountValue
    // )
    // )
    // );
    // } else {
    // value.obj.TextValue =
    // parseFloat(JSON.parse(JSON.stringify(value.obj.TextValue))) +
    // parseFloat(
    // JSON.parse(
    // JSON.stringify(
    // this.state.pivotGroupTag[i].Columns[index].obj.TextValue
    // )
    // )
    // );
    // }
    // });
    // }
    // }
    //
    // totalofall.map((value, index) => {
    // if (
    // value.obj.ColumnGuid != accountguid &&
    // value.obj.ColumnGuid != levelguid &&
    // value.obj.ColumnGuid != descriptionguid &&
    // value.obj.ColumnGuid != groupguid
    // ) {
    // if (value.obj.TextValue != 0 && value.obj.AmountValue != 0) {
    // value.obj.TextValue =
    // parseFloat(value.obj.TextValue) + parseFloat(value.obj.AmountValue);
    // }
    // }
    // });
    //
    // totalofall.map((value, index) => {
    // if (
    // value.obj.ColumnGuid != accountguid &&
    // value.obj.ColumnGuid != levelguid &&
    // value.obj.ColumnGuid != descriptionguid &&
    // value.obj.ColumnGuid != groupguid
    // ) {
    // if (
    // this.state.orderColumns[index].Format != 'TEXT' &&
    // this.state.orderColumns[index].TotalColumn == true
    // ) {
    // if (
    // value.obj.TextValue == '0' ||
    // value.obj.TextValue.toString() == 'NaN'
    // ) {
    // value.obj.TextValue = ' ';
    // }
    // if (value.obj.AmountValue == null) {
    // value.obj.AmountValue = '0';
    // } else if (value.obj.AmountValue.toString() === 'NaN') {
    // value.obj.AmountValue = '0';
    // }
    // } else {
    // value.obj.AmountValue = '';
    // value.obj.TextValue = '';
    // }
    // }
    // });
    //
    // objtmp.Columns = totalofall;
    this.calculateData(objtmp);

    // await this.setState({ finaldata: [objtmp] });
    var historys = this.state.pivotGroupTag;
    var guids = localStorage.getItem("templateguid");

    if (guids && guids !== "" && guids !== null && guids.length !== 0) {
      guids = JSON.parse(guids).filter(
        (project) => project.template !== this.state.selectedtempguid
      );

      var parsed_guids = JSON.parse(localStorage.getItem("templateguid"));
      parsed_guids = parsed_guids.filter(
        (project) => project.template !== this.state.selectedtempguid
      );

      var exist = parsed_guids.filter((e) => {
        return e.project === this.state.selectedProject.guid;
      });
      //get already stored template data
      if (exist[0] && exist[0].data) {
        var history_rplace = [];
        historys.map((his) => {
          var found = exist[0].data.filter((v) => v.record_guid === his.guid);
          if (found.length > 0) {
            his.clicked = found[0].record_clicked;
            his.carrot = found[0].record_carrot;
            history_rplace.push(his);
          }
        });

        if (exist[0].data.length > 0) {
          history_rplace.map((v) => {
            if (v.clicked == true && v.carrot == true && v.Type != "Blank") {
              var obj = history_rplace.find(
                (u) => u.ParentGuid == v.guid && u.Type == "Total"
              );

              v.Columns.map((s, i) => {
                if (i > 3) {
                  obj.Columns[i].obj.TextValue = JSON.parse(
                    JSON.stringify(s.obj.TextValue)
                  );
                  obj.Columns[i].obj.AmountValue = JSON.parse(
                    JSON.stringify(s.obj.AmountValue)
                  );
                  s.obj.TextValue = "";
                  s.obj.AmountValue = "";
                }
              });
            }
            if (v.Type === "Header") {
              this.calculateData(v);
            }
          });
          await this.setState({
            finaldata: history_rplace,
          });
          await this.replaceHistory(history_rplace);
        } else {
          await this.setState({
            finaldata: [objtmp],
          });
          await this.replaceHistory([objtmp]);
        }
      } else {
        await this.setState({
          finaldata: [objtmp],
        });
        await this.replaceHistory([objtmp]);
      }
    } else {
      await this.setState({
        finaldata: [objtmp],
      });
      await this.replaceHistory([objtmp]);
    }

    await this.setState({
      pivotGroupTag: historys,
      //finaldata: this.state.finaldata
    });

    if (
      this.state.CheckZero ||
      this.state.headingTotal ||
      this.state.check_blank_row ||
      this.state.headingTotal
    ) {
      await this.applyingfilter();
    }
    await this.setState({
      // isLoading: false,
      allNodes:
        this.state.pivotGroupTag.length === this.state.finaldata.length
          ? true
          : false,
    });

    await this.calculateAllTotals(this.state.pivotGroupTag);
    //this.tes();
  };

  groupingLevelUnmutable = async (pivotdata) => {
    var data = pivotdata;
    var columnguid = "";
    var objtmp;

    /**
     * updatedPivotTag.nonHiddenRows: These rows contains those groups whose property {{Hide}} is false.
     * updatedPivotTag.hiddenRows: These rows contains those groups whose property {{Hide}} is true.
     * finaldata.nonHiddenRows: These rows contains those groups whose property {{Hide}} is false.
     * That's why hidden rows need to be hide here.
     */
    let { selectedProject, get_groupsd, orderColumns } = this.state;
    let hiddenGroups = get_groupsd.filter((group) => group.Hide);
    let groupGuid = orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "GROUPS"
    ).guid;
    let updatedPivotTag = await this.removeHideRows(
      data,
      hiddenGroups,
      groupGuid,
      selectedProject.OnConflict ? selectedProject.OnConflict : false
    );

    await this.setState({
      pivotGroupTag: updatedPivotTag.nonHiddenRows,
      pivotGroupTagHiddenRows: updatedPivotTag.hiddenRows,
    });

    data = updatedPivotTag.nonHiddenRows;

    await this.setState({
      pivotGroupTag: data,
    });
    await this.applyColumnFormula();

    /**
     * checkzero: This property determines either row is zero or not.
     *     If template ZeroRows = true then those rows having checkzero = false can display on screen.
     * AmountValue: Have no idea what this property does right now.
     */
    this.state.orderColumns.map((x) => {
      if (x.ColumnName.toUpperCase() == "LEVEL") {
        columnguid = x.guid;
      }
    });

    pivotdata = data;
    var x = this.state.orderColumns;
    pivotdata.map((value, index) => {
      //filterxero rows
      var checkzero = true;
      if (value.Columns && value.Columns.length > 0) {
        value.Columns.map((val, inde) => {
          //setting level as a amunt value
          if (val.obj.ColumnGuid == columnguid) {
            data[index].AmountValue = val.obj.AmountValue;
          }
          //filterxero rows

          //checking system columns
          var issystem = this.state.orderColumns.find(
            (d) => d.guid === val.obj.ColumnGuid
          );
          if (checkzero === true && issystem.Type !== "System") {
            // if (x[inde].Format != "TEXT") {
            // if (
            // (val.obj.TextValue == " " || val.obj.TextValue == null) &&
            // val.obj.AmountValue == 0
            // ) {
            // checkzero = true;
            // }
            // } else if (x[inde].Format == "TEXT") {
            // checkzero = false;
            // }

            if (
              (val.obj.TextValue == " " ||
                val.obj.TextValue == null ||
                val.obj.TextValue == 0) &&
              val.obj.AmountValue == 0
            ) {
              checkzero = true;
            } else {
              checkzero = false;
            }
          }
          // data[index].clicked = false
        });
      }
      if (value.Type !== "Total" && value.Type !== "Header") {
        data[index].checkzero = checkzero;
      } else {
        data[index].checkzero = false;
      }
    });

    // var lastlevel = ''

    // var rootlastguid
    // var rootindex
    for (var i = 0; i < data.length; i++) {
      //checking the blank row and setting carrot and data for calculations
      if (data[i].AmountValue) {
        // if (data[i].Type === 'Header') {
        //   data[i].carrot = true
        // } else {
        //   data[i].carrot = false
        // }
        if (data[i].ParentGuid == "root") {
          objtmp = data[i];
          // rootindex = i
          // rootlastguid = data[i].guid
        }
      } else if (data[i].ParentGuid == "root") {
        objtmp = data[i];
        // rootindex = i
        // rootlastguid = data[i].guid
      } else {
        // data[i].carrot = false
      }
    }

    await this.calculateData(objtmp);

    // var historys = this.state.pivotGroupTag
    // var guids = localStorage.getItem('templateguid')

    // if (guids && guids !== '' && guids !== null && guids.length !== 0) {
    //   guids = JSON.parse(guids).filter(project => project.template !== this.state.selectedtempguid)

    //   var parsed_guids = JSON.parse(localStorage.getItem('templateguid'))
    //   parsed_guids = parsed_guids.filter(project => project.template !== this.state.selectedtempguid)

    //   var exist = parsed_guids.filter(e => {
    //     return e.project === this.state.selectedProject.guid
    //   })
    //   //get already stored template data
    //   if (exist[0] && exist[0].data) {
    //     var history_rplace = []
    //     historys.map(his => {
    //       var found = exist[0].data.filter(v => v.record_guid === his.guid)
    //       if (found.length > 0) {
    //         his.clicked = found[0].record_clicked
    //         his.carrot = found[0].record_carrot
    //         history_rplace.push(his)
    //       }
    //     })

    //     if (exist[0].data.length > 0) {
    //       history_rplace.map(v => {
    //         if (v.clicked == true && v.carrot == true && v.Type != 'Blank') {
    //           var obj = history_rplace.find(
    //             u => u.ParentGuid == v.guid && u.Type == 'Total'
    //           )

    //           v.Columns.map((s, i) => {
    //             if (i > 3) {
    //               obj.Columns[i].obj.TextValue = JSON.parse(
    //                 JSON.stringify(s.obj.TextValue)
    //               )
    //               obj.Columns[i].obj.AmountValue = JSON.parse(
    //                 JSON.stringify(s.obj.AmountValue)
    //               )
    //               s.obj.TextValue = ''
    //               s.obj.AmountValue = ''
    //             }
    //           })
    //         }
    //         if (v.Type === 'Header') {
    //           this.calculateData(v)
    //         }
    //       })
    //       await this.setState({
    //         finaldata: history_rplace
    //       })
    //       await this.replaceHistory(history_rplace)
    //     } else {
    //       await this.setState({
    //         finaldata: [objtmp]
    //       })
    //       await this.replaceHistory([objtmp])
    //     }
    //   } else {
    //     await this.setState({
    //       finaldata: [objtmp]
    //     })
    //     await this.replaceHistory([objtmp])
    //   }
    // } else {
    //   await this.setState({
    //     finaldata: [objtmp]
    //   })
    //   await this.replaceHistory([objtmp])
    // }

    // await this.setState({
    //   pivotGroupTag: historys,
    //   finaldata: this.state.finaldata
    // })

    await this.setState({
      pivotGroupTag: this.state.pivotGroupTag,
    });

    if (
      this.state.CheckZero ||
      this.state.headingTotal ||
      this.state.check_blank_row ||
      this.state.headingTotal
    ) {
      await this.applyingfilter();
    }
    // await this.setState({
    //   // isLoading: false,
    //   allNodes: this.state.pivotGroupTag.length === this.state.finaldata.length ? true : false
    // })

    await this.calculateAllTotals(this.state.pivotGroupTag);
  };

  handleChangeCheckbox = async (checkBoxName, isChecked) => {
    // console.log(this.state.editTemplateModal, "check box value");
    let { selectedProject } = this.state;

    if (checkBoxName === "check_zero_rows") {
      this.setState({
        check_zero_rows: isChecked,
      });
    }
    if (checkBoxName === "check_blank_row") {
      this.setState({
        check_blank_row: isChecked,
      });
    }
    if (checkBoxName === "check_hidden_columns") {
      this.setState({
        check_hidden_columns: isChecked,
      });
    }
    if (checkBoxName === "check_heading_totals") {
      this.setState({
        check_heading_totals: isChecked,
      });
    }
    if (checkBoxName === "on_conflict_hide_group_list") {
      let previousValue = JSON.parse(
        JSON.stringify(
          selectedProject.OnConflict ? selectedProject.OnConflict : false
        )
      );
      selectedProject.OnConflict = isChecked;
      await this.setState({
        selectedProject,
      });

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          User: localStorage.getItem("Email"),
          Datetime: dateTime,
          Module: "Groups List",
          Description: "On conflict hide",
          ProjectName: this.state.selectedProject.Name,
          Projectguid: this.state.selectedProject.guid,
          ColumnName: "",
          ValueFrom: previousValue ? "Yes" : "No",
          ValueTo: isChecked ? "Yes" : "No",
          Tenantid: localStorage.getItem("tenantguid"),
        },
      ]);

      await this.updateGroupsHelper();

      API.post("pivot", "/updatefields", {
        body: {
          table: "PivotBusinessUnit",
          guid: this.state.selectedProject.guid,
          fieldname: "OnConflict",
          value: isChecked,
        },
      })
        .then(async (data) => {
          // toast.success("Template Name Updated");
        })
        .catch((err) => {
          this.setState({
            message_desc: "Project on conflict hide property not saved",
            message_heading: "Project",
            openMessageModal: true,
          });
          // toast.error('Template Name Not Updated');
        });
    }
    // this.state.editTemplateModal.Exclude !== undefined ? this.state.editTemplateModal.Exclude[0]["ZeroRows"] : false
  };

  openModal = async (name) => {
    console.log(">>>>", name);
    if (name === "openRefreshModal") {
      await this.setState({
        openRefreshModal: true,
      });
      $(document).ready(function () {
        $("#refresh_btn_ok").focus();
      });
    }
    if (name === "openFilterModal") {
      await this.setState({
        openFilterModal: true,
      });
      $(document).ready(function () {
        $("#filter").focus();
      });
    }
    if (name === "openAddEditColumn") {
      // this is for focus on First field of AddEdit Modal
      focusOn({ id: "add_column_before" });
    }
    if (name === "openReportsModal") {
      await this.setState({
        isLoading: true,
      });
      if (this.state.layouts.length === 0) {
        await this.getLayouts();
      }
      await this.getReportdata();

      await this.setState({
        openReportsModal: true,
      });

      $(document).ready(function () {
        $("#select_layout_report").focus();
      });
      await this.setState({
        isLoading: false,
      });
    }
    if (name === "openAddTemplateModal") {
      await this.setState({
        openAddTemplateModal: true,
      });
      $(document).ready(function () {
        $(this).find("#key").focus();
      });
    }
    if (name === "openProfileModal") {
      await this.setState({
        openProfileModal: true,
      });
      $(document).ready(function () {
        $("#profile_focus>div").attr("tabindex", 0).focus();
      });
    }
    if (name === "openShareModal") {
      $(document).ready(function () {
        $(".sm_signup_form input.share_email").focus();
      });
    }
    this.setState({
      [name]: true,
    });
  };

  getReportdata = async (
    template = "",
    optionalBody = {
      guid: template !== "" ? template : this.state.editTemplateModal.guid,
    }
  ) => {
    await API.post("pivot", "/getReportdata", {
      body: optionalBody,
    })
      .then((data) => {
        this.setState({
          reportdata: data,
        });
      })
      .catch((err) => {});
    await this.setState({
      temp_report: template,
    });
  };

  closeModal = (name) => {
    if (name === "openAddEditColumn") {
      this.setState({
        columnData: "",
        editColumn: false,
        openAddEditColumn: false,
      });
    } else {
      this.setState({
        [name]: false,
        groupValue: "",
      });
    }
  };

  getObjectLength = (object) => {
    return Object.keys(object).length;
  };

  changefont = async (select) => {
    let that = this;
    let { selectedProject } = this.state;
    await this.isLoading(true);

    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotBusinessUnit",
        guid: selectedProject.guid,
        fieldname: "FontSize",
        value: select.value,
      },
    })
      .then(async (data) => {
        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Worktable Option",
            Description: "Font",
            ProjectName: this.state.selectedProject.Name,
            Projectguid: this.state.selectedProject.guid,
            ColumnName: "",
            ValueFrom: JSON.parse(JSON.stringify(selectedProject.FontSize)),
            ValueTo: select.value,
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);
        selectedProject.FontSize = select.value;
        // await toast.success("Template Font Updated");
        await that.setState({
          selectedProject: selectedProject,
          fontsizetemplate: select.value,
          isLoading: false,
        });
      })
      .catch(async (err) => {
        // toast.error('Template Font Not Updated');
        await that.setState({
          message_desc: "Template Font Not Updated'",
          message_heading: "Template",
          openMessageModal: true,
          isLoading: false,
        });
      });
  };

  switchProject = async (event) => {
    await this.setState({
      isLoading: true,
    });
    let { projects } = this.state;
    // let projectType = projects.find(project => project.guid === event).Connection;

    //await this.refreshXeroToken()
    // if (projectType === "XERO") {
    //   let tokenObject = JSON.parse(localStorage.getItem('tokenObject'))
    //   if (tokenObject) {
    //     await API.post('pivot', '/xerotenants', {
    //       body: {
    //         clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
    //         clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
    //         redirectUris: process.env.REACT_APP_XERO_APP_URL,
    //         scopes: process.env.REACT_APP_XERO_APP_SCOPES,
    //         token: tokenObject
    //       }
    //     })
    //       .then(async (data) => {
    //         localStorage.setItem('tenants', JSON.stringify(data.tenants))
    //         localStorage.setItem(
    //           'connectedTenant',
    //           JSON.stringify(data.tenants[0])
    //         )
    //       })
    //       .catch(async (myBlob) => {});

    //       await this.dropclick(event);
    //   } else {
    //     // toast.info('Please connect xero account to proceed this process.');
    //     await this.dropclick(event);
    //   }

    //   let dateTime = new Date().getTime();
    //   let selectedProject = projects.find(project => project.guid === event);
    //   if (selectedProject) {
    //     await this.activityRecord([{
    //       "User": localStorage.getItem('Email'),
    //       "Datetime": dateTime,
    //       "Module": "Icons",
    //       "Description": "Change Project",
    //       "ProjectName": this.state.selectedProject.Name,
    //       "Projectguid": this.state.selectedProject.guid,
    //       "ColumnName": "",
    //       "ValueFrom": "",
    //       "ValueTo": selectedProject.Name,
    //       "Tenantid": localStorage.getItem('tenantguid')
    //     }]);
    //   }

    // } else {
    await this.dropclick(event);

    let dateTime = new Date().getTime();
    let selectedProject = projects.find((project) => project.guid === event);
    if (selectedProject) {
      await this.activityRecord([
        {
          User: localStorage.getItem("Email"),
          Datetime: dateTime,
          Module: "Icons",
          Description: "Change Project",
          ProjectName: this.state.selectedProject.Name,
          Projectguid: this.state.selectedProject.guid,
          ColumnName: "",
          ValueFrom: "",
          ValueTo: selectedProject.Name,
          Tenantid: localStorage.getItem("tenantguid"),
        },
      ]);
    }
    // }
    await this.setState({
      isLoading: false,
    });
  };

  dropclick = async (event) => {
    //reset states for new slecting project

    await this.setState({
      isLoading: true,
      pivotData: [],
      check_zero_rows: false,
      check_blank_row: false,
      check_heading_totals: false,
      check_hidden_columns: false,
      fontsizetemplate: "",
      templateselectvalue: "",
      selectedtempguid: "",
      orderColumns: [],
      buguid: event,
      editTemplateModal: "",
    });
    await this.getProjectByGuid(event);
    await this.getTemplates();
    await this.getprojects();
    //await this.gettemplateanddata(event);
    var ty = this.state.projects;
    await this.setState({
      isLoading: false,
      projects: ty.sort(function (a, b) {
        var nameA = a.Name;
        var nameB = b.Name;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
    });
    var guids = localStorage.getItem("templateguid")
      ? JSON.parse(localStorage.getItem("templateguid"))
      : [];

    var exist = guids.filter((e) => {
      return e.project === this.state.selectedProject.guid;
    });
    if (exist.length > 0) {
      this.updatetemplateinlocal(exist[0].template);
      await this.gettemplateanddata(exist[0].template);
    } else {
      this.updatetemplateinlocal(this.state.templates[0].guid);
      await this.gettemplateanddata(this.state.templates[0].guid);
    }
  };

  findlevel = async (findex, x) => {
    var levelflag = false;
    var nextlevel = -1;
    for (var i = findex + 1; i < this.state.pivotGroupTag.length; i++) {
      if (
        this.state.pivotGroupTag[i].AmountValue &&
        this.state.pivotGroupTag[i].AmountValue > x &&
        levelflag == false
      ) {
        nextlevel = this.state.pivotGroupTag[i].AmountValue;
        levelflag = true;
      }
    }

    return nextlevel;
  };

  ongroupclick = async (e, u) => {
    //jquery
    // check scrollbar present or not
    e.preventDefault();
    $(function () {
      if ($("#table_height").hasScrollBar() === false) {
        $("thead.he").css("padding-right", "0px");
      }
    });

    (function ($) {
      $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
      };
    })($);
    // end

    // check boxxes
    await this.removeCheckedRows();
    var cb = this.state.selectedcheckbox;

    var findex = this.state.pivotGroupTag.findIndex((data) => {
      return data.guid == u;
    });
    // get column guid of level and description
    var levelguid = "";
    var descriptionguid = "";
    var accountguid = "";
    var groupguid = "";
    this.state.orderColumns.map((vals, ind) => {
      if (vals.ColumnName.toUpperCase() == "LEVEL") {
        levelguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "DESCRIPTION") {
        descriptionguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "ACCOUNT") {
        accountguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "GROUPS") {
        groupguid = vals.guid;
      }
    });
    // <>
    var lastfindex = "";
    for (var i = findex; i < this.state.pivotGroupTag.length; i++) {
      if (
        this.state.pivotGroupTag[i].ParentGuid === u &&
        this.state.pivotGroupTag[i].Type === "Total"
      ) {
        lastfindex = i;
      }
    }

    var state = this.state.finaldata; //JSON.parse(JSON.stringify( this.state.finaldata));
    var lastindex = "";

    var findex1 = this.state.finaldata.findIndex((data) => {
      return data.guid == u;
    });
    if (this.state.pivotGroupTag[findex].clicked === false) {
      var totalofalls;
      var rr;
      var x = this.state.pivotGroupTag[findex].AmountValue;
      var nextlevel = await this.findlevel(findex, x);

      this.state.pivotGroupTag.map(async (value, index) => {
        //current level headers and data append
        if (index === findex) {
          //adding all the columns till lastfin

          this.state.pivotGroupTag[findex].clicked = true;

          // clear the current index column values except level and description
          rr = JSON.parse(JSON.stringify(state[findex1].Columns));
          state[findex1].Columns.map((val, inde) => {
            if (
              val.obj.ColumnGuid !== levelguid &&
              val.obj.ColumnGuid !== descriptionguid &&
              val.obj.ColumnGuid !== accountguid &&
              val.obj.ColumnGuid !== groupguid
            ) {
              val.obj.TextValue = "";
              val.obj.AmountValue = "";
            }
          });
        }
        //next level headers append
        if (u === value.ParentGuid && index <= lastfindex) {
          if (value.Type === "Header") {
            this.state.pivotGroupTag[index].clicked = false;
            value.carrot = true;

            // calculation statrt
            var findex3 = this.state.pivotGroupTag.findIndex((data) => {
              return data.guid == value.guid;
            });
            var uu = value.guid;
            var lastfindexx = "";
            for (var i = findex3; i < this.state.pivotGroupTag.length; i++) {
              if (
                this.state.pivotGroupTag[i].ParentGuid === uu &&
                this.state.pivotGroupTag[i].Type === "Total"
              ) {
                lastfindexx = i;
              }
            }

            totalofalls = JSON.parse(JSON.stringify(value.Columns));
            totalofalls.map((value, index) => {
              if (
                value.obj.ColumnGuid != accountguid &&
                value.obj.ColumnGuid != levelguid &&
                value.obj.ColumnGuid != descriptionguid &&
                value.obj.ColumnGuid != groupguid
              ) {
                if (
                  this.state.orderColumns[index].Format != "TEXT" &&
                  this.state.orderColumns[index].TotalColumn == true
                ) {
                  totalofalls[index].obj.AmountValue = "0";
                  if (value.obj.TextValue == null) {
                    totalofalls[index].obj.TextValue = "0";
                  } else {
                    totalofalls[index].obj.TextValue = "0";
                  }
                } else {
                  totalofalls[index].obj.TextValue = "";
                  totalofalls[index].obj.AmountValue = "";
                }
              }
            });

            for (var i = findex3 + 1; i < lastfindexx; i++) {
              if (
                this.state.pivotGroupTag[i].Type !== "Total" &&
                this.state.pivotGroupTag[i].Type !== "Header" &&
                this.state.pivotGroupTag[i].Columns.length > 0
              ) {
                totalofalls.map((value, index) => {
                  if (
                    this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                      accountguid &&
                    this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                      levelguid &&
                    this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                      descriptionguid &&
                    this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                      groupguid
                  )
                    if (
                      this.state.orderColumns[index].Format == "TEXT" ||
                      this.state.orderColumns[index].TotalColumn == false
                    ) {
                      if (
                        this.state.pivotGroupTag[i].Columns[index].obj
                          .TextValue == " " ||
                        this.state.pivotGroupTag[i].Columns[index].obj
                          .TextValue == null
                      ) {
                        value.obj.AmountValue = "";
                        /*this.state.pivotGroupTag[
                                                 i
                                               ].Columns[index].obj.AmountValue;*/
                      } else {
                        value.obj.TextValue = "";
                        /*this.state.pivotGroupTag[
                                                 i
                                               ].Columns[index].obj.TextValue;*/
                      }
                    } else if (
                      this.state.pivotGroupTag[i].Columns[index].obj
                        .TextValue == " " ||
                      this.state.pivotGroupTag[i].Columns[index].obj
                        .TextValue == null
                    ) {
                      value.obj.AmountValue =
                        parseInt(
                          JSON.parse(JSON.stringify(value.obj.AmountValue))
                        ) +
                        parseInt(
                          JSON.parse(
                            JSON.stringify(
                              this.state.pivotGroupTag[i].Columns[index].obj
                                .AmountValue
                            )
                          )
                        );
                    } else {
                      value.obj.TextValue =
                        parseInt(
                          JSON.parse(JSON.stringify(value.obj.TextValue))
                        ) +
                        parseInt(
                          JSON.parse(
                            JSON.stringify(
                              this.state.pivotGroupTag[i].Columns[index].obj
                                .TextValue
                            )
                          )
                        );
                    }
                });
              }
            }
            totalofalls.map((value, index) => {
              if (
                value.obj.ColumnGuid != accountguid &&
                value.obj.ColumnGuid != levelguid &&
                value.obj.ColumnGuid != descriptionguid &&
                value.obj.ColumnGuid != groupguid
              ) {
                if (value.obj.TextValue != 0 && value.obj.AmountValue != 0) {
                  value.obj.TextValue =
                    parseInt(value.obj.TextValue) +
                    parseInt(value.obj.AmountValue);
                }
              }
            });

            totalofalls.map((value, index) => {
              if (
                value.obj.ColumnGuid != accountguid &&
                value.obj.ColumnGuid != levelguid &&
                value.obj.ColumnGuid != descriptionguid &&
                value.obj.ColumnGuid != groupguid
              ) {
                if (
                  value.obj.TextValue == "0" ||
                  value.obj.TextValue.toString() == "NaN"
                ) {
                  value.obj.TextValue = " ";
                }
                if (value.obj.AmountValue == null) {
                  value.obj.AmountValue = "0";
                } else if (value.obj.AmountValue.toString() === "NaN") {
                  value.obj.AmountValue = "0";
                }
              }
            });

            value.Columns = totalofalls;

            // end
          } else {
            this.state.pivotGroupTag[findex].clicked = true;
          }

          state.push(value);

          state[findex1].clicked = this.state.pivotGroupTag[findex].clicked;
          state[findex1].carrot = this.state.pivotGroupTag[findex].carrot;
        }
      });

      for (var i = 0; i < state.length; i++) {
        if (state[i].ParentGuid === u && state[i].Type === "Total") {
          lastindex = i;
        }
      }

      if (state[lastindex] && state[lastindex].Columns) {
        state[lastindex].Columns.map((value, index) => {
          if (
            value.obj.ColumnGuid != accountguid &&
            value.obj.ColumnGuid != levelguid &&
            value.obj.ColumnGuid != descriptionguid &&
            value.obj.ColumnGuid != groupguid
          ) {
            if (this.state.orderColumns[index].Format == "TEXT") {
              state[lastindex].Columns[index].obj.AmountValue = "";
              state[lastindex].Columns[index].obj.TextValue = "";
            } else {
              state[lastindex].Columns[index] = JSON.parse(
                JSON.stringify(rr[index])
              );
            }
          }
        });
      }
    } else {
      var findex1 = state.findIndex((data) => {
        return data.guid == u;
      });

      for (var i = 0; i < state.length; i++) {
        if (state[i].ParentGuid === u && state[i].Type === "Total") {
          lastindex = i;
        }
      }
      // replace last total of current index on closing carrot
      var cols = "";

      // for (var i = 0; i < state.length; i++) {
      // if (state[i].ParentGuid === u && state[i].Type === 'Total') {
      // lastindex = i;
      // }
      // }

      if (lastindex !== "") {
        cols = state[lastindex].Columns;

        this.state.orderColumns.map((value, odex) => {
          if (
            value.guid != accountguid &&
            value.guid != levelguid &&
            value.guid != descriptionguid &&
            value.guid != groupguid
          ) {
            //if (value.Format != "TEXT") {

            state[findex1].Columns[odex] = cols[odex];

            //}
          }
        });
      }

      //deleteing the elements (colapse)
      state.map((value, index) => {
        if (index === findex1) {
          value.clicked = false;
          var findex = this.state.pivotGroupTag.findIndex((data) => {
            return data.guid == value.guid;
          });
          this.state.pivotGroupTag[findex].clicked = false;
        }
        if (index > findex1 && index <= lastindex) {
          var findex = this.state.pivotGroupTag.findIndex((data) => {
            return data.guid == value.guid;
          });
          this.state.pivotGroupTag[findex].clicked = false;
          value.clicked = false;
          delete state[index];
        }
      });
      //deleteing blank rows after total with in the clicked childs elements (colapse)
      state.map((v, index) => {
        if (
          state[findex1].guid === state[index].ParentGuid &&
          state[index].Type === "Blank"
        ) {
          this.state.pivotGroupTag[findex].clicked = false;
          v.clicked = false;
          delete state[index];
        }
      });

      //return false;
    }

    state = state.filter(function (el) {
      return el != null;
    });

    state = state.sort(function (a, b) {
      var nameA = a.Position;
      var nameB = b.Position;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    await this.setState({
      finaldata: state,
      pivotGroupTag: this.state.pivotGroupTag,
      allNodes:
        (this.state.pivotGroupTag.length === state.length) === 1 ? true : false,
    });

    // setting history state of data
    if (state.length > 0) {
      await this.replaceHistory(state);
    } else {
      await this.replaceHistory([]);
    }
    cb.map((value) => {
      $(`.span_dim_color`).removeClass("span_dim_color");
      // var ids = document.getElementById(`${value.guid}_span`);
      // ids.style.backgroundColor = "#848484"
    });
    cb.map((value) => {
      // var ids = document.getElementById(`${value.guid}_span`);
      // ids.style.backgroundColor = "#848484"
      $(`#${value.guid}_span`).addClass("span_dim_color");
    });
    await this.setState({
      // isLoading: false,
      allNodes:
        this.state.pivotGroupTag.length === this.state.finaldata.length
          ? true
          : false,
    });

    this.redRowHandler();
  };

  replaceHistory = (data) => {
    var guids = localStorage.getItem("templateguid");
    if (guids && guids !== "" && guids !== null && guids.length !== 0) {
      var parsed_guids = JSON.parse(localStorage.getItem("templateguid"));
      var exist = parsed_guids.filter((e) => {
        return e.project === this.state.selectedProject.guid;
      });
      //get already stored template data
      if (exist[0]) {
        var history = [];
        data.map((val) => {
          history.push({
            record_guid: val.guid,
            record_clicked: val.clicked,
            record_carrot: val.carrot,
            from: "/dashboard",
          });
        });
        exist[0].data = history;
        localStorage.setItem("templateguid", JSON.stringify(parsed_guids));
      }
    }
  };

  deletetemplate = async () => {
    if (this.state.templates.length > 1) {
      await this.setState({
        isLoading: true,
      });
      let { allcolumnsoftemp, editTemplateModal } = this.state;
      let columnInFormulaExist = undefined;
      let columnExist = undefined;

      columnInFormulaExist = editTemplateModal.Columns.find((guid) =>
        allcolumnsoftemp.find(
          (col) => col.Formula && col.Formula.includes(guid)
        )
      );

      columnExist = allcolumnsoftemp.find(
        (column) => column.SelectedTemplateGuid === editTemplateModal.guid
      );

      if (columnExist) {
        this.setState({
          message_desc:
            "You can't delete this template because template's column used in other column.",
          message_heading: "Delete Column",
          openMessageModal: true,
        });
      } else if (columnInFormulaExist === undefined) {
        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Worktable Option",
            Description: "Delete Template",
            ProjectName: this.state.selectedProject.Name,
            ColumnName: "",
            ValueFrom: "",
            ValueTo: editTemplateModal.TemplateName,
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);

        var columnguids = [];
        await API.post("pivot", "/deletetemplate", {
          body: {
            guid: this.state.editTemplateModal.guid,
            tenant: localStorage.getItem("tenantguid"),
          },
        })
          .then((data) => {
            columnguids = this.state.allcolumnsoftemp.filter(
              (column) =>
                this.state.editTemplateModal.Columns.find(
                  (guid) => guid === column.guid
                ) !== undefined
            );
            this.setState({
              undo: [],
            });
            // toast.success("Template deleted successfully");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Template not delete",
              message_heading: "Template",
              openMessageModal: true,
            });
            // toast.error('Template not delete');
          });

        await this.getTemplates();
        await this.removeoldtemplatelocal(this.state.editTemplateModal.guid);

        await this.resetstatesForCleanPage();
        await this.updatetemplateinlocal(this.state.templates[0].guid);

        var finaldata = [];
        columnguids.map((val) => {
          if (val.Type !== "System") {
            finaldata.push(val.guid);
          }
        });
        await this.deletecolumns(finaldata);
        await this.gettemplateanddata(this.state.templates[0].guid);
      } else {
        this.setState({
          message_desc:
            "You can't delete this template because template's column used in formula.",
          message_heading: "Delete Column",
          openMessageModal: true,
        });
      }
      await this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        message_desc: "You can't delete this last template.",
        message_heading: "Delete Column",
        openMessageModal: true,
      });
    }
  };

  deleteColumnData = async (data) => {
    var final = this.state.originalData;
    final.map((od) => {
      if (od.Type !== "Blank") {
        od.Columns = od.Columns.filter((e) => data.indexOf(e.ColumnGuid) < 0);
      }
    });
    var lofdata = Math.ceil(final.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = final.slice(i, i + 20);
      await API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then((data) => {
          // toast.success('data added');
        })
        .catch((err) => {
          this.setState({
            message_desc: "Copydata request failed",
            message_heading: "Pivot data",
            openMessageModal: true,
          });
          // toast.error('copydata request failed');
        });
    }
  };

  deletecolumns = async (finaldata) => {
    if (finaldata.length > 0) {
      // await API.post('pivot', '/deletecolumns', {
      //     body: {
      //       finaldata: finaldata,
      //     },
      //   })
      //   .then((data) => {
      //     this.deleteColumnData(finaldata);
      //     // toast.success("columns deleted successfully against the template");
      //   })
      //   .catch((error) => {
      //     toast.error('columns not deleted');
      //   });

      let lofdata = Math.ceil(finaldata.length / 20);
      for (let i = 0; i < lofdata * 20; i = i + 20) {
        let arraytosend = finaldata.slice(i, i + 20);
        await API.post("pivot", "/deletecolumns", {
          body: {
            finaldata: arraytosend,
          },
        })
          .then(() => {
            if (i === lofdata * 20 - 20) {
              // toast.success('Data replaced successfully.');
            }
          })
          .catch((error) => {
            this.setState({
              message_desc: "Data didn't replaced successfully.",
              message_heading: "Delete data",
              openMessageModal: true,
            });
            // toast.error("Data didn't replaced successfully.");
          });
      }
      this.deleteColumnData(finaldata);
    }
  };

  resetstatesForCleanPage = async () => {
    await this.setState({
      editTemplateModal: {},
      check_zero_rows: false,
      check_blank_row: false,
      check_heading_totals: false,
      check_hidden_columns: false,
      fontsizetemplate: "",
      templateselectvalue: "",
      selectedtempguid: "",
      pivotData: [],
      columns: [],
      orderColumns: [],
    });
  };

  applyExcludeHandler = async () => {
    if (this.state.editTemplateModal === "") {
      this.validateSelectField(this.state.editTemplateModal);
      this.setState({
        message_desc: "Please Select Template First!",
        message_heading: "Template",
        openMessageModal: true,
      });
      // toast.error('Please Select Template First!');
    } else {
      await this.setState({
        blankrow: this.state.check_blank_row,
        hiddencolumn: this.state.check_hidden_columns,
        headingTotal: this.state.check_heading_totals,
        CheckZero: this.state.check_zero_rows,
      });

      this.setState({
        isLoading: true,
      });
      // if (this.state.allNodes) {
      if (this.state.allNodes && document.getElementById("allopen")) {
        document.getElementById("allopen").click();
      }

      await API.post("pivot", "/updatefields", {
        body: {
          table: "PivotTemplates",
          guid: this.state.selectedtempguid,
          fieldname: "Exclude",
          value: [
            {
              BlankRows: this.state.check_blank_row,
              HiddenColumns: this.state.check_hidden_columns,
              ZeroRows: this.state.check_zero_rows,
              HeadingsTotals: this.state.check_heading_totals,
            },
          ],
        },
      })
        .then(async (data) => {
          // toast.success("Exclude Updated Successfully.");

          let { templates, selectedtempguid } = this.state;

          let template = templates.find(
            (template) => template.guid === selectedtempguid
          );
          let previousValues = [];
          let newValues = [];
          let dateTime = new Date().getTime();

          if (template.Exclude[0]["BlankRows"]) {
            previousValues.push("Blank");
          }
          if (template.Exclude[0]["HeadingsTotals"]) {
            previousValues.push("Heading");
          }
          if (template.Exclude[0]["HiddenColumns"]) {
            previousValues.push("Hidden");
          }
          if (template.Exclude[0]["ZeroRows"]) {
            previousValues.push("Zero");
          }

          if (this.state.check_blank_row) {
            newValues.push("Blank");
          }
          if (this.state.check_heading_totals) {
            newValues.push("Heading");
          }
          if (this.state.check_hidden_columns) {
            newValues.push("Hidden");
          }
          if (this.state.check_zero_rows) {
            newValues.push("Zero");
          }

          this.activityRecord([
            {
              User: localStorage.getItem("Email"),
              Datetime: dateTime,
              Module: "Worktable Option",
              Description: "Exclude Rows/Columns",
              ProjectName: this.state.selectedProject.Name,
              Projectguid: this.state.selectedProject.guid,
              ColumnName: "",
              ValueFrom: previousValues.toString(),
              ValueTo: newValues.toString(),
              Tenantid: localStorage.getItem("tenantguid"),
            },
          ]);
          template.Exclude[0]["BlankRows"] = this.state.check_blank_row;
          template.Exclude[0]["HeadingsTotals"] =
            this.state.check_heading_totals;
          template.Exclude[0]["HiddenColumns"] =
            this.state.check_hidden_columns;
          template.Exclude[0]["ZeroRows"] = this.state.check_zero_rows;

          this.setState({
            templates,
          });
        })
        .catch((err) => {
          this.setState({
            message_desc: "Exclude Not Updated!",
            message_heading: "Exclude",
            openMessageModal: true,
          });
          // toast.error('Exclude Not Updated!');
        });
      await this.gettemplateanddata(this.state.selectedtempguid);

      await this.applyingfilter();

      await this.setState({
        isLoading: false,
      });
      $("#closeRightSliderArrow").click();
    }
  };

  applyingfilter = async () => {
    //Exclude Cases
    var data_filter = this.state.pivotGroupTag;

    if (this.state.CheckZero) {
      data_filter = data_filter.filter((e) => {
        return e.checkzero != true;
      });
    }

    if (this.state.headingTotal) {
      data_filter = data_filter.filter((e) => {
        return e.Type == "Detail";
      });
    }

    var x = [];
    var fla = false;

    if (this.state.check_blank_row) {
      data_filter.map((u) => {
        fla = false;
        if (u.Columns) {
          var levelguid = "";
          levelguid = this.state.orderColumns.find(
            (k) => k.ColumnName.toUpperCase() == "LEVEL"
          ).guid;
          /*           
           if (vals.ColumnName.toUpperCase() == 'LEVEL') {
             levelguid = vals.guid;
           }*/
          u.Columns.map((i) => {
            if (i.obj.ColumnGuid !== levelguid) {
              if (
                !(
                  i.obj.AmountValue == 0 &&
                  (i.obj.TextValue == null || i.obj.TextValue == 0)
                )
              ) {
                fla = true;
              }
            }
          });
          if (fla == false) {
            u.blankrow = true;
          } else {
            u.blankrow = false;
          }
        }
      });
      data_filter = data_filter.filter((i) => i.blankrow != true);
    }

    await this.setState({
      // isLoading: false,
      pivotGroupTag: data_filter, //this may cause a problem
      finaldata: data_filter,
    });
    if (this.state.headingTotal) {
      $("#allopen").hide();
    } else {
      $("#allopen").show();
      if (document.getElementById("allopen"))
        document.getElementById("allopen").click();
    }
  };

  updateTemplate = async (name, isChecked) => {
    await this.setState({
      isLoading: true,
    });

    let { templates, selectedtempguid, editTemplateModal } = this.state;
    let oldTemplateName = JSON.parse(
      JSON.stringify(
        templates.find((temp) => temp.guid === selectedtempguid).TemplateName
      )
    );
    // update template name
    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotTemplates",
        guid: selectedtempguid,
        fieldname: "TemplateName",
        value: name,
      },
    })
      .then(async (data) => {
        // toast.success("Template Name Updated");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Template Name Not Updated!",
          message_heading: "Template",
          openMessageModal: true,
        });
        // toast.error('Template Name Not Updated');
      });

    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotTemplates",
        guid: selectedtempguid,
        fieldname: "ExpenseOnly",
        value: isChecked,
      },
    })
      .then(async (data) => {
        // toast.success("Template Name Updated");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Template Name Not Updated",
          message_heading: "Template",
          openMessageModal: true,
        });
        // toast.error('Template Name Not Updated');
      });

    await this.getTemplates();
    await this.gettemplateanddata(this.state.selectedtempguid);

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Worktable Option",
        Description: "Edit Template",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: oldTemplateName,
        ValueTo: name,
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);

    this.setState({
      isLoading: false,
    });
  };

  xeroTrackingCategories = async () => {
    let { user, selectedProject } = this.state;
    await this.refreshXeroToken();
    if (this.state.currentproject.Connection !== "CSV") {
      if (user.XeroTokenObject && selectedProject.XeroDB) {
        await API.post("pivot", "/xerotrackingcat", {
          body: {
            clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
            clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
            redirectUris: process.env.REACT_APP_XERO_APP_URL,
            scopes: process.env.REACT_APP_XERO_APP_SCOPES,
            token: user.XeroTokenObject,
            connectedXeroTenant: selectedProject.XeroDB.tenantId,
          },
        })
          .then(async (data) => {
            this.setState({
              errorcat: false,
              catagories: data.response.body.TrackingCategories,
            });
          })
          .catch(async (myBlob) => {
            this.setState({
              errorcat: true,
            });
            // this.setState({
            //   message_desc: 'Connect to database to edit tracking.',
            //   message_heading: "XERO",
            //   openMessageModal: true,
            // })
          });
      } else {
        this.setState({
          errorcat: true,
        });
      }
    }
  };

  editColumn = async (data) => {
    await this.setState({
      isLoading: true,
    });

    if (data.Type === "DataIntegration") {
      await this.xeroTrackingCategories();
    }
    //call api here
    await API.post("pivot", "/getcolumnbyguid", {
      body: {
        columnGuid: data.guid,
      },
    })
      .then((cd) => {
        if (cd && cd.guid) {
          this.setState(
            {
              columnData: cd,
              editColumn: true,
            },
            () => {
              this.openModal("openAddEditColumn");
              $(document).ready(function () {
                $(this).find("#type_add_edit").focus();
              });
            }
          );
        } else {
          this.setState({
            message_desc: "Column has been deleted",
            message_heading: "Column",
            openMessageModal: true,
          });
          // toast.error('Column has been deleted');
        }
      })
      .catch((err) => {
        this.setState({
          message_desc: "Error While getting Column data By Guid!",
          message_heading: "Column",
          openMessageModal: true,
        });
        // toast.error('Error While getting Column data By Guid!');
      });

    await this.setState({
      isLoading: false,
    });
  };

  openAddEditModal = async () => {
    await this.removeCutRows();
    let selectedTemplate = this.state.editTemplateModal;
    if (selectedTemplate && selectedTemplate.guid) {
      // await this.xeroTrackingCategories();
      this.openModal("openAddEditColumn");
      $(document).ready(function () {
        $(this).find("#add_column_before").focus();
      });
    } else {
      this.setState({
        message_desc: "Please Select Template First!",
        message_heading: "Template",
        openMessageModal: true,
      });
      // toast.error('Please Select Template First!');
    }
  };

  openEditModalHandler = () => {
    if (this.state.editTemplateModal === "") {
      this.validateSelectField(this.state.editTemplateModal);
      this.setState({
        message_desc: "Please Select Template First!",
        message_heading: "Template",
        openMessageModal: true,
      });
      // toast.error('Please Select Template First!');
    } else {
      this.openModal("openEditTemplateModal");
      $(document).ready(function () {
        $(this).find("#key").focus();
      });
    }
  };

  isLoading = (flag) => {
    if (flag) {
      this.setState({
        isLoading: true,
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  loading = (flag) => {
    if (flag) {
      document.getElementById("isLoading").classList.remove("d-none");
    } else {
      document.getElementById("isLoading").classList.add("d-none");
    }
  };

  //paste here
  handleClickOnCell1 = async (id, data, cellValue) => {
    if (id !== this.state.editCellId) {
      await this.setState({
        editedflag: false,
      });
    }
    var currenttabindex = document.activeElement.tabIndex;
    if (this.state.indexfocus !== currenttabindex) {
      // document.execCommand('selectAll',false,null)
      //save index for focus on next below field.
      await this.removeCheckedRows();
      await this.redRowHandler();
      document.activeElement.textContent = cellValue;
      if (document.activeElement.textContent == "") {
        document.activeElement.classList.add("caret-hidden");
      } else {
        document.activeElement.classList.remove("caret-hidden");
      }

      await this.setState({
        editCellId: "",
        editCellValue: "",
      });
      if (this.state.editCellId === "" && this.state.editCellValue === "") {
        await this.setState({
          indexfocus: currenttabindex,
          trparent: document.activeElement.parentElement,
        });
      }

      var range = document.createRange();
      range.selectNodeContents(document.activeElement);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // if(cellValue==""||cellValue==" "||cellValue=="0"){
      window.getSelection().collapseToEnd();
      //  }
      await this.setState(
        {
          editCellId: id,
          editCellValue: cellValue,
          defaultforcurrenttd: cellValue,
        },
        () => {}
      );
    } else {
      await this.setState(
        {
          editCellId: id,
          editCellValue: cellValue, //document.activeElement.textContent
        },
        () => {}
      );
    }
  };

  handleClickOnCell = async (id, data, cellValue) => {
    //console.log("cellsssssssssss",id,this.state.editCellId);
    if (id !== this.state.editCellId) {
      await this.setState({
        editedflag: false,
      });
    }
    // document.execCommand('selectAll',false,null)
    //save index for focus on next below field.
    await this.removeCheckedRows();
    await this.redRowHandler();
    //document.activeElement.textContent = cellValue
    if (document.activeElement.textContent == "") {
      document.activeElement.classList.add("caret-hidden");
    } else {
      document.activeElement.classList.remove("caret-hidden");
    }

    await this.setState({
      editCellId: "",
      editCellValue: "",
    });
    if (this.state.editCellId === "" && this.state.editCellValue === "") {
      var currenttabindex = document.activeElement.tabIndex;

      await this.setState({
        indexfocus: currenttabindex,
        trparent: document.activeElement.parentElement,
      });
    }

    var range = document.createRange();
    range.selectNodeContents(document.activeElement);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    // if(cellValue==""||cellValue==" "||cellValue=="0"){
    //      window.getSelection().collapseToEnd();
    //  }
    await this.setState(
      {
        editCellId: id,
        editCellValue: cellValue,
        defaultforcurrenttd: cellValue,
      },
      () => {}
    );
  };

  handleChangeCell = async (e, format, data) => {
    // console.log('handleChangeCell');

    //allowed keys to numeric type columns
    if (document.activeElement.textContent == "") {
      document.activeElement.classList.add("caret-hidden");
    } else {
      document.activeElement.classList.remove("caret-hidden");
    }

    var keysarr = [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 9, 27, 113, 39, 37, 38, 40, 13,
      16, 8, 46, 189, 109, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 190,
      110,
    ];
    //console.log('jjjjjjjjjjjj',e.target.textContent);
    if (
      format === "TEXT" ||
      (format != "TEXT" && keysarr.indexOf(e.keyCode) > -1)
    ) {
      // Shift + . isn't allowed.
      if (e.keyCode === 190 && e.key !== ".") {
        e.preventDefault();
      }

      if (e.keyCode === 9) {
        e.preventDefault();
        e.persist();
      }

      if (this.state.editCellId !== "") {
        e.persist();
        if (e.keyCode === 27) {
          this.setState({
            editCellValue: this.state.defaultforcurrenttd,
          });
          // if(this.state.editCellValue!==""&&this.state.editCellValue!==" "&&this.state.editCellValue!="0"){
          document.activeElement.textContent = this.state.defaultforcurrenttd;
          var range = document.createRange();
          range.selectNodeContents(document.activeElement);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          //          }else{
          //              window.getSelection().collapseToEnd();
          //          }
        } else if (e.keyCode === 113) {
          document.activeElement.textContent = this.state.defaultforcurrenttd;
          var range = document.createRange();
          range.selectNodeContents(document.activeElement);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          window.getSelection().collapseToEnd();
          await this.setState({
            editCellValue: e.target.textContent,
            editedflag: true,
          });
        } else {
          if (
            this.state.editedflag === false &&
            e.keyCode != 9 && // tab
            e.keyCode != 39 && // right arrow.
            e.keyCode != 37 && // left arrow.
            e.keyCode != 38 && // up arrow.
            e.keyCode != 40 && // down arrow.
            e.keyCode != 13 && // enter.
            e.keyCode != 16 && // shift.
            e.keyCode != 91 && // Windows Key / Left ⌘ / Chromebook Search key.
            e.keyCode != 18 // alt.
            //!e.shiftKey
          ) {
            // document.activeElement.textContent = '';
            await this.setState({
              editCellValue: e.target.textContent,
              editedflag: true,
            });
            //  console.log('1111111111--------------------------1--------------: ', e.target.textContent);
          } else if (this.state.editedflag === true) {
            await this.setState({
              editCellValue: e.target.textContent,
            });
            //  console.log('1111111111--------------------------2--------------: ', e.target.textContent);
          }
        }

        let finalval = "0";
        if (
          format !== "TEXT" &&
          (this.state.editCellValue == "" || this.state.editCellValue == " ")
        ) {
          finalval = await this.formatValidation("0", format)[0].value;
        } else {
          finalval = await this.formatValidation(
            this.state.editCellValue,
            format
          )[0].value;
        }
        if (data.isAccountEmpty === false) {
          if (e.keyCode === 9) {
            e.preventDefault();
            //shift+tab
            if (e.shiftKey) {
              await this.setState({
                editedflag: false,
              });
              document.activeElement.textContent = finalval;
            } else {
              await this.setState({
                editedflag: false,
              });
              document.activeElement.textContent = finalval;
            }
          } else if (e.keyCode === 39) {
            e.preventDefault();
            // Right Arrow or

            await this.setState({
              editedflag: false,
            });
            document.activeElement.textContent = finalval;
          } else if (e.keyCode === 37) {
            e.preventDefault();
            // Left Arrow
            await this.setState({
              editedflag: false,
            });
            document.activeElement.textContent = finalval;
          } else if (e.keyCode === 38) {
            e.preventDefault();
            // Up Arrow
            await this.setState({
              editedflag: false,
            });
            document.activeElement.textContent = finalval;
          } else if (e.keyCode === 40 || e.keyCode === 13) {
            e.preventDefault();
            // Down Arrow
            await this.setState({
              editedflag: false,
            });

            document.activeElement.textContent = finalval;
          }
        } else if (
          e.keyCode == 9 ||
          e.keyCode == 39 ||
          e.keyCode == 37 ||
          e.keyCode == 38 ||
          e.keyCode == 40 ||
          e.keyCode == 13 ||
          e.keyCode == 16 ||
          e.keyCode == 91 ||
          e.keyCode == 18 //&&
          //!e.shiftKey
        ) {
          //this condition is for description empty in empty account number row so we have to disable default functionality of movement keys
          e.preventDefault();
          await this.setState({
            editedflag: false,
          });
          //document.activeElement.textContent = finalval;
        }
      }
    } else {
      e.preventDefault();
    }
  };

  handleChangeCellonBlur = async (e) => {
    await this.removeCheckedRows();
    await this.redRowHandler();
    await this.setState({
      editCellId: "",
      editCellValue: "",
    });
  };

  handleChangeCellOnEnter = async (
    e,
    id,
    data,
    cellObj,
    cellValue,

    format
  ) => {
    // console.log('handleChangeCellOnEnter', data);

    // console.log("cellObj", cellObj, "editCellValue", this.state.editCellValue,"latestvalue");
    var latestvalue = e.target.textContent;
    await this.removeCheckedRows();
    await this.redRowHandler();
    let { editCellValue, defaultforcurrenttd, undo } = this.state;

    if (
      this.state.editCellId !== "" ||
      (e.keyCode === 13 && this.state.editCellId !== "")
    ) {
      //below value updateion is for removing last element fron cell value while navigate in worktable through clicking
      if (this.state.editedflag) {
        editCellValue = latestvalue;
        this.setState({
          editCellValue,
        });
      }
      //end
      var findex1, findex;
      if (
        this.state.editCellValue != null &&
        this.state.editCellValue !== this.state.defaultforcurrenttd
      ) {
        findex1 = this.state.originalData.findIndex((dat) => {
          return dat.guid == data.guid;
        });
        findex = this.state.pivotGroupTag.findIndex((dat) => {
          return dat.guid == data.guid;
        });
        var foundIndex = this.state.pivotGroupTag[findex].Columns.findIndex(
          (x) => x.obj.ColumnGuid == cellObj.obj.ColumnGuid
        );

        var foundIndex1 = this.state.originalData[findex1].Columns.findIndex(
          (x) => x.ColumnGuid == cellObj.obj.ColumnGuid
        );
        var obj = this.state.originalData[findex1].Columns[foundIndex1];

        let FROM = {
          AMOUNTVALUE: obj.AmountValue,
          TEXTVALUE: obj.TextValue,
          COLUMNGUID: obj.ColumnGuid,
        };

        if (cellObj.obj.TextValue == " " || cellObj.obj.TextValue == null) {
          obj.AmountValue = this.state.editCellValue;
          cellObj.obj.AmountValue =
            (format !== "TEXT" && this.state.editCellValue == "") ||
            this.state.editCellValue == " "
              ? "0"
              : this.state.editCellValue;
        } else {
          obj.TextValue = this.state.editCellValue;
          cellObj.obj.TextValue =
            (format !== "TEXT" && this.state.editCellValue == "") ||
            this.state.editCellValue == " "
              ? "0"
              : this.state.editCellValue; //here is change empty to zero for number columns on run time but original data change bellow
        }
        this.state.originalData[findex1].Columns[foundIndex1] = obj;

        let TO = {
          AMOUNTVALUE: obj.AmountValue,
          TEXTVALUE: obj.TextValue,
          COLUMNGUID: obj.ColumnGuid,
        };

        let columnsArr = [];
        this.state.originalData[findex1].Columns.map((c, i) => {
          // delete c.obj["uniqueCellId"];
          Object.keys(c).forEach(function (key) {
            if (c[key] === "" || c[key] === " ") {
              if (key == "AmountValue") {
                c[key] = "0";
              } else {
                c[key] = null;
              }
            }
          });
          columnsArr.push(c);
        });
        await this.setState({
          pivotGroupTag: this.state.pivotGroupTag,
          isLoading: true,
        });
        await this.applyColumnFormula();

        var dd = "";
        var dex = -1;

        var fla = true;

        this.state.pivotGroupTag.map((value, index) => {
          if (value.guid == data.ParentGuid) {
            dex = index;
            dd = value;
          }
        });
        await this.calculateData(dd);
        //        var lastfindex = '';
        //        var xflag = false;
        //
        //        var levelguid = '';
        //        var descriptionguid = '';
        //        var accountguid = '';
        //        var groupguid = '';
        //        var columnsnotcalc = [];
        //        this.state.orderColumns.map((vals, ind) => {
        //          if (vals.TotalColumn === false) {
        //            columnsnotcalc.push(vals.guid);
        //          }
        //          if (vals.ColumnName.toUpperCase() == 'LEVEL') {
        //            levelguid = vals.guid;
        //          }
        //          if (vals.ColumnName.toUpperCase() == 'DESCRIPTION') {
        //            descriptionguid = vals.guid;
        //          }
        //          if (vals.ColumnName.toUpperCase() == 'ACCOUNT') {
        //            accountguid = vals.guid;
        //          }
        //          if (vals.ColumnName.toUpperCase() == 'GROUPS') {
        //            groupguid = vals.guid;
        //          }
        //        });
        //
        //        if (
        //          data.ParentGuid !== 'root' &&
        //          cellObj.obj.ColumnGuid !== accountguid &&
        //          cellObj.obj.ColumnGuid !== descriptionguid && columnsnotcalc.indexOf(cellObj.obj.ColumnGuid) < 0
        //        ) {
        //          while (fla == true) {
        //            for (var i = dex; i < this.state.pivotGroupTag.length; i++) {
        //              if (
        //                this.state.pivotGroupTag[i].ParentGuid == dd.guid &&
        //                this.state.pivotGroupTag[i].Type == 'Total'
        //              ) {
        //                lastfindex = i;
        //              }
        //            }
        //            var hella;
        //
        //            var updatedcol = 0;
        //            var hhh = 0;
        //            var state = this.state.pivotGroupTag;
        //            var lastindex = '';
        //
        //            for (var i = dex + 1; i < lastfindex; i++) {
        //              if (
        //                this.state.pivotGroupTag[i].Type != 'Blank' &&
        //                this.state.pivotGroupTag[i].Type != 'Header' &&
        //                this.state.pivotGroupTag[i].Type != 'Total' &&
        //                this.state.pivotGroupTag[i].Type != 'SubHeader'
        //              ) {
        //                if (
        //                  this.state.pivotGroupTag[i].Columns[foundIndex].obj
        //                  .TextValue == ' ' ||
        //                  this.state.pivotGroupTag[i].Columns[foundIndex].obj
        //                  .TextValue == null
        //                ) {
        //                  // updatedcol = Math.round(
        //                  updatedcol =
        //                    updatedcol +
        //                    parseFloat(
        //                      this.state.pivotGroupTag[i].Columns[foundIndex].obj
        //                      .AmountValue
        //                    );
        //                  // );
        //                } else {
        //                  // updatedcol = Math.round(
        //                  updatedcol =
        //                    updatedcol +
        //                    parseFloat(
        //                      this.state.pivotGroupTag[i].Columns[foundIndex].obj
        //                      .TextValue
        //                    );
        //                  // );
        //                }
        //              }
        //            }
        //
        //            for (var i = 0; i < state.length; i++) {
        //              if (state[i].ParentGuid == dd.guid && state[i].Type == 'Total') {
        //                lastindex = i;
        //              }
        //            }
        //
        //            if (
        //              state[lastindex].Columns[foundIndex].obj.TextValue == ' ' ||
        //              state[lastindex].Columns[foundIndex].obj.TextValue == null
        //            ) {
        //              state[lastindex].Columns[foundIndex].obj.AmountValue = updatedcol;
        //            } else {
        //              state[lastindex].Columns[foundIndex].obj.TextValue = updatedcol;
        //            }
        //            if (updatedcol.toString() === 'NaN') {
        //              updatedcol = '';
        //            }
        //            if (
        //              this.state.pivotGroupTag[lastfindex].Columns[foundIndex].obj
        //              .TextValue == ' ' ||
        //              this.state.pivotGroupTag[lastfindex].Columns[foundIndex].obj
        //              .TextValue == null
        //            ) {
        //              this.state.pivotGroupTag[lastfindex].Columns[
        //                foundIndex
        //              ].obj.AmountValue = updatedcol;
        //            } else {
        //              this.state.pivotGroupTag[lastfindex].Columns[
        //                foundIndex
        //              ].obj.TextValue = updatedcol;
        //            }
        //
        //            this.state.pivotGroupTag.map((value, index) => {
        //              if (value.guid == dd.ParentGuid) {
        //                dex = index;
        //                dd = value;
        //              }
        //            });
        //            if (xflag == true) {
        //              fla = false;
        //            }
        //
        //            if (dd.ParentGuid == 'root') {
        //              xflag = true;
        //            }
        //          }
        //        }

        var pivot = this.state.pivotGroupTag;
        var gui = this.state.orderColumns.find(
          (a) => a.ColumnName.toUpperCase() === "ACCOUNT"
        ).guid;
        var f = pivot.find((j) => j.guid === data.guid);
        var fobj = f.Columns.find((s) => s.obj.ColumnGuid === gui);

        if (
          (fobj.obj.AmountValue != 0 &&
            fobj.obj.AmountValue != null &&
            fobj.obj.AmountValue != " ") ||
          (fobj.obj.TextValue != "" &&
            fobj.obj.TextValue != "" &&
            fobj.obj.TextValue != null)
        ) {
          f.isAccountEmpty = false;
        } else {
          f.isAccountEmpty = true;
        }
        // set state for recalculate column formula
        await this.setState({
          pivotGroupTag: pivot,
        });

        // update column
        API.post("pivot", "/updatefields", {
          body: {
            table: "PivotData",
            guid: data.guid,
            fieldname: "Columns",
            value: columnsArr,
          },
        })
          .then(async (data) => {
            // toast.success("Update Columns Successfully");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Update Cell Error",
              message_heading: "Cell",
              openMessageModal: true,
            });
            // toast.error('Update Columns Error');
          });

        //focus again on current td to change value in foramt
        //          this.state.trparent.querySelectorAll(
        //              'td[tabindex="' + this.state.indexfocus + '"]'
        //            )[0]
        //            .focus();
        //            document.activeElement.textContent=this.formatValidation(this.state.editCellValue,"[Green]0%;[Red]-0%")[0].value

        // moment of data

        if (
          e.keyCode === 13 &&
          document.activeElement.closest("tr").nextElementSibling
        ) {
          document.activeElement
            .closest("tr")
            .nextElementSibling.querySelectorAll(
              'td[tabindex="' + this.state.indexfocus + '"]'
            )[0]
            .focus();
        }

        let dateTime = new Date().getTime();
        let column = this.state.allcolumnsoftemp.find(
          (col) => col.ColumnName.toUpperCase() === "ACCOUNT"
        );

        let cellColumn = this.state.allcolumnsoftemp.find(
          (col) => col.guid === cellObj.obj.ColumnGuid
        );
        let account = undefined;
        if (column) {
          let accountCell = data.Columns.find(
            (cell) => cell.obj.ColumnGuid === column.guid
          );
          if (accountCell) {
            if (
              accountCell.obj.TextValue &&
              accountCell.obj.TextValue !== "" &&
              accountCell.obj.TextValue !== " "
            ) {
              account = accountCell.obj.TextValue;
            } else if (accountCell.obj.AmountValue !== "0") {
              account = accountCell.obj.AmountValue;
            }
          }
        }
        let cell_column = this.state.allcolumnsoftemp.find(
          (column) => column.guid === FROM.COLUMNGUID
        );
        FROM["COLUMNTYPE"] = cell_column.Type;
        TO["COLUMNTYPE"] = cell_column.Type;
        undo.push({
          WORKTABLECHANGE: {
            FROM: FROM,
            TO: TO,
            ROWGUID: data.guid,
          },
        });

        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Worktable Changes",
            Description: "Worktable Change",
            ProjectName: this.state.selectedProject.Name,
            Projectguid: this.state.selectedProject.guid,
            ColumnName: account ? cellColumn.ColumnName + " - " + account : "",
            ValueFrom: defaultforcurrenttd,
            ValueTo: editCellValue,
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);
        // window.getSelection().removeAllRanges();

        await this.setState({
          isLoading: false,
          undo: undo,
        });
      } else {
        //await this.setState({ editCellId: "", editCellValue: "" });
      }
      //await this.setState({ editCellId: "", editCellValue: "" });
    }

    //await this.setState({ editCellId: "", editCellValue: "" });
  };

  checkboxHandler = async (CheckBoxName, isChecked, findex) => {
    // console.log(CheckBoxName, isChecked, findex, 'CheckBoxNamesCheckedCheckBoxNameisChecked')
    // let isAllChecked =
    // CheckBoxName === "select_all_check" && isChecked;
    // let isAllUnChecked =
    // CheckBoxName === "select_all_check" && !isChecked;

    var checked = isChecked;

    this.state.finaldata.map((item, index) => {
      if (item.guid === CheckBoxName) {
        item.checkbox = checked;
      }

      // else if (isAllUnChecked) {
      // return Object.assign({}, item, {
      // checked: false
      // });
      // }

      // return item;
    });
    await this.redRowHandler();
    // let isAllSelected =
    // checkList.findIndex(item => item.checked === false) === -1 ||
    // isAllChecked;

    await this.setState({
      // select_all_check: isAllSelected,
      finaldata: this.state.finaldata,
    });
  };

  checkBetweenHandler = async () => {
    await this.removeCutRows();
    var index_start;
    var index_end;
    var check_between = [];
    var checkedRowsGuids = [];
    let { undo } = this.state;

    this.state.finaldata.filter((e, index) => {
      if (e.checkbox == true) {
        check_between.push(index);
        checkedRowsGuids.push(e.guid);
      }
    });

    undo.push({
      SELECTBETWEEN: checkedRowsGuids,
    });

    index_start = check_between[0];
    index_end = check_between[1];
    if (check_between.length == 2) {
      this.state.finaldata.map((e, index) => {
        if (index >= index_start && index <= index_end) {
          e.checkbox = true;
        }
      });

      await this.setState({
        finaldata: this.state.finaldata,
        undo: undo,
      });
    } else {
      this.state.required_messages.map((e) =>
        e.ID == 11
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }
    await this.redRowHandler();
  };

  insertRowHandler = async () => {
    await this.removeCutRows();
    let { undo } = this.state;
    let check_row = [];
    let checkrowindex = "";
    this.state.finaldata.filter((e, index) => {
      if (e.checkbox == true) {
        check_row.push(e); // my code
      }
    });

    //get the sample of detail row to copy
    var samplefordb = this.state.originalData.find(
      (d) => d.guid === check_row[0].guid
    );
    //    var sampleforusage = this.state.pivotGroupTag.find(
    //      e => e.Type === "Detail"
    //    );
    var columnsfordb = [];
    samplefordb.Columns.map((s) => {
      // check_row[0].Columns.map(s => {
      var column = this.state.allcolumnsoftemp.find(
        (column) => column.guid === s.ColumnGuid
      );

      if (column !== undefined) {
        columnsfordb.push({
          // uniqueCellId: uuidv1(),
          ColumnGuid: s.ColumnGuid,
          AmountValue: "0",
          TextValue:
            column.ColumnName.toUpperCase() == "LEVEL" ? s.TextValue : null,
          // TextValue: null
        });
      }
    });

    // return false;
    if (check_row.length == 1) {
      //get indexof checked row to get previous row from pivotgrouptag

      checkrowindex = this.state.pivotGroupTag.indexOf(check_row[0]);

      //checking the addition between header and total(no child node between them)
      var having_child_node = [];
      if (check_row[0].Type === "Header") {
        this.state.required_messages.map((e) =>
          e.ID == 17
            ? this.setState({
                message_desc:
                  "Blank rows can only be inserted between a header & total",
                message_heading: "Can't Insert Row",
                openMessageModal: true,
              })
            : ""
        );
        return false;
      } else {
        having_child_node = this.state.pivotGroupTag.filter((val) => {
          return (
            val.ParentGuid === check_row[0].ParentGuid && val.Type === "Header"
          );
        });
      }

      if (having_child_node.length === 0) {
        //making position here

        var finalposition = await this.makeposition(
          this.state.pivotGroupTag[checkrowindex - 1].Position
        );
        let guid = uuidv1();

        // var rowtoadd = {
        //   BusinessUnitGuid: check_row[0].BusinessUnitGuid,
        //   Columns: columnsfordb,
        //   checkbox: false,
        //   checkzero: false,
        //   guid: guid,
        //   ParentGuid:
        //     check_row[0].Type === "Header"
        //       ? check_row[0].guid
        //       : check_row[0].ParentGuid,
        //   Position: finalposition,
        //   TenantGuid: check_row[0].TenantGuid,
        //   Type: "Detail",
        //   TotalGuid: null,
        //   clicked: false,
        //   carrot: false,
        //   isAccountEmpty: true,
        // };

        // mycode

        var rowtoadd = {
          BusinessUnitGuid: check_row[0].BusinessUnitGuid,
          Columns: columnsfordb,
          checkbox: false,
          checkzero: false,
          guid: guid,
          ParentGuid:
            check_row[0].Type === "Header"
              ? check_row[0].guid
              : check_row[0].ParentGuid,
          Position: finalposition,
          TenantGuid: check_row[0].TenantGuid,
          Type: "Detail",
          TotalGuid: null,
          clicked: false,
          carrot: false,
          isAccountEmpty: false,
        };

        // mycode

        undo.push({
          INSERTROW: guid,
        });

        var test = this.state.pivotGroupTag;
        var test1 = this.state.finaldata;
        var test2 = this.state.originalData;
        API.post("pivot", "/addblankrow", {
          body: rowtoadd,
        })
          .then(async (e) => {
            //adding in original data for further process
            let dateTime = new Date().getTime();
            this.activityRecord([
              {
                User: localStorage.getItem("Email"),
                Datetime: dateTime,
                Module: "Icons",
                Description: "Insert Row",
                ProjectName: this.state.selectedProject.Name,
                Projectguid: this.state.selectedProject.guid,
                ColumnName: "",
                ValueFrom: "",
                ValueTo: "",
                Tenantid: localStorage.getItem("tenantguid"),
              },
            ]);

            test2.push(e);
            this.setState({
              originalData: test2,
            });
          })
          .catch((e) => {
            console.log(e);
          });

        //making object for current usage
        var usagecolumn = [];
        columnsfordb.map((column) => {
          var tmpcheck = this.state.orderColumns.find(
            (o) => o.guid === column.ColumnGuid
          );
          if (tmpcheck !== undefined) {
            usagecolumn.push({
              obj: {
                uniqueCellId: uuidv1(),
                ColumnGuid: column.ColumnGuid,
                AmountValue: "0",
                TextValue: column.TextValue,
              },
            });
          }
        });

        //ordering data according to template columns
        var finalcols = [];
        this.state.orderColumns.map((a) => {
          var tmp = usagecolumn.find((d) => d.obj.ColumnGuid === a.guid);
          finalcols.push(tmp);
        });

        rowtoadd.Columns = finalcols;
        // if (!this.state.check_blank_row) {
        test.push(rowtoadd);

        // if (check_row[0].Type === "Header") {
        // if (check_row[0].clicked===true) {
        //
        // test1.push(rowtoadd);
        // }
        // } else {
        test1.push(rowtoadd);
        //}
        //  }
        await this.setState({
          undo: undo,
          finaldata: test1.sort(function (a, b) {
            var nameA = a.Position;
            var nameB = b.Position;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          }),
          pivotGroupTag: test.sort(function (a, b) {
            var nameA = a.Position;
            var nameB = b.Position;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          }),
        });
        await this.redRowHandler();
      } else {
        this.state.required_messages.map((e) =>
          e.ID == 17
            ? this.setState({
                message_desc:
                  "Blank rows can only be inserted between a header & total",
                message_heading: "Can't Insert Row",
                openMessageModal: true,
              })
            : ""
        );
      }
      //await this.groupingLevel(this.state.pivotData);
      if (!this.state.check_blank_row) {
        await this.replaceHistory(this.state.finaldata);
      }
    } else {
      this.state.required_messages.map((e) =>
        e.ID == 12
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }
  };

  makeposition = (position) => {
    var prev_position = position;

    prev_position =
      prev_position.length > 8
        ? prev_position.slice(0, -4) +
          (
            parseInt(prev_position.substr(prev_position.length - 4)) + 10
          ).toString()
        : (parseInt(prev_position) + 10).toString();

    if (
      this.state.originalData.find(
        (e) => e.Position === prev_position.toString()
      ) !== undefined
    ) {
      prev_position =
        prev_position.length > 8
          ? (
              prev_position.slice(0, -4) +
              (
                parseInt(prev_position.substr(prev_position.length - 4)) - 10
              ).toString()
            ).toString() + "5000"
          : (parseInt(prev_position) - 10).toString() + "5000";
      if (
        this.state.originalData.find(
          (e) => e.Position === prev_position.toString()
        ) !== undefined
      ) {
        prev_position =
          prev_position.length > 8
            ? prev_position.slice(0, -4) +
              (
                parseInt(prev_position.substr(prev_position.length - 4)) - 10
              ).toString()
            : (parseInt(prev_position) - 10).toString();
        if (
          this.state.originalData.find(
            (e) => e.Position === prev_position.toString()
          ) !== undefined
        ) {
          var flag = false;
          while (flag === false) {
            if (
              this.state.originalData.find(
                (e) => e.Position === prev_position.toString()
              ) !== undefined
            ) {
              prev_position =
                prev_position.length > 8
                  ? prev_position.slice(0, -4) +
                    (
                      parseInt(prev_position.substr(prev_position.length - 4)) -
                      10
                    ).toString()
                  : (parseInt(prev_position) - 10).toString();
            } else {
              flag = true;
            }
          }
        }
      }
    }
    return prev_position.toString();
  };

  deleteRow = async () => {
    await this.setState({
      delete: true,
    });
    await this.closeModal("openDeleteModal");
    await this.onDeleteRow();
  };

  onDeleteRow = async () => {
    await this.removeCutRows();
    let { undo } = this.state;
    var check_row = [];
    var pivotdataupdate = [];
    let checkedRowsHeaders = [];
    let check_row_positions = [];
    let check_row_description = [];
    let descriptionColumnGuid = this.state.allcolumnsoftemp.find(
      (col) => col.ColumnName.toUpperCase() === "DESCRIPTION"
    ).guid;

    this.state.finaldata.map((e, index) => {
      if (e.checkbox == true) {
        check_row.push(e);
        check_row_positions.push(index);

        let descriptionCell = e.Columns.find(
          (cell) => cell.obj.ColumnGuid === descriptionColumnGuid
        );
        if (descriptionCell && descriptionCell.obj.TextValue) {
          check_row_description.push(descriptionCell.obj.TextValue);
        } else {
          check_row_description.push(descriptionCell.obj.AmountValue);
        }
      } else {
        delete [e.deletes];
      }
    });

    //find columns of previous period type
    let periodcolumn = this.state.allcolumnsoftemp.filter((g) => {
      if (
        g.Type === "PreviousPeriod" ||
        g.Type === "Entry" ||
        g.Type === "DataIntegration"
      ) {
        return true;
      }
    });

    // let emptyperiodcell = true;
    // check_row.find((checkedRow) => {
    //   let originalRow = this.state.originalData.find(k => k.guid === checkedRow.guid);

    //   let result = periodcolumn.find(k => {

    //     let originalCell = originalRow.Columns.find(j => j.ColumnGuid === k.guid);
    //     let pivotCell = checkedRow.Columns.find(j => j.obj.ColumnGuid === k.guid);

    //     if(pivotCell === undefined) {

    //       let column = this.state.allcolumnsoftemp.find(c => c.guid === k.SelectedColumnGuid);
    //       if(column && column.Formula) {
    //         let value = this.formulaCallback(checkedRow.guid, column.Formula);
    //         if(value !== "0" && value !== 0) {
    //           emptyperiodcell = false;
    //           return true;
    //         }
    //       }

    //     } else {

    //       if(
    //         pivotCell.obj.AmountValue !== "0" ||
    //         pivotCell.obj.TextValue !== null
    //       ) {
    //         emptyperiodcell = false;
    //         return true;
    //       }

    //     }
    //   });
    //   if(result) {
    //     return true;
    //   }
    // });

    let emptyperiodcell = true;
    check_row.map((checkedRow) => {
      let originalRow = this.state.originalData.find(
        (k) => k.guid === checkedRow.guid
      );

      periodcolumn.map((k) => {
        let originalCell = originalRow.Columns.find(
          (j) => j.ColumnGuid === k.guid
        );

        if (
          (originalCell && originalCell.AmountValue != "0") ||
          (originalCell &&
            originalCell.TextValue !== null &&
            originalCell &&
            originalCell.TextValue != "0")
        ) {
          emptyperiodcell = false;
        }
      });
    });

    if (emptyperiodcell === true) {
      /**
       * Getting headers of check_row.
       */
      check_row.map((checkedRow) => {
        this.state.finaldata.find((row) => {
          if (row.guid === checkedRow.ParentGuid) {
            checkedRowsHeaders.push(row);
          }
        });
      });

      if (check_row.length > 0) {
        var guids = [];
        if (!this.state.delete) {
          await this.openModal("openDeleteModal");
          $("#projects_sub_del").focus();
        }
        if (this.state.delete == true) {
          await this.setState({
            isLoading: true,
          });
          if (
            check_row.find((i) => i.Type == "Total" || i.Type == "Header") ==
            undefined
          ) {
            //details delete case

            check_row.map(async (value, index) => {
              value.deletes = true;
            });
          } else if (
            check_row.find((i) => i.Type == "Total") !== undefined &&
            check_row.find((i) => i.Type == "Header") !== undefined &&
            check_row.find((i) => i.Type == "Detail") !== undefined
          ) {
            //chunk delete case
            this.state.required_messages.map((e) =>
              e.ID == 1
                ? this.setState({
                    message_desc:
                      "only checked Detail(s) or Header at once, both at a time not allowed",
                    message_heading: "Delete Row",
                    openMessageModal: true,
                  })
                : ""
            );
            $(document).ready(function () {
              $(this).find("#ok_button").focus();
            });
          } else {
            if (
              check_row.length === 1 &&
              check_row[0].Type === "Header" &&
              check_row[0].ParentGuid !== "root"
            ) {
              //delete chunk
              var array = [];
              var detailstochangelevel = [];
              var guid = check_row[0].guid;
              var containdetail = false;
              var headerindex = this.state.pivotGroupTag.findIndex(
                (h) => h.guid === guid
              );
              var totalindex = this.state.pivotGroupTag.findIndex(
                (h) => h.ParentGuid === guid && h.Type === "Total"
              );
              this.state.pivotGroupTag.map((value, ind) => {
                if (ind > headerindex && ind < totalindex) {
                  if (
                    value.Type === "Detail" &&
                    value.ParentGuid ===
                      this.state.pivotGroupTag[headerindex].guid
                  ) {
                    containdetail = true;
                  }
                  if (value.Type === "Header" || value.Type === "Total") {
                    array.push(value);
                  } else {
                    detailstochangelevel.push(value);
                  }
                }
              });
              if (containdetail == false) {
                //only push total in guids because header is automaticaly get through checked rows.
                this.state.pivotGroupTag[headerindex].deletes = true;
                this.state.pivotGroupTag[totalindex].deletes = true;
                //guids.push(this.state.pivotGroupTag[headerindex].guid)
                guids.push(this.state.pivotGroupTag[totalindex].guid);
                var parentid = this.state.pivotGroupTag[headerindex].ParentGuid;
                //changing parent id

                if (array.length > 0) {
                  var levelguid = this.state.orderColumns.find(
                    (u) => u.ColumnName.toUpperCase() === "LEVEL"
                  ).guid;
                  array.map((o) => {
                    if (o.Type === "Header") {
                      this.state.pivotGroupTag.find(
                        (u) => u.guid == o.guid
                      ).ParentGuid = parentid;
                      this.state.finaldata.find(
                        (u) => u.guid == o.guid
                      ).ParentGuid = parentid;
                      this.state.originalData.find(
                        (u) => u.guid == o.guid
                      ).ParentGuid = parentid;
                    }
                    //tag data level change start

                    var tmprowtag = this.state.pivotGroupTag.find(
                      (u) => u.guid == o.guid
                    );
                    var leveltag = tmprowtag.Columns.find(
                      (y) => y.obj.ColumnGuid === levelguid
                    );
                    if (parseInt(leveltag.obj.TextValue) != NaN) {
                      leveltag.obj.TextValue =
                        parseInt(leveltag.obj.TextValue) - 1;
                    } else if (parseInt(leveltag.obj.AmountValue) != NaN) {
                      leveltag.obj.TextValue =
                        parseInt(leveltag.obj.AmountValue) - 1;
                    }

                    //tag data level change end

                    //original rows level start
                    var tmproworg = this.state.originalData.find(
                      (u) => u.guid == o.guid
                    );

                    var levelorg = tmproworg.Columns.find(
                      (y) => y.ColumnGuid === levelguid
                    );

                    if (parseInt(levelorg.TextValue) != NaN) {
                      levelorg.TextValue = parseInt(levelorg.TextValue) - 1;
                    } else if (parseInt(levelorg.obj.AmountValue) != NaN) {
                      levelorg.TextValue = parseInt(levelorg.AmountValue) - 1;
                    }
                    //original rows level end
                    pivotdataupdate.push(
                      this.state.originalData.find((u) => u.guid == o.guid)
                    );
                  });

                  detailstochangelevel.map((o) => {
                    var tmprowtag = this.state.pivotGroupTag.find(
                      (u) => u.guid == o.guid
                    );
                    var leveltag = tmprowtag.Columns.find(
                      (y) => y.obj.ColumnGuid === levelguid
                    );
                    if (parseInt(leveltag.obj.TextValue) != NaN) {
                      leveltag.obj.TextValue =
                        parseInt(leveltag.obj.TextValue) - 1;
                    } else if (parseInt(leveltag.obj.AmountValue) != NaN) {
                      leveltag.obj.TextValue =
                        parseInt(leveltag.obj.AmountValue) - 1;
                    }

                    //tag data level change end

                    //original rows level start
                    var tmproworg = this.state.originalData.find(
                      (u) => u.guid == o.guid
                    );

                    var levelorg = tmproworg.Columns.find(
                      (y) => y.ColumnGuid === levelguid
                    );

                    if (parseInt(levelorg.TextValue) != NaN) {
                      levelorg.TextValue = parseInt(levelorg.TextValue) - 1;
                    } else if (parseInt(levelorg.obj.AmountValue) != NaN) {
                      levelorg.TextValue = parseInt(levelorg.AmountValue) - 1;
                    }
                    //original rows level end
                    pivotdataupdate.push(
                      this.state.originalData.find((u) => u.guid == o.guid)
                    );
                  });
                }
              } else {
                this.state.required_messages.map((e) =>
                  e.ID == 1
                    ? this.setState({
                        message_desc:
                          "Can’t delete header that contains detail rows. Delete detail rows first then delete header row.",
                        message_heading: "Delete Row",
                        openMessageModal: true,
                      })
                    : ""
                );
                $(document).ready(function () {
                  $(this).find("#ok_button").focus();
                });
              }
            } else if (
              check_row.find((i) => i.Type == "Header") !== undefined &&
              check_row.find((i) => i.Type == "Detail") !== undefined
            ) {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc:
                        "only checked Detail(s) or Header at once, both at a time not allowed",
                      message_heading: "Delete Row",
                      openMessageModal: true,
                    })
                  : ""
              );
              $(document).ready(function () {
                $(this).find("#ok_button").focus();
              });
            } else {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc:
                        "Check the header row only to delete a header and total.",
                      message_heading: "Delete Header & Total",
                      openMessageModal: true,
                    })
                  : ""
              );
              $(document).ready(function () {
                $(this).find("#ok_button").focus();
              });
            }
          }

          await this.setState({
            delete: false,
          });

          var d = false;

          check_row.map((u) => {
            if (u.deletes !== true) {
              d = true;
            } else if (u.deletes == true) {
              guids.push(u.guid);
            }
          });

          let undoPivotRows = [];
          let undoOriginalRows = [];
          guids.map((local_guid) => {
            undoPivotRows.push(
              this.state.pivotGroupTag.find((row) => local_guid === row.guid)
            );
            undoOriginalRows.push(
              this.state.originalData.find((row) => local_guid === row.guid)
            );
          });
          undo.push({
            DELETEDROW: {
              DELETEDPIVOTROW: undoPivotRows,
              DELETEDORIGINALROW: undoOriginalRows,
            },
          });

          this.setState({
            undo: undo,
          });

          if (d == false) {
            var p = this.state.pivotGroupTag;
            var f = this.state.finaldata;
            var od = this.state.originalData;
            guids.map((value) => {
              p = p.filter((u) => u.guid != value);
              f = f.filter((u) => u.guid != value);
              od = od.filter((u) => u.guid != value);
            });
            await this.setState({
              undo: undo,
              pivotGroupTag: p.sort(function (a, b) {
                var nameA = a.Position;
                var nameB = b.Position;
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              }),
              originalData: od,
              finaldata: f.sort(function (a, b) {
                var nameA = a.Position;
                var nameB = b.Position;
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              }),
            });
            await this.redRowHandler();

            checkedRowsHeaders.map(async (row) => {
              await this.calculateData(row);
            });

            var lofrows = Math.ceil(guids.length / 20);
            for (var i = 0; i < lofrows * 20; i = i + 20) {
              var arraytosend = guids.slice(i, i + 20);
              await API.post("pivot", "/deletepivotdata", {
                body: {
                  guids: arraytosend,
                },
              })
                .then(async () => {
                  if (lofrows * 20 - 20 === i) {
                    let dateTime = new Date().getTime();
                    this.activityRecord([
                      {
                        User: localStorage.getItem("Email"),
                        Datetime: dateTime,
                        Module: "Icons",
                        Description: "Delete Row",
                        ProjectName: this.state.selectedProject.Name,
                        Projectguid: this.state.selectedProject.guid,
                        ColumnName: "",
                        ValueFrom: check_row_description.toString(),
                        // "ValueTo": check_row_positions.toString(),
                        ValueTo: "",
                        Tenantid: localStorage.getItem("tenantguid"),
                      },
                    ]);
                  }
                })
                .catch((error) => {});
            }

            if (pivotdataupdate.length > 0) {
              var lofdata = Math.ceil(pivotdataupdate.length / 20);
              for (var i = 0; i < lofdata * 20; i = i + 20) {
                var arraytosend = pivotdataupdate.slice(i, i + 20);
                await API.post("pivot", "/copypivotdata", {
                  body: {
                    pivotdata: arraytosend,
                  },
                })
                  .then((data) => {
                    // toast.success("data added with updated groups names.");
                  })
                  .catch((err) => {
                    this.setState({
                      message_desc: "Copydata request failed",
                      message_heading: "Pivot Data",
                      openMessageModal: true,
                    });
                    // toast.error('copydata request failed');
                  });
              }
            }
          }
          // await this.setState({finaldata:x})
        }
        await this.setState({
          isLoading: false,
        });
      } else {
        this.state.required_messages.map((e) =>
          e.ID == 1
            ? this.setState({
                message_desc: "This only works if 1 or more rows are selected.",
                message_heading: "Delete Row",
                openMessageModal: true,
              })
            : ""
        );
        $(document).ready(function () {
          $(this).find("#ok_button").focus();
        });
      }
    } else {
      this.state.required_messages.map((e) =>
        e.ID == 26
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }
  };

  handleColumnvalue = async (e) => {
    await this.setState({
      columnValue: e.target.value,
    });
  };

  handleComparisonValue = async (e) => {
    await this.setState({
      comparsionValue: e.target.value,
    });
  };

  handlevalue = async (e) => {
    await this.setState({
      value: e.target.value,
    });
  };

  filterdata = async () => {
    var columnValue = this.state.columnValue;
    var comparsionValue = this.state.comparsionValue;
    var value = this.state.value;
    var tmp_arr = [];
    var white = this.state.columns_white;
    var indi = this.state.orderColumns.findIndex((e) => {
      return columnValue == e.guid;
    });
    let formErrors = this.state.filter_formErrors;

    if (!this.state.columnValue) {
      formErrors.columnValue = "This Field is Required.";
      this.state.required_messages.map((e) =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }
    if (!this.state.comparsionValue) {
      formErrors.comparsionValue = "This Field is Required.";
      this.state.required_messages.map((e) =>
        e.ID == 1
          ? this.setState({
              message_desc: e.Desc,
              message_heading: e.Heading,
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }
    // if (!this.state.value) {
    //   formErrors.value = 'This Field is Required.';
    //   this.state.required_messages.map((e) =>
    //     e.ID == 1 ?
    //     this.setState({
    //       message_desc: e.Desc,
    //       message_heading: e.Heading,
    //       openMessageModal: true,
    //     }) :
    //     ''
    //   );
    //   $(document).ready(function () {
    //     $(this).find('#ok_button').focus();
    //   });
    // }

    if (columnValue !== "" && comparsionValue !== "") {
      //saving the last state of worktable
      if (this.state.columns_white.length === 0) {
        this.setState({
          laststateWorktable: this.state.finaldata,
        });
      }

      //identifying the first filter or second
      var datafilter =
        this.state.columns_white.length > 0
          ? this.state.finaldata
          : this.state.pivotGroupTag;
      datafilter.map((e, index) => {
        if (e.Type !== "Header" && e.Type !== "Total" && e.Columns.length > 0) {
          switch (comparsionValue) {
            case "greater":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (value < e.Columns[indi].obj.TextValue) {
                  tmp_arr.push(e);
                }
              } else {
                if (value !== "" && value < e.Columns[indi].obj.AmountValue) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            case "less":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (value > e.Columns[indi].obj.TextValue) {
                  tmp_arr.push(e);
                }
              } else {
                if (value !== "" && value > e.Columns[indi].obj.AmountValue) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            case "equal":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (value == e.Columns[indi].obj.TextValue) {
                  tmp_arr.push(e);
                }
              } else {
                if (value !== "" && value == e.Columns[indi].obj.AmountValue) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            case "notequal":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (value != e.Columns[indi].obj.TextValue) {
                  tmp_arr.push(e);
                }
              } else {
                if (value !== "" && value != e.Columns[indi].obj.AmountValue) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            case "contain":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (
                  e.Columns[indi].obj.TextValue.toLowerCase().includes(
                    value.toLowerCase()
                  )
                ) {
                  tmp_arr.push(e);
                }
              } else {
                if (
                  value !== "" &&
                  e.Columns[indi].obj.AmountValue.toLowerCase().includes(
                    value.toLowerCase()
                  )
                ) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            case "notcontain":
              if (
                e.Columns[indi].obj.TextValue !== " " &&
                e.Columns[indi].obj.TextValue !== null
              ) {
                if (
                  !e.Columns[indi].obj.TextValue.toLowerCase().includes(
                    value.toLowerCase()
                  )
                ) {
                  tmp_arr.push(e);
                }
              } else {
                if (
                  value !== "" &&
                  !e.Columns[indi].obj.AmountValue.toLowerCase().includes(
                    value.toLowerCase()
                  )
                ) {
                  tmp_arr.push(e);
                } else if (
                  value === "" &&
                  (e.Columns[indi].obj.TextValue === "" ||
                    e.Columns[indi].obj.TextValue === null) &&
                  e.Columns[indi].obj.AmountValue === "0"
                ) {
                  tmp_arr.push(e);
                }
              }

              break;

            default:
              break;
          }
        }
      });

      document.getElementsByClassName("filter" + columnValue)[0].style.color =
        "red";
      white.push("filter" + columnValue);
      this.closeModal("openFilterModal");
      await this.setState({
        columns_white: white,
        finaldata: tmp_arr,
        columnValue: "",
        comparsionValue: "",
        value: "",
      });
    }
    await this.redRowHandler();
  };

  clearfilter = async () => {
    this.state.columns_white.map((e) => {
      if (document.getElementsByClassName(e)[0]) {
        document.getElementsByClassName(e)[0].style.color = "white";
      }
    });
    let formErrors = this.state.filter_formErrors;
    formErrors.columnValue = "";
    formErrors.comparsionValue = "";
    formErrors.value = "";
    await this.setState({
      finaldata:
        this.state.columns_white.length > 0
          ? this.state.laststateWorktable
          : this.state.finaldata,
      columns_white: [],
      columnValue: "",
      comparsionValue: "",
      value: "",
      filter_formErrors: formErrors,
    });
    await this.clearFilterRedRow();
    await this.redRowHandler();
    this.closeFilterModal();
    // await this.groupingLevel(this.state.pivotData);
  };

  clearStates = (state) => {
    this.setState(state);
  };

  closeFilterModal = () => {
    this.closeModal("openFilterModal");
  };

  logout = async () => {
    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Icons",
        Description: "Logout",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        ValueTo: "",
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);

    await this.props.signinout();
    if (this.props.signoutresult !== "") {
      localStorage.removeItem("guid");
      localStorage.removeItem("tenantguid");
      localStorage.removeItem("tenantguids");
      localStorage.removeItem("Email");
      // toast.success('Successfully Logout');
      this.props.history.push("/login", {
        from: "/dashboard",
      });
    }
  };

  cutRows = async () => {
    var check_row = [];
    var selectedrows = [];
    var u1 = [];
    var unselect = [];
    let selectedRowsPositions = [];
    let undoRowsGuids = [];
    let { undo } = this.state;
    this.state.finaldata.filter((e, index) => {
      if (e.checkbox == true) {
        selectedrows.push(e);
        selectedRowsPositions.push(e.Position);
        u1.push(e.guid);
        undoRowsGuids.push(e);
      }
    });

    undo.push({
      CUTROWS: selectedrows,
    });

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Icons",
        Description: "Cut Row",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        // "ValueTo": selectedRowsPositions.toString(),
        ValueTo: "",
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);

    unselect = selectedrows;

    var indexes = [];
    var ggg = [];
    var totalnotfound = false;
    var headernotfound = false;
    selectedrows.map(async (val, index) => {
      var s = this.state.pivotGroupTag.findIndex((u) => u.guid == val.guid);

      ggg.push(s);
    });
    indexes = ggg;

    var halt = false;
    indexes.sort(function (nameA, nameB) {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    var vals = indexes[0];
    if (indexes.length >= 1) {
      for (var i = 0; i < indexes.length; i++) {
        if (halt == false) {
          if (indexes.length - 1 >= i + 1) {
            var nextvalue = indexes[i + 1];
            if (nextvalue == vals + 1) {
              vals = nextvalue;
            } else if (nextvalue != vals + 1) {
              halt = true;
            }
          }
        }
      }

      // are in sequence;
      var handt = false;

      if (halt == false) {
        indexes.map(async (value, index) => {
          if (this.state.pivotGroupTag[value].Type == "Header") {
            handt = true;
            var y2 = this.state.pivotGroupTag;
            var s2 = indexes.findIndex(
              (u) => y2[u].ParentGuid == y2[value].guid && y2[u].Type == "Total"
            );

            if (s2 == -1) {
              halt = true;
            }

            if (halt == true) {
              totalnotfound = true;
            }
          } else if (this.state.pivotGroupTag[value].Type == "Total") {
            handt = true;
            var y2 = this.state.pivotGroupTag;
            var s2 = indexes.findIndex(
              (u) =>
                y2[u].guid == y2[value].ParentGuid && y2[u].Type == "Header"
            );

            if (s2 == -1) {
              halt = true;
              headernotfound = true;
            }
          }
        });
        // all total headers exist

        if (halt == false) {
          check_row = [];
          if (handt == true) {
            var s4 = indexes[0];
            var obj = this.state.pivotGroupTag.find(
              (u) => u.guid == this.state.pivotGroupTag[s4].guid
            );
            obj.cutrow = true;
            check_row.push(obj);
            var laste = indexes.length - 1;
            s4 = indexes[laste];
            obj = this.state.pivotGroupTag[s4];
            obj.cutrow = true;
            check_row.push(obj);
          } else {
            indexes.map((value, index) => {
              var s4 = indexes[index];
              var obj = this.state.pivotGroupTag.find(
                (u) => u.guid == this.state.pivotGroupTag[s4].guid
              );
              obj.cutrow = true;
              check_row.push(obj);
            });
          }
          var sh = this.state.pivotGroupTag;
          unselect.map((value) => {
            value.checkbox = false;
          });
          await this.setState({
            pivotGroupTag: this.state.pivotGroupTag,
          });
        }
        if (halt == true) {
          if (totalnotfound == true) {
            totalnotfound = false;
            this.state.required_messages.map((e) =>
              e.ID == 17
                ? this.setState({
                    message_desc: e.Desc,
                    message_heading: e.Heading,
                    openMessageModal: true,
                  })
                : ""
            );
            $(document).ready(function () {
              $(this).find("#ok_button").focus();
            });
          } else if (headernotfound == true) {
            headernotfound = false;
            this.state.required_messages.map((e) =>
              e.ID == 17
                ? this.setState({
                    message_desc: e.Desc,
                    message_heading: e.Heading,
                    openMessageModal: true,
                  })
                : ""
            );
            $(document).ready(function () {
              $(this).find("#ok_button").focus();
            });
          }
          check_row = [];
        }
      }

      if (halt == true) {
        this.state.required_messages.map((e) =>
          e.ID == 16
            ? this.setState({
                message_desc: e.Desc,
                message_heading: e.Heading,
                openMessageModal: true,
              })
            : ""
        );
        $(document).ready(function () {
          $(this).find("#ok_button").focus();
        });
      }
    }

    if (check_row.length > 0) {
      var x = this.state.finaldata;
      var row = check_row[0];
      if (row.Type != "Header" && row.Type != "Total") {
        x.map((value, index) => {
          if (value.guid == row.guid) {
            value.cutrow = true;
            row.checkbox = false;
          }
        });
        await this.setState({
          finaldata: x,
        });
      } else if (
        row.Type == "Header" ||
        row.Type == "Total" ||
        row.Type == "SubHeader" ||
        row.Type == "SubTotal"
      ) {
        if (check_row.length >= 2) {
          if (row.Type == "Header" || row.Type == "SubHeader") {
            if (row.ParentGuid != "root") {
              var secondRow = check_row[1];
              if (secondRow.ParentGuid != "root") {
                if (
                  (secondRow.Type == "Total" || secondRow.Type == "SubTotal") &&
                  row.guid == secondRow.ParentGuid
                ) {
                  var x = this.state.finaldata;

                  // see if there is inner elemet of type header than no check

                  x.map((value, index) => {
                    if (value.guid == row.guid) {
                      value.cutrow = true;
                      row.checkbox = false;
                      secondRow.checkbox = false;
                    }
                  });
                  await this.setState({
                    finaldata: x,
                  });
                } else {
                  this.state.required_messages.map((e) =>
                    e.ID == 1
                      ? this.setState({
                          message_desc:
                            "This will only works if the corresponding header and total are selected",
                          message_heading: "Cut Header and Total",
                          openMessageModal: true,
                        })
                      : ""
                  );
                  $(document).ready(function () {
                    $(this).find("#ok_button").focus();
                  });
                }
              } else {
                this.state.required_messages.map((e) =>
                  e.ID == 1
                    ? this.setState({
                        message_desc: "This row Can't be cut",
                        message_heading: "Cut First Row",
                        openMessageModal: true,
                      })
                    : ""
                );
                $(document).ready(function () {
                  $(this).find("#ok_button").focus();
                });
                this.state.pivotGroupTag.map((value) => {
                  if (value.guid == secondRow.guid) {
                    value.checkbox = false;
                  }
                  if (value.guid == row.guid) {
                    value.checkbox = false;
                  }
                });
                await this.setState({
                  pivotGroupTag: this.state.pivotGroupTag,
                });
              }
            } else {
              this.state.required_messages.map((e) =>
                e.ID == 17
                  ? this.setState({
                      message_desc: e.Desc,
                      message_heading: e.Heading,
                      openMessageModal: true,
                    })
                  : ""
              );
              $(document).ready(function () {
                $(this).find("#ok_button").focus();
              });
              this.state.pivotGroupTag.map((value) => {
                if (value.guid == row.guid) {
                  value.checkbox = false;
                }
              });
              await this.setState({
                pivotGroupTag: this.state.pivotGroupTag,
              });
            }
          } else if (row.Type == "Total" || row.Type == "SubTotal") {
            var secondrow = check_row[1];
            if (
              (secondrow.Type == "Header" || secondrow.Type == "SubHeader") &&
              row.ParentGuid == secondrow.guid
            ) {
              var x = this.state.finaldata;
              x.map((value, index) => {
                if (value.guid == secondrow.guid) {
                  value.cut = true;
                  row.checkbox = false;
                  secondrow.checkbox = false;
                }
              });
            } else {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc: e.Desc,
                      message_heading: "Cut Header and Total",
                      openMessageModal: true,
                    })
                  : ""
              );
              $(document).ready(function () {
                $(this).find("#ok_button").focus();
              });
            }
          }
        } else {
          this.state.required_messages.map((e) =>
            e.ID == 1
              ? this.setState({
                  message_desc:
                    "This will only works if corresponding header and total are selected",
                  message_heading: "Cut Header and Total",
                  openMessageModal: true,
                })
              : ""
          );
          $(document).ready(function () {
            $(this).find("#ok_button").focus();
          });
        }
      }
      this.setState({
        cutfinal: u1,
        selectedcheckbox: selectedrows,
        undo: undo,
      });

      selectedrows.map((value) => {
        var ids = document.getElementById(`${value.guid}_span`);
        // ids.style.backgroundColor = "#848484"
        $(`#${value.guid}_span`).addClass("span_dim_color");
      });
    } else {
      this.state.required_messages.map((e) =>
        e.ID == 1
          ? this.setState({
              message_desc:
                "This will only works if the corresponding header and total are selected",
              message_heading: "Cut Header and Total",
              openMessageModal: true,
            })
          : ""
      );
      $(document).ready(function () {
        $(this).find("#ok_button").focus();
      });
    }

    await this.redRowHandler();
  };

  pasteRow = async () => {
    var check_row = [];
    var cutRows = [];
    var originalData = this.state.originalData;
    var pivotGroupTag = this.state.pivotGroupTag;
    var finaldata = this.state.finaldata;
    var pasteRowIndex;
    var error = false;
    let postData = [];
    let { undo } = this.state;
    let undoPasteRows = [];
    let levelcol = this.state.allcolumnsoftemp.find(
      (k) => k.ColumnName.toUpperCase() === "LEVEL"
    );

    pivotGroupTag.filter((e, index) => {
      // push checkrow
      if (e.checkbox == true) {
        check_row.push(e);
      }
      // cut rows
      if (e.cutrow) {
        if (e.cutrow === true) {
          cutRows.push(e);
        }
      }
    });

    /**
     * Getting header of paste row for pasting detail rows only.
     */
    var pasteRow = check_row[0];
    var pasteRowParent = pasteRow.ParentGuid;
    var pasteRowHeader = pivotGroupTag.find(
      (row, index) => row.guid === pasteRowParent
    );
    var cutRowHeader = pivotGroupTag.find(
      (row, index) => row.guid === cutRows[0].ParentGuid
    );

    if (check_row.length === 1) {
      /**
       * Case: Cut rows.
       */
      if (pasteRow.ParentGuid === "root") {
        this.state.required_messages.map((e) =>
          e.ID == 1
            ? this.setState({
                message_desc: "You cannot paste rows at root element.",
                message_heading: "Paste row error",
                openMessageModal: true,
              })
            : ""
        );
        error = true;
      } else {
        /**
         * Updating level here.
         */
        var Levelobj = this.state.orderColumns.find(
          (s) => s.ColumnName.toUpperCase() === "LEVEL"
        );
        if (Levelobj === undefined) {
          Levelobj = "0";
        }

        //only detail cut rows case

        if (cutRows[0].Type === "Detail") {
          cutRows.map(async (row) => {
            var Levelvalue = pasteRow.Columns.find(
              (u) => u.obj.ColumnGuid === Levelobj.guid
            );
            var finalLevel;

            if (
              Levelvalue.obj.TextValue === " " ||
              Levelvalue.obj.TextValue === null
            ) {
              finalLevel = Levelvalue.obj.AmountValue;
            } else {
              finalLevel = Levelvalue.obj.TextValue;
            }

            if (pasteRow.Type === "Header") {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc: "You cannot paste detail rows at header.",
                      message_heading: "Paste row error",
                      openMessageModal: true,
                    })
                  : ""
              );
              error = true;
            } else {
              pasteRowIndex = pivotGroupTag.findIndex(
                (row) => row.guid === pasteRow.guid
              );

              let cell = row.Columns.find(
                (cell) => cell.obj.ColumnGuid === levelcol.guid
              );
              undoPasteRows.push({
                GUID: row.guid,
                POSITION: row.Position,
                PARENTGUID: row.ParentGuid,
                LEVELCOLUMNGUID: cell.obj.ColumnGuid,
                LEVELAMOUNTVALUE: cell.obj.AmountValue,
                LEVELTEXTVALUE: cell.obj.TextValue,
              });

              if (
                pivotGroupTag.find(
                  (row) =>
                    row.ParentGuid === pasteRowHeader.guid &&
                    row.Type === "Header"
                ) === undefined
              ) {
                /**
                 * We shouldn't update data in finaldata because finaldata is reference of pivotGroupTag.
                 * Updating position, level and ParentGuid in pivotGroupTag here.
                 */
                var prev_position = pivotGroupTag[pasteRowIndex - 1].Position;
                // makingPosition() start

                prev_position =
                  prev_position.length > 8
                    ? prev_position.slice(0, -4) +
                      (
                        parseInt(
                          prev_position.substr(prev_position.length - 4)
                        ) + 10
                      ).toString()
                    : (parseInt(prev_position) + 10).toString();

                if (
                  this.state.originalData.find(
                    (e) => e.Position === prev_position.toString()
                  ) !== undefined
                ) {
                  prev_position =
                    prev_position.length > 8
                      ? (
                          prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        ).toString() + "5000"
                      : (parseInt(prev_position) - 10).toString() + "5000";
                  if (
                    this.state.originalData.find(
                      (e) => e.Position === prev_position.toString()
                    ) !== undefined
                  ) {
                    prev_position =
                      prev_position.length > 8
                        ? prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        : (parseInt(prev_position) - 10).toString();
                    if (
                      this.state.originalData.find(
                        (e) => e.Position === prev_position.toString()
                      ) !== undefined
                    ) {
                      var flag = false;
                      while (flag === false) {
                        if (
                          this.state.originalData.find(
                            (e) => e.Position === prev_position.toString()
                          ) !== undefined
                        ) {
                          prev_position =
                            prev_position.length > 8
                              ? prev_position.slice(0, -4) +
                                (
                                  parseInt(
                                    prev_position.substr(
                                      prev_position.length - 4
                                    )
                                  ) - 10
                                ).toString()
                              : (parseInt(prev_position) - 10).toString();
                        } else {
                          flag = true;
                        }
                      }
                    }
                  }
                }
                prev_position = prev_position.toString();
                // makingPosition() end
                row.Position = prev_position;
                row.Columns.find(
                  (d) => d.obj.ColumnGuid === Levelobj.guid
                ).obj.TextValue = finalLevel;
                row.ParentGuid = pasteRowHeader.guid;

                /**
                 * Updating position, level and ParentGuid in originalData here.
                 */
                var originalDataRow;
                originalDataRow = originalData.find(
                  (originalRow) => originalRow.guid === row.guid
                );
                originalDataRow.Position = row.Position;
                originalDataRow.Columns.find(
                  (d) => d.ColumnGuid === Levelobj.guid
                ).TextValue = finalLevel;
                originalDataRow.ParentGuid = pasteRowHeader.guid;
                postData.push(originalDataRow);

                pivotGroupTag = pivotGroupTag.sort(function (a, b) {
                  var nameA = a.Position;
                  var nameB = b.Position;
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
                });
              } else {
                this.state.required_messages.map((e) =>
                  e.ID == 1
                    ? this.setState({
                        message_desc:
                          "You cannot paste detail rows at header which have other child nodes.",
                        message_heading: "Paste row error",
                        openMessageModal: true,
                      })
                    : ""
                );
                error = true;
              }
            }
          });
        }

        //complete chunk paste case
        // We have to paste complete chunk parallel to extreme child nodes that not having further child nodes
        else if (
          cutRows[0].Type === "Header" &&
          (pasteRow.Type === "Header" || pasteRow.Type === "Total")
        ) {
          /**
           * Getting rows between two outer cut header and total.
           * cutRows can only contains 1 outer header and 1 outer total.
           */

          var finalChunk = [];
          var headerIndex = pivotGroupTag.findIndex(
            (row) => row.guid === cutRows[0].guid
          );
          var totalIndex = pivotGroupTag.findIndex(
            (row) => row.guid === cutRows[1].guid
          );
          for (let index = headerIndex; index <= totalIndex; index++) {
            finalChunk.push(pivotGroupTag[index]);
          }

          if (pasteRow.Type === "Header") {
            var pasteRowHaveChunks;
            pasteRowHaveChunks = pivotGroupTag.find(
              (row) => row.ParentGuid === pasteRow.guid && row.Type === "Header"
            );
            if (pasteRowHaveChunks === undefined) {
              /**
               * Getting level for cut rows.
               */
              var Levelvalue = pasteRow.Columns.find(
                (u) => u.obj.ColumnGuid === Levelobj.guid
              );
              var finalLevel;

              if (
                Levelvalue.obj.TextValue === " " ||
                Levelvalue.obj.TextValue === null
              ) {
                finalLevel = Levelvalue.obj.AmountValue;
              } else {
                finalLevel = Levelvalue.obj.TextValue;
              }
              finalChunk.map(async (row, finalChunkIndex) => {
                pasteRowIndex = pivotGroupTag.findIndex(
                  (row) => row.guid === pasteRow.guid
                );

                let cell = row.Columns.find(
                  (cell) => cell.obj.ColumnGuid === levelcol.guid
                );
                undoPasteRows.push({
                  GUID: row.guid,
                  POSITION: row.Position,
                  PARENTGUID: row.ParentGuid,
                  LEVELCOLUMNGUID: cell.obj.ColumnGuid,
                  LEVELAMOUNTVALUE: cell.obj.AmountValue,
                  LEVELTEXTVALUE: cell.obj.TextValue,
                });

                /**
                 * We shouldn't update data in finaldata because finaldata is reference of pivotGroupTag.
                 * Updating position, level and ParentGuid in pivotGroupTag here.
                 */

                var prev_position = pivotGroupTag[pasteRowIndex - 1].Position;
                // makingPosition() start

                prev_position =
                  prev_position.length > 8
                    ? prev_position.slice(0, -4) +
                      (
                        parseInt(
                          prev_position.substr(prev_position.length - 4)
                        ) + 10
                      ).toString()
                    : (parseInt(prev_position) + 10).toString();

                if (
                  this.state.originalData.find(
                    (e) => e.Position === prev_position.toString()
                  ) !== undefined
                ) {
                  prev_position =
                    prev_position.length > 8
                      ? (
                          prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        ).toString() + "5000"
                      : (parseInt(prev_position) - 10).toString() + "5000";
                  if (
                    this.state.originalData.find(
                      (e) => e.Position === prev_position.toString()
                    ) !== undefined
                  ) {
                    prev_position =
                      prev_position.length > 8
                        ? prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        : (parseInt(prev_position) - 10).toString();
                    if (
                      this.state.originalData.find(
                        (e) => e.Position === prev_position.toString()
                      ) !== undefined
                    ) {
                      var flag = false;
                      while (flag === false) {
                        if (
                          this.state.originalData.find(
                            (e) => e.Position === prev_position.toString()
                          ) !== undefined
                        ) {
                          prev_position =
                            prev_position.length > 8
                              ? prev_position.slice(0, -4) +
                                (
                                  parseInt(
                                    prev_position.substr(
                                      prev_position.length - 4
                                    )
                                  ) - 10
                                ).toString()
                              : (parseInt(prev_position) - 10).toString();
                        } else {
                          flag = true;
                        }
                      }
                    }
                  }
                }
                prev_position = prev_position.toString();
                // makingPosition() end

                //finallevel yupdated
                if (finalChunkIndex > 0 && row.Type === "Header") {
                  finalLevel = parseInt(finalLevel) + 1;
                }

                row.Position = prev_position;
                row.Columns.find(
                  (d) => d.obj.ColumnGuid === Levelobj.guid
                ).obj.TextValue = finalLevel;
                if (finalChunkIndex === 0) {
                  row.ParentGuid = pasteRowHeader.guid;
                }

                /**
                 * Updating position, level and ParentGuid in originalData here.
                 */
                var originalDataRow;
                originalDataRow = originalData.find(
                  (originalRow) => originalRow.guid === row.guid
                );
                originalDataRow.Position = row.Position;
                originalDataRow.Columns.find(
                  (d) => d.ColumnGuid === Levelobj.guid
                ).TextValue = finalLevel;
                if (finalChunkIndex === 0) {
                  originalDataRow.ParentGuid = pasteRowHeader.guid;
                }
                postData.push(originalDataRow);
                if (finalChunkIndex > 0 && row.Type === "Total") {
                  finalLevel = parseInt(finalLevel) - 1;
                }
                pivotGroupTag = pivotGroupTag.sort(function (a, b) {
                  var nameA = a.Position;
                  var nameB = b.Position;
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
                });
              });
            } else {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc:
                        "You cannot paste header/detail/total rows at this position.",
                      message_heading: "Paste row error",
                      openMessageModal: true,
                    })
                  : ""
              );
              error = true;
            }
          } else if (pasteRow.Type === "Total") {
            /**
             * Checking extreme level with checking only 1 total before the checked total row.
             */
            pasteRowIndex = pivotGroupTag.findIndex(
              (row) => row.guid === pasteRow.guid
            );
            if (
              pivotGroupTag[pasteRowIndex - 1].Type === "Total" &&
              pivotGroupTag[pasteRowIndex - 2].Type !== "Total"
            ) {
              var finalLevel;
              /**
               * Getting level for cut rows.
               */
              var Levelvalue = pasteRow.Columns.find(
                (u) => u.obj.ColumnGuid === Levelobj.guid
              );

              if (
                Levelvalue.obj.TextValue === " " ||
                Levelvalue.obj.TextValue === null
              ) {
                finalLevel = Levelvalue.obj.AmountValue;
              } else {
                finalLevel = Levelvalue.obj.TextValue;
              }
              finalChunk.map(async (row, finalChunkIndex) => {
                pasteRowIndex = pivotGroupTag.findIndex(
                  (row) => row.guid === pasteRow.guid
                );

                let cell = row.Columns.find(
                  (cell) => cell.obj.ColumnGuid === levelcol.guid
                );
                undoPasteRows.push({
                  GUID: row.guid,
                  POSITION: row.Position,
                  PARENTGUID: row.ParentGuid,
                  LEVELCOLUMNGUID: cell.obj.ColumnGuid,
                  LEVELAMOUNTVALUE: cell.obj.AmountValue,
                  LEVELTEXTVALUE: cell.obj.TextValue,
                });

                /**
                 * We shouldn't update data in finaldata because finaldata is reference of pivotGroupTag.
                 * Updating position, level and ParentGuid in pivotGroupTag here.
                 */

                var prev_position = pivotGroupTag[pasteRowIndex - 1].Position;
                // makingPosition() start
                prev_position = parseInt(prev_position) + 10;

                prev_position =
                  prev_position.length > 8
                    ? prev_position.slice(0, -4) +
                      (
                        parseInt(
                          prev_position.substr(prev_position.length - 4)
                        ) + 10
                      ).toString()
                    : (parseInt(prev_position) + 10).toString();

                if (
                  this.state.originalData.find(
                    (e) => e.Position === prev_position.toString()
                  ) !== undefined
                ) {
                  prev_position =
                    prev_position.length > 8
                      ? (
                          prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        ).toString() + "5000"
                      : (parseInt(prev_position) - 10).toString() + "5000";
                  if (
                    this.state.originalData.find(
                      (e) => e.Position === prev_position.toString()
                    ) !== undefined
                  ) {
                    prev_position =
                      prev_position.length > 8
                        ? prev_position.slice(0, -4) +
                          (
                            parseInt(
                              prev_position.substr(prev_position.length - 4)
                            ) - 10
                          ).toString()
                        : (parseInt(prev_position) - 10).toString();
                    if (
                      this.state.originalData.find(
                        (e) => e.Position === prev_position.toString()
                      ) !== undefined
                    ) {
                      var flag = false;
                      while (flag === false) {
                        if (
                          this.state.originalData.find(
                            (e) => e.Position === prev_position.toString()
                          ) !== undefined
                        ) {
                          prev_position =
                            prev_position.length > 8
                              ? prev_position.slice(0, -4) +
                                (
                                  parseInt(
                                    prev_position.substr(
                                      prev_position.length - 4
                                    )
                                  ) - 10
                                ).toString()
                              : (parseInt(prev_position) - 10).toString();
                        } else {
                          flag = true;
                        }
                      }
                    }
                  }
                }
                prev_position = prev_position.toString();
                // makingPosition() end

                //finallevel yupdated

                if (finalChunkIndex >= 0 && row.Type === "Header") {
                  finalLevel = parseInt(finalLevel) + 1;
                }

                row.Position = prev_position;
                row.Columns.find(
                  (d) => d.obj.ColumnGuid === Levelobj.guid
                ).obj.TextValue = finalLevel;
                if (finalChunkIndex === 0) {
                  row.ParentGuid = pasteRowHeader.guid;
                }

                /**
                 * Updating position, level and ParentGuid in originalData here.
                 */
                var originalDataRow;
                originalDataRow = originalData.find(
                  (originalRow) => originalRow.guid === row.guid
                );
                originalDataRow.Position = row.Position;
                originalDataRow.Columns.find(
                  (d) => d.ColumnGuid === Levelobj.guid
                ).TextValue = finalLevel;
                if (finalChunkIndex === 0) {
                  originalDataRow.ParentGuid = pasteRowHeader.guid;
                }
                postData.push(originalDataRow);
                if (finalChunkIndex >= 0 && row.Type === "Total") {
                  finalLevel = parseInt(finalLevel) - 1;
                }
                pivotGroupTag = pivotGroupTag.sort(function (a, b) {
                  var nameA = a.Position;
                  var nameB = b.Position;
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
                });
              });
            } else {
              this.state.required_messages.map((e) =>
                e.ID == 1
                  ? this.setState({
                      message_desc:
                        "You cannot paste header/detail/total rows at this point.",
                      message_heading: "Paste row error",
                      openMessageModal: true,
                    })
                  : ""
              );
              error = true;
            }
          }
        } else {
          this.state.required_messages.map((e) =>
            e.ID == 1
              ? this.setState({
                  message_desc:
                    "You cannot paste header/detail/total rows at detail rows.",
                  message_heading: "Paste row error",
                  openMessageModal: true,
                })
              : ""
          );
          error = true;
        }
      }
    } else {
      this.state.required_messages.map((e) =>
        e.ID == 1
          ? this.setState({
              message_desc:
                "This only works if you have selected single paste row ",
              message_heading: "Select single row for paste",
              openMessageModal: true,
            })
          : ""
      );
    }

    var cy = this.state.selectedcheckbox;
    cy.map((value) => {
      $(`span`).removeClass("span_dim_color");
    });
    pasteRow.checkbox = false;

    /**
     * Calculating total values.
     */
    if (!error) {
      await this.calculateData(pasteRowHeader);
      await this.calculateData(cutRowHeader);
    }
    cutRows.map((p) => {
      delete p.cutrow;
    });
    if (undoPasteRows.length > 0) {
      undo.push({
        PASTEROWS: undoPasteRows,
      });
    }
    await this.redRowHandler();
    await this.setState({
      selectedcheckbox: [],
      undo: undo,
      originalData: originalData,
      pivotGroupTag: pivotGroupTag.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
      // ,
      finaldata: finaldata.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
    });

    var lofdata = Math.ceil(postData.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = postData.slice(i, i + 20);
      await API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then(async (data) => {
          // toast.success('data added with updated groups names.');
        })
        .catch((err) => {
          this.setState({
            message_desc: "Copydata request failed",
            message_heading: "Pivot Data",
            openMessageModal: true,
          });
          // toast.error('copydata request failed');
        });
    }

    if (postData.length > 0) {
      let positions = [];
      postData.map((row) => positions.push(row.Position));

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          User: localStorage.getItem("Email"),
          Datetime: dateTime,
          Module: "Icons",
          Description: "Paste Row",
          ProjectName: this.state.selectedProject.Name,
          Projectguid: this.state.selectedProject.guid,
          ColumnName: "",
          ValueFrom: "",
          // "ValueTo": positions.toString(),
          ValueTo: "",
          Tenantid: localStorage.getItem("tenantguid"),
        },
      ]);
    }
  };

  calculateAllTotals = (data) => {
    debugger;
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx calculateAllTotals: ");
    if (data && data.length) {
      data.map(async (row) => {
        if (row && row.Type.toUpperCase() === "HEADER") {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Type: ", row.Type);
          await this.calculateData(row);
        }
      });
    }
  };

  calculateData = async (data) => {
    // await this.setState({
    //   isLoading: true
    // })
    // console.log("calculateData start isLoading", this.state.isLoading)

    var dd = "";
    var dex = "";

    var fla = true;
    this.state.pivotGroupTag.map((value, index) => {
      if (value.guid == data.ParentGuid) {
        dd = value;
      }
    });
    var lastfindex = "";
    var xflag = false;
    var totalofalls;
    var levelguid = "";
    var descriptionguid = "";
    var accountguid = "";
    var groupguid = "";
    this.state.orderColumns.map((vals, ind) => {
      if (vals.ColumnName.toUpperCase() == "LEVEL") {
        levelguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "DESCRIPTION") {
        descriptionguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "ACCOUNT") {
        accountguid = vals.guid;
      }
      if (vals.ColumnName.toUpperCase() == "GROUPS") {
        groupguid = vals.guid;
      }
    });

    if (data.ParentGuid) {
      dex = data;
      if (data.clicked == false) {
        // index of data
        var findex3 = this.state.pivotGroupTag.findIndex((data) => {
          return data.guid == dex.guid;
        });
        var uu = dex.guid;
        var lastfindexx = "";
        // get last index of header
        for (var i = findex3; i < this.state.pivotGroupTag.length; i++) {
          if (
            this.state.pivotGroupTag[i].ParentGuid === uu &&
            this.state.pivotGroupTag[i].Type === "Total"
          ) {
            lastfindexx = i;
          }
        }

        totalofalls = JSON.parse(JSON.stringify(dex.Columns));
        totalofalls.map((value, index) => {
          if (
            value.obj.ColumnGuid !== accountguid &&
            value.obj.ColumnGuid != levelguid &&
            value.obj.ColumnGuid != descriptionguid &&
            value.obj.ColumnGuid != groupguid
          ) {
            if (
              this.state.orderColumns[index].Format != "TEXT" &&
              this.state.orderColumns[index].TotalColumn == true
            ) {
              totalofalls[index].obj.AmountValue = "0";
              if (value.obj.TextValue == null) {
                totalofalls[index].obj.TextValue = "0";
              } else {
                totalofalls[index].obj.TextValue = "0";
              }
            } else {
              totalofalls[index].obj.AmountValue = "";
              totalofalls[index].obj.TextValue = "";
            }
          }
        });

        //total

        for (var i = findex3; i < lastfindexx; i++) {
          if (
            this.state.pivotGroupTag[i].Type !== "Total" &&
            this.state.pivotGroupTag[i].Type !== "Header" &&
            this.state.pivotGroupTag[i].Columns.length > 0
          ) {
            totalofalls.map((value, index) => {
              if (
                this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                  accountguid &&
                this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                  levelguid &&
                this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                  descriptionguid &&
                this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                  groupguid
              ) {
                if (
                  this.state.orderColumns[index].Format == "TEXT" ||
                  this.state.orderColumns[index].TotalColumn == false
                ) {
                  if (
                    this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                      " " ||
                    this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                      null
                  ) {
                    value.obj.AmountValue = ""; //this.state.pivotGroupTag[i].Columns[index].obj.AmountValue;
                  } else {
                    value.obj.TextValue = ""; //this.state.pivotGroupTag[i].Columns[index].obj.TextValue;
                  }
                } else if (
                  this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                    " " ||
                  this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                    null
                ) {
                  // value.obj.AmountValue = Math.round(
                  value.obj.AmountValue =
                    parseFloat(
                      JSON.parse(JSON.stringify(value.obj.AmountValue))
                    ) +
                    parseFloat(
                      JSON.parse(
                        JSON.stringify(
                          this.state.pivotGroupTag[i].Columns[index].obj
                            .AmountValue
                        )
                      )
                    );
                  // );
                } else {
                  // value.obj.TextValue = Math.round(
                  value.obj.TextValue =
                    parseFloat(
                      JSON.parse(JSON.stringify(value.obj.TextValue))
                    ) +
                    parseFloat(
                      JSON.parse(
                        JSON.stringify(
                          this.state.pivotGroupTag[i].Columns[index].obj
                            .TextValue
                        )
                      )
                    );
                  // );
                }
              }
            });
          }
        }

        totalofalls.map((value, index) => {
          if (
            value.obj.ColumnGuid != accountguid &&
            value.obj.ColumnGuid != levelguid &&
            value.obj.ColumnGuid != descriptionguid &&
            value.obj.ColumnGuid != groupguid
          ) {
            if (value.obj.TextValue != 0 && value.obj.AmountValue != 0) {
              // value.obj.TextValue = Math.round(
              value.obj.TextValue =
                parseFloat(value.obj.TextValue) +
                parseFloat(value.obj.AmountValue);
              // );
            }
          }
        });

        totalofalls.map((value, index) => {
          if (
            value.obj.ColumnGuid != accountguid &&
            value.obj.ColumnGuid != levelguid &&
            value.obj.ColumnGuid != descriptionguid &&
            value.obj.ColumnGuid != groupguid
          ) {
            if (
              this.state.orderColumns[index].Format != "TEXT" &&
              this.state.orderColumns[index].TotalColumn == true
            ) {
              if (
                value.obj.TextValue == "0" ||
                value.obj.TextValue.toString() == "NaN"
              ) {
                value.obj.TextValue = " ";
              }
              if (value.obj.AmountValue == null) {
                value.obj.AmountValue = "0";
              } else if (value.obj.AmountValue.toString() === "NaN") {
                value.obj.AmountValue = "0";
              }
            } else {
              value.obj.AmountValue = "";
              value.obj.TextValue = "";
            }
          }
        });

        this.state.pivotGroupTag[findex3].Columns = totalofalls;
        await this.setState({
          pivotGroupTag: this.state.pivotGroupTag,
        });
      } else {
        while (fla == true) {
          // index of data
          var findex3 = this.state.pivotGroupTag.findIndex((data) => {
            return data.guid == dex.guid;
          });
          var uu = dex.guid;
          var lastfindexx = "";
          // get last index of header
          for (var i = findex3; i < this.state.pivotGroupTag.length; i++) {
            if (
              this.state.pivotGroupTag[i].ParentGuid === uu &&
              this.state.pivotGroupTag[i].Type === "Total"
            ) {
              lastfindexx = i;
            }
          }

          totalofalls = JSON.parse(
            JSON.stringify(this.state.pivotGroupTag[lastfindexx].Columns)
          );
          totalofalls.map((value, index) => {
            if (
              value.obj.ColumnGuid != accountguid &&
              value.obj.ColumnGuid != levelguid &&
              value.obj.ColumnGuid != descriptionguid &&
              value.obj.ColumnGuid != groupguid
            ) {
              if (
                this.state.orderColumns[index].Format != "TEXT" &&
                this.state.orderColumns[index].TotalColumn == true
              ) {
                totalofalls[index].obj.AmountValue = "0";
                if (value.obj.TextValue == null) {
                  totalofalls[index].obj.TextValue = "0";
                } else {
                  totalofalls[index].obj.TextValue = "0";
                }
              } else {
                totalofalls[index].obj.AmountValue = "";
                totalofalls[index].obj.TextValue = "";
              }
            }
          });

          //total

          for (var i = findex3; i < lastfindexx; i++) {
            if (
              this.state.pivotGroupTag[i].Type !== "Total" &&
              this.state.pivotGroupTag[i].Type !== "Header" &&
              this.state.pivotGroupTag[i].Columns.length > 0
            ) {
              totalofalls.map((value, index) => {
                if (
                  this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                    accountguid &&
                  this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                    levelguid &&
                  this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                    descriptionguid &&
                  this.state.pivotGroupTag[i].Columns[index].obj.ColumnGuid !=
                    groupguid
                ) {
                  if (
                    this.state.orderColumns[index].Format == "TEXT" ||
                    this.state.orderColumns[index].TotalColumn == false
                  ) {
                    if (
                      this.state.pivotGroupTag[i].Columns[index].obj
                        .TextValue == " " ||
                      this.state.pivotGroupTag[i].Columns[index].obj
                        .TextValue == null
                    ) {
                      value.obj.AmountValue = ""; //this.state.pivotGroupTag[i].Columns[index].obj.AmountValue;
                    } else {
                      value.obj.TextValue = ""; //this.state.pivotGroupTag[i].Columns[index].obj.TextValue;
                    }
                  } else if (
                    this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                      " " ||
                    this.state.pivotGroupTag[i].Columns[index].obj.TextValue ==
                      null
                  ) {
                    // value.obj.AmountValue = Math.round(
                    value.obj.AmountValue =
                      parseFloat(
                        JSON.parse(JSON.stringify(value.obj.AmountValue))
                      ) +
                      parseFloat(
                        JSON.parse(
                          JSON.stringify(
                            this.state.pivotGroupTag[i].Columns[index].obj
                              .AmountValue
                          )
                        )
                      );
                    // );
                  } else {
                    // value.obj.TextValue = Math.round(
                    value.obj.TextValue =
                      parseFloat(
                        JSON.parse(JSON.stringify(value.obj.TextValue))
                      ) +
                      parseFloat(
                        JSON.parse(
                          JSON.stringify(
                            this.state.pivotGroupTag[i].Columns[index].obj
                              .TextValue
                          )
                        )
                      );
                    // );
                  }
                }
              });
            }
          }
          totalofalls.map((value, index) => {
            if (
              value.obj.ColumnGuid != accountguid &&
              value.obj.ColumnGuid != levelguid &&
              value.obj.ColumnGuid != descriptionguid &&
              value.obj.ColumnGuid != groupguid
            ) {
              if (value.obj.TextValue != 0 && value.obj.AmountValue != 0) {
                value.obj.TextValue =
                  // Math.round(
                  parseFloat(value.obj.TextValue) +
                  parseFloat(value.obj.AmountValue);
                // );
              }
            }
          });

          totalofalls.map((value, index) => {
            if (
              value.obj.ColumnGuid != accountguid &&
              value.obj.ColumnGuid != levelguid &&
              value.obj.ColumnGuid != descriptionguid &&
              value.obj.ColumnGuid != groupguid
            ) {
              if (
                this.state.orderColumns[index].Format != "TEXT" &&
                this.state.orderColumns[index].TotalColumn == true
              ) {
                if (
                  value.obj.TextValue == "0" ||
                  value.obj.TextValue.toString() == "NaN"
                ) {
                  value.obj.TextValue = " ";
                  // value.obj.AmountValue = "c";
                }

                if (value.obj.AmountValue == null) {
                  value.obj.AmountValue = "0";
                } else if (value.obj.AmountValue.toString() === "NaN") {
                  value.obj.AmountValue = "0";
                }
              } else {
                value.obj.AmountValue = "";
                value.obj.TextValue = "";
              }
            }
          });
          // done total

          this.state.pivotGroupTag[lastfindexx].Columns = totalofalls;

          this.state.pivotGroupTag.map((value, index) => {
            if (value.guid == dex.ParentGuid) {
              dex = value;
            }
          });
          if (xflag == true) {
            fla = false;
          }

          if (dex.ParentGuid == "root") {
            xflag = true;
          }
        }
      }
    }
    if (this.state.finaldata.length > 1) {
      await this.setState({
        finaldata: this.state.finaldata.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
        pivotGroupTag: this.state.pivotGroupTag.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
      });
    } else {
      await this.setState({
        finaldata: this.state.finaldata,
      });
    }
    // console.log("----- calculateData", JSON.parse(JSON.stringify(this.state.pivotGroupTag.length)), ", ", JSON.parse(JSON.stringify(this.state.finaldata.length)))
    // await this.setState({
    //   isLoading: false
    // })
    // console.log("calculateData end isLoading", this.state.isLoading)
    console.log("calculateData");
  };

  redRowHandler = () => {
    var y = this.state.finaldata;
    var check_parent;
    var check_td;
    var check_tr;
    y.map((value, i) => {
      if (document.getElementById(`${value.guid}`)) {
        check_parent = document.getElementById(`${value.guid}`).parentElement;
        check_td = check_parent.parentElement;
        check_tr = check_td.parentElement;
        if (value.checkbox == true) {
          check_tr.className += " cut_row";
        } else {
          check_tr.classList.remove("cut_row");
        }
      }
    });
  };

  clearFilterRedRow = () => {
    var { finaldata } = this.state;
    finaldata.map((value, i) => {
      if (value.checkbox) {
        value.checkbox = false;
      }
    });

    this.setState({
      finaldata,
    });
  };

  onAllNodes = async (e) => {
    // open all nodes
    this.getTableHeadPadding();

    if (this.state.finaldata.length >= 1 && this.state.allNodes == false) {
      var temp = [];
      var tagdata = this.state.pivotGroupTag;
      tagdata.map((v) => {
        v.clicked = true;

        if (v.clicked == true && v.carrot == true && v.Type != "Blank") {
          var obj = tagdata.find(
            (u) => u.ParentGuid == v.guid && u.Type == "Total"
          );

          v.Columns.map((s, i) => {
            if (i > 3) {
              obj.Columns[i].obj.TextValue = JSON.parse(
                JSON.stringify(s.obj.TextValue)
              );
              obj.Columns[i].obj.AmountValue = JSON.parse(
                JSON.stringify(s.obj.AmountValue)
              );
              s.obj.TextValue = "";
              s.obj.AmountValue = "";
            }
          });
          this.calculateData(v);
        }
        temp.push(v);
      });

      await this.setState({
        allNodes: true,
      });
      await this.calculateData(tagdata[0]);

      await this.setState({
        finaldata: temp,
      });
    } else if (this.state.allNodes == true) {
      // close all node

      var root = this.state.pivotGroupTag.filter((u) => u.ParentGuid == "root");
      root[0].clicked = false;

      await this.calculateData(root[0]);
      await this.setState({
        allNodes: false,
        pivotGroupTag: this.state.pivotGroupTag,
        finaldata: root,
      });
    }

    if (this.state.columns_white.length) {
      this.state.columns_white.map((e) => {
        if (document.getElementsByClassName(e)[0]) {
          document.getElementsByClassName(e)[0].style.color = "white";
        }
      });
    }
    await this.redRowHandler();
    await this.replaceHistory(this.state.finaldata);
  };

  goToActivity = (e) => {
    e.preventDefault();
    let { history } = this.props;
    history.push("/activity", {
      guid: this.state.selectedProject.guid,
      projects: history.location.state.projects,
      user_type: history.location.state.user_type
        ? history.location.state.user_type
        : this.state.user_type,
      tenantGuid: this.state.selectedProject.TenantGuid,
      from: "/dashboard",
    });
    $(document).ready(function () {
      $("#dash_2>img").focus();
    });
  };

  getGroupsHandler = async () => {
    this.setState({
      isLoading: true,
    });
    let { originalData, selectedProject } = this.state;
    var groupGuid = this.state.orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "GROUPS"
    ).guid;
    let tenantguids = localStorage.getItem("tenantguid");
    await API.post("pivot", "/getgroups", {
      body: {
        tenantguid: tenantguids,
        PivotBusinessUnit: selectedProject.guid,
      },
    })
      .then(async (data) => {
        data.sort(function (a, b) {
          if (!(a.Code && b.Code)) return 0;
          if (a.Code.toUpperCase() < b.Code.toUpperCase()) {
            return -1;
          }
          if (a.Code.toUpperCase() > b.Code.toUpperCase()) {
            return 1;
          }
          return 0;
        });

        data = await this.updateGroupsRowsCountProperty(
          originalData,
          groupGuid,
          data
        );
        this.setState({
          get_groupsd: data,
          openGroupListModal: true,
        });
        $(document).ready(function () {
          $("#gListEdit_53").focus();
        });
      })
      .catch((err) => {
        this.setState({
          message_desc: "Groups fetched failed",
          message_heading: "Groups",
          openMessageModal: true,
        });
        // toast.error('groups fetched faild');
      });
    this.setState({
      isLoading: false,
    });
  };

  getGroups = async () => {
    this.setState({
      isLoading: true,
    });
    let { selectedProject } = this.state;
    let tenantguids = localStorage.getItem("tenantguid");
    await API.post("pivot", "/getgroups", {
      body: {
        tenantguid: tenantguids,
        PivotBusinessUnit: selectedProject.guid,
      },
    })
      .then((data) => {
        this.setState({
          get_groupsd: data,
          // openGroupListModal: true
        });
      })
      .catch((err) => {
        this.setState({
          message_desc: "Groups fetched failed",
          message_heading: "Groups",
          openMessageModal: true,
        });
        // toast.error('groups fetched faild');
      });
    this.setState({
      isLoading: false,
    });
  };

  clickgroups = async () => {
    await this.removeCutRows();
    var fla = false;
    var selectedrows = [];
    var groupguid = this.state.orderColumns.find(
      (u) => u.ColumnName.toUpperCase() == "GROUPS"
    );
    this.state.finaldata.map((e, index) => {
      if (e.checkbox == true) {
        if (e.Type == "Blank") {
          fla = true;
        }
        selectedrows.push(e);
      }
    });

    await this.setState({
      checkedcount: selectedrows.length,
    });
    var groups = "";
    if (selectedrows.length > 0 && fla == false) {
      selectedrows.map((u) => {
        u.Columns.map((i) => {
          if (i.obj.ColumnGuid == groupguid.guid) {
            if (i.obj.TextValue == " " || i.obj.TextValue == null) {
              groups = groups + i.obj.AmountValue + ",";
            } else {
              groups = groups + "" + i.obj.TextValue + ",";
            }
          }
        });
      });
      var gv = groups.substring(0, groups.length - 1);
      await this.setState({
        groupValue: gv,
      });
      await this.getGroups();
      this.openModal("openApplyGroupModal");
      document.getElementById("apply_group_btn").focus();
    } else {
      this.setState({
        message_desc: "Please select rows except blank rows",
        message_heading: "Rows",
        openMessageModal: true,
      });
      // toast.error('please select rows except blank rows');
    }
  };

  groupcheckedvalue = async (obj, unobj) => {
    await this.setState({
      groupValue: obj,
      isLoading: true,
    });
    var x = this.state.orderColumns.find(
      (u) => u.ColumnName.toUpperCase() == "GROUPS"
    );
    var groupguid = x.guid;
    var groupsary = obj.split(",");
    var Uncheckary = unobj.split(",");
    let { undo } = this.state;

    var p = this.state.pivotGroupTag;
    var originaldata = this.state.originalData;
    var f = this.state.finaldata;
    var selectedrows = [];
    let selectedRowsPositions = [];
    let undoSelectedRows = [];
    this.state.finaldata.filter((e, index) => {
      if (e.checkbox == true) {
        selectedrows.push(e);
        selectedRowsPositions.push(e.Position);
        undoSelectedRows.push(e);
      }
    });

    if (undoSelectedRows.length > 0) {
      undo.push({
        APPLYGROUPS: JSON.parse(JSON.stringify(undoSelectedRows)),
      });
    }
    var pi = [];
    var fi = [];
    var od = [];
    selectedrows.map((u) => {
      var g = p.findIndex((v) => u.guid == v.guid);
      pi.push(g);
      var o = originaldata.findIndex((v) => u.guid == v.guid);
      od.push(o);
      var h = f.findIndex((w) => u.guid == w.guid);
      fi.push(h);
    });
    console.log("selectedrows", selectedrows);

    fi.map((pushind) => {
      var tmp_obj = f[pushind].Columns.find(
        (d) => d.obj.ColumnGuid === groupguid
      );
      if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
        var psrval =
          tmp_obj.obj.AmountValue !== null && tmp_obj.obj.AmountValue !== ""
            ? tmp_obj.obj.AmountValue.split(",")
            : [];
        groupsary.map((o) => {
          if (psrval.indexOf(o) === -1) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.obj.AmountValue = psrval
          .filter((l) => l !== "" && l != 0)
          .toString();
      } else {
        var psrval = tmp_obj.obj.TextValue.split(",");
        groupsary.map((o) => {
          if (psrval.indexOf(o) < 0) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.obj.TextValue = psrval
          .filter((l) => l !== "" && l != 0)
          .toString();
      }
    });

    pi.map((pushind) => {
      var tmp_obj = p[pushind].Columns.find(
        (d) => d.obj.ColumnGuid === groupguid
      );
      if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
        var psrval =
          tmp_obj.obj.AmountValue !== null && tmp_obj.obj.AmountValue !== ""
            ? tmp_obj.obj.AmountValue.split(",")
            : [];
        groupsary.map((o) => {
          if (psrval.indexOf(o) === -1) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.obj.AmountValue = psrval
          .filter((l) => l !== "" && l != 0)
          .toString();
      } else {
        var psrval = tmp_obj.obj.TextValue.split(",");
        groupsary.map((o) => {
          if (psrval.indexOf(o) < 0) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.obj.TextValue = psrval
          .filter((l) => l !== "" && l != 0)
          .toString();
      }
    });
    let postData = [];

    od.map((pushind) => {
      var tmp_obj = originaldata[pushind].Columns.find(
        (d) => d.ColumnGuid === groupguid
      );
      if (tmp_obj.TextValue === null || tmp_obj.TextValue === " ") {
        var psrval =
          tmp_obj.AmountValue !== null && tmp_obj.AmountValue !== ""
            ? tmp_obj.AmountValue.split(",")
            : [];
        groupsary.map((o) => {
          if (psrval.indexOf(o) === -1) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.AmountValue = psrval
          .filter((l) => l !== "" && l != 0)
          .toString();
      } else {
        var psrval = tmp_obj.TextValue.split(",");
        groupsary.map((o) => {
          if (psrval.indexOf(o) < 0) {
            psrval.push(o);
          }
        });
        Uncheckary.map((o) => {
          if (psrval.indexOf(o) > -1) {
            delete psrval[psrval.indexOf(o)];
          }
        });
        tmp_obj.TextValue = psrval.filter((l) => l !== "" && l != 0).toString();
      }

      postData.push(originaldata[pushind]);
    });

    await this.setState({
      pivotGroupTag: p,
      finaldata: f,
      groupValue: "",
      originalData: originaldata,
      undo: undo,
    });
    var lofdata = Math.ceil(postData.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = postData.slice(i, i + 20);
      await API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then((data) => {})
        .catch((err) => {
          this.setState({
            message_desc: "Copydata request failed",
            message_heading: "Pivot Data",
            openMessageModal: true,
          });
          // toast.error('copydata request failed');
        });
    }
    await this.setState({
      isLoading: false,
    });
    // toast.success('data added');
  };

  ImportModalHandler = async () => {
    document.getElementById("csv_pad").click();
  };

  CsvModalHandler = async () => {
    document.getElementById("import_pad").click();
  };

  onImportArrow = () => {
    this.openModal("openImportModal");
  };

  onCsvArrow = () => {
    this.openModal("openImportModal");
  };

  addColumnBatch = async (columnsArray) => {
    await API.post("pivot", "/addColumnBatch", {
      body: {
        columns: columnsArray,
      },
    })
      .then(async (data) => {
        console.log(data, "------------------");
        // toast.success('Columns Added Successfully');
      })
      .catch((err) => {
        this.setState({
          message_desc: "Columns Adding Error",
          message_heading: "Pivot Data",
          openMessageModal: true,
        });
        // toast.error('Columns Adding Error');
      });
  };

  deleteGroupsBatch = async (guidsArray) => {
    let loftemp = guidsArray.length / 20;
    for (let i = 0; i < Math.ceil(loftemp) * 20; i = i + 20) {
      let arraytosend = guidsArray.slice(i, i + 20);
      await API.post("pivot", "/deletegroupbatch", {
        body: {
          guids: arraytosend,
        },
      }).catch((error) => {
        this.setState({
          message_desc: "Groups Deletion Process Failed",
          message_heading: "Pivot Data",
          openMessageModal: true,
        });
      });
    }
  };

  addGroupsBatch = async (groupsArray) => {
    let loftemp = groupsArray.length / 20;
    for (let i = 0; i < Math.ceil(loftemp) * 20; i = i + 20) {
      let arraytosend = groupsArray.slice(i, i + 20);
      await API.post("pivot", "/addgroupbatch", {
        body: {
          groups: arraytosend,
        },
      }).catch((err) => {
        this.setState({
          message_desc: "Adding Groups Failed",
          message_heading: "Pivot Data",
          openMessageModal: true,
        });
      });
    }
  };

  insertHeaderTotal = async () => {
    await this.removeCutRows();
    var selectedrows = [];
    let { undo } = this.state;

    //storing three data stores for later use

    var pt = this.state.pivotGroupTag;
    var od = this.state.originalData;
    var fd = this.state.finaldata;
    let postData = [];
    this.state.finaldata.filter((e, index) => {
      if (e.checkbox == true) {
        selectedrows.push(e);
      }
    });
    if (selectedrows.length == 1) {
      if (
        selectedrows[0].Type === "Header" ||
        selectedrows[0].Type === "Total"
      ) {
        //insert header and total process

        if (
          selectedrows[0].Type === "Header" &&
          selectedrows[0].ParentGuid !== "root"
        ) {
          //check selected header have childs or not
          //          var pasteRowHaveChunks;
          //          pasteRowHaveChunks = pt.find(
          //            (row) =>
          //            row.ParentGuid === selectedrows[0].guid && row.Type === 'Header'
          //          );
          //          if (pasteRowHaveChunks === undefined) {
          var indxoffst1h = this.state.pivotGroupTag.findIndex(
            (o) => o.guid === selectedrows[0].guid
          );
          var fposition1h = await this.makeposition(
            this.state.pivotGroupTag[indxoffst1h - 1].Position
          );
          var guid1h = uuidv1();
          var tempcol1h = [];
          var colsfororg1h = [];

          var allcols = od.find((j) => j.guid === selectedrows[0].guid);
          allcols.Columns.map((ioi) => {
            //get column name to get value except empty columns

            var check = this.state.allcolumnsoftemp.find(
              (l) => l.guid === ioi.ColumnGuid
            );

            if (
              check !== undefined &&
              (check.ColumnName.toUpperCase() === "ACCOUNT" ||
                check.ColumnName.toUpperCase() === "LEVEL" ||
                check.ColumnName.toUpperCase() === "DESCRIPTION")
            ) {
              var obj1 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue,
                TextValue:
                  check.ColumnName.toUpperCase() === "DESCRIPTION"
                    ? "HEADER"
                    : check.ColumnName.toUpperCase() === "ACCOUNT"
                    ? ""
                    : ioi.TextValue,
                uniqueCellId: uuidv1(),
              };
              var obj2 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                TextValue:
                  ioi.TextValue == ""
                    ? null
                    : check.ColumnName.toUpperCase() === "DESCRIPTION"
                    ? "HEADER"
                    : check.ColumnName.toUpperCase() === "ACCOUNT"
                    ? null
                    : ioi.TextValue,
              };
            } else {
              var obj1 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: "",
                TextValue:
                  check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : ""
                    : "",
                uniqueCellId: uuidv1(),
              };
              var obj2 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                TextValue:
                  ioi.TextValue == ""
                    ? null
                    : check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? null
                      : ioi.TextValue
                    : "",
              };
            }
            tempcol1h.push({
              obj: obj1,
            });
            colsfororg1h.push(obj2);
          });

          var filteredtmp_col1h = [];
          this.state.orderColumns.map((p) => {
            var getc = tempcol1h.find((o) => o.obj.ColumnGuid === p.guid);
            if (getc !== undefined) {
              filteredtmp_col1h.push(getc);
            }
          });
          var headObj1h = {
            BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
            ParentGuid: selectedrows[0].ParentGuid,
            Columns: filteredtmp_col1h,
            Position: fposition1h,
            TenantGuid: selectedrows[0].TenantGuid,
            TotalGuid: null,
            Type: "Header",
            guid: guid1h,
            checkbox: false,
            checkzero: false,
            carrot: true,
            clicked: true,
          };
          pt.push(headObj1h);
          fd.push(headObj1h);
          let headObjorg1h = JSON.parse(JSON.stringify(headObj1h));
          headObjorg1h.Columns = colsfororg1h;
          delete headObjorg1h["checkbox"];
          delete headObjorg1h["checkzero"];
          delete headObjorg1h["carrot"];
          delete headObjorg1h["clicked"];
          od.push(headObjorg1h);
          postData.push(headObjorg1h);

          //adding total row

          var tposition1t = await this.makeposition(fposition1h);
          var totaltempcol1t = [];
          var totalcolsfororg1t = [];

          var allcols = od.find((j) => j.guid === selectedrows[0].guid);
          allcols.Columns.map((ioi) => {
            var check = this.state.allcolumnsoftemp.find(
              (l) => l.guid === ioi.ColumnGuid
            );
            var obj1 = {
              ColumnGuid: ioi.ColumnGuid,
              AmountValue: ioi.AmountValue,
              TextValue:
                check !== undefined
                  ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                    ? "TOTAL"
                    : check.ColumnName.toUpperCase() === "ACCOUNT"
                    ? ""
                    : ioi.TextValue
                  : "",
              uniqueCellId: uuidv1(),
            };
            var obj2 = {
              ColumnGuid: ioi.ColumnGuid,
              AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
              TextValue:
                ioi.TextValue == ""
                  ? null
                  : check !== undefined
                  ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                    ? "TOTAL"
                    : check.ColumnName.toUpperCase() === "ACCOUNT"
                    ? null
                    : ioi.TextValue
                  : "",
            };
            totaltempcol1t.push({
              obj: obj1,
            });
            totalcolsfororg1t.push(obj2);
          });

          var filteredtotal_col1t = [];
          this.state.orderColumns.map((p) => {
            var getc = totaltempcol1t.find((o) => o.obj.ColumnGuid === p.guid);
            if (getc !== undefined) {
              filteredtotal_col1t.push(getc);
            }
          });

          var guid1t = uuidv1();
          var TotalObj1t = {
            BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
            ParentGuid: guid1h,
            Columns: filteredtotal_col1t,
            Position: tposition1t,
            TenantGuid: selectedrows[0].TenantGuid,
            TotalGuid: null,
            Type: "Total",
            guid: guid1t,
            checkbox: false,
            checkzero: false,
            carrot: false,
            clicked: false,
          };

          pt.push(TotalObj1t);

          fd.push(TotalObj1t);
          let TotalObjorg1t = JSON.parse(JSON.stringify(TotalObj1t));
          TotalObjorg1t.Columns = totalcolsfororg1t;
          delete TotalObjorg1t["checkbox"];
          delete TotalObjorg1t["checkzero"];
          delete TotalObjorg1t["carrot"];
          delete TotalObjorg1t["clicked"];
          od.push(TotalObjorg1t);
          postData.push(TotalObjorg1t);
          //adding total row end

          undo.push({
            INSERTHEADERTOTAL: {
              HEADERGUID: guid1h,
              TOTALGUID: guid1t,
            },
          });

          od = od;
          fd = fd.sort(function (a, b) {
            var nameA = a.Position;
            var nameB = b.Position;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          pt = pt.sort(function (a, b) {
            var nameA = a.Position;
            var nameB = b.Position;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });

          await this.setState({
            originalData: od,
            finaldata: fd,
            pivotGroupTag: pt,
          });

          this.redRowHandler();
          await this.calculateData(headObj1h);
          //          } else {
          //            toast.error(
          //              'Correct Your Selection of Row(Header/ total) To Insert Header And Total'
          //            );
          //          }
        } else if (selectedrows[0].Type === "Total") {
          var indxoffst1h = this.state.pivotGroupTag.findIndex(
            (o) => o.guid === selectedrows[0].guid
          );

          if (
            this.state.pivotGroupTag[indxoffst1h - 1].Type === "Total" ||
            (this.state.pivotGroupTag[indxoffst1h - 1].Type === "Header" &&
              this.state.pivotGroupTag[indxoffst1h - 1].guid ===
                selectedrows[0].ParentGuid)
          ) {
            var levelcol1h = this.state.orderColumns.find(
              (k) => k.ColumnName.toUpperCase() === "LEVEL"
            );
            var finallevel1h = 0;
            var tmp_lvl = this.state.pivotGroupTag[
              indxoffst1h - 1
            ].Columns.find((k) => k.obj.ColumnGuid === levelcol1h.guid);
            if (
              this.state.pivotGroupTag[indxoffst1h - 1].Type === "Header" &&
              levelcol1h !== undefined
            ) {
              //increasing level by one

              if (
                tmp_lvl.obj.TextValue == " " ||
                tmp_lvl.obj.AmountValue == null
              ) {
                finallevel1h = parseInt(tmp_lvl.obj.AmountValue) + 1;
              } else {
                finallevel1h = parseInt(tmp_lvl.obj.TextValue) + 1;
              }
            } else {
              //same level
              if (
                tmp_lvl.obj.TextValue == " " ||
                tmp_lvl.obj.AmountValue == null
              ) {
                finallevel1h = parseInt(tmp_lvl.obj.AmountValue);
              } else {
                finallevel1h = parseInt(tmp_lvl.obj.TextValue);
              }
            }

            var fposition1h = await this.makeposition(
              this.state.pivotGroupTag[indxoffst1h - 1].Position
            );
            var guid1h = uuidv1();
            var tempcol1h = [];
            var colsfororg1h = [];

            var allcols = od.find(
              (j) => j.guid === this.state.pivotGroupTag[indxoffst1h - 1].guid
            );
            allcols.Columns.map((ioi) => {
              //get column name to get value except empty columns

              var check = this.state.allcolumnsoftemp.find(
                (l) => l.guid === ioi.ColumnGuid
              );

              if (
                check !== undefined &&
                (check.ColumnName.toUpperCase() === "ACCOUNT" ||
                  check.ColumnName.toUpperCase() === "LEVEL" ||
                  check.ColumnName.toUpperCase() === "DESCRIPTION")
              ) {
                var obj1 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue,
                  TextValue:
                    check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : check.ColumnName.toUpperCase() === "LEVEL"
                      ? finallevel1h
                      : ioi.TextValue,
                  uniqueCellId: uuidv1(),
                };
                var obj2 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                  TextValue:
                    ioi.TextValue == ""
                      ? null
                      : check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? null
                      : check.ColumnName.toUpperCase() === "LEVEL"
                      ? finallevel1h
                      : ioi.TextValue,
                };
              } else {
                var obj1 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: "",
                  TextValue:
                    check !== undefined
                      ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                        ? "HEADER"
                        : check.ColumnName.toUpperCase() === "ACCOUNT"
                        ? ""
                        : check.ColumnName.toUpperCase() === "LEVEL"
                        ? finallevel1h
                        : ""
                      : "",
                  uniqueCellId: uuidv1(),
                };
                var obj2 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                  TextValue:
                    ioi.TextValue == ""
                      ? null
                      : check !== undefined
                      ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                        ? "HEADER"
                        : check.ColumnName.toUpperCase() === "ACCOUNT"
                        ? null
                        : check.ColumnName.toUpperCase() === "LEVEL"
                        ? finallevel1h
                        : ioi.TextValue
                      : "",
                };
              }
              tempcol1h.push({
                obj: obj1,
              });
              colsfororg1h.push(obj2);
            });

            var filteredtmp_col1h = [];
            this.state.orderColumns.map((p) => {
              var getc = tempcol1h.find((o) => o.obj.ColumnGuid === p.guid);
              if (getc !== undefined) {
                filteredtmp_col1h.push(getc);
              }
            });
            var headObj1h = {
              BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
              ParentGuid: selectedrows[0].ParentGuid,
              Columns: filteredtmp_col1h,
              Position: fposition1h,
              TenantGuid: selectedrows[0].TenantGuid,
              TotalGuid: null,
              Type: "Header",
              guid: guid1h,
              checkbox: false,
              checkzero: false,
              carrot: true,
              clicked: true,
            };
            pt.push(headObj1h);
            fd.push(headObj1h);
            let headObjorg1h = JSON.parse(JSON.stringify(headObj1h));
            headObjorg1h.Columns = colsfororg1h;
            delete headObjorg1h["checkbox"];
            delete headObjorg1h["checkzero"];
            delete headObjorg1h["carrot"];
            delete headObjorg1h["clicked"];
            od.push(headObjorg1h);
            postData.push(headObjorg1h);

            //adding total row

            var tposition1t = await this.makeposition(fposition1h);
            var totaltempcol1t = [];
            var totalcolsfororg1t = [];

            var allcols = od.find(
              (j) => j.guid === this.state.pivotGroupTag[indxoffst1h - 1].guid
            );
            allcols.Columns.map((ioi) => {
              var check = this.state.allcolumnsoftemp.find(
                (l) => l.guid === ioi.ColumnGuid
              );
              var obj1 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue,
                TextValue:
                  check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "TOTAL"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : check.ColumnName.toUpperCase() === "LEVEL"
                      ? finallevel1h
                      : ioi.TextValue
                    : "",
                uniqueCellId: uuidv1(),
              };
              var obj2 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                TextValue:
                  ioi.TextValue == ""
                    ? null
                    : check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "TOTAL"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? null
                      : check.ColumnName.toUpperCase() === "LEVEL"
                      ? finallevel1h
                      : ioi.TextValue
                    : "",
              };
              totaltempcol1t.push({
                obj: obj1,
              });
              totalcolsfororg1t.push(obj2);
            });

            var filteredtotal_col1t = [];
            this.state.orderColumns.map((p) => {
              var getc = totaltempcol1t.find(
                (o) => o.obj.ColumnGuid === p.guid
              );
              if (getc !== undefined) {
                filteredtotal_col1t.push(getc);
              }
            });

            var guid1t = uuidv1();
            var TotalObj1t = {
              BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
              ParentGuid: guid1h,
              Columns: filteredtotal_col1t,
              Position: tposition1t,
              TenantGuid: selectedrows[0].TenantGuid,
              TotalGuid: null,
              Type: "Total",
              guid: guid1t,
              checkbox: false,
              checkzero: false,
              carrot: false,
              clicked: false,
            };

            pt.push(TotalObj1t);

            fd.push(TotalObj1t);
            let TotalObjorg1t = JSON.parse(JSON.stringify(TotalObj1t));
            TotalObjorg1t.Columns = totalcolsfororg1t;
            delete TotalObjorg1t["checkbox"];
            delete TotalObjorg1t["checkzero"];
            delete TotalObjorg1t["carrot"];
            delete TotalObjorg1t["clicked"];
            od.push(TotalObjorg1t);
            postData.push(TotalObjorg1t);
            //adding total row end

            undo.push({
              INSERTHEADERTOTAL: {
                HEADERGUID: guid1h,
                TOTALGUID: guid1t,
              },
            });

            od = od;
            fd = fd.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });
            pt = pt.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });

            await this.setState({
              originalData: od,
              finaldata: fd,
              pivotGroupTag: pt,
            });

            this.redRowHandler();
            await this.calculateData(headObj1h);
          } else {
            this.setState({
              message_desc:
                "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
              message_heading: "Header & Total",
              openMessageModal: true,
            });
            //            toast.error(
            //              'Correct Your Selection of Row(Header/ total) To Insert Header And Total'
            //            );
          }
        } else {
          this.setState({
            message_desc:
              "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
            message_heading: "Header & Total",
            openMessageModal: true,
          });
          //          toast.error(
          //            'Correct Your Selection of Row(Header/ total) To Insert Header And Total'
          //          );
        }
      } else {
        this.setState({
          message_desc:
            "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
          message_heading: "Header & Total",
          openMessageModal: true,
        });
        //        toast.error(
        //          'Correct Your Selection of Row(Header/ total) To Insert Header And Total'
        //        );
      }
    } else if (selectedrows.length == 2) {
      if (this.state.allNodes === true) {
        //changed condition &&selectedrows[1].Type == "Header"
        if (
          selectedrows[0].Type == "Header" &&
          selectedrows[0].ParentGuid !== "root"
        ) {
          //finding previous row of second selected total and check is it valid or not

          var indxoffst = this.state.pivotGroupTag.findIndex(
            (o) => o.guid === selectedrows[0].guid
          );
          var indxofscd = this.state.pivotGroupTag.findIndex(
            (o) => o.guid === selectedrows[1].guid
          );
          var levelcolvalid = this.state.orderColumns.find(
            (k) => k.ColumnName.toUpperCase() === "LEVEL"
          );
          let childHeaders = [];

          for (let i = indxoffst; i < indxofscd; i++) {
            if (
              this.state.pivotGroupTag[i].Type === "Header" &&
              this.state.pivotGroupTag[i].ParentGuid ===
                selectedrows[0].ParentGuid
            ) {
              childHeaders.push(this.state.pivotGroupTag[i].guid);
            }
          }

          var finalselectedrow = this.state.pivotGroupTag[indxofscd - 1];
          let check1 = finalselectedrow.Columns.find(
            (i) => i.obj.ColumnGuid === levelcolvalid.guid
          );
          let check2 = selectedrows[0].Columns.find(
            (o) => o.obj.ColumnGuid === levelcolvalid.guid
          );
          let finalLevelValue1 = undefined;
          let finalLevelValue2 = undefined;

          if (check1 && check1.obj.TextValue && check1.obj.TextValue !== " ") {
            finalLevelValue1 = check1.obj.TextValue;
          } else {
            finalLevelValue1 = check1.obj.AmountValue;
          }

          if (check2 && check2.obj.TextValue && check2.obj.TextValue !== " ") {
            finalLevelValue2 = check2.obj.TextValue;
          } else {
            finalLevelValue2 = check2.obj.AmountValue;
          }

          if (
            finalselectedrow.Type === "Total" &&
            finalLevelValue1 == finalLevelValue2
          ) {
            //valid case start

            //creating new Header Object to push/add
            var obj = [];
            var parentguid = selectedrows[0].ParentGuid;
            console.log("inde1", parentguid);
            var guid = uuidv1();
            var tempcol = [];
            var colsfororg = [];

            var allcols = od.find((j) => j.guid === selectedrows[0].guid);
            allcols.Columns.map((ioi) => {
              //get column name to get value except empty columns

              var check = this.state.allcolumnsoftemp.find(
                (l) => l.guid === ioi.ColumnGuid
              );
              if (
                check !== undefined &&
                (check.ColumnName.toUpperCase() === "ACCOUNT" ||
                  check.ColumnName.toUpperCase() === "LEVEL" ||
                  check.ColumnName.toUpperCase() === "DESCRIPTION")
              ) {
                var obj1 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue,
                  TextValue:
                    check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : ioi.TextValue,
                  uniqueCellId: uuidv1(),
                };
                var obj2 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                  TextValue:
                    ioi.TextValue == ""
                      ? null
                      : check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "HEADER"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? null
                      : ioi.TextValue,
                };
              } else {
                var obj1 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: "",
                  TextValue:
                    check !== undefined
                      ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                        ? "HEADER"
                        : check.ColumnName.toUpperCase() === "ACCOUNT"
                        ? ""
                        : ""
                      : "",
                  uniqueCellId: uuidv1(),
                };
                var obj2 = {
                  ColumnGuid: ioi.ColumnGuid,
                  AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                  TextValue:
                    ioi.TextValue == ""
                      ? null
                      : check !== undefined
                      ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                        ? "HEADER"
                        : check.ColumnName.toUpperCase() === "ACCOUNT"
                        ? null
                        : ioi.TextValue
                      : "",
                };
              }
              tempcol.push({
                obj: obj1,
              });
              colsfororg.push(obj2);
            });
            var fposition = await this.makeposition(
              this.state.pivotGroupTag[indxoffst - 1].Position
            );
            var filteredtmp_col = [];
            this.state.orderColumns.map((p) => {
              var getc = tempcol.find((o) => o.obj.ColumnGuid === p.guid);
              if (getc !== undefined) {
                filteredtmp_col.push(getc);
              }
            });
            var headObj = {
              BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
              ParentGuid: parentguid,
              Columns: filteredtmp_col,
              Position: fposition,
              TenantGuid: selectedrows[0].TenantGuid,
              TotalGuid: null,
              Type: "Header",
              guid: guid,
              checkbox: false,
              checkzero: false,
              carrot: true,
              clicked: true,
            };

            //pushing header and changing inside new header row
            pt.push(headObj);
            childHeaders.map((guidr) => {
              let row = pt.find((row) => row.guid === guidr);
              row.ParentGuid = guid;
              let row1 = fd.find((row) => row.guid === guidr);
              row1.ParentGuid = guid;
            });
            // pt[indxoffst].ParentGuid = guid;

            fd.push(headObj);
            // selectedrows[0].ParentGuid = guid;

            //for original data

            let headObjorg = JSON.parse(JSON.stringify(headObj));
            headObjorg.Columns = colsfororg;
            delete headObjorg["checkbox"];
            delete headObjorg["checkzero"];
            delete headObjorg["carrot"];
            delete headObjorg["clicked"];
            od.push(headObjorg);
            // var changerow = od.find((q) => q.guid == selectedrows[0].guid);
            // changerow.ParentGuid = guid;

            childHeaders.map((guidr) => {
              let row = od.find((q) => q.guid == guidr);
              row.ParentGuid = guid;
            });
            /**
             * Push data for updation in database.
             */
            postData.push(headObjorg);

            //creating new Total Object to push/add

            //checking index of second selected header again because it will be change after pushing new created header in pivottagdata
            var totaltempcol = [];
            var totalcolsfororg = [];
            var indxagain = this.state.pivotGroupTag.findIndex(
              (o) => o.guid === selectedrows[1].guid
            );
            var tposition = await this.makeposition(
              this.state.pivotGroupTag[indxagain - 1].Position
            );

            var allcols = od.find(
              (j) => j.guid === this.state.pivotGroupTag[indxagain - 1].guid
            );
            allcols.Columns.map((ioi) => {
              var check = this.state.allcolumnsoftemp.find(
                (l) => l.guid === ioi.ColumnGuid
              );
              var obj1 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue,
                TextValue:
                  check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "TOTAL"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : ioi.TextValue
                    : "",
                uniqueCellId: uuidv1(),
              };
              var obj2 = {
                ColumnGuid: ioi.ColumnGuid,
                AmountValue: ioi.AmountValue == "" ? "0" : ioi.AmountValue,
                TextValue:
                  ioi.TextValue == ""
                    ? null
                    : check !== undefined
                    ? check.ColumnName.toUpperCase() === "DESCRIPTION"
                      ? "TOTAL"
                      : check.ColumnName.toUpperCase() === "ACCOUNT"
                      ? ""
                      : ioi.TextValue
                    : "",
              };
              totaltempcol.push({
                obj: obj1,
              });
              totalcolsfororg.push(obj2);
            });

            var filteredtotal_col = [];
            this.state.orderColumns.map((p) => {
              var getc = totaltempcol.find((o) => o.obj.ColumnGuid === p.guid);
              if (getc !== undefined) {
                filteredtotal_col.push(getc);
              }
            });

            var guid2 = uuidv1();
            var TotalObj = {
              BusinessUnitGuid: selectedrows[0].BusinessUnitGuid,
              ParentGuid: guid,
              Columns: filteredtotal_col,
              Position: tposition,
              TenantGuid: selectedrows[1].TenantGuid,
              TotalGuid: null,
              Type: "Total",
              guid: guid2,
              checkbox: false,
              checkzero: false,
              carrot: false,
              clicked: false,
            };

            pt.push(TotalObj);

            fd.push(TotalObj);

            let TotalObjorg = JSON.parse(JSON.stringify(TotalObj));
            TotalObjorg.Columns = totalcolsfororg;
            delete TotalObjorg["checkbox"];
            delete TotalObjorg["checkzero"];
            delete TotalObjorg["carrot"];
            delete TotalObjorg["clicked"];
            od.push(TotalObjorg);
            postData.push(TotalObjorg);

            //sort data first to get correct indexes
            od = od;
            fd = fd.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });
            pt = pt.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });

            var newheaderindx = this.state.pivotGroupTag.findIndex(
              (o) => o.guid === guid
            );
            var newtotalindx = this.state.pivotGroupTag.findIndex(
              (o) => o.guid === guid2
            );

            undo.push({
              INSERTHEADERTOTAL: {
                HEADERGUID: guid,
                TOTALGUID: guid2,
              },
            });

            //changing level value increase by one between two selected rows
            var idsfrlvlchg = [];
            //getting guid of Level
            var levelcol = this.state.orderColumns.find(
              (k) => k.ColumnName.toUpperCase() === "LEVEL"
            );
            if (levelcol !== undefined) {
              for (var i = newheaderindx + 1; i < newtotalindx; i++) {
                //replacing parent guid with in the new added header and total (only of headers)
                var parentidtoreplace = pt[newheaderindx].ParentGuid;
                //check the first level headers, after newely added headers having no further.
                if (pt[i].ParenGuid === selectedrows[1].guid) {
                  pt[i].ParentGuid = parentidtoreplace;
                  od.find((k) => k.guid === pt[i].guid).ParentGuid =
                    parentidtoreplace;
                }

                idsfrlvlchg.push(pt[i]);
              }

              idsfrlvlchg.map((k) => {
                var h = k.Columns.find(
                  (j) => j.obj.ColumnGuid === levelcol.guid
                );
                if (h.obj.TextValue === " " || h.obj.TextValue === null) {
                  h.obj.AmountValue = parseInt(h.obj.AmountValue) + 1;
                } else {
                  h.obj.TextValue = parseInt(h.obj.TextValue) + 1;
                }

                //changing level for original data

                //finding row in originaldata
                var gotarow = od.find((kp) => kp.guid === k.guid);
                if (gotarow !== undefined) {
                  var h = gotarow.Columns.find(
                    (j) => j.ColumnGuid === levelcol.guid
                  );
                  if (h.TextValue === " " || h.TextValue === null) {
                    h.AmountValue = parseInt(h.AmountValue) + 1;
                  } else {
                    h.TextValue = parseInt(h.TextValue) + 1;
                  }
                }

                /**
                 * Push infected rows inside the new inserted header and total for updation in database.
                 */
                postData.push(gotarow);
              });
            }

            //changing level value increase by one between two selected rows end

            await this.setState({
              originalData: od,
              finaldata: fd,
              pivotGroupTag: pt,
              undo: undo,
            });

            this.redRowHandler();
            await this.calculateData(headObj);

            //valid case End
          } else {
            this.setState({
              message_desc:
                "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
              message_heading: "Header & Total",
              openMessageModal: true,
            });
            //          toast.error(
            //            'Correct Your Selection of Rows To Insert Header And Total'
            //          );
          }
        } else {
          this.setState({
            message_desc:
              "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
            message_heading: "Header & Total",
            openMessageModal: true,
          });
          //        toast.error(
          //          'Correct Your Selection of Rows To Insert Header And Total'
          //        );
        }
      } else {
        this.setState({
          message_desc:
            "Expand all rows by clicking triangle in header and try again.",
          message_heading: "Header & Total",
          openMessageModal: true,
        });
      }
    } else {
      this.setState({
        message_desc:
          "Header & Total cannot be inserted on checked rows. Please refer to help menu for more information.",
        message_heading: "Header & Total",
        openMessageModal: true,
      });
      //      toast.error('Correct Your Selection of Rows To Insert Header And Total');
    }
    await this.replaceHistory(this.state.finaldata);
    if (postData.length > 0) {
      var lofdata = Math.ceil(postData.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = postData.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend,
          },
        })
          .then((data) => {
            // toast.success('data added');
          })
          .catch((err) => {
            this.setState({
              message_desc: "Copydata request failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            });
            // toast.error('copydata request failed');
          });
      }

      let positions = [];
      postData.map((newRow) => {
        this.state.pivotGroupTag.find((tagRow, index) => {
          if (tagRow.guid === newRow.guid) {
            positions.push(index);
          }
        });
      });

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          User: localStorage.getItem("Email"),
          Datetime: dateTime,
          Module: "Icons",
          Description: "Insert Header & Total",
          ProjectName: this.state.selectedProject.Name,
          Projectguid: this.state.selectedProject.guid,
          ColumnName: "",
          ValueFrom: "",
          // "ValueTo": positions.toString(),
          ValueTo: "",
          Tenantid: localStorage.getItem("tenantguid"),
        },
      ]);
    }
  };

  exportdata = async () => {
    await this.setState({
      isLoading: true,
    });
    await this.tes();
    $("#test1").click();
    await this.setState({
      isLoading: false,
    });

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Groups List",
        Description: "Export",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        ValueTo: "",
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);
  };

  tes = async () => {
    let { pivotGroupTag } = this.state;
    //denugger;;
    var exceldata = [];
    await this.getGroups();

    var tcols = [];
    if (this.state.templates) {
      this.state.templates.map((p) => {
        if (p.Columns) {
          p.Columns.map((o) => {
            tcols.push(o);
          });
        }
      });
    }

    // await API.post('pivot', '/getColumsbyMultipleTemplates', {
    //     body: {
    //       templates: tcols,
    //     },
    //   })
    //   .then(async (data) => {
    //     this.setState({
    //       templatecols: data.result.Items.filter(
    //         (e) => e.ColumnName.toString().toUpperCase() !== 'LEVEL'
    //       ),
    //     });
    //   })
    //   .catch((err) => {
    //     return false;
    //     toast.error('Get Columns By Multiple Templates Error');
    //   });

    let columns = await this.getColumsByMultipleTemplates(tcols);
    await this.setState({
      templatecols: columns.filter(
        (e) => e.ColumnName.toString().toUpperCase() !== "LEVEL"
      ),
    });

    //getting in order all columns

    var tmp_result = this.state.templatecols;
    var finalordercolumns = [];
    //first align the system columns
    tmp_result
      .filter((o) => o.Type === "System")
      .sort(function (a, b) {
        var nameA = a.ColumnName;
        var nameB = b.ColumnName;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      })
      .map((i) => {
        finalordercolumns.push(i);
      });
    //align the selected  template columns
    var tmp_templates = JSON.parse(JSON.stringify(this.state.templates));
    var b = this.state.selectedtempguid;
    tmp_templates = tmp_templates.sort(function (a) {
      var nameA = a.guid;
      var nameB = b;

      if (nameA === nameB) {
        return -1;
      } else {
        return 1;
      }

      // names must be equal
      return 0;
    });

    tmp_templates.map((u) => {
      var col_order = u.Columns;
      col_order.map((s) => {
        var f_push = tmp_result.find((k) => k.guid === s);
        if (f_push !== undefined && f_push.Type !== "System") {
          finalordercolumns.push(f_push);
        }
      });
    });

    await this.setState({
      templatecols: finalordercolumns,
    });
    var obj = {};
    if (this.state.templatecols) {
      this.state.templatecols.map((p) => {
        obj[p.guid] = p.Type;
      });
      obj["gCode"] = "Group List";
      obj["description"] = "Group List";
      obj["hide"] = "Group List";
      exceldata.push(obj);
      obj = {};
      this.state.templatecols.map((p) => {
        obj[p.guid] = p.ColumnName;
      });

      obj["gCode"] = "Group Code";
      obj["description"] = "Group Description";
      obj["hide"] = "Hide";
      obj["Header"] = "Header & Total";
      exceldata.push(obj);

      obj = {};
      var temporg = this.state.originalData;
      temporg.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });

      temporg.map((u, ii) => {
        obj = {};
        this.state.templatecols.map((x) => {
          if (
            (u.Type == "Header" || u.Type == "Total") &&
            x.Type !== "System"
          ) {
            var objoftagdata = this.state.pivotGroupTag.find(
              (f) => f.guid === u.guid
            );
            if (objoftagdata !== undefined) {
              var valstoreplace = objoftagdata.Columns.find(
                (j) => j.obj.ColumnGuid === x.guid
              );

              if (valstoreplace !== undefined) {
                if (x.Format == "TEXT") {
                  if (
                    valstoreplace.obj.TextValue == null ||
                    valstoreplace.obj.TextValue == " "
                  ) {
                    obj[x.guid] = valstoreplace.obj.AmountValue.toString();
                  } else {
                    obj[x.guid] = valstoreplace.obj.TextValue.toString();
                  }
                } else {
                  if (
                    valstoreplace.obj.TextValue == null ||
                    valstoreplace.obj.TextValue == " "
                  ) {
                    obj[x.guid] = Number(valstoreplace.obj.AmountValue);
                  } else {
                    obj[x.guid] = Number(valstoreplace.obj.TextValue);
                  }
                }
              }
            } else {
              obj[x.guid] = "";
            }
          } else {
            var i = u.Columns.find((o) => o.ColumnGuid == x.guid);
            if (i !== undefined) {
              if (x.Type == "System") {
                if (i.AmountValue == "0" && i.TextValue == null) {
                  obj[x.guid] = "";
                } else {
                  if (i.TextValue == null || i.TextValue == " ") {
                    obj[x.guid] = i.AmountValue.toString();
                  } else {
                    obj[x.guid] = i.TextValue.toString();
                  }
                }
              } else {
                let cell = i;
                if (x.Type.toString().toUpperCase() == "CALCULATION") {
                  pivotGroupTag.find((row) => {
                    if (row.guid === u.guid) {
                      row.Columns.find((pivotCell) => {
                        if (pivotCell.obj.ColumnGuid === i.ColumnGuid) {
                          cell = pivotCell.obj;
                          console.log("cell", cell);
                          return true;
                        }
                      });
                      return true;
                    }
                  });
                }
                if (
                  cell.AmountValue == "0" &&
                  cell.TextValue == null &&
                  x.Format == "TEXT"
                ) {
                  obj[x.guid] = "";
                } else {
                  if (x.Format == "TEXT") {
                    if (cell.TextValue == null || cell.TextValue == " ") {
                      obj[x.guid] = cell.AmountValue.toString();
                    } else {
                      obj[x.guid] = cell.TextValue.toString();
                    }
                  } else {
                    if (cell.TextValue == null || cell.TextValue == " ") {
                      obj[x.guid] = Number(cell.AmountValue);
                    } else {
                      obj[x.guid] = Number(cell.TextValue);
                    }
                  }
                }
              }
            }
          }
        });

        obj["Header"] = u.Type == "Detail" ? "" : u.Type;

        if (this.state.get_groupsd[ii]) {
          obj["gCode"] = this.state.get_groupsd[ii].Code;

          obj["description"] = this.state.get_groupsd[ii].Description;
          if (this.state.get_groupsd[ii].Hide == true) {
            obj["hide"] = "Y";
          } else {
            obj["hide"] = " ";
          }
        }
        exceldata.push(obj);
      });
    }
    this.setState({
      exceldata: exceldata,
    });
  };

  importcsv = () => {
    var detailrows = this.state.originalData.filter((t) => t.Type === "Detail");
    if (detailrows[0]) {
      detailrows[0].Columns[0].AmountValue = 11;
    }
  };

  importcsvfinal = async () => {
    this.setState({
      isLoading: true,
    });
    const import_pad = document.getElementById("import_pad");
    let rowsList = [];
    let postdata = [];
    // var path = import_pad.value;
    // var file_name = path.replace(/^C:\\fakepath\\/, "");
    // document.getElementById("paste_pad_label").innerHTML = file_name;
    let { pivotGroupTag, finaldata, originalData, orderColumns, get_groupsd } =
      this.state;
    await readXlsxFile(import_pad.files[0]).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.

      rowsList = rows;
      if (rowsList.length > 0) {
        var csvFileColumns = rowsList[0];

        var columns = [];
        // to get account column object from originalData and pivotGroupTag to match CSV acc number.
        var accountColumnGuid = "";
        csvFileColumns.map((csvFileColumn) => {
          var orderColumnsFiltered = orderColumns.filter(
            (u) =>
              u.ColumnName.toString()
                .replace(/ /g, "")
                .toString()
                .toUpperCase() ==
              csvFileColumn
                .toString()
                .replace(/ /g, "")
                .toString()
                .toUpperCase()
          );
          if (orderColumnsFiltered.length > 0) {
            orderColumnsFiltered.map((orderColumn) => {
              if (
                orderColumn.ColumnName.toString().toUpperCase() == "ACCOUNT"
              ) {
                accountColumnGuid = orderColumn.guid;
              }
              columns.push(orderColumn);
            });
          }
        });
        rowsList.map(async (u, i) => {
          if (i != 0) {
            var r;
            var ptagindexacc;
            ptagindexacc = pivotGroupTag[0].Columns.findIndex(
              (column) => column.obj.ColumnGuid === accountColumnGuid
            );
            if (ptagindexacc > -1) {
              r = pivotGroupTag.find(
                (ii) =>
                  ii.Columns[ptagindexacc].obj.AmountValue == u[0] ||
                  ii.Columns[ptagindexacc].obj.TextValue == u[0]
              );
            }

            // var r1 = originalData.find(
            // ii =>
            // ii.Columns[0].AmountValue == u[0] ||
            // ii.Columns[0].TextValue == u[0]
            // );
            var r1;
            originalData.map((ii) => {
              var tempAcc = ii.Columns.find(
                (col) => col.ColumnGuid === accountColumnGuid
              );
              if (
                (tempAcc && tempAcc.AmountValue == u[0]) ||
                (tempAcc && tempAcc.TextValue == u[0])
              ) {
                //new added 'tempAcc &&' condition
                r1 = ii;
              }
            });
            //
            //
            //
            if (r) {
              postdata.push(r1);
              columns.map((yy, oo) => {
                var coltype = orderColumns.find((p) => p.guid == yy.guid);
                if (
                  coltype &&
                  (coltype.Type == "System" ||
                    coltype.Type == "DataIntegration" ||
                    coltype.Type == "Entry")
                ) {
                  var d = r.Columns.find((u) => u.obj.ColumnGuid == yy.guid);
                  var d1 = r1.Columns.find((u) => u.ColumnGuid == yy.guid);
                  var fi = csvFileColumns.findIndex((u) => u == yy.ColumnName);

                  var vals = u[fi];
                  var groupsvalue = "";
                  if (coltype.ColumnName.toString().toUpperCase() == "GROUPS") {
                    if (vals) {
                      var gr = vals.split(",");

                      gr.map((u) => {
                        var getgroup = get_groupsd.find(
                          (iii) =>
                            iii.Code.toString().toUpperCase() ==
                            u.toString().toUpperCase()
                        );
                        if (getgroup) {
                          groupsvalue = groupsvalue + "" + u + ",";
                        }
                      });
                    }
                    vals = groupsvalue;
                  }

                  if (d) {
                    if (d.obj.TextValue) {
                      if (vals === undefined) {
                        d.obj.TextValue = null;
                        d1.TextValue = null;
                      } else {
                        d.obj.TextValue = vals;
                        d1.TextValue = vals === "" ? null : vals;
                      }
                    } else {
                      if (vals === undefined) {
                        d.obj.AmountValue = "0";
                        d1.AmountValue = "0";
                      } else {
                        d.obj.AmountValue =
                          vals === null || vals === "" ? "0" : vals;
                        d1.AmountValue =
                          vals === null || vals === "" ? "0" : vals;
                      }
                    }
                  }
                }
              });
              // break;
              // await this.setState({
              //   pivotGroupTag: pivotGroupTag,
              //   originalData: originalData,
              // });
              // var parent = this.state.pivotGroupTag.find(
              //   (e) => e.guid === r.ParentGuid
              // );
              // await this.calculateData(parent);
              // await this.setState({
              //   pivotGroupTag: this.state.pivotGroupTag,
              //   finaldata: this.state.finaldata,
              // });
            } else if (r1) {
              columns.map((yy, oo) => {
                var coltype = orderColumns.find((p) => p.guid == yy.guid);
                if (
                  coltype &&
                  (coltype.Type == "System" ||
                    coltype.Type == "DataIntegration" ||
                    coltype.Type == "Entry")
                ) {
                  var d1 = r1.Columns.find((u) => u.ColumnGuid == yy.guid);
                  var fi = csvFileColumns.findIndex((u) => u == yy.ColumnName);

                  var vals = u[fi];
                  var groupsvalue = "";
                  if (coltype.ColumnName.toString().toUpperCase() == "GROUPS") {
                    if (vals) {
                      var gr = vals.split(",");

                      gr.map((u) => {
                        var getgroup = get_groupsd.find(
                          (iii) =>
                            iii.Code.toString().toUpperCase() ==
                            u.toString().toUpperCase()
                        );
                        if (getgroup) {
                          groupsvalue = groupsvalue + "" + u + ",";
                        }
                      });
                    }
                    vals = groupsvalue;
                  }

                  if (d1) {
                    if (d1.TextValue) {
                      if (vals === undefined) {
                        d1.TextValue = null;
                      } else {
                        d1.TextValue = vals === "" ? null : vals;
                      }
                    } else {
                      if (vals === undefined) {
                        d1.AmountValue = "0";
                      } else {
                        d1.AmountValue =
                          vals === null || vals === "" ? "0" : vals;
                      }
                    }
                  }
                }
              });

              let cells = [];
              orderColumns.map((orderColumn, index) => {
                let column = r1.Columns.find(
                  (cell) => cell.ColumnGuid === orderColumn.guid
                );
                if (column) {
                  cells.push({
                    obj: {
                      ColumnGuid: column.ColumnGuid,
                      AmountValue: column.AmountValue,
                      TextValue: column.TextValue,
                      tabId: index + 1,
                      uniqueCellId: uuidv1(),
                    },
                  });
                }
              });

              delete r1["TotalGuid"];
              var rowtoadd = {
                AmountValue: "0",
                BusinessUnitGuid: r1.BusinessUnitGuid,
                Columns: cells,
                ParentGuid: r1.ParentGuid,
                Position: r1.Position,
                TenantGuid: r1.TenantGuid,
                Type: "Detail",
                carrot: false,
                chartID: r1.chartID,
                guid: r1.guid,
                checkbox: false,
                checkzero: false,
                clicked: false,
                isAccountEmpty:
                  (cells[0].obj.TextValue === null ||
                    cells[0].obj.TextValue === " ") &&
                  cells[0].obj.AmountValue === "0"
                    ? false
                    : false,
              };
              pivotGroupTag.push(rowtoadd);
              finaldata.push(rowtoadd);
              postdata.push(r1);

              // break;
              // await this.setState({
              //   pivotGroupTag: pivotGroupTag,
              //   finaldata: finaldata,
              //   originalData: originalData,
              // });
              // var parent = this.state.pivotGroupTag.find(
              //   (e) => e.guid === r.ParentGuid
              // );
              // await this.calculateData(parent);
              // await this.setState({
              //   pivotGroupTag: this.state.pivotGroupTag,
              //   finaldata: this.state.finaldata,
              // });
            } else {
              pivotGroupTag.sort(function (a, b) {
                var nameA = a.Position;
                var nameB = b.Position;
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              });
              //push unmatched rows at very bottom of worktable
              //u row will be an object that is goin to appen in main array
              var singlerow = JSON.parse(
                JSON.stringify(pivotGroupTag[pivotGroupTag.length - 1])
              );
              singlerow.guid = uuidv1();
              var pos = this.makeposition(singlerow.Position);
              singlerow.Position = (pos + 10).toString();
              singlerow.Type = "Detail";
              singlerow.Columns.map((sr) => {
                sr.obj.AmountValue = "0";
                sr.obj.TextValue = null;
              });
              columns.map((yy, oo) => {
                var coltype = orderColumns.find((p) => p.guid == yy.guid);
                if (
                  coltype &&
                  (coltype.Type == "System" ||
                    coltype.Type == "DataIntegration" ||
                    coltype.Type == "Entry")
                ) {
                  var d = singlerow.Columns.find(
                    (u) => u.obj.ColumnGuid == yy.guid
                  );
                  var fi = csvFileColumns.findIndex((u) => u == yy.ColumnName);
                  var vals = rowsList[i][fi];
                  var groupsvalue = "";
                  if (coltype.ColumnName.toString().toUpperCase() == "GROUPS") {
                    if (vals) {
                      var gr = vals.split(",");
                      gr.map((u) => {
                        var getgroup = get_groupsd.find(
                          (iii) =>
                            iii.Code.toString().toUpperCase() ==
                            u.toString().toUpperCase()
                        );
                        if (getgroup) {
                          groupsvalue = groupsvalue + "" + u + ",";
                        }
                      });
                    }
                    vals = groupsvalue;
                  }

                  if (d) {
                    if (d.obj.TextValue) {
                      if (vals === undefined) {
                        d.obj.TextValue = null;
                      } else {
                        d.obj.TextValue = vals;
                      }
                    } else {
                      if (vals === undefined) {
                        d.obj.AmountValue = "0";
                      } else {
                        d.obj.AmountValue =
                          vals === null || vals === "" ? "0" : vals;
                      }
                    }
                  }
                }
              });
              var singleorgrow = JSON.parse(JSON.stringify(singlerow));
              var gosl = JSON.parse(JSON.stringify(singlerow.Columns));
              var colorg = [];

              gosl.map((iu) => {
                let obj = {
                  ColumnGuid: iu.obj.ColumnGuid,
                  AmountValue:
                    iu.obj.AmountValue === null || iu.obj.AmountValue === ""
                      ? "0"
                      : iu.obj.AmountValue,
                  TextValue: iu.obj.TextValue,
                };
                colorg.push(obj);
                obj = {};
              });
              singlerow["isAccountEmpty"] =
                (singlerow.Columns[0].obj.TextValue === null ||
                  singlerow.Columns[0].obj.TextValue === " ") &&
                singlerow.Columns[0].obj.AmountValue === "0"
                  ? true
                  : false;
              // var frd = this.state.finaldata;
              // var ord = this.state.pivotGroupTag;
              pivotGroupTag.push(singlerow);
              finaldata.push(singlerow);
              singleorgrow.Columns = colorg;
              // var ord1 = this.state.originalData;
              delete singleorgrow["checkbox"];
              delete singleorgrow["checkzero"];
              delete singleorgrow["carrot"];
              delete singleorgrow["clicked"];
              delete singleorgrow["AmountValue"];
              delete singleorgrow["isAccountEmpty"];
              delete singleorgrow["TotalGuid"];
              var sampledetail = originalData.find((k) => k.Type === "Detail");
              //update non existing columns as empty
              sampledetail.Columns.map((s) => {
                if (
                  singleorgrow.Columns.find(
                    (h) => h.ColumnGuid === s.ColumnGuid
                  ) === undefined
                ) {
                  singleorgrow.Columns.push({
                    ColumnGuid: s.ColumnGuid,
                    AmountValue: "0",
                    TextValue: null,
                  });
                }
              });

              originalData.push(singleorgrow);

              postdata.push(singleorgrow);

              // await this.setState({
              //   pivotGroupTag: ord,
              //   finaldata: frd,
              //   originalData: ord1,
              // });
            }
          }
        });
      }
    });

    await this.setState({
      pivotGroupTag: pivotGroupTag,
      finaldata: finaldata,
      originalData: originalData,
    });

    Promise.all(
      ["0"].map(async (item) => {
        await this.groupingLevelUnmutable(pivotGroupTag);
      })
    )
      .then(async (success) => {
        if (postdata.length > 0) {
          var lofdata = Math.ceil(postdata.length / 20);
          for (var i = 0; i < lofdata * 20; i = i + 20) {
            var arraytosend = postdata.slice(i, i + 20);
            await API.post("pivot", "/copypivotdata", {
              body: {
                pivotdata: arraytosend,
              },
            })
              .then(() => {
                // toast.success('Data replaced successfully.');
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }

        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Groups List",
            Description: "CSV",
            ProjectName: this.state.selectedProject.Name,
            Projectguid: this.state.selectedProject.guid,
            ColumnName: "",
            ValueFrom: "",
            ValueTo: "",
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);

        this.setState({
          message_heading: "CSV Import",
          message_desc: "CSV import complete.",
          openMessageModal: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          message_heading: "CSV Import",
          message_desc: "CSV import failed to upload.",
          openMessageModal: true,
          isLoading: false,
        });
      });

    // To select new excel file and perform above operations, import_pad needs to be clear here.
    import_pad.value = null;
  };

  importExcelValidation = async () => {
    let csv_pad = document.getElementById("csv_pad");
    let worktableTemplates = {};
    let excelTemplates = {};
    let columnsCount = true;
    let areColumnsNameSame = true;
    let { allcolumnsoftemp, templates } = this.state;
    let fetched_data = [];
    let groupsNotExist = false;

    // var path = csv_pad.value;
    // var file_name = path.replace(/^C:\\fakepath\\/, "");
    // document.getElementById("csv_pad_label").innerHTML = file_name;
    // var csv_pad = document.getElementById("csv_pad");

    await readXlsxFile(csv_pad.files[0]).then((rows) => {
      fetched_data = rows;
    });

    templates.map((template) => {
      worktableTemplates[template.TemplateName.toUpperCase()] = {};
      template.Columns.map((columnGuid) => {
        let searchedColumn = allcolumnsoftemp.find(
          (column) =>
            column.guid === columnGuid && column.Type.toUpperCase() !== "SYSTEM"
        );
        if (searchedColumn) {
          if (
            worktableTemplates[template.TemplateName.toUpperCase()][
              "ColumnNames"
            ]
          ) {
            worktableTemplates[template.TemplateName.toUpperCase()][
              "ColumnNames"
            ].push(searchedColumn.ColumnName.toUpperCase());
          } else {
            worktableTemplates[template.TemplateName.toUpperCase()][
              "ColumnNames"
            ] = [searchedColumn.ColumnName.toUpperCase()];
          }
        }
      });
    });

    fetched_data[0].map((templateName, index) => {
      templateName = templateName.toString().toUpperCase();
      if (templateName !== "SYSTEM" && templateName !== "TEMPLATE") {
        if (excelTemplates[templateName] === undefined) {
          excelTemplates[templateName] = {};
        }
        if (excelTemplates[templateName]["ColumnNames"] === undefined) {
          excelTemplates[templateName]["ColumnNames"] = [
            fetched_data[2][index].toString().toUpperCase(),
          ];
        } else {
          excelTemplates[templateName]["ColumnNames"].push(
            fetched_data[2][index].toString().toUpperCase()
          );
        }
      }
    });

    Object.keys(worktableTemplates).map((templateName) => {
      worktableTemplates[templateName]["ColumnNames"] =
        worktableTemplates[templateName]["ColumnNames"].sort();
    });

    Object.keys(excelTemplates).map((templateName) => {
      excelTemplates[templateName]["ColumnNames"] =
        excelTemplates[templateName]["ColumnNames"].sort();
    });

    if (
      Object.keys(excelTemplates).length !==
      Object.keys(worktableTemplates).length
    ) {
      columnsCount = false;
    } else {
      Object.keys(excelTemplates).map((templateName) => {
        if (worktableTemplates[templateName]) {
          if (
            worktableTemplates[templateName]["ColumnNames"].length !==
            excelTemplates[templateName]["ColumnNames"].length
          ) {
            columnsCount = false;
          } else {
            if (
              JSON.stringify(
                worktableTemplates[templateName]["ColumnNames"]
              ) !== JSON.stringify(excelTemplates[templateName]["ColumnNames"])
            ) {
              areColumnsNameSame = false;
            }
          }
        }
      });
    }

    if (
      fetched_data[0] &&
      fetched_data[0][fetched_data[0].length - 1] &&
      fetched_data[0][fetched_data[0].length - 1].toUpperCase() !== "SYSTEM" &&
      fetched_data[0][fetched_data[0].length - 2] &&
      fetched_data[0][fetched_data[0].length - 2].toUpperCase() !== "SYSTEM" &&
      fetched_data[0][fetched_data[0].length - 3] &&
      fetched_data[0][fetched_data[0].length - 3].toUpperCase() !== "SYSTEM"
    ) {
      groupsNotExist = true;
    }

    if (fetched_data[2].find((columnName) => typeof columnName !== "string")) {
      this.setState({
        message_desc: "Cannot import dates as headings, import will abort.",
        message_heading: "Headings",
        openMessageModal: true,
        isLoading: false,
      });
      csv_pad.value = null;
      return;
    }

    if (`${fetched_data[3][0]}`.toUpperCase() !== "HEADER") {
      this.setState({
        message_desc:
          'In order to proceed, change your first row type to "Header".',
        message_heading: "Import",
        openMessageModal: true,
        isLoading: false,
      });
      csv_pad.value = null;
      return;
    }

    if (groupsNotExist) {
      this.setState({
        message_desc: "Groups not found. Please provide groups to proceed.",
        message_heading: "WARNING",
        openMessageModal: true,
        isLoading: false,
      });
      csv_pad.value = null;
      return;
    }

    if (!(columnsCount && areColumnsNameSame)) {
      this.setState({
        message_desc: !columnsCount
          ? "Cannot import as column headings or number of columns have changed."
          : "Headings have changed. All column calculation and formatting will be lost if you click OK. Close X message to abort import.",
        message_heading: "WARNING",
        openMessageModal: true,
        // optionalOkFunction: this.importexcel,
        optionalOkFunction: () => {
          document.getElementById("csv_pad").value = null;
        },
        optionalCloseFunction: () => {
          document.getElementById("csv_pad").value = null;
        },
        isLoading: false,
      });
      return;
    }

    this.importexcel();
  };

  importexcel = async () => {
    await this.setState({
      isLoading: true,
    });
    let csv_pad = document.getElementById("csv_pad");

    // var path = csv_pad.value;
    // var file_name = path.replace(/^C:\\fakepath\\/, "");
    // document.getElementById("csv_pad_label").innerHTML = file_name;
    // var csv_pad = document.getElementById("csv_pad");

    let fetched_data = [];

    await readXlsxFile(csv_pad.files[0]).then((rows) => {
      fetched_data = rows;
    });

    /**
     * Checking total's and header's are equal then proceed.
     * Otherwise excel file isn't in right format and toast will display along error message.
     */
    let headers = fetched_data.filter(
      (p) => p[0] && p[0].toString().toUpperCase() === "Header".toUpperCase()
    );
    let totals = fetched_data.filter(
      (p) => p[0] && p[0].toString().toUpperCase() === "Total".toUpperCase()
    );

    if (headers.length == totals.length) {
      /**
       * Getting old and new templates
       * Filtering columns of named 'Template' and 'System'.
       * After filtration, separated templates stored in alltemplates.
       */
      var alltemplates = [];
      fetched_data[0].map((i) => {
        if (
          alltemplates.indexOf(i) < 0 &&
          i.toString().toUpperCase() !== "TEMPLATE" &&
          i.toString().toUpperCase() !== "SYSTEM"
        ) {
          alltemplates.push(i);
        }
      });
      var oldtemplates = [];
      oldtemplates = alltemplates.filter((o) =>
        this.state.templates.find((y) => o === y.TemplateName)
      );
      var newtemplates = [];
      newtemplates = alltemplates.filter(
        (o) =>
          this.state.templates.find((y) => o === y.TemplateName) === undefined
      );
      /**
       * Getting those templates which aren't exists in excel file.but in worktable
       */
      var worktableTemplatesOnly = [];
      worktableTemplatesOnly = this.state.templates.filter(
        (template) => !alltemplates.includes(template.TemplateName)
      );

      /**
       * Adding new templates{{non-existing templates in db}} in db.
       * These templates imported from excel file.
       */
      if (newtemplates.length > 0) {
        await this.addingunmatchedtemp(newtemplates, fetched_data);
      }
      if (oldtemplates.length > 0) {
        await this.addingmatchedtemp(oldtemplates, fetched_data);
      }

      await this.createSystemColumns(fetched_data);

      /**
       * Rows data will create here.
       * finalobjects will contains rows data.
       * Parent child relationship will create here.
       */

      var stack = [];
      var finalobjects = [];
      var position = 50000;
      fetched_data.map((row, index) => {
        /**
         * Leave first three rows of imported excel file data.
         * These three rows contains file data which isn't required here.
         */
        if (index > 2) {
          var tmp_guid = uuidv1();
          var parentid = index === 3 ? "root" : stack[stack.length - 1];
          if (
            row[0] &&
            row[0].toString().toUpperCase() === "Header".toUpperCase()
          ) {
            stack.push(tmp_guid);
          }

          position = position + 10;

          var obj = {
            guid: tmp_guid,
            Columns: [
              {
                ColumnGuid: this.state.finalColumnsForDB.find(
                  (s) => s.ColumnName.toString().toUpperCase() == "LEVEL"
                ).guid,
                AmountValue: "0",
                TextValue: stack.length,
              },
            ],
            BusinessUnitGuid: this.state.selectedProject.guid,
            ParentGuid: parentid,
            Position: position.toString(),
            TenantGuid: localStorage.getItem("tenantguid"),
            Type:
              row[0] &&
              row[0].toString().toUpperCase() === "Header".toUpperCase()
                ? "Header"
                : row[0] &&
                  row[0].toString().toUpperCase() === "Total".toUpperCase()
                ? "Total"
                : "Detail",
          };
          finalobjects.push(obj);
          if (
            row[0] &&
            row[0].toString().toUpperCase() === "Total".toUpperCase()
          ) {
            stack.pop();
          }
        }
      });

      this.state.finalTemplatesForDB.map((u, uindex) => {
        var thistempcols = [];
        u.Columns.map((o) => {
          var newcol = this.state.finalColumnsForDB.find((s) => s.guid === o);
          if (newcol !== undefined) {
            thistempcols.push(newcol);
          } else {
            var oldcol = this.state.allcolumnsoftemp.find((s) => s.guid === o);
            thistempcols.push(oldcol);
          }
        });

        fetched_data.map((row, index) => {
          var tmpthiscol = JSON.parse(JSON.stringify(thistempcols));
          if (index > 2) {
            row.map((r, rindex) => {
              if (rindex > 0) {
                var flag = false;
                tmpthiscol.map((col, ind) => {
                  if (uindex === 0) {
                    if (
                      (fetched_data[0][rindex].toString().toUpperCase() ===
                        u.TemplateName.toString().toUpperCase() ||
                        fetched_data[0][rindex].toString().toUpperCase() ===
                          "SYSTEM") &&
                      fetched_data[2][rindex].toString().toUpperCase() ===
                        col.ColumnName.toString().toUpperCase() &&
                      fetched_data[1][rindex].toString().toUpperCase() !==
                        "GROUP LIST" &&
                      flag === false
                    ) {
                      finalobjects[index - 3].Columns.push({
                        ColumnGuid: col.guid,
                        AmountValue: "0",
                        // AmountValue: col.Format === "TEXT" && col.Type === "System" ? " " : "0",
                        TextValue:
                          finalobjects[index - 3].Type === "Header" ||
                          finalobjects[index - 3].Type === "Total"
                            ? col.Type === "System"
                              ? r
                              : null
                            : r,
                      });

                      flag = true;
                      delete tmpthiscol[ind];
                    }
                  } else {
                    if (
                      fetched_data[0][rindex].toString().toUpperCase() ===
                        u.TemplateName.toString().toUpperCase() &&
                      fetched_data[2][rindex].toString().toUpperCase() ===
                        col.ColumnName.toString().toUpperCase() &&
                      flag === false
                    ) {
                      finalobjects[index - 3].Columns.push({
                        ColumnGuid: col.guid,
                        AmountValue: "0",
                        // AmountValue: col.Format === "TEXT" && col.Type === "System" ? " " : "0",
                        TextValue:
                          finalobjects[index - 3].Type === "Header" ||
                          finalobjects[index - 3].Type === "Total"
                            ? col.Type === "System"
                              ? r
                              : null
                            : r,
                      });
                      flag = true;
                      delete tmpthiscol[ind];
                    }
                  }
                });
              }
            });
          }
        });
      });

      if (worktableTemplatesOnly.length > 0) {
        worktableTemplatesOnly.map((wtemplate) => {
          var finalobj = [];
          var guidsfortemp = [];
          wtemplate.Columns.map((col) => {
            var currentcol = this.state.allcolumnsoftemp.find(
              (u) => u.guid === col
            );
            if (currentcol !== undefined && currentcol.Type !== "System") {
              finalobj.push(currentcol);
              guidsfortemp.push(currentcol.guid);
            }
          });
          var objtopush = [];

          if (finalobj.length > 0) {
            finalobj.map((i) => {
              var obj = {
                ColumnGuid: i.guid,
                AmountValue: "0",
                TextValue: null,
              };
              objtopush.push(obj);
            });

            finalobjects.map((fdata) => {
              fdata.Columns = fdata.Columns.concat(objtopush);
            });
          }
          var colsofcurrenttemp = this.state.allcolumnsoftemp.filter(
            (s) =>
              wtemplate.Columns.find(
                (k) => k === s.guid && s.Type != "System"
              ) !== undefined
          );
          var columnsForDB = [];
          colsofcurrenttemp.map((p) => {
            // p.Formula = null; Uncomment this line to make all column's Formula equal to null
            // Inherit formula
            p.Formula = this.state.newColumnUploaded ? null : p.Formula;
            columnsForDB.push(p);
          });

          wtemplate.Columns = this.state.sysids.concat(guidsfortemp);
          var finalTemplatesForDB = this.state.finalTemplatesForDB;
          finalTemplatesForDB.push(wtemplate);
          this.setState({
            finalTemplatesForDB,
          });
          this.setState({
            finalColumnsForDB:
              this.state.finalColumnsForDB.concat(columnsForDB),
          });
        });
      }

      let groupStartingIndex = undefined;
      let excelGroups = [];
      let { get_groupsd } = this.state;
      fetched_data.map((row, index) => {
        if (index === 0) {
          row.find((r, rindex) => {
            if (rindex > 3 && r === "System") {
              groupStartingIndex = rindex;
              return true;
            }
            return false;
          });
        }
        if (index > 2) {
          let code = row[groupStartingIndex];
          let description = row[groupStartingIndex + 1];
          let hide = row[groupStartingIndex + 2];
          hide = hide && hide.toString().toUpperCase() === "Y" ? true : false;

          console.log("Group Code", code);
          console.log("Group Description", description);
          console.log("Hide", hide);

          if (code && code !== "" && code !== " ") {
            excelGroups.push({
              Code: code,
              Description: description === null ? "" : description,
              Hide: hide,
              TenantGuid: this.state.selectedProject.TenantGuid,
              PivotBusinessUnit: this.state.selectedProject.guid,
            });
          }
        }
      });

      let groupsGuids = undefined;
      groupsGuids = get_groupsd.map((dashboardGroup) => dashboardGroup.guid);
      get_groupsd = get_groupsd.filter((dashboardGroup) => {
        let isFound = excelGroups.find(
          (excelGroup) => dashboardGroup.Code === excelGroup.Code
        );
        return isFound ? false : true;
      });
      excelGroups = get_groupsd.concat(excelGroups);

      if (excelGroups.length) {
        await this.addGroupsBatch(excelGroups);
        if (groupsGuids) {
          await this.deleteGroupsBatch(groupsGuids);
        }
      }

      // await this.getGroups();
      let tenantguids = localStorage.getItem("tenantguid");
      await API.post("pivot", "/getgroups", {
        body: {
          tenantguid: tenantguids,
          PivotBusinessUnit: this.state.selectedProject.guid,
        },
      })
        .then(async (data) => {
          await this.setState({
            get_groupsd: data,
            // openGroupListModal: true
          });
        })
        .catch((err) => {
          this.setState({
            message_desc: "Groups fetched failed",
            message_heading: "Groups",
            openMessageModal: true,
          });
          // toast.error('groups fetched faild');
        });

      await this.addImportInDatabase(finalobjects);

      // To select new excel file and perform above operations, csv_pad needs to clear here.
      csv_pad.value = null;
    } else {
      this.setState({
        message_desc:
          "Import doesn’t have the same number of Headers & Totals.",
        message_heading: "Can’t Import",
        openMessageModal: true,
      });
      csv_pad.value = null;
    }
    /**
     * Clear state.
     * Get all columns of templates.
     */

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Groups List",
        Description: "Import",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        ValueTo: "",
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);

    await this.setState({
      isLoading: false,
    });
  };

  addingunmatchedtemp = (temps, fetched_data) => {
    var allColumns = [];

    /**
     * Getting columns for individual templates.
     * Removing group list columns.
     * Splitting columns between allColumns{{template columns}} and systemColumns{{system columns}}.
     */
    temps.map((newTemplateName, mainIndex) => {
      fetched_data[0].map((fileTemplateName, index) => {
        if (
          newTemplateName === fileTemplateName &&
          fetched_data[1][index].toString().toUpperCase() !== "GROUP LIST"
        ) {
          var obj = {
            templateName: newTemplateName,
            columnType: fetched_data[1][index],
            columnName: fetched_data[2][index],
          };
          allColumns.push(obj);
        }
      });
    });

    /**
     * Looping over templates.
     * Converting temps into template objects and saving them into templatesForDB.
     * Filtering template columns, looping over them, converting each column into column objects and
     * saving them into columnsForDB.
     */
    var templatesForDB = [];
    var columnsForDB = [];
    temps.map((template, index) => {
      var templateID = uuidv1();
      var templateObj = {
        TenantGuid: localStorage.getItem("tenantguid"),
        Exclude: [
          {
            BlankRows: false,
            HiddenColumns: false,
            ZeroRows: false,
            HeadingsTotals: false,
          },
        ],
        BusinessUnitGuid: this.state.selectedProject.guid,
        guid: templateID,
        FontSize: 0,
        Columns: [],
        TemplateName: template,
      };

      var temporaryColumns = allColumns.filter(
        (s) => s.templateName === template
      );
      var columnsIDs = [];
      var finalColumns = [];

      temporaryColumns.map((col) => {
        var cid = uuidv1();
        columnsIDs.push(cid);
        var obj = {
          TenantGuid: localStorage.getItem("tenantguid"),
          PrevColumnGuid: null,
          DoNotCalculate: false,
          Type: col.columnType.replace(" ", ""),
          Hide: false,
          // Assign first item from dropdown list as a default value according to client requirement.
          Format: this.state.config.Formats[0].val.toString(),
          TotalColumn: true,
          guid: cid,
          Width: "12",
          ColumnName: col.columnName,
          PeriodClear: false,
          PrevColumnGuid: null,
          SelectedColumnGuid: null,
          SelectedTemplateGuid: null,
          Trackingcat: [],
          API: [
            {
              APICall: null,
              TrackingCat: null,
              TrackingCatID: null,
              TrackingCode: null,
              TrackingCodeID: null,
            },
          ],
          TemplateGuid: templateID,
          Alignment: "Right",
          Formula: null,
        };
        columnsForDB.push(obj);
      });
      /**
       * columnsIDs contains columns guid's and assigning them to templateObj.Columns.
       */
      templateObj.Columns = columnsIDs;
      templatesForDB.push(templateObj);
    });

    this.setState({
      finalColumnsForDB: this.state.finalColumnsForDB.concat(columnsForDB),
      finalTemplatesForDB:
        this.state.finalTemplatesForDB.concat(templatesForDB),
      newColumnUploaded: true,
    });
  };

  addingmatchedtemp = async (temps, fetched_data) => {
    var allColumns = [];
    var completeobjoftemp = [];
    //making temp taht have to be new created
    temps.map((newTemplateName, mainIndex) => {
      var completeobjtmp = this.state.templates.find(
        (d) => d.TemplateName === newTemplateName
      );
      var colsofcurrenttemp = this.state.allcolumnsoftemp.filter(
        (s) => completeobjtmp.Columns.find((k) => k === s.guid) !== undefined
      );

      fetched_data[0].map((fileTemplateName, index) => {
        let column = this.state.orderColumns.find(
          (c) => c.Type !== "System" && c.ColumnName === fetched_data[2][index]
        );
        if (
          newTemplateName === fileTemplateName &&
          fetched_data[1][index].toString().toUpperCase() !== "GROUP LIST" &&
          colsofcurrenttemp.find(
            (d) => d.ColumnName === fetched_data[2][index]
          ) === undefined
        ) {
          var obj = {
            templateName: newTemplateName,
            columnType: fetched_data[1][index],
            columnName: fetched_data[2][index],
            Width: column ? column.Width : "10",
            Alignment: column ? column.Alignment : "Right",
          };
          allColumns.push(obj);
          this.setState({
            newColumnUploaded: true,
          });
        }
      });

      completeobjoftemp.push(completeobjtmp);
    });
    //making temp taht have to be new created end
    var templatesforDB = [];
    var columnsForDB = [];

    temps.map((s, ind) => {
      var completeobjtmp = this.state.templates.find(
        (d) => d.TemplateName === s
      );
      var colsofcurrenttemp = this.state.allcolumnsoftemp.filter(
        (h) =>
          completeobjtmp.Columns.find(
            (k) => k === h.guid && h.Type !== "System"
          ) !== undefined
      );
      var temporaryColumns = allColumns.filter((g) => g.templateName === s);

      /**
       * AR Version
       * Columns sorting according to current template columns in excel file.
       */
      var columnsIDs = [];
      var sortedColumnsNames = [];

      fetched_data[0].map((cellValue, index) => {
        if (s === cellValue) {
          sortedColumnsNames.push(fetched_data[2][index]);
        }
      });

      sortedColumnsNames.map((name) => {
        var column = colsofcurrenttemp.filter(
          (f) =>
            f.ColumnName === name &&
            f.Type !== "System" &&
            !columnsIDs.includes(f.guid)
        );
        if (column[0] != null && column[0] != undefined) {
          columnsIDs.push(column[0].guid);
        }
      });

      // /**
      // * Moazam Version
      // */
      // var columnsIDs = [];
      // colsofcurrenttemp.map(f => {
      // if (f.Type !== "System") {
      // columnsIDs.push(f.guid);
      // }
      // });

      temporaryColumns.map((col) => {
        var cid = uuidv1();
        columnsIDs.push(cid);
        var obj = {
          TenantGuid: localStorage.getItem("tenantguid"),
          PrevColumnGuid: null,
          DoNotCalculate: false,
          Type: col.columnType.replace(" ", ""),
          Hide: false,
          // Assign first item from dropdown list as a default value according to client requirement.
          Format: this.state.config.Formats[0].val.toString(),
          TotalColumn: true,
          guid: cid,
          Width: col.Width,
          ColumnName: col.columnName,
          PeriodClear: false,
          API: [
            {
              APICall: null,
              TrackingCat: null,
              TrackingCatID: null,
              TrackingCode: null,
              TrackingCodeID: null,
            },
          ],
          TemplateGuid: completeobjtmp.guid,
          Alignment: col.Alignment,
          Formula: null,
        };
        columnsForDB.push(obj);
      });
      //making formula null of already created columns.
      console.log("temporaryColumns -------------- ", temporaryColumns);

      colsofcurrenttemp.map((p) => {
        // p.Formula = null; Uncomment this line to make all column's Formula equal to null
        // Inherit formula
        p.Formula = this.state.newColumnUploaded ? null : p.Formula;
        columnsForDB.push(p);
      });

      completeobjtmp.Columns = columnsIDs;
      templatesforDB.push(completeobjtmp);
    });

    this.setState({
      finalColumnsForDB: this.state.finalColumnsForDB.concat(columnsForDB),
      finalTemplatesForDB:
        this.state.finalTemplatesForDB.concat(templatesforDB),
    });
  };

  createSystemColumns = (fetched_data) => {
    var tempSystemColumns = [];
    var sysids = [];
    var finalSystemColumns = [];

    fetched_data[0].map((templateName, index) => {
      if (
        templateName.toString().toUpperCase() === "SYSTEM" &&
        fetched_data[1][index].toString().toUpperCase() !== "GROUP LIST"
      ) {
        let column = this.state.orderColumns.find(
          (c) => c.ColumnName === fetched_data[2][index]
        );
        tempSystemColumns.push({
          Type: fetched_data[1][index],
          columnName: fetched_data[2][index],
          Alignment: column.Alignment,
          Width: column.Width,
          Hide: column.Hide,
        });
      }
    });

    tempSystemColumns.map((column, index) => {
      var sysID = uuidv1();
      sysids.push(sysID);

      // system column object
      var obj = {
        TenantGuid: localStorage.getItem("tenantguid"),
        PrevColumnGuid: null,
        DoNotCalculate: false,
        Type: "System",
        Hide: column.Hide,
        Format: "TEXT",
        TotalColumn: true,
        guid: sysID,
        Width: column.Width,
        ColumnName: column.columnName,
        PeriodClear: false,
        PrevColumnGuid: null,
        SelectedColumnGuid: null,
        SelectedTemplateGuid: null,
        Trackingcat: [],
        API: [
          {
            APICall: null,
            TrackingCat: null,
            TrackingCatID: null,
            TrackingCode: null,
            TrackingCodeID: null,
          },
        ],
        TemplateGuid: this.state.finalTemplatesForDB[0].guid,
        Alignment: column.Alignment,
        Formula: null,
      };
      finalSystemColumns.push(obj);
      if (index === 0) {
        var tmp_levelid = uuidv1();

        // level column object
        finalSystemColumns.push({
          TenantGuid: localStorage.getItem("tenantguid"),
          PrevColumnGuid: null,
          DoNotCalculate: false,
          Type: "System",
          Hide: false,
          Format: "TEXT",
          TotalColumn: true,
          guid: tmp_levelid,
          Width: "9",
          ColumnName: "Level",
          PeriodClear: false,
          PrevColumnGuid: null,
          SelectedColumnGuid: null,
          SelectedTemplateGuid: null,
          Trackingcat: [],
          API: [
            {
              APICall: null,
              TrackingCat: null,
              TrackingCatID: null,
              TrackingCode: null,
              TrackingCodeID: null,
            },
          ],
          TemplateGuid: this.state.finalTemplatesForDB[0].guid,
          Alignment: "Center",
          Formula: null,
        });
        sysids.push(tmp_levelid);
      }
    });

    this.setState({
      finalColumnsForDB: finalSystemColumns.concat(
        this.state.finalColumnsForDB
      ),
    });
    var finalTemplatesForDB = this.state.finalTemplatesForDB;
    finalTemplatesForDB.map((template) => {
      template.Columns = sysids.concat(template.Columns);
    });
    this.setState({
      finalTemplatesForDB,
      sysids,
    });
  };

  addImportInDatabase = async (finalobjects) => {
    // console.log("finalTemplatesForDB -------------- ", this.state.finalTemplatesForDB);
    // console.log("finalColumnsForDB -------------- ", this.state.finalColumnsForDB);
    // console.log("finalobjects -------------- ", finalobjects);
    // return false;

    var guids = JSON.parse(localStorage.getItem("templateguid"));
    var exist = guids.filter((e) => {
      return e.project === this.state.selectedProject.guid;
    });
    //console.log(guids,'beore');
    if (exist[0]) {
      var tmp_h = guids.filter((e) => {
        return e.project !== this.state.selectedProject.guid;
      });
      localStorage.setItem("templateguid", JSON.stringify(tmp_h));
    }

    // return false;
    var that = this;
    var responseFlag = false;
    var catchArray = [];
    var loftemp = this.state.finalTemplatesForDB.length / 20;
    for (var i = 0; i < Math.ceil(loftemp) * 20; i = i + 20) {
      var arraytosend = this.state.finalTemplatesForDB.slice(i, i + 20);
      await API.post("pivot", "/addTemplateBatch", {
        body: {
          templates: arraytosend,
        },
      })
        .then(() => {
          responseFlag = true;
          // toast.success('Template added successfully.');
        })
        .catch((error) => {
          responseFlag = false;
          catchArray.push(responseFlag);
          console.log(error);
        });
      console.log(
        arraytosend,
        "finalTemplatesForDB",
        "--------------------------------------------"
      );
    }

    /**
     * Manipulating column type bugs.
     */
    this.state.finalColumnsForDB.map((column) => {
      const type = column.Type.toString()
        .replace(/ /g, "")
        .toString()
        .toUpperCase();
      if (type === "DATAINTEGRATION") column.type = "DataIntegration";
      else if (type === "ENTRY") column.type = "Entry";
      else if (type === "CALCULATION") column.type = "Calculation";
      else if (type === "PREVIOUSPERIOD") column.type = "PreviousPeriod";
    });
    var lofcols = Math.ceil(this.state.finalColumnsForDB.length / 20);
    for (var i = 0; i < lofcols * 20; i = i + 20) {
      var arraytosend = this.state.finalColumnsForDB.slice(i, i + 20);
      await API.post("pivot", "/addColumnBatch", {
        body: {
          columns: arraytosend,
        },
      })
        .then(() => {
          responseFlag = true;
          // toast.success('Columns added successfully.');
        })
        .catch((error) => {
          responseFlag = false;
          catchArray.push(responseFlag);
          console.log(error);
        });
      console.log(
        arraytosend,
        "finalColumnsForDB",
        "--------------------------------------------"
      );
    }

    var lofdata = Math.ceil(finalobjects.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = finalobjects.slice(i, i + 20);
      await API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then(() => {
          responseFlag = true;
          // toast.success('Data replaced successfully.');
        })
        .catch((error) => {
          responseFlag = false;
          catchArray.push(responseFlag);
          console.log(error);
        });
      console.log(
        arraytosend,
        "finalobjects",
        "--------------------------------------------"
      );
    }

    var rowsGuids = [];
    rowsGuids = this.state.originalData.map((row) => row.guid);

    var lofrows = Math.ceil(rowsGuids.length / 20);
    for (var i = 0; i < lofrows * 20; i = i + 20) {
      var arraytosend = rowsGuids.slice(i, i + 20);
      await API.post("pivot", "/deletepivotdata", {
        body: {
          guids: arraytosend,
        },
      })
        .then(() => {
          responseFlag = true;
        })
        .catch((error) => {
          responseFlag = false;
          catchArray.push(responseFlag);
          console.log(error);
        });
      console.log(
        arraytosend,
        "rowsGuids",
        "--------------------------------------------"
      );
    }

    await this.setState({
      finalColumnsForDB: [],
      finalTemplatesForDB: [],
      sysids: [],
    });

    //    var timer = setInterval(async function() {
    //      if (responseFlag && catchArray.length === 0) {
    await that.dropclick(that.state.selectedProject.guid);

    //        clearInterval(timer);
    //      }
    //    }, 1000);
    var body = "";
    var header = "";
    if (that.state.newColumnUploaded) {
      header = "Import completed";
      body = "New columns have been inserted please check column settings.";
    } else {
      header = "Import completed";
      body = "Import successfully completed.";
    }
    that.setState({
      message_desc: body,
      message_heading: header,
      openMessageModal: true,
      newColumnUploaded: false,
    });
  };

  handleCalculationForCheckedRows = async (rows) => {
    let detailRows = rows || [];
    let checkedRowsHeaders = [];
    console.log("handleCalculationForCheckedRows");

    /**
     * Getting headers of detailRows.
     */
    detailRows.map((checkedRow) => {
      this.state.finaldata.find((row) => {
        if (row.guid === checkedRow.ParentGuid) {
          checkedRowsHeaders.push(row);
        }
      });
    });

    checkedRowsHeaders.map(async (row) => {
      await this.calculateData(row);
    });
  };

  updateGroups = async (oldData, newData) => {
    let postData = [];
    //getting groups column guid
    var groupcol = this.state.orderColumns.find(
      (o) => o.ColumnName.toUpperCase() === "GROUPS"
    );

    if (groupcol !== undefined && groupcol.guid) {
      let {
        originalData,
        pivotGroupTag,
        finaldata,
        get_groupsd,
        pivotGroupTagHiddenRows,
        selectedProject,
      } = this.state;
      pivotGroupTag = pivotGroupTag.concat(pivotGroupTagHiddenRows);
      finaldata = finaldata.concat(pivotGroupTagHiddenRows);
      let checkedRows = [];

      originalData.map((row) => {
        var tmp_obj = row.Columns.find((t) => t.ColumnGuid === groupcol.guid);
        if (tmp_obj.TextValue === null || tmp_obj.TextValue === " ") {
          let splitTextArray = tmp_obj.AmountValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            postData.push(row);
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.AmountValue =
              splitTextArray.toString() === ""
                ? "0"
                : splitTextArray.toString();
          }
        } else {
          let splitTextArray = tmp_obj.TextValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            postData.push(row);
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.TextValue =
              splitTextArray.toString() === ""
                ? null
                : splitTextArray.toString();
          }
        }
      });
      pivotGroupTag.map((row) => {
        var tmp_obj = row.Columns.find(
          (t) => t.obj.ColumnGuid === groupcol.guid
        );
        if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
          let splitTextArray = tmp_obj.obj.AmountValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            checkedRows.push(row);
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.obj.AmountValue =
              splitTextArray.toString() === ""
                ? "0"
                : splitTextArray.toString();
          }
        } else {
          let splitTextArray = tmp_obj.obj.TextValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            checkedRows.push(row);
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.obj.TextValue =
              splitTextArray.toString() === ""
                ? null
                : splitTextArray.toString();
          }
        }
      });
      finaldata.map((row) => {
        var tmp_obj = row.Columns.find(
          (t) => t.obj.ColumnGuid === groupcol.guid
        );
        if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
          let splitTextArray = tmp_obj.obj.AmountValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.obj.AmountValue =
              splitTextArray.toString() === ""
                ? "0"
                : splitTextArray.toString();
          }
        } else {
          let splitTextArray = tmp_obj.obj.TextValue.toString().split(",");
          let index = splitTextArray.indexOf(oldData.code);
          if (index > -1) {
            if (newData.code === "")
              splitTextArray = splitTextArray.filter(
                (group) => group !== oldData.code
              );
            else splitTextArray[index] = newData.code;
            tmp_obj.obj.TextValue =
              splitTextArray.toString() === ""
                ? null
                : splitTextArray.toString();
          }
        }
      });

      /**
       * Edited group changes saved here.
       */
      if (newData.code === "") {
        get_groupsd = get_groupsd.filter(
          (group) => group.Code !== oldData.code
        );
      } else {
        get_groupsd.map((group) => {
          if (group.Code === oldData.code) {
            group.Code = newData.code;
            group.Description = newData.description;
            group.Hide = newData.hide_check;
          }
        });
      }
      let result = await this.updateGroupsHideProperty(
        pivotGroupTag,
        finaldata,
        get_groupsd,
        selectedProject.OnConflict ? selectedProject.OnConflict : false
      );
      await this.setState({
        originalData: originalData,
        pivotGroupTag: result.pivotGroupTag,
        finaldata: result.finaldata,
        get_groupsd: get_groupsd,
        get_groupsd: get_groupsd,
        pivotGroupTagHiddenRows: result.pivotGroupTagHiddenRows,
      });

      var lofdata = Math.ceil(postData.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = postData.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend,
          },
        })
          .then((data) => {
            if (i + 20 == lofdata * 20) {
              // toast.success('data added with updated groups names.');
            }
          })
          .catch((err) => {
            this.setState({
              message_desc: "Copydata request failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            });
            // toast.error('copydata request failed');
          });
      }
      if (checkedRows.length) {
        await this.handleCalculationForCheckedRows(checkedRows);
        await this.removeCheckedRows();
      }
    }
  };

  updateGroupsHideProperty = async (
    pivotGroupTag,
    finaldata,
    get_groupsd,
    selectedProjectOnConflict
  ) => {
    let hiddenGroups = get_groupsd.filter((group) => group.Hide);
    let groupGuid = this.state.orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "GROUPS"
    ).guid;
    let updatedPivotTag = [];
    let updatedFinalData = [];

    updatedPivotTag = await this.removeHideRows(
      pivotGroupTag,
      hiddenGroups,
      groupGuid,
      selectedProjectOnConflict
    );
    updatedFinalData = await this.removeHideRows(
      finaldata,
      hiddenGroups,
      groupGuid,
      selectedProjectOnConflict
    );
    updatedPivotTag.nonHiddenRows.sort(function (a, b) {
      var nameA = a.Position;
      var nameB = b.Position;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    updatedFinalData.nonHiddenRows.sort(function (a, b) {
      var nameA = a.Position;
      var nameB = b.Position;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    return {
      pivotGroupTag: updatedPivotTag.nonHiddenRows,
      finaldata: updatedFinalData.nonHiddenRows,
      pivotGroupTagHiddenRows: updatedPivotTag.hiddenRows,
      checkedRows: updatedPivotTag.checkedRows,
    };
  };

  updateGroupsRowsCountProperty = async (originalData, groupGuid, data) => {
    originalData.map((row) => {
      row.Columns.map((cell) => {
        if (cell.ColumnGuid === groupGuid) {
          let value = cell.TextValue;
          if (value == null) {
            let splitTextArray = cell.AmountValue.split(",");
            splitTextArray.map((textGroup) => {
              data.map((group) => {
                if (group.Code === textGroup.toString()) {
                  if (group["Rows"] === undefined) {
                    group["Rows"] = 1;
                  } else {
                    group["Rows"] += 1;
                  }
                }
              });
            });
          } else {
            let splitTextArray = value.split(",");
            splitTextArray.map((textGroup) => {
              data.map((group) => {
                if (group.Code === textGroup.toString()) {
                  if (group["Rows"] === undefined) {
                    group["Rows"] = 1;
                  } else {
                    group["Rows"] += 1;
                  }
                }
              });
            });
          }
        }
      });
    });
    return data;
  };

  removeHideRows = (
    pivotGroupTag,
    hiddenGroups,
    groupGuid,
    selectedProjectOnConflict
  ) => {
    let array = [];
    let hiddenRows = [];
    let nonHiddenRows = [];
    let checkedRows = [];

    if (
      pivotGroupTag !== null ||
      pivotGroupTag !== undefined ||
      pivotGroupTag.length > 0
    ) {
      array = pivotGroupTag.map((row, rowIndex) => {
        let check = {
          index: rowIndex,
          hide: false,
        };
        let oneTimeOnly = true;
        row.Columns.map((cell) => {
          if (cell.obj.ColumnGuid === groupGuid) {
            let value = cell.obj.TextValue;
            if (value == null) {
              let splitTextArray = cell.obj.AmountValue.split(",");
              splitTextArray.map((textGroup) => {
                hiddenGroups.map((group) => {
                  if (group.Code === textGroup.toString()) {
                    if (oneTimeOnly) {
                      checkedRows.push(row);
                      oneTimeOnly = false;
                    }
                    /**
                     * If splitTextArray has only single child then selectedProjectOnConflict wouldn't apply in this case.
                     * So due to this condition [[group.Code === textGroup.toString()]] row will hide.
                     */
                    if (splitTextArray.length === 1) check.hide = true;
                    /**
                     * If splitTextArray has childrens and more than one child has [[Hide=true]] property then
                     * selectedProjectOnConflict apply in this case.
                     * selectedProjectOnConflict = true
                     *    1. hide row if any group contains [[Hide=true]].
                     * selectedProjectOnConflict = false
                     *    1. display row either any group contains [[Hide=true]] or [[Hide=false]].
                     */ else
                      check.hide = selectedProjectOnConflict ? true : false;
                  }
                });
              });
            } else {
              let splitTextArray = value.split(",");
              splitTextArray.map((textGroup) => {
                hiddenGroups.map((group) => {
                  if (group.Code === textGroup.toString()) {
                    if (oneTimeOnly) {
                      checkedRows.push(row);
                      oneTimeOnly = false;
                    }
                    /**
                     * If splitTextArray has only single child then selectedProjectOnConflict wouldn't apply in this case.
                     * So due to this condition [[group.Code === textGroup.toString()]] row will hide.
                     */
                    if (splitTextArray.length === 1) check.hide = true;
                    /**
                     * If splitTextArray has childrens and more than one child has [[Hide=true]] property then
                     * selectedProjectOnConflict apply in this case.
                     * selectedProjectOnConflict = true
                     *    1. hide row if any group contains [[Hide=true]].
                     * selectedProjectOnConflict = false
                     *    1. display row either any group contains [[Hide=true]] or [[Hide=false]].
                     */ else
                      check.hide = selectedProjectOnConflict ? true : false;
                  }
                });
              });
            }
          }
        });
        return check;
      });
      array.map((element) => {
        if (element.hide) {
          hiddenRows.push(pivotGroupTag[element.index]);
        } else {
          nonHiddenRows.push(pivotGroupTag[element.index]);
        }
      });

      return {
        hiddenRows: hiddenRows,
        nonHiddenRows: nonHiddenRows,
        checkedRows: checkedRows,
      };
    } else {
      throw "Please provide valid pivotGroupTag data";
    }
  };

  updateGroupsHelper = async () => {
    let {
      pivotGroupTag,
      finaldata,
      get_groupsd,
      pivotGroupTagHiddenRows,
      selectedProject,
    } = this.state;
    pivotGroupTag = pivotGroupTag.concat(pivotGroupTagHiddenRows);
    finaldata = finaldata.concat(pivotGroupTagHiddenRows);
    let result = await this.updateGroupsHideProperty(
      pivotGroupTag,
      finaldata,
      get_groupsd,
      selectedProject.OnConflict ? selectedProject.OnConflict : false
    );
    await this.setState({
      pivotGroupTag: result.pivotGroupTag,
      finaldata: result.finaldata,
      pivotGroupTagHiddenRows: result.pivotGroupTagHiddenRows,
    });
    await this.handleCalculationForCheckedRows(result.checkedRows);
    await this.redRowHandler();
    await this.removeCheckedRows();
  };

  formatValidation = (value, format) => {
    let color = "";
    if (value === "") {
      return [
        {
          value: value,
          color: color,
        },
      ];
    } else if (format !== "TEXT") {
      // we are using the indexes , so position cant be change
      const formats = this.state.config.Formats;
      value = isNaN(Number(value)) ? 0 : Number(value);
      if (formats[0].val === format) {
        value = Math.round(value);
        if (value >= 0) {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          color = "red";
          value = "(" + value.substring(1) + ")";
        }
      } else if (formats[1].val === format) {
        value = Math.round(value);
        if (value >= 0) {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          color = "red";
        } else {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          value = "(" + value.substring(1) + ")";
        }
      } else if (formats[2].val === format) {
        if (value >= 0) {
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          color = "red";
          value != ""
            ? (value =
                "(" +
                parseFloat(value.toString().substring(1)).toFixed(2) +
                ")")
            : (value = "0");
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[3].val === format) {
        if (value >= 0) {
          color = "red";
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          value != ""
            ? (value =
                "(" +
                parseFloat(value.toString().substring(1)).toFixed(2) +
                ")")
            : (value = "0");
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[4].val === format) {
        value = Math.round(value);
        if (value >= 0) {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          color = "red";
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[5].val === format) {
        value = Math.round(value);
        if (value >= 0) {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          color = "red";
        } else {
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[6].val === format) {
        if (value >= 0) {
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          color = "red";
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[7].val === format) {
        if (value >= 0) {
          color = "red";
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          value != "" ? (value = parseFloat(value).toFixed(2)) : (value = "0");
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else if (formats[8].val === format) {
        if (value >= 0) {
          value = value.toString();
          color = "#02de02";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        } else {
          value = value.toString();
          color = "red";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        }
      } else if (formats[9].val === format) {
        if (value >= 0) {
          value = value.toString();
          color = "red";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        } else {
          value = value.toString();
          color = "#02de02";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        }
      } else if (formats[10].val === format) {
        if (value >= 0) {
          value = value.toString();
          value != ""
            ? (value = parseFloat(value * 100).toFixed(2) + "%")
            : (value = "0");
        } else {
          color = "red";
          value = value.toString();
          value != ""
            ? (value = parseFloat(value * 100).toFixed(2) + "%")
            : (value = "0");
        }
      } else if (formats[11].val === format) {
        if (value >= 0) {
          color = "red";
          value = value.toString();
          value != ""
            ? (value = parseFloat(value * 100).toFixed(2) + "%")
            : (value = "0");
        } else {
          value = value.toString();
          value != ""
            ? (value = parseFloat(value * 100).toFixed(2) + "%")
            : (value = "0");
        }
      } else if (formats[12].val === format) {
        if (value >= 0) {
          value = value.toString();
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        } else {
          value = value.toString();
          color = "red";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        }
      } else if (formats[13].val === format) {
        if (value >= 0) {
          value = value.toString();
          color = "red";
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        } else {
          value = value.toString();
          value != "" ? (value = Math.round(value * 100) + "%") : (value = "0");
        }
      }

      return [
        {
          value: value,
          color: color,
        },
      ];
    } else {
      return [
        {
          value: value,
          color: color,
        },
      ];
    }
  };

  removeSpacesBetweenNumbers = (formula) => {
    let newFormula = "";

    formula
      .toString()
      .split(" ")
      .map((item, index) => {
        if (index === 0 || !isNaN(item)) {
          newFormula += item;
        } else {
          newFormula += " " + item + " ";
        }
      });
    newFormula = newFormula
      .split(" ")
      .filter((item) => item !== "")
      .join(" ");
    return newFormula;
  };

  evaluateExpression = (expression) => {
    expression = expression.replace("--", "+");
    expression = expression.replace("++", "+");
    expression = expression.replace("-+", "-");
    expression = expression.replace("+-", "-");

    try {
      return eval(expression);
    } catch (e) {
      let before = JSON.parse(JSON.stringify(expression));
      before.split(/[\(,\),\/,\*,\+,\-,\=]+/).map((element) => {
        if (element !== "" && element !== " ") {
          expression = expression.replace(element, parseInt(element));
        }
      });
      // console.log(
      //   "evaluateExpression() => octal before: ", before, "octal after: ", expression
      // );
      return eval(expression);
    }
  };

  formulaCallback = (rowGuid, formula) => {
    let DMASRule = {
      "(": "(",
      ")": ")",
      "/": "/",
      "*": "*",
      "+": "+",
      "-": "-",
      "=": "=",
      ".": ".",
    };
    let result = undefined;
    let { allcolumnsoftemp, originalData } = this.state;
    /**
     * It just remove spaces between a number for example ( 1 + 2 ) 2 3 - 4 ===== ( 1 + 2 ) 23 - 4.
     * And return back the formula.
     */
    // //denugger;;
    formula = this.removeSpacesBetweenNumbers(formula);

    let expression = "";
    formula.split(" ").map((formulaGuid) => {
      if (isNaN(formulaGuid) && DMASRule[formulaGuid] === undefined) {
        // //denugger;;

        let column = allcolumnsoftemp.find((col) => col.guid === formulaGuid);
        if (column.Formula) {
          let result = undefined;

          // //denugger;;
          result = this.formulaCallback(rowGuid, column.Formula);
          // //denugger;;
          expression += result;

          return;
        } else {
          let row = undefined;
          let cell = undefined;
          row = originalData.find((row) => row.guid === rowGuid);
          cell = row.Columns.find((cell) => cell.ColumnGuid === formulaGuid);

          if (cell.TextValue) {
            expression += cell.TextValue;
            return;
          } else {
            expression += cell.AmountValue;
            return;
          }
        }
      }
      expression += formulaGuid;
      return;
    });
    // console.log(
    //   "formulaCallback --------------------------------------------------:  ", eval(expression)
    // );
    result = this.evaluateExpression(expression);
    return result;
  };

  applyColumnFormula = async () => {
    /**
     * Get and loop over pivot tag data.
     * Get calculation type columns.
     * In formula, replace columnguid's with cell value.
     * Calculate it then paste calculated cell value into cell.
     */
    let {
      originalData,
      pivotGroupTag,
      orderColumns,
      selectedProject,
      allcolumnsoftemp,
    } = this.state;
    let DMASRule = {
      "(": "(",
      ")": ")",
      "/": "/",
      "*": "*",
      "+": "+",
      "-": "-",
      "=": "=",
      ".": ".",
    };
    let calculatedTypeColumns = [];
    let periodCount = selectedProject.periodcount;
    calculatedTypeColumns = orderColumns.filter(
      (column) =>
        column.Type === "Calculation" &&
        column.Formula !== null &&
        column.Formula !== ""
    );
    originalData = originalData.sort(function (a, b) {
      let nameA = a.Position;
      let nameB = b.Position;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    pivotGroupTag.map(async (pivotGroupTagRow, rowIndex) => {
      if (pivotGroupTagRow.Type === "Detail") {
        pivotGroupTagRow.Columns.map(async (cell, cellIndex) => {
          let column = calculatedTypeColumns.find(
            (column) => column.guid === cell.obj.ColumnGuid
          );

          if (
            column !== undefined &&
            column.Formula !== null &&
            // column.Formula !== undefined &&
            column.Type !== "System"
          ) {
            // console.log("column.Formula ++++++++++++++++++//////////////////////////())))()()()()()()((()(())()()(()", column.Formula)
            /**
             * It just remove spaces between a number for example ( 1 + 2 ) 2 3 - 4 ===== ( 1 + 2 ) 23 - 4.
             * And return back the formula.
             */
            let formula = await this.removeSpacesBetweenNumbers(column.Formula);
            let expression = "";
            formula.split(" ").map(async (formulaGuid) => {
              let value = undefined;

              if (isNaN(formulaGuid) && DMASRule[formulaGuid] === undefined) {
                let column = allcolumnsoftemp.find(
                  (col) => col.guid === formulaGuid
                );

                if (column.Formula) {
                  let originalRow = originalData.find(
                    (k) => k.guid === pivotGroupTagRow.guid
                  );
                  value = this.formulaCallback(
                    originalRow.guid,
                    column.Formula
                  );
                  // console.log(
                  //   "applyColumnFormula +++++++++++++++++++++++++++++++++++++++++++++++:  ", value, column.Formula
                  // );
                }

                // let pivotDataCell = pivotData[rowIndex].Columns.find(pivotDataCell => pivotDataCell.obj.ColumnGuid === formulaGuid);
                let pivotDataCell = pivotGroupTagRow.Columns.find(
                  (pivotDataCell) =>
                    pivotDataCell.obj.ColumnGuid === formulaGuid
                );

                if (pivotDataCell !== undefined) {
                  if (
                    pivotDataCell.obj.TextValue == null ||
                    pivotDataCell.obj.TextValue == "" ||
                    pivotDataCell.obj.TextValue == " "
                  ) {
                    expression += value ? value : pivotDataCell.obj.AmountValue;
                    expression = expression === "" ? "0" : expression;
                    return;
                  } else {
                    expression += value ? value : pivotDataCell.obj.TextValue;
                    expression = expression === "" ? "0" : expression;
                    return;
                  }
                }

                if (pivotDataCell === undefined) {
                  let originalDataCell = originalData
                    .find(
                      (originalDataRow) =>
                        originalDataRow.guid === pivotGroupTagRow.guid
                    )
                    .Columns.find(
                      (originalDataCell) =>
                        originalDataCell.ColumnGuid === formulaGuid
                    );
                  if (
                    originalDataCell.TextValue == null ||
                    originalDataCell.TextValue == "" ||
                    originalDataCell.TextValue == " "
                  ) {
                    expression += value ? value : originalDataCell.AmountValue;
                    expression = expression === "" ? "0" : expression;
                    return;
                  } else {
                    expression += value ? value : originalDataCell.TextValue;
                    expression = expression === "" ? "0" : expression;
                    return;
                  }
                }
              }

              expression += formulaGuid;
              return expression;
            });

            if (periodCount === 0 && column.DoNotCalculate === true) {
              cell.obj.TextValue = null;
              cell.obj.AmountValue = "0";
            } else {
              //  console.log(
              //    "applyColumnFormula - Final Result xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:  ", expression,"jjjjjjjjjjjj"+this.evaluateExpression(expression)
              //  );
              var tmp = this.evaluateExpression(expression);
              cell.obj.TextValue =
                isNaN(tmp) || tmp === -Infinity || tmp === Infinity ? 0 : tmp;
            }
          }
        });
      }
    });

    await this.setState({
      pivotGroupTag: pivotGroupTag,
    });
    // console.log("----- Formula", JSON.parse(JSON.stringify(this.state.pivotGroupTag.length)), ", ", JSON.parse(JSON.stringify(this.state.finaldata.length)))
  };

  removeCutRows = async () => {
    let { selectedcheckbox } = this.state;
    selectedcheckbox.map((row) => {
      delete row.cutrow;
      $(`span`).removeClass("span_dim_color");
    });
    await this.setState({
      selectedcheckbox: [],
    });
  };

  removeCheckedRows = async () => {
    let { pivotGroupTag, finaldata } = this.state;
    pivotGroupTag.map((row) => {
      row.checkbox = false;
    });
    finaldata.map((row) => {
      row.checkbox = false;
    });
    await this.setState({
      pivotGroupTag: pivotGroupTag,
      finaldata: finaldata,
    });
  };

  handleUndo = async () => {
    // await this.removeCutRows();

    let {
      undo,
      originalData,
      pivotGroupTag,
      pivotGroupTagHiddenRows,
      finaldata,
    } = this.state;
    if (undo.length > 0) {
      let lastItem = undo[undo.length - 1];
      let operationName = Object.keys(lastItem)[0];

      switch (operationName) {
        case "SELECTBETWEEN":
          pivotGroupTag.map((row) => {
            if (row.checkbox) {
              row.checkbox = false;
            }
          });
          undo.pop();
          this.setState({
            cutfinal: [],
            selectedcheckbox: [],
            pivotGroupTag: pivotGroupTag,
            undo: undo,
          });
          break;

        case "INSERTROW":
          await this.UndoInsert(lastItem["INSERTROW"]);

          undo.pop();
          await this.setState({
            undo: undo,
          });

          await this.replaceHistory(finaldata);
          break;

        case "DELETEDROW":
          lastItem = lastItem["DELETEDROW"];

          await this.undoDelete(
            lastItem["DELETEDPIVOTROW"],
            lastItem["DELETEDORIGINALROW"]
          );

          undo.pop();
          await this.setState({
            undo: undo,
          });
          await this.replaceHistory(finaldata);
          break;

        case "APPLYGROUPS":
          await this.isLoading(true);
          let groupColumnGuid = this.state.allcolumnsoftemp.find(
            (column) => column.ColumnName.toUpperCase() === "GROUPS"
          ).guid;
          let postData = [];
          await this.getGroups();
          let { get_groupsd } = this.state;
          let hiddenGroupNames = [];
          let removeRowsIndexes = [];

          get_groupsd.map((group) => {
            if (group.Hide) {
              hiddenGroupNames.push(group.Code);
            }
          });
          await lastItem["APPLYGROUPS"].map((row) => {
            let currentTagRow = pivotGroupTag.find(
              (pivotRow) => pivotRow.guid === row.guid
            );
            currentTagRow = currentTagRow
              ? currentTagRow
              : pivotGroupTagHiddenRows.find(
                  (pivotRow) => pivotRow.guid === row.guid
                );

            var g = pivotGroupTag.findIndex((v) => row.guid == v.guid);
            let pi = [];
            pi.push(g);
            var ph = pivotGroupTagHiddenRows.findIndex(
              (v) => row.guid == v.guid
            );
            let phr = [];
            phr.push(ph);
            var o = originalData.findIndex((v) => row.guid == v.guid);
            let od = [];
            od.push(o);
            var h = finaldata.findIndex((w) => row.guid == w.guid);
            let fi = [];
            fi.push(h);

            row.Columns.map(async (cell, index) => {
              if (cell.obj.ColumnGuid === groupColumnGuid) {
                let obj = undefined;
                let unobj = undefined;
                if (cell.obj.TextValue === null || cell.obj.TextValue === " ") {
                  obj = cell.obj.AmountValue;
                  unobj = currentTagRow.Columns[index].obj.AmountValue;
                } else {
                  obj = cell.obj.TextValue;
                  unobj = currentTagRow.Columns[index].obj.TextValue;
                }

                await this.undoApplyGroup(
                  obj,
                  unobj,
                  originalData,
                  pivotGroupTag,
                  pivotGroupTagHiddenRows,
                  finaldata,
                  pi,
                  phr,
                  od,
                  fi,
                  hiddenGroupNames,
                  removeRowsIndexes
                );
              }
            });

            postData.push(originalData[o]);
          });

          pivotGroupTagHiddenRows = pivotGroupTagHiddenRows.filter(
            (row, index) => !removeRowsIndexes.includes(index)
          );

          var lofdata = Math.ceil(postData.length / 20);
          for (var i = 0; i < lofdata * 20; i = i + 20) {
            var arraytosend = postData.slice(i, i + 20);
            await API.post("pivot", "/copypivotdata", {
              body: {
                pivotdata: arraytosend,
              },
            })
              .then((data) => {})
              .catch((err) => {
                this.setState({
                  message_desc: "Copydata request failed",
                  message_heading: "Pivot Data",
                  openMessageModal: true,
                });
                // toast.error('copydata request failed');
              });
          }

          // undo.pop();
          await this.setState({
            // undo: undo,
            finaldata: finaldata.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            }),
            pivotGroupTag: pivotGroupTag.sort(function (a, b) {
              var nameA = a.Position;
              var nameB = b.Position;
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            }),
            originalData: originalData,
            pivotGroupTagHiddenRows: pivotGroupTagHiddenRows,
            isLoading: false,
          });
          break;

        case "CUTROWS":
          lastItem["CUTROWS"].map((row) => {
            if (row.cutrow) {
              delete row.cutrow;
              $(`span`).removeClass("span_dim_color");
            }
          });

          undo.pop();
          await this.setState({
            undo: undo,
          });
          break;

        case "PASTEROWS":
          await this.undoPasteRows(lastItem["PASTEROWS"]);

          undo.pop();
          await this.setState({
            undo: undo,
          });
          break;

        case "INSERTCOLUMN":
          await this.undoInsertColumn(lastItem["INSERTCOLUMN"]);

          undo.pop();
          await this.setState({
            undo: undo,
          });
          break;

        case "WORKTABLECHANGE":
          await this.undoCellChange(lastItem["WORKTABLECHANGE"]);

          undo.pop();
          await this.setState({
            undo: undo,
          });
          break;

        case "INSERTHEADERTOTAL":
          await this.undoHeaderTotal(lastItem["INSERTHEADERTOTAL"]);

          undo.pop();
          await this.setState({
            undo: undo,
          });
          await this.replaceHistory(finaldata);
          break;
      }
      this.redRowHandler();

      // let dateTime = new Date().getTime();
      // this.activityRecord([{
      //   "User": localStorage.getItem('Email'),
      //   "Datetime": dateTime,
      //   "Module": "Undo",
      //   "Description": "[Worktable Action]",
      //   "ProjectName": this.state.selectedProject.Name,
      //   "Projectguid": this.state.selectedProject.guid,
      //   "ColumnName": "",
      //   "ValueFrom": "[Value From]",
      //   "ValueTo": "[Value To]",
      //   "Tenantid": localStorage.getItem('tenantguid')
      // }]);
    } else {
      this.setState({
        message_desc: "There is nothing to undo.",
        message_heading: "Undo",
        openMessageModal: true,
      });
    }
  };

  // my code
  recalc = async () => {
    this.setState({
      recalc: !this.state.recalc,
    });
    console.log("mmmmmm dashboard recalc", this.state.recalc);
    // window.alert(`recalculated: ${!this.state.recalc}`);
    window.alert(`Recalculated`);
    window.location.reload();
  };
  // my code

  undoValue = async (data) => {
    await this.isLoading(true);
    let { undo } = this.state;
    undo.push(data);

    this.setState({
      undo: undo,
    });
    await this.isLoading(false);
  };

  UndoInsert = async (data) => {
    await this.isLoading(true);
    let guids = [data];
    var p = this.state.pivotGroupTag;
    var f = this.state.finaldata;
    var od = this.state.originalData;
    guids.map((value) => {
      p = p.filter((u) => u.guid != value);
      f = f.filter((u) => u.guid != value);
      od = od.filter((u) => u.guid != value);
    });
    await this.setState({
      pivotGroupTag: p,
      finaldata: f,
      originalData: od,
    });
    var lofrows = Math.ceil(guids.length / 20);
    for (var i = 0; i < lofrows * 20; i = i + 20) {
      var arraytosend = guids.slice(i, i + 20);
      await API.post("pivot", "/deletepivotdata", {
        body: {
          guids: arraytosend,
        },
      })
        .then(async () => {})
        .catch((error) => {});
    }
    await this.isLoading(false);
  };

  undoDelete = async (pivotRows, originalRows) => {
    await this.isLoading(true);
    let { originalData, pivotGroupTag, finaldata } = this.state;
    let rowsHasHeader = false;
    let postData = [];
    let levelcol = this.state.allcolumnsoftemp.find(
      (column) => column.ColumnName.toUpperCase() === "LEVEL"
    );

    pivotRows.map((row) => {
      if (
        row.Type.toUpperCase() === "HEADER" ||
        row.Type.toUpperCase() === "TOTAL"
      ) {
        rowsHasHeader = true;
      }
    });

    if (rowsHasHeader) {
      originalRows.map((row) => {
        originalData.push(row);
        row.checkbox = false;
      });

      pivotRows.map((row) => {
        pivotGroupTag.push(row);
        row.checkbox = false;
      });

      pivotRows.map((row) => {
        finaldata.push(row);
        row.checkbox = false;
      });

      await this.setState({
        finaldata: finaldata.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
        pivotGroupTag: pivotGroupTag.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
        originalData: originalData,
      });

      let comingHeaderIndex = pivotGroupTag.findIndex((row) => {
        return row.guid === pivotRows.find((h) => h.Type === "Header").guid;
      });

      let comingTotalIndex = pivotGroupTag.findIndex((row) => {
        return row.guid === pivotRows.find((h) => h.Type === "Total").guid;
      });

      let chunkRows = [];

      for (let i = comingHeaderIndex + 1; i < comingTotalIndex; i++) {
        chunkRows.push(pivotGroupTag[i]);
      }
      let headerParentGuid = pivotGroupTag[comingHeaderIndex].guid;
      chunkRows.map((row) => {
        let gotarow = originalData.find((k) => k.guid === row.guid);

        if (row.ParentGuid === pivotGroupTag[comingHeaderIndex].ParentGuid) {
          row.ParentGuid = headerParentGuid;
          gotarow.ParentGuid = headerParentGuid;
        }

        var h = row.Columns.find((j) => j.obj.ColumnGuid === levelcol.guid);
        if (h.obj.TextValue === " " || h.obj.TextValue === null) {
          h.obj.AmountValue = parseInt(h.obj.AmountValue) + 1;
        } else {
          h.obj.TextValue = parseInt(h.obj.TextValue) + 1;
        }

        // var gotarow = originalData.find((kp) => kp.guid === row.guid);
        if (gotarow !== undefined) {
          var h = gotarow.Columns.find((j) => j.ColumnGuid === levelcol.guid);
          if (h.TextValue === " " || h.TextValue === null) {
            h.AmountValue = parseInt(h.AmountValue) + 1;
          } else {
            h.TextValue = parseInt(h.TextValue) + 1;
          }
        }
        postData.push(gotarow);
      });

      postData.push(originalRows[0]);
      postData.push(originalRows[1]);

      await this.setState({
        originalData,
        pivotGroupTag,
        finaldata,
      });

      var lofdata = Math.ceil(postData.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = postData.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend,
          },
        })
          .then((data) => {
            // toast.success("data added");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Copydata request failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            });
            //  toast.error("copydata request failed");
          });
      }
    } else {
      originalRows.map((row) => {
        originalData.push(row);
        row.checkbox = false;
      });

      pivotRows.map((row) => {
        pivotGroupTag.push(row);
        row.checkbox = false;
      });

      let headerCheck = pivotGroupTag.find(
        (row) => row.guid === pivotRows[0].ParentGuid
      );
      if (headerCheck.clicked) {
        pivotRows.map((row) => {
          finaldata.push(row);
          row.checkbox = false;
        });
      }

      await this.setState({
        finaldata: finaldata.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
        pivotGroupTag: pivotGroupTag.sort(function (a, b) {
          var nameA = a.Position;
          var nameB = b.Position;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        }),
        originalData: originalData,
      });

      var lofdata = Math.ceil(originalRows.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = originalRows.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend,
          },
        })
          .then((data) => {
            // toast.success("data added");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Copydata request failed",
              message_heading: "Pivot Data",
              openMessageModal: true,
            });
            //  toast.error("copydata request failed");
          });
      }
    }
    await this.isLoading(false);
  };

  undoInsertColumn = async (guid) => {
    await this.isLoading(true);
    let { allcolumnsoftemp, selectedtempguid, templates, originalData } =
      this.state;
    let columnData = allcolumnsoftemp.find((column) => column.guid === guid);
    let allColumns = allcolumnsoftemp;

    if (columnData && columnData.guid) {
      let findColumnInFormula = allColumns.find(
        (column) =>
          column.Formula !== null &&
          column.Formula.toString().includes(columnData.guid) &&
          columnData.guid !== column.guid
      );
      let findColumn = allColumns.find(
        (column) => column.SelectedColumnGuid === columnData.guid
      );

      if (findColumnInFormula) {
        this.setState({
          message_desc:
            "There is a formula referenced to this template/column so it can’t be deleted. Remove from formula and try again.",
          message_heading: "Delete",
          openMessageModal: true,
        });
        return;
      } else if (findColumn) {
        this.setState({
          message_desc:
            "This column is referenced with other column. Try to remove this reference first.",
          message_heading: "Delete",
          openMessageModal: true,
        });
        return;
      } else {
        if (columnData && columnData.guid) {
          let deleteColumn = false;
          let selectedTempGuid = selectedtempguid;

          //call api here
          await API.post("pivot", "/deleteColumnByGuid", {
            body: {
              columnGuid: columnData.guid,
            },
          })
            .then(async (data) => {
              deleteColumn = true;
              // toast.success("Column Deleted Successfully");
            })
            .catch((err) => {
              this.setState({
                message_desc: "There is an Error while deleting Column",
                message_heading: "Column",
                openMessageModal: true,
              });
              // toast.error("There is an Error whileDeleting Column");
            });
          if (deleteColumn) {
            let selectedTemp = templates.find(
              (temp) => temp.guid === selectedTempGuid
            );
            let columns = selectedTemp.Columns;
            let filterdColumns = columns.filter((c) => c != columnData.guid);

            await API.post("pivot", "/updatefields", {
              body: {
                table: "PivotTemplates",
                guid: selectedTemp.guid,
                fieldname: "Columns",
                value: filterdColumns,
              },
            })
              .then(async (data) => {
                // toast.success("Template Updated Successfully.");
              })
              .catch((err) => {
                this.setState({
                  message_desc: "Template Not Updated!",
                  message_heading: "Template",
                  openMessageModal: true,
                });
                // toast.error("Template Not Updated!");
              });
          }

          var newArray = originalData;
          newArray.map((pod) => {
            if (pod.Type !== "Blank") {
              pod.Columns = pod.Columns.filter(
                (c) => c.ColumnGuid !== columnData.guid
              );
            }
          });
          var lofdata = Math.ceil(newArray.length / 20);
          for (var i = 0; i < lofdata * 20; i = i + 20) {
            var arraytosend = newArray.slice(i, i + 20);
            await API.post("pivot", "/copypivotdata", {
              body: {
                pivotdata: arraytosend,
              },
            })
              .then((data) => {
                // toast.success("data added");
              })
              .catch((err) => {
                this.setState({
                  message_desc: "Copydata request failed",
                  message_heading: "Pivot Data",
                  openMessageModal: true,
                });
                // toast.error("copydata request failed");
              });
          }

          await this.gettemplateanddata(selectedTempGuid);
          this.setState({
            allcolumnsoftemp,
            selectedtempguid,
            templates,
            originalData,
          });
        } else {
          this.setState({
            message_desc: "Column Guid Not Found!",
            message_heading: "Column",
            openMessageModal: true,
          });
          // toast.error("Column Guid Not Found!");
        }
      }
    }
    await this.isLoading(false);
  };

  undoCellChange = async (WORKTABLECHANGE) => {
    await this.isLoading(true);
    if (WORKTABLECHANGE) {
      let { originalData, pivotGroupTag } = this.state;
      let originalRow = originalData.find(
        (row) => row.guid === WORKTABLECHANGE.ROWGUID
      );
      let originalCell = originalRow.Columns.find(
        (cell) => cell.ColumnGuid === WORKTABLECHANGE.FROM.COLUMNGUID
      );
      let pivotRow = pivotGroupTag.find(
        (row) => row.guid === WORKTABLECHANGE.ROWGUID
      );
      let pivotCell = pivotRow.Columns.find(
        (cell) => cell.obj.ColumnGuid === WORKTABLECHANGE.FROM.COLUMNGUID
      );

      if (originalRow && originalCell && pivotRow && pivotCell) {
        originalCell.AmountValue = WORKTABLECHANGE.FROM.AMOUNTVALUE;
        originalCell.TextValue = WORKTABLECHANGE.FROM.TEXTVALUE;
        pivotCell.obj.AmountValue = WORKTABLECHANGE.FROM.AMOUNTVALUE;
        pivotCell.obj.TextValue = WORKTABLECHANGE.FROM.TEXTVALUE;

        this.setState({
          originalData,
          pivotGroupTag,
        });

        await this.applyColumnFormula();

        let parentRow = pivotGroupTag.find(
          (value) => value.guid === pivotRow.ParentGuid
        );
        if (parentRow) {
          await this.calculateData(parentRow);
        }

        API.post("pivot", "/updatefields", {
          body: {
            table: "PivotData",
            guid: originalRow.guid,
            fieldname: "Columns",
            value: originalRow.Columns,
          },
        })
          .then(async (data) => {
            // toast.success("Update Columns Successfully");
          })
          .catch((err) => {
            this.setState({
              message_desc: "Update Columns Error",
              message_heading: "Columns",
              openMessageModal: true,
            });
            // toast.error('Update Columns Error');
          });
      } else {
        this.setState({
          message_desc: "Undo worktable change failed.",
          message_heading: "Worktable",
          openMessageModal: true,
        });
        // toast.error("Undo worktable change failed.");
      }
    }
    await this.isLoading(false);
  };

  undoApplyGroup = async (
    obj,
    unobj,
    originalData,
    pivotGroupTag,
    pivotGroupTagHiddenRows,
    finaldata,
    pi,
    phr,
    od,
    fi,
    hiddenGroupNames,
    removeRowsIndexes
  ) => {
    var x = this.state.orderColumns.find(
      (u) => u.ColumnName.toUpperCase() == "GROUPS"
    );
    var groupguid = x.guid;
    var groupsary = obj.split(",");
    var Uncheckary = unobj.split(",");

    var p = pivotGroupTag;
    var originaldata = originalData;
    var f = finaldata;
    var ph = pivotGroupTagHiddenRows;

    fi.map((pushind) => {
      if (f[pushind]) {
        var tmp_obj = f[pushind].Columns.find(
          (d) => d.obj.ColumnGuid === groupguid
        );
        if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
          var psrval =
            tmp_obj.obj.AmountValue !== null && tmp_obj.obj.AmountValue !== ""
              ? tmp_obj.obj.AmountValue.split(",")
              : [];
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) === -1) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.AmountValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        } else {
          var psrval = tmp_obj.obj.TextValue.split(",");
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) < 0) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.TextValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        }
      }
    });

    pi.map((pushind) => {
      if (p[pushind]) {
        var tmp_obj = p[pushind].Columns.find(
          (d) => d.obj.ColumnGuid === groupguid
        );
        if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
          var psrval =
            tmp_obj.obj.AmountValue !== null && tmp_obj.obj.AmountValue !== ""
              ? tmp_obj.obj.AmountValue.split(",")
              : [];
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) === -1) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.AmountValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        } else {
          var psrval = tmp_obj.obj.TextValue.split(",");
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) < 0) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.TextValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        }
      }
    });

    phr.map((pushind) => {
      if (ph[pushind]) {
        var tmp_obj = ph[pushind].Columns.find(
          (d) => d.obj.ColumnGuid === groupguid
        );
        if (tmp_obj.obj.TextValue === null || tmp_obj.obj.TextValue === " ") {
          var psrval =
            tmp_obj.obj.AmountValue !== null && tmp_obj.obj.AmountValue !== ""
              ? tmp_obj.obj.AmountValue.split(",")
              : [];
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) === -1) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.AmountValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();

          let check = true;
          hiddenGroupNames.map((name) => {
            if (tmp_obj.obj.AmountValue.includes(name)) {
              check = false;
            }
          });
          if (check) {
            p.push(ph[pushind]);
            f.push(ph[pushind]);
            removeRowsIndexes.push(pushind);
          }
        } else {
          var psrval = tmp_obj.obj.TextValue.split(",");
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) < 0) {
              psrval.push(o);
            }
          });
          tmp_obj.obj.TextValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();

          let check = true;
          hiddenGroupNames.map((name) => {
            if (tmp_obj.obj.TextValue.includes(name)) {
              check = false;
            }
          });
          if (check) {
            p.push(ph[pushind]);
            f.push(ph[pushind]);
            removeRowsIndexes.push(pushind);
          }
        }
      }
    });

    od.map((pushind) => {
      if (originaldata[pushind]) {
        var tmp_obj = originaldata[pushind].Columns.find(
          (d) => d.ColumnGuid === groupguid
        );
        if (tmp_obj.TextValue === null || tmp_obj.TextValue === " ") {
          var psrval =
            tmp_obj.AmountValue !== null && tmp_obj.AmountValue !== ""
              ? tmp_obj.AmountValue.split(",")
              : [];
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) === -1) {
              psrval.push(o);
            }
          });
          tmp_obj.AmountValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        } else {
          var psrval = tmp_obj.TextValue.split(",");
          Uncheckary.map((o) => {
            if (psrval.indexOf(o) > -1) {
              delete psrval[psrval.indexOf(o)];
            }
          });
          groupsary.map((o) => {
            if (psrval.indexOf(o) < 0) {
              psrval.push(o);
            }
          });
          tmp_obj.TextValue = psrval
            .filter((l) => l !== "" && l != 0)
            .toString();
        }
      }
    });

    return pivotGroupTagHiddenRows;
  };

  undoHeaderTotal = async (data) => {
    await this.isLoading(true);
    let { originalData, pivotGroupTag, finaldata, allcolumnsoftemp } =
      this.state;
    let pivotHeaderIndex = pivotGroupTag.findIndex((row) => {
      return row.guid === data["HEADERGUID"];
    });
    let pivotTotalIndex = pivotGroupTag.findIndex((row) => {
      return row.guid === data["TOTALGUID"];
    });
    let chunkRows = [];
    let postData = [];
    let levelcol = allcolumnsoftemp.find(
      (column) => column.ColumnName.toUpperCase() === "LEVEL"
    );

    for (let i = pivotHeaderIndex + 1; i < pivotTotalIndex; i++) {
      chunkRows.push(pivotGroupTag[i]);
    }

    if (chunkRows.length > 0) {
      let headerParentGuid = pivotGroupTag[pivotHeaderIndex].ParentGuid;
      chunkRows.map((row) => {
        let gotarow = originalData.find((k) => k.guid === row.guid);

        if (row.ParentGuid === pivotGroupTag[pivotTotalIndex].ParentGuid) {
          row.ParentGuid = headerParentGuid;
          gotarow.ParentGuid = headerParentGuid;
          // postData.push(gotarow);
        }

        var h = row.Columns.find((j) => j.obj.ColumnGuid === levelcol.guid);
        if (h.obj.TextValue === " " || h.obj.TextValue === null) {
          h.obj.AmountValue = parseInt(h.obj.AmountValue) - 1;
        } else {
          h.obj.TextValue = parseInt(h.obj.TextValue) - 1;
        }

        // var gotarow = originalData.find((kp) => kp.guid === row.guid);
        if (gotarow !== undefined) {
          var h = gotarow.Columns.find((j) => j.ColumnGuid === levelcol.guid);
          if (h.TextValue === " " || h.TextValue === null) {
            h.AmountValue = parseInt(h.AmountValue) - 1;
          } else {
            h.TextValue = parseInt(h.TextValue) - 1;
          }
        }
        postData.push(gotarow);
      });

      var lofdata = Math.ceil(postData.length / 20);
      for (var i = 0; i < lofdata * 20; i = i + 20) {
        var arraytosend = postData.slice(i, i + 20);
        await API.post("pivot", "/copypivotdata", {
          body: {
            pivotdata: arraytosend,
          },
        })
          .then((data) => {
            // toast.success('data added');
          })
          .catch((err) => {
            this.setState({
              message_desc: "Copydata request failed.",
              message_heading: "Pivot Data",
              openMessageModal: true,
            });
            // toast.error('copydata request failed');
          });
      }
      originalData = originalData.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );
      pivotGroupTag = pivotGroupTag.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );
      finaldata = finaldata.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );

      let guids = [data["HEADERGUID"], data["TOTALGUID"]];
      var lofrows = Math.ceil(guids.length / 20);
      for (var i = 0; i < lofrows * 20; i = i + 20) {
        var arraytosend = guids.slice(i, i + 20);
        await API.post("pivot", "/deletepivotdata", {
          body: {
            guids: arraytosend,
          },
        })
          .then((data) => {
            // toast.success("Successfull deleted.");
          })
          .catch((data) => {
            this.setState({
              message_desc: "Rows failed to delete.",
              message_heading: "Rows",
              openMessageModal: true,
            });
            // toast.error("Rows failed to delete.")
          });
      }
    } else {
      originalData = originalData.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );
      pivotGroupTag = pivotGroupTag.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );
      finaldata = finaldata.filter(
        (row) =>
          row.guid !== data["HEADERGUID"] && row.guid !== data["TOTALGUID"]
      );

      let guids = [data["HEADERGUID"], data["TOTALGUID"]];
      var lofrows = Math.ceil(guids.length / 20);
      for (var i = 0; i < lofrows * 20; i = i + 20) {
        var arraytosend = guids.slice(i, i + 20);
        await API.post("pivot", "/deletepivotdata", {
          body: {
            guids: arraytosend,
          },
        })
          .then((data) => {
            // toast.success("Successfull deleted.")
          })
          .catch((data) => {
            this.setState({
              message_desc: "Rows failed to delete.",
              message_heading: "Rows",
              openMessageModal: true,
            });
            // toast.error("Rows failed to delete.")
          });
      }
    }

    await this.setState({
      originalData,
      pivotGroupTag,
      finaldata,
      isLoading: false,
    });
  };

  undoPasteRows = async (pivotRowData) => {
    await this.isLoading(true);
    let { originalData, pivotGroupTag, finaldata } = this.state;
    let postData = [];

    pivotRowData.map((item) => {
      let originalRow = originalData.find((row) => row.guid === item.GUID);
      let originalCell = originalRow.Columns.find(
        (cell) => cell.ColumnGuid === item.LEVELCOLUMNGUID
      );

      let pivotRow = pivotGroupTag.find((row) => row.guid === item.GUID);
      let pivotCell = pivotRow.Columns.find(
        (cell) => cell.obj.ColumnGuid === item.LEVELCOLUMNGUID
      ).obj;

      if (originalRow && originalCell && pivotRow && pivotCell) {
        originalRow.Position = item.POSITION;
        pivotRow.Position = item.POSITION;

        originalRow.ParentGuid = item.PARENTGUID;
        pivotRow.ParentGuid = item.PARENTGUID;

        originalCell.AmountValue = item.LEVELAMOUNTVALUE;
        pivotCell.AmountValue = item.LEVELAMOUNTVALUE;

        originalCell.TextValue = item.LEVELTEXTVALUE;
        pivotCell.TextValue = item.LEVELTEXTVALUE;

        postData.push(originalRow);
      }
    });

    await this.setState({
      finaldata: finaldata.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
      pivotGroupTag: pivotGroupTag.sort(function (a, b) {
        var nameA = a.Position;
        var nameB = b.Position;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      }),
      originalData: originalData,
    });

    var lofdata = Math.ceil(postData.length / 20);
    for (var i = 0; i < lofdata * 20; i = i + 20) {
      var arraytosend = postData.slice(i, i + 20);
      await API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then((data) => {
          // toast.success("data added");
        })
        .catch((err) => {
          this.setState({
            message_desc: "Copydata request failed.",
            message_heading: "Pivot Data",
            openMessageModal: true,
          });
          // toast.error("copydata request failed");
        });
    }
    await this.isLoading(false);
  };

  handleRedo = async () => {
    await this.removeCutRows();

    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Redo",
        Description: "[Worktable Action]",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "[Value From]",
        ValueTo: "[Value To]",
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);
  };

  handleRunReport = async () => {
    await this.removeCutRows();

    if (this.state.reportdata) {
      //await this.generatereport();
      await this.openModal("openReportsModal");
    } else {
      this.setState({
        message_heading: "Report",
        message_desc:
          "There are no report defaults for this template. Run report from slide out menu and add defaults.",
        openMessageModal: true,
      });
    }

    let dateTime = new Date().getTime();
    let templateName = this.state.templates.find(
      (template) => template.guid === this.state.selectedtempguid
    ).TemplateName;
    this.activityRecord([
      {
        User: localStorage.getItem("Email"),
        Datetime: dateTime,
        Module: "Icons",
        Description: "Report Run",
        ProjectName: this.state.selectedProject.Name,
        Projectguid: this.state.selectedProject.guid,
        ColumnName: "",
        ValueFrom: "",
        ValueTo: templateName,
        Tenantid: localStorage.getItem("tenantguid"),
      },
    ]);
  };

  refreshXeroToken = async () => {
    let { user } = this.state;

    if (
      user.XeroTokenObject &&
      user.XeroTokenObject.expires_at * 1000 < new Date().getTime()
    ) {
      await API.post("pivot", "/xerorefreshtoken", {
        body: {
          clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
          clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
          redirectUris: process.env.REACT_APP_XERO_APP_URL,
          scopes: process.env.REACT_APP_XERO_APP_SCOPES,
          token: user.XeroTokenObject,
        },
      })
        .then(async (token) => {
          await API.post("pivot", "/updatefields", {
            body: {
              table: "PivotUser",
              guid: user.guid,
              fieldname: "XeroTokenObject",
              value: token,
            },
          })
            .then(async () => {
              user.XeroTokenObject = token;
              await this.setState({
                user,
              });
            })
            .catch((err) => {
              toast.error("Xero token failed to assign to user.");
            });
        })
        .catch(async (myBlob) => {
          this.setState({
            message_desc: "Xero access has expired and needs to be renewed.",
            message_heading: "Xero Access",
            openMessageModal: true,
          });
          return false;
        });
    }
  };

  handleRefresh = async () => {
    let { user, selectedProject } = this.state;
    if (selectedProject.Connection === "XERO") {
      await this.setState({
        isLoading: true,
      });

      if (
        !user.XeroTokenObject ||
        user.XeroTokenObject === undefined ||
        user.XeroTokenObject === null
      ) {
        this.setState({
          message_desc:
            "User never connect with Xero. Kindly connect with xero first.",
          message_heading: "XERO",
          openMessageModal: true,
        });
        await this.setState({
          isLoading: false,
        });
        return false;
      } else if (
        !selectedProject.XeroDB ||
        selectedProject.XeroDB === undefined ||
        selectedProject.XeroDB === null
      ) {
        this.setState({
          message_desc:
            "This project didn't connect with any Xero company. Kindly connect with atleast one Xero company.",
          message_heading: "XERO",
          openMessageModal: true,
        });
        await this.setState({
          isLoading: false,
        });
        return false;
      }

      await this.openModal("openRefreshModal");
      await this.setState({
        isLoading: false,
      });
    } else {
      await this.setState({
        message_desc: "Refresh data be adding updated CSV file.",
        message_heading: "Refresh",
        openMessageModal: true,
      });
    }
  };

  Refreshapicall = async () => {
    let { user, selectedProject } = this.state;
    await this.setState({
      isLoading: true,
    });
    await this.refreshXeroToken();

    await API.post("pivot", "/xerogetaccounts", {
      body: {
        clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
        clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
        redirectUris: process.env.REACT_APP_XERO_APP_URL,
        scopes: process.env.REACT_APP_XERO_APP_SCOPES,
        token: user.XeroTokenObject,
        connectedXeroTenant: selectedProject.XeroDB.tenantId,
      },
    })
      .then(async (data) => {
        console.log("Refreshapicall", data);
        let filterOnlyExpenceAccount = data.response.body.Accounts.filter(
          (account) => account.Type === "EXPENSE"
        );

        // await this.setState({
        //   accounts: data.response.body.Accounts,
        // });

        await this.setState({
          accounts: filterOnlyExpenceAccount,
        });

        await this.handlingXeroAccounts();
        $("#closeRightSliderArrow").click();
      })
      .catch(async (myBlob) => {
        console.log(
          "xxxxxxxxxxxxxxxxxxx Connect to database to refresh data. - Refreshapicall",
          JSON.parse(JSON.stringify(user)),
          JSON.parse(JSON.stringify(selectedProject)),
          myBlob
        );
        this.setState({
          isLoading: false,
          message_desc: "Connect to database to refresh data.",
          message_heading: "XERO",
          openMessageModal: true,
        });
      });
  };

  handlingXeroAccounts = async () => {
    let {
      accounts,
      originalData,
      pivotGroupTag,
      finaldata,
      orderColumns,
      allcolumnsoftemp,
      selectedProject,
      selectedtempguid,
      templates,
    } = this.state;
    let accountColumnGuid = orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "ACCOUNT"
    ).guid;
    let desColumnGuid = orderColumns.find(
      (column) => column.ColumnName.toUpperCase() === "DESCRIPTION"
    ).guid;
    let sampleOriginalRow = originalData[0];
    let samplePivotRow = pivotGroupTag[pivotGroupTag.length - 1];
    let positionForNewRow = pivotGroupTag[pivotGroupTag.length - 1].Position;
    let parentGuidForNewRow = pivotGroupTag.find(
      (row) => row.ParentGuid === "root"
    ).guid;
    let affectedRows = [];
    let affectedRowsGuids = [];
    let selectedTemplate = templates.find(
      (template) => template.guid === selectedtempguid
    );

    accounts.map((account) => {
      if (
        (selectedTemplate && selectedTemplate.ExpenseOnly === false) ||
        account.Class === "EXPENSE"
      ) {
        let chartID = account.AccountID;
        let code = account.Code + "";
        let description = account.Name;
        let isAccountExist = false;

        originalData.find((row, index) => {
          let accountColumnCell = row.Columns.find(
            (cell) => cell.ColumnGuid === accountColumnGuid
          );
          let desColumnCell = row.Columns.find(
            (cell) => cell.ColumnGuid === desColumnGuid
          );

          // Case 1: Populates the chart id into any rows where the account code matches but no chart id exists (user added account manually to worktable).
          if (
            (accountColumnCell.TextValue !== undefined &&
              accountColumnCell.TextValue !== null &&
              accountColumnCell.TextValue !== "" &&
              accountColumnCell.TextValue !== " " &&
              accountColumnCell.TextValue.toString() === code) ||
            (accountColumnCell.AmountValue !== undefined &&
              accountColumnCell.AmountValue !== null &&
              accountColumnCell.AmountValue.toString() === code)
          ) {
            row.chartID = chartID;
            isAccountExist = true;
            desColumnCell.TextValue = description;
            affectedRows.push(row);
            return true;
          }
          // end

          // Case 2: Updates the account code where there is a chart id but the account code is different.
          else if (
            row.chartID !== null &&
            row.chartID !== undefined &&
            row.chartID !== ""
          ) {
            if (row.chartID === chartID) {
              if (
                accountColumnCell.TextValue !== undefined &&
                accountColumnCell.TextValue !== null &&
                accountColumnCell.TextValue !== "" &&
                accountColumnCell.TextValue !== " " &&
                accountColumnCell.TextValue.toString() !== code
              ) {
                // console.log('Case 2: TextValue');
                accountColumnCell.TextValue = code;
                desColumnCell.TextValue = description;
                console.log(
                  "desColumnCell.TextValue: ",
                  desColumnCell.TextValue
                );
                isAccountExist = true;
                affectedRows.push(row);
                return true;
              } else if (
                accountColumnCell.AmountValue !== undefined &&
                accountColumnCell.AmountValue !== null &&
                accountColumnCell.AmountValue !== "" &&
                accountColumnCell.AmountValue !== "0" &&
                accountColumnCell.AmountValue.toString() !== code
              ) {
                // console.log('Case 2: AmountValue', row.chartID);
                accountColumnCell.AmountValue = code;
                desColumnCell.AmountValue = description;
                console.log(
                  "desColumnCell.AmountValue: ",
                  desColumnCell.AmountValue
                );
                isAccountExist = true;
                affectedRows.push(row);
                return true;
              } else if (
                accountColumnCell.TextValue !== undefined &&
                accountColumnCell.TextValue !== null &&
                accountColumnCell.TextValue !== "" &&
                accountColumnCell.TextValue !== " " &&
                accountColumnCell.TextValue.toString() === code
              ) {
                isAccountExist = true;
                return true;
              } else if (
                accountColumnCell.AmountValue !== undefined &&
                accountColumnCell.AmountValue !== null &&
                accountColumnCell.AmountValue !== "" &&
                accountColumnCell.AmountValue !== "0" &&
                accountColumnCell.AmountValue.toString() === code
              ) {
                isAccountExist = true;
                return true;
              }
            }
          }

          //end

          // Case 3: Updates the account code where there is a chart id but the account code is different.
          if (index === originalData.length - 1 && !isAccountExist) {
            console.log("Case 3: ", isAccountExist, index);
            positionForNewRow = this.makeposition(positionForNewRow);
            let sampleOriginalRowColumns = sampleOriginalRow.Columns.map(
              (cell) => {
                let column = orderColumns.find(
                  (column) => column.guid === cell.ColumnGuid
                );
                return {
                  AmountValue: "0",
                  TextValue:
                    cell.ColumnGuid === accountColumnGuid
                      ? code
                      : cell.ColumnGuid === desColumnGuid
                      ? description
                      : null,
                  ColumnGuid: cell.ColumnGuid,
                };
              }
            );
            var rowObject = {
              TenantGuid: localStorage.getItem("tenantguid"),
              guid: uuidv1(),
              BusinessUnitGuid: selectedProject.guid,
              Columns: sampleOriginalRowColumns,
              Position: positionForNewRow,
              Type: "Detail",
              ParentGuid: parentGuidForNewRow,
              chartID: account.AccountID,
              newrow: true,
            };
            originalData.push(rowObject);
            affectedRows.push(rowObject);
          }
          // end
        });
      }
    });

    affectedRows.map((tempRow, affectedRowIndex) => {
      let affectedRow = JSON.parse(JSON.stringify(tempRow));
      let pivotRow = pivotGroupTag.find(
        (pivotRow) => affectedRow.guid === pivotRow.guid
      );
      let orgrow = originalData.find(
        (orgrow) => affectedRow.guid === orgrow.guid
      );
      if (pivotRow) {
        affectedRowsGuids.push(pivotRow.guid);
        /**
         * If any affectedRow{{originalData Row}} exists in pivotGroupTag then execute below code.
         * Changing account cell and charID in below code.
         */
        let affectedRowAccountCell = affectedRow.Columns.find(
          (cell) => cell.ColumnGuid === accountColumnGuid
        );
        let affectedRowDesCell = affectedRow.Columns.find(
          (cell) => cell.ColumnGuid === desColumnGuid
        );
        let pivotRowAccountCell = pivotRow.Columns.find(
          (rowCell) =>
            rowCell.obj.ColumnGuid === affectedRowAccountCell.ColumnGuid
        );
        pivotRowAccountCell.obj.TextValue = affectedRowAccountCell.TextValue;
        pivotRowAccountCell.obj.AmountValue =
          affectedRowAccountCell.AmountValue;
        let pivotRowDesCell = pivotRow.Columns.find(
          (rowCell) => rowCell.obj.ColumnGuid === affectedRowDesCell.ColumnGuid
        );
        pivotRowDesCell.obj.TextValue = affectedRowDesCell.TextValue;
        pivotRowDesCell.obj.AmountValue = affectedRowDesCell.AmountValue;
        pivotRow.chartID = affectedRow.chartID;
      } else if (orgrow || orgrow.newrow) {
        //condition for filter the group hidden rows
        /**
         * orgrow: If an affectedRow{{originalData Row}} doesn't exist in pivotGroupTag then find from originalData and use it's data to make pivotGroupTag Row
         *     This originalData row already exist and never created in accounts loop.
         * orgrow.newrow: If an affectedRow{{originalData Row}} doesn't exist in pivotGroupTag then find from originalData and use it's data to make pivotGroupTag Row
         *     This originalData row was created in accounts loop under condition 3.
         */
        let columns = [];
        orderColumns.map((column) => {
          let tabIndex = undefined;
          let affectedRowCell = affectedRow.Columns.find((cell, index) => {
            if (cell.ColumnGuid === column.guid) {
              tabIndex = index;
              return true;
            }
          });
          if (affectedRowCell) {
            columns.push({
              obj: {
                AmountValue: affectedRowCell.AmountValue,
                ColumnGuid: affectedRowCell.ColumnGuid,
                TextValue: affectedRowCell.TextValue,
                uniqueCellId: uuidv1(),
                tabId: tabIndex && tabIndex,
              },
            });
          }
        });
        let rowObject = {
          TenantGuid: affectedRow.TenantGuid,
          guid: affectedRow.guid,
          BusinessUnitGuid: affectedRow.BusinessUnitGuid,
          Columns: columns,
          Position: affectedRow.Position,
          Type: affectedRow.Type,
          ParentGuid: parentGuidForNewRow,
          chartID: affectedRow.chartID,
          isAccountEmpty: false,
          clicked: true,
          AmountValue: "0",
          checkzero: false,
          carrot: false,
          checkbox: false,
        };
        pivotGroupTag.push(rowObject);
        finaldata.push(rowObject);
        affectedRowsGuids.push(rowObject.guid);
      }
    });
    await this.DIColumns({
      accounts,
      originalData,
      pivotGroupTag,
      finaldata,
      orderColumns,
      allcolumnsoftemp,
      selectedProject,
      affectedRowsGuids,
    });

    await this.setState({
      originalData: originalData,
      pivotGroupTag: pivotGroupTag,
      finaldata: finaldata,
    });
  };

  DIColumns = async (data) => {
    let {
      pivotGroupTag,
      finaldata,
      orderColumns,
      originalData,
      allcolumnsoftemp,
      affectedRowsGuids,
    } = data;
    let DI_columns = allcolumnsoftemp.filter(
      (g) => g.Type === "DataIntegration"
    );
    await this.xeroTrackingCategories();

    await Promise.all(
      DI_columns.map(async (val, index) => {
        pivotGroupTag.map((row) => {
          // if (row.Type !== "Header" && row.Type !== "Total") {
          if (row.Type !== "Header") {
            row.Columns.map((cell) => {
              if (cell.obj.ColumnGuid === val.guid) {
                cell.obj.TextValue = null;
                cell.obj.AmountValue = "0";
              }
            });
          }
        });

        originalData.map((row) => {
          // if (row.Type !== "Header" && row.Type !== "Total") {
          if (row.Type !== "Header") {
            row.Columns.map((cell) => {
              if (cell.ColumnGuid === val.guid) {
                cell.TextValue = null;
                cell.AmountValue = "0";
              }
            });
          }
        });

        if (val.API[0].APICall !== "Purchase Order") {
          await this.ProfitAndLoss(data, val.guid, val.API);
        } else {
          await this.PurchaseOrder(data, val.guid, val.API);
        }
      })
    ).then(async (results) => {
      let affectedOriginalRows = originalData.filter((row) =>
        affectedRowsGuids.find((guid) => guid === row.guid)
      );

      await this.setState(
        {
          originalData,
          pivotGroupTag,
          finaldata,
        },
        async () => {
          Promise.all(
            ["0"].map(async (item) => {
              this.groupingLevelUnmutable(this.state.pivotGroupTag);
            })
          ).then(async () => {
            if (affectedOriginalRows) {
              let lofdata = Math.ceil(this.state.originalData.length / 20);
              for (let i = 0; i < lofdata * 20; i = i + 20) {
                let arraytosend = this.state.originalData.slice(i, i + 20);
                await API.post("pivot", "/copypivotdata", {
                  body: {
                    pivotdata: arraytosend,
                  },
                })
                  .then(() => {
                    if (i === lofdata * 20 - 20) {
                      // toast.success('Data replaced successfully.');
                    }
                  })
                  .catch((error) => {
                    this.setState({
                      message_desc: "Data didn't replaced successfully.",
                      message_heading: "Pivot Data",
                      openMessageModal: true,
                    });
                    // toast.error("Data didn't replaced successfully.");
                  });
              }
              await this.setState({
                catagories: [],
              });
            } else {
              // toast.info("Xero accounts didn't upload in database.");
            }
          });
        }
      );
    });
    await this.setState({
      catagories: [],
      isLoading: false,
    });
  };

  ProfitAndLoss = async (bdata, guid, api) => {
    debugger;
    var that = this;
    var guid = guid;
    //    var TrackingCat = "";
    //    var TrackingCatID = "";
    //    var TrackingCode = "";
    //    var TrackingCodeID = "";
    //    if (api.length > 0) {
    //      TrackingCat = api[0].TrackingCat
    //      TrackingCatID = api[0].TrackingCatID
    //      TrackingCode = api[0].TrackingCode
    //      TrackingCodeID = api[0].TrackingCodeID
    //    }
    var TrackingCat = "";
    var TrackingCatID = "";
    var TrackingCode = "";
    var TrackingCodeID = "";
    if (api.length > 0) {
      var catconfrm = this.state.catagories.find(
        (a) => a.TrackingCategoryID === api[0].TrackingCatID
      );
      if (catconfrm !== undefined) {
        TrackingCat = catconfrm !== undefined ? api[0].TrackingCat : null;
        TrackingCatID =
          catconfrm !== undefined ? catconfrm.TrackingCategoryID : null;
        var codeconfrm = catconfrm.Options.find(
          (h) => h.TrackingOptionID === api[0].TrackingCodeID
        );
        if (codeconfrm !== undefined) {
          TrackingCode = codeconfrm.Name;
          TrackingCodeID = codeconfrm.TrackingOptionID;
        } else {
          TrackingCode =
            api[0].TrackingCodeID === "All"
              ? "All"
              : api[0].TrackingCodeID === "Unassigned"
              ? "Unassigned"
              : null;
          TrackingCodeID =
            api[0].TrackingCodeID === "All"
              ? "All"
              : api[0].TrackingCodeID === "Unassigned"
              ? "Unassigned"
              : null;
        }
      } else {
        TrackingCat = null;
        TrackingCatID = null;
        TrackingCode = null;
        TrackingCodeID = null;
      }
    }

    ////for testing purposes
    //
    // TrackingCat= "Trevascus";
    //      TrackingCatID= "f6825551-fc62-4a8a-b7be-ddcaaf3efdbf";
    //      TrackingCode= "All";
    //      TrackingCodeID= "All";

    let { selectedProject, allcolumnsoftemp } = bdata;
    if (selectedProject.Connection === "XERO") {
      let { user } = this.state;
      let column = allcolumnsoftemp.find((column) => column.guid === guid);
      let toDate = undefined;
      let fromDate = undefined;
      let stringDate = column.ColumnName.slice(0, 10);
      if (stringDate && moment(stringDate, "YYYY-MM-DD", true).isValid()) {
        // fromDate = moment(moment(stringDate).subtract(365, "days")).add(1, "days")  // leapYear 366 normal year 365
        if (moment(stringDate).isLeapYear()) {
          // fromDate = moment(moment(stringDate).subtract(366, "days")).add(
          //   1,
          //   "days"
          // );
          fromDate = moment(stringDate).subtract(365, "days");
        } else {
          // fromDate = moment(moment(stringDate).subtract(365, "days")).add(
          //   1,
          //   "days"
          // );
          fromDate = moment(stringDate).subtract(364, "days");
        } // date range from = 2019-07-01 (Slice Date – 12 months + 1 day)
        toDate = moment(stringDate).format("YYYY-MM-DD"); // date range to = 2020-06-30 (Slice Date)
      } else {
        // fromDate = "";                                                                                  // date range to = “” (Blank)
        // toDate = "";                                                                                    // date range to = “” (Blank)

        // fromDate = moment().subtract(364, "days"); // old 29-07-2021
        if (moment().isLeapYear()) {
          // fromDate = moment().subtract(366, "days");
          fromDate = moment().subtract(365, "days");
        } else {
          // fromDate = moment().subtract(365, "days");
          fromDate = moment().subtract(364, "days");
        }
        toDate = moment().format("YYYY-MM-DD");
        fromDate = fromDate.format("YYYY-MM-DD");
      }
      // fromDate = moment().subtract(365, "days");
      // toDate = moment().format("YYYY-MM-DD");
      // fromDate = fromDate.format("YYYY-MM-DD");
      if (user.XeroTokenObject && selectedProject.XeroDB) {
        await API.post("pivot", "/xeroprofitandloss", {
          body: {
            clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
            clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
            redirectUris: process.env.REACT_APP_XERO_APP_URL,
            scopes: process.env.REACT_APP_XERO_APP_SCOPES,
            token: user.XeroTokenObject,
            connectedXeroTenant: selectedProject.XeroDB.tenantId,
            fromDate: fromDate,
            toDate: toDate,
            trackingCategoryID: TrackingCatID,
            trackingOptionID: TrackingCodeID,
          },
        })
          .then(async (data) => {
            console.log("Xero => Profit and loss => API response", data);

            if (data.response.body.Reports.length > 0) {
              var cellunassign = data.response.body.Reports[0].Rows.find(
                (j) => j.RowType === "Header"
              ).Cells.findIndex((a) => a.Value === "Unassigned");

              var sections = data.response.body.Reports[0].Rows.filter(
                (j) => j.RowType !== "Header" && j.Title !== ""
              );
              sections.map((sec) => {
                var onlydetialrow = [];
                onlydetialrow = sec.Rows.filter((r) => r.RowType === "Row");
                // console.log('onlydetialrow', onlydetialrow);
                var finalrows = [];
                if (TrackingCodeID === "Unassigned" && cellunassign > -1) {
                  onlydetialrow.map((s) => {
                    if (s.Cells[cellunassign].Value !== "0.00") {
                      finalrows.push(s);
                    }
                  });
                } else if (TrackingCodeID !== null || TrackingCatID === null) {
                  finalrows = onlydetialrow;
                }
                finalrows.map((s) => {
                  that.replace_valueinDI(
                    bdata,
                    s,
                    guid,
                    TrackingCodeID,
                    cellunassign
                  );
                });
              });
            }
          })
          .catch(async (myBlob) => {
            console.log("Xero => Profit and loss => Error.", myBlob);
            this.setState({
              message_desc:
                "Xero Profit and Loss data didn’t fetch successfully. Please try again.",
              message_heading: "XERO",
              openMessageModal: true,
            });
          });
      } else {
        console.log(
          "xxxxxxxxxxxxxxxxxxx Connect to database to refresh data. - ProfitAndLoss",
          JSON.parse(JSON.stringify(user)),
          JSON.parse(JSON.stringify(selectedProject))
        );
        this.setState({
          message_desc: "Connect to database to refresh data.",
          message_heading: "XERO",
          openMessageModal: true,
        });
      }
    }
  };

  replace_valueinDI = async (data, row, guid, TrackingCodeID, cellunassign) => {
    let { pivotGroupTag, originalData, allcolumnsoftemp, affectedRowsGuids } =
      data;
    let description = row.Cells[0];
    let value;
    if (TrackingCodeID === "Unassigned") {
      value = row.Cells[cellunassign];
    } else {
      value = row.Cells[row.Cells.length - 1];
    }
    let row_replace = pivotGroupTag.find(
      (f) => f.chartID === value.Attributes[0].Value
    );
    let row_replace_org = originalData.find(
      (f) => f.chartID === value.Attributes[0].Value
    );

    if (row_replace !== undefined) {
      let changeval = row_replace.Columns.find(
        (h) => h.obj.ColumnGuid === guid
      );

      if (changeval !== undefined) {
        changeval.obj.TextValue = value.Value;
      }
    }
    if (row_replace_org !== undefined) {
      let changevalorg = row_replace_org.Columns.find(
        (h) => h.ColumnGuid === guid
      );
      affectedRowsGuids.push(row_replace_org.guid);

      if (changevalorg !== undefined) {
        changevalorg.TextValue = value.Value;
      }
      // let header = pivotGroupTag.find(pivotRow => pivotRow.guid === row_replace_org.ParentGuid);
      // await this.applyColumnFormula();
      // await this.calculateData(header);
    }

    await this.setState({
      pivotGroupTag: pivotGroupTag,
      originalData: originalData,
      allcolumnsoftemp: allcolumnsoftemp,
    });
  };

  PurchaseOrder = async (bdata, guid, api) => {
    var that = this;

    var TrackingCat = "";
    var TrackingCatID = "";
    var TrackingCode = "";
    var TrackingCodeID = "";
    if (api.length > 0) {
      var catconfrm = this.state.catagories.find(
        (a) => a.TrackingCategoryID === api[0].TrackingCatID
      );
      if (catconfrm !== undefined) {
        TrackingCat = catconfrm !== undefined ? api[0].TrackingCat : null;
        TrackingCatID =
          catconfrm !== undefined ? catconfrm.TrackingCategoryID : null;
        var codeconfrm = catconfrm.Options.find(
          (h) => h.TrackingOptionID === api[0].TrackingCodeID
        );
        if (codeconfrm !== undefined) {
          TrackingCode = codeconfrm.Name;
          TrackingCodeID = codeconfrm.TrackingOptionID;
        } else {
          TrackingCode = null;
          TrackingCodeID = null;
        }
      } else {
        TrackingCat = null;
        TrackingCatID = null;
        TrackingCode = null;
        TrackingCodeID = null;
      }
    }
    let toDate = moment().format("YYYY-MM-DD");

    // let fromDate = moment().subtract(365, "days");
    let fromDate = moment();
    if (fromDate.isLeapYear()) {
      fromDate = moment().subtract(365, "days");
    } else {
      fromDate = moment().subtract(364, "days");
    }

    fromDate = fromDate.format("YYYY-MM-DD");
    let { selectedProject } = bdata;

    if (selectedProject.Connection === "XERO") {
      let { user } = this.state;
      let purchaseOrderCounter = 0;
      if (user.XeroTokenObject && selectedProject.XeroDB) {
        await API.post("pivot", "/xeropurchaseorders", {
          body: {
            clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
            clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
            redirectUris: process.env.REACT_APP_XERO_APP_URL,
            scopes: process.env.REACT_APP_XERO_APP_SCOPES,
            token: user.XeroTokenObject,
            connectedXeroTenant: selectedProject.XeroDB.tenantId,
            dateFrom: fromDate,
            dateTo: toDate,
          },
        })
          .then(async (data) => {
            console.log("Xero => Purchase Orders => API response", data);
            let { pivotGroupTag, originalData, allcolumnsoftemp } = that.state;

            if (data.response.body.PurchaseOrders.length > 0) {
              let purchaseOrder = [];
              let accountColumnGuid = allcolumnsoftemp.find(
                (column) => column.ColumnName.toUpperCase() === "ACCOUNT"
              ).guid;

              data.response.body.PurchaseOrders.map((pu) => {
                if (pu.Status !== "DELETED" && pu.Status !== "BILLED") {
                  pu.LineItems.map((k) => {
                    if (TrackingCat !== null && TrackingCatID !== null) {
                      if (TrackingCode == null && TrackingCodeID == null) {
                        if (api[0].TrackingCodeID === "All") {
                          let accountCode = k.AccountCode;
                          if (pu.LineAmountTypes === "Inclusive") {
                            var lineAmount = k.LineAmount - k.TaxAmount;
                          } else {
                            var lineAmount = k.LineAmount;
                          }
                          let chartID = undefined;

                          pivotGroupTag.map((row) => {
                            let accountCell = row.Columns.find(
                              (col) => col.obj.ColumnGuid === accountColumnGuid
                            );
                            if (
                              accountCell.obj.TextValue == accountCode ||
                              accountCell.obj.AmountValue == accountCode
                            ) {
                              chartID = row.chartID;
                            }
                          });
                          var alreadyexst = purchaseOrder.find(
                            (a) => a.AccountCode == accountCode
                          );
                          if (alreadyexst !== undefined) {
                            alreadyexst.LineAmount += lineAmount;
                          } else {
                            purchaseOrder.push({
                              LineAmount: lineAmount,
                              AccountCode: accountCode,
                              ChartID: chartID,
                            });
                          }
                        } else if (api[0].TrackingCodeID === "Unassigned") {
                          let trackingcodematch = true;
                          if (k.Tracking.length === 0) {
                            trackingcodematch = false;
                          } else {
                            var temp = k.Tracking.find(
                              (f) => f.TrackingCategoryID == TrackingCatID
                            );
                            if (temp == undefined) {
                              trackingcodematch = false;
                            }
                          }

                          if (trackingcodematch == false) {
                            //if(k.Tracking.length===0){
                            let accountCode = k.AccountCode;
                            if (pu.LineAmountTypes === "Inclusive") {
                              var lineAmount = k.LineAmount - k.TaxAmount;
                            } else {
                              var lineAmount = k.LineAmount;
                            }
                            let chartID = undefined;

                            pivotGroupTag.map((row) => {
                              let accountCell = row.Columns.find(
                                (col) =>
                                  col.obj.ColumnGuid === accountColumnGuid
                              );
                              if (
                                accountCell.obj.TextValue == accountCode ||
                                accountCell.obj.AmountValue == accountCode
                              ) {
                                chartID = row.chartID;
                              }
                            });
                            var alreadyexst = purchaseOrder.find(
                              (a) => a.AccountCode == accountCode
                            );
                            if (alreadyexst !== undefined) {
                              alreadyexst.LineAmount += lineAmount;
                            } else {
                              purchaseOrder.push({
                                LineAmount: lineAmount,
                                AccountCode: accountCode,
                                ChartID: chartID,
                              });
                            }
                            // }
                          }
                        }
                        /*else{
                                                             let accountCode = k.AccountCode;
                                         if(pu.LineAmountTypes==="Inclusive"){
                                          var lineAmount = k.LineAmount-k.TaxAmount;
                                             }else{
                                               var lineAmount = k.LineAmount  
                                             }
                                          let chartID = undefined;
                          
                                          pivotGroupTag.map(row => {
                                            let accountCell = row.Columns.find(col => col.obj.ColumnGuid === accountColumnGuid);
                                            if (accountCell.obj.TextValue == accountCode || accountCell.obj.AmountValue == accountCode) {
                                              chartID = row.chartID
                                            }
                                          });
                                          var alreadyexst = purchaseOrder.find(a => a.AccountCode == accountCode);
                                          if (alreadyexst !== undefined) {
                                            alreadyexst.LineAmount += lineAmount
                                          } else {
                                            purchaseOrder.push({
                                              "LineAmount": lineAmount,
                                              "AccountCode": accountCode,
                                              "ChartID": chartID
                                            });
                                          }
                                                        
                                                    }*/
                      } else {
                        //tracking code is selected

                        let trackingcodematch = false;
                        if (k.Tracking.length > 0) {
                          trackingcodematch = k.Tracking.find(
                            (f) =>
                              f.TrackingCategoryID === TrackingCatID &&
                              f.Option === TrackingCode
                          );
                          if (trackingcodematch !== undefined) {
                            let accountCode = k.AccountCode;

                            if (pu.LineAmountTypes === "Inclusive") {
                              var lineAmount = k.LineAmount - k.TaxAmount;
                            } else {
                              var lineAmount = k.LineAmount;
                            }
                            let chartID = undefined;

                            pivotGroupTag.map((row) => {
                              let accountCell = row.Columns.find(
                                (col) =>
                                  col.obj.ColumnGuid === accountColumnGuid
                              );
                              if (
                                accountCell.obj.TextValue == accountCode ||
                                accountCell.obj.AmountValue == accountCode
                              ) {
                                chartID = row.chartID;
                              }
                            });
                            var alreadyexst = purchaseOrder.find(
                              (a) => a.AccountCode == accountCode
                            );
                            if (alreadyexst !== undefined) {
                              alreadyexst.LineAmount += lineAmount;
                            } else {
                              purchaseOrder.push({
                                LineAmount: lineAmount,
                                AccountCode: accountCode,
                                ChartID: chartID,
                              });
                            }
                          }
                        }
                      }
                    } else {
                      let accountCode = k.AccountCode;
                      if (pu.LineAmountTypes === "Inclusive") {
                        var lineAmount = k.LineAmount - k.TaxAmount;
                      } else {
                        var lineAmount = k.LineAmount;
                      }
                      let chartID = undefined;

                      pivotGroupTag.map((row) => {
                        let accountCell = row.Columns.find(
                          (col) => col.obj.ColumnGuid === accountColumnGuid
                        );
                        if (
                          accountCell.obj.TextValue == accountCode ||
                          accountCell.obj.AmountValue == accountCode
                        ) {
                          chartID = row.chartID;
                        }
                      });
                      var alreadyexst = purchaseOrder.find(
                        (a) => a.AccountCode == accountCode
                      );
                      if (alreadyexst !== undefined) {
                        alreadyexst.LineAmount += lineAmount;
                      } else {
                        purchaseOrder.push({
                          LineAmount: lineAmount,
                          AccountCode: accountCode,
                          ChartID: chartID,
                        });
                      }
                    }
                  });
                }
              });
              this.replace_valPO(bdata, purchaseOrder, guid);
            }
          })
          .catch((error) => {
            console.log("Xero => Purchase Orders => Error", error);
            purchaseOrderCounter++;
            if (purchaseOrderCounter > 1) {
              purchaseOrderCounter = 0;
              this.setState({
                message_desc:
                  "Xero Purchase Orders didn’t fetch successfully. Please try again.",
                message_heading: "XERO",
                openMessageModal: true,
              });
            }
          });
      } else {
        console.log(
          "xxxxxxxxxxxxxxxxxxx Connect to database to refresh data. - PurchaseOrder",
          JSON.parse(JSON.stringify(user)),
          JSON.parse(JSON.stringify(selectedProject))
        );
        this.setState({
          message_desc: "Connect to database to refresh data.",
          message_heading: "XERO",
          openMessageModal: true,
        });
      }
      //      let header = this.state.pivotGroupTag.find(pivotRow => pivotRow.ParentGuid === "root");
      //      await this.applyColumnFormula();
      //      await this.calculateData(header);
    }
  };

  replace_valPO = async (data, purchaseOrder, guid) => {
    let { pivotGroupTag, originalData, affectedRowsGuids } = data;
    // let headers = [];

    purchaseOrder.map(async (order) => {
      if (order.ChartID) {
        let pivotRows = pivotGroupTag.find((row) => {
          if (row.chartID === order.ChartID) {
            return true;
          }
        });
        if (pivotRows) {
          let diCell = pivotRows.Columns.find(
            (col) => col.obj.ColumnGuid === guid
          );
          if (diCell) {
            if (
              diCell.obj.TextValue !== null &&
              diCell.obj.TextValue !== undefined &&
              diCell.obj.TextValue !== " "
            ) {
              diCell.obj.TextValue = order.LineAmount;
            } else if (
              diCell.obj.AmountValue !== null &&
              diCell.obj.AmountValue !== undefined
            ) {
              diCell.obj.AmountValue = order.LineAmount;
            }
          }
        }
        // headers.push(pivotGroupTag.find(pivotRow => pivotRow.guid === pivotRows.ParentGuid));

        let originalRows = originalData.find(
          (row) => row.chartID === order.ChartID
        );
        if (originalRows) {
          let diCell = originalRows.Columns.find(
            (col) => col.ColumnGuid === guid
          );
          affectedRowsGuids.push(originalRows.guid);
          if (diCell) {
            if (
              diCell.TextValue !== null &&
              diCell.TextValue !== undefined &&
              diCell.TextValue !== " "
            ) {
              diCell.TextValue = order.LineAmount;
            } else if (
              diCell.AmountValue !== null &&
              diCell.AmountValue !== undefined
            ) {
              diCell.AmountValue = order.LineAmount;
            }
          }
        }
        // let header = pivotGroupTag.find(
        //   (pivotRow) => pivotRow.guid === pivotRows.ParentGuid
        // );
        // await this.applyColumnFormula();
        // await this.calculateData(header);
      }
    });

    await this.setState({
      pivotGroupTag: pivotGroupTag,
      originalData: originalData,
    });
  };

  periodClose = async (guid) => {
    await this.isLoading(true);
    let {
      selectedProject,
      currentproject,
      projects,
      allcolumnsoftemp,
      originalData,
      pivotGroupTag,
      finaldata,
    } = this.state;

    selectedProject["periodcount"] += 1;
    currentproject["periodcount"] = selectedProject["periodcount"];
    projects.map((project) => project.guid === guid)["periodcount"] =
      selectedProject["periodcount"];

    await API.post("pivot", "/updatefields", {
      body: {
        table: "PivotBusinessUnit",
        guid: selectedProject.guid,
        fieldname: "periodcount",
        value: selectedProject["periodcount"],
      },
    })
      .then(async (data) => {
        // toast.success("Columns Updated Successfully.");
      })
      .catch((err) => {
        this.setState({
          message_desc: "Previous Period Failed!",
          message_heading: "Previous Period",
          openMessageModal: true,
        });
        // toast.error('Previous Period Failed!');
      });

    let columns = allcolumnsoftemp.filter(
      (col) => col.Type === "PreviousPeriod"
    );

    columns.map((previousColumn) => {
      if (previousColumn.SelectedColumnGuid !== null) {
        pivotGroupTag.map((pivotRow) => {
          if (pivotRow.Type !== "Header" && pivotRow.Type !== "Total") {
            let previousPeriodCell = pivotRow.Columns.find(
              (cell) => cell.obj.ColumnGuid === previousColumn.guid
            );
            let selectedColumnCell = pivotRow.Columns.find(
              (cell) =>
                cell.obj.ColumnGuid === previousColumn.SelectedColumnGuid
            );
            let selectedColumn = allcolumnsoftemp.find(
              (column) => column.guid === previousColumn.SelectedColumnGuid
            );
            let originalRow = originalData.find(
              (row) => row.guid === pivotRow.guid
            );
            let originalCell = originalRow.Columns.find(
              (cell) => cell.ColumnGuid === previousColumn.guid
            );
            let originalCellSelectedColumn = originalRow.Columns.find(
              (cell) => cell.ColumnGuid === selectedColumn.guid
            );
            let value = undefined;

            if (selectedColumnCell) {
              if (selectedColumn.Formula) {
                value = this.formulaCallback(
                  originalRow.guid,
                  selectedColumn.Formula
                );
                // console.log('formulaValue -------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:    ', value);
              } else {
                value =
                  selectedColumnCell.obj.TextValue === null ||
                  selectedColumnCell.obj.TextValue === " "
                    ? selectedColumnCell.obj.AmountValue
                    : selectedColumnCell.obj.TextValue;
              }
            } else {
              if (originalRow && selectedColumn.Formula) {
                value = this.formulaCallback(
                  originalRow.guid,
                  selectedColumn.Formula
                );
                // console.log('formulaValue -------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:    ', value);
              } else {
                value =
                  (originalCellSelectedColumn &&
                    originalCellSelectedColumn.TextValue === null) ||
                  originalCellSelectedColumn.TextValue === " "
                    ? originalCellSelectedColumn.AmountValue
                    : originalCellSelectedColumn.TextValue;
              }
            }

            if (previousPeriodCell) {
              previousPeriodCell.obj.TextValue =
                value === "0" || value === 0 || value === " " ? null : value;
              previousPeriodCell.obj.AmountValue = "0";
            }

            originalCell.TextValue =
              value === "0" || value === 0 || value === " " ? null : value;
            originalCell.AmountValue = "0";
          }
        });
      }
    });

    let entryColumns = allcolumnsoftemp.filter(
      (col) => col.Type.toUpperCase() === "ENTRY"
    );
    entryColumns.map((column) => {
      if (column.PeriodClear === true) {
        originalData.map((row) => {
          if (row.Type.toUpperCase() === "DETAIL") {
            row.Columns.find((cell) => {
              if (cell.ColumnGuid === column.guid) {
                cell.AmountValue = "0";
                cell.TextValue = null;
              }
            });
          }
        });

        pivotGroupTag.map((row) => {
          if (row.Type.toUpperCase() === "DETAIL") {
            row.Columns.find((cell) => {
              if (cell.obj.ColumnGuid === column.guid) {
                cell.obj.AmountValue = "0";
                cell.obj.TextValue = null;
              }
            });
          }
        });
      }
    });

    await this.setState({
      selectedProject,
      currentproject,
      projects,
      originalData,
    });
    await this.setState({
      pivotGroupTag,
      finaldata,
    });

    await this.applyColumnFormula();
    let headerRows = pivotGroupTag.filter(
      (row) => row.Type.toUpperCase() === "HEADER"
    );
    if (headerRows) {
      Promise.all(
        headerRows.map(async (header) => {
          await this.calculateData(header);
        })
      ).then(async () => {
        let lofdata = Math.ceil(originalData.length / 20);
        for (let i = 0; i < lofdata * 20; i = i + 20) {
          let arraytosend = originalData.slice(i, i + 20);
          await API.post("pivot", "/copypivotdata", {
            body: {
              pivotdata: arraytosend,
            },
          })
            .then((data) => {
              if (i + 20 == lofdata * 20) {
                // toast.success('data added.');
              }
            })
            .catch((err) => {
              this.setState({
                message_desc: "Copydata request failed.",
                message_heading: "Pivot Data",
                openMessageModal: true,
              });
              // toast.error('copydata request failed');
            });
        }

        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            User: localStorage.getItem("Email"),
            Datetime: dateTime,
            Module: "Period Close",
            Description: "Period Close",
            ProjectName: this.state.selectedProject.Name,
            Projectguid: this.state.selectedProject.guid,
            ColumnName: "",
            ValueFrom: "",
            ValueTo: "",
            Tenantid: localStorage.getItem("tenantguid"),
          },
        ]);
        await this.isLoading(false);
      });
    }
  };

  getDateTime = () => {
    const date = new Date();
    const dateTime =
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes();
    return dateTime;
  };

  activityRecord = async (finalarray) => {
    await API.post("pivot", "/addactivities", {
      body: {
        activities: finalarray,
      },
    })
      .then(async (data) => {
        // toast.success('Activity successfully recorded.')
      })
      .catch((err) => {
        this.setState({
          message_desc: "Activity failed to record.",
          message_heading: "Acitivity",
          openMessageModal: true,
        });
        // toast.error('Activity failed to record.')
      });
  };

  generatereport = async (temp = "", reportData = {}) => {
    await this.setState({
      isLoading: true,
    });

    this.removeCutRows();
    var finalreport = {};
    finalreport["Columns"] = {};
    this.state.orderColumns.map((column, index) => {
      finalreport["Columns"]["Col" + index] = column.ColumnName;
    });
    finalreport["ReportDetails"] = reportData;
    finalreport["Project"] = this.state.selectedProject;
    finalreport["Entity"] = this.state.user;
    var data = [];

    this.state.pivotGroupTag.map((pivotRow) => {
      var f_row = {
        Position: pivotRow.Position,
        Type: pivotRow.Type,
      };

      let row = pivotRow;
      if (pivotRow.Type.toUpperCase() === "TOTAL") {
        row = this.state.pivotGroupTag.find(
          (localPivotRow) => localPivotRow.guid === pivotRow.ParentGuid
        );
        if (row.clicked) {
          row = pivotRow;
        }
      }

      row.Columns.map((cell, index) => {
        if (
          cell.obj.TextValue == null ||
          cell.obj.TextValue == "" ||
          cell.obj.TextValue == " "
        ) {
          f_row["Col" + index] = cell.obj.AmountValue;
        } else {
          f_row["Col" + index] = cell.obj.TextValue;
        }
      });
      data.push(f_row);
    });

    finalreport["Data"] = data;
    if (temp === "") {
      await this.getReportdata(this.state.editTemplateModal.guid);
    } else {
      await this.getReportdata(temp);
    }
    var layout = this.state.reportdata[0].LayoutGuid;
    var filename = this.state.reportdata[0].LayoutGuid;
    await API.post("pivot", "/getlayoutfile", {
      body: {
        guid: layout,
      },
    })
      .then(async (data) => {
        filename = data.Filename;
      })
      .catch((s) => {});
    await this.setState({
      isLoading: false,
    });
    var dataaaaa = JSON.stringify(finalreport);
    localStorage.setItem("getreport", dataaaaa);
    var path =
      window.location.protocol +
      "//" +
      window.location.host +
      "/reportpdf?file=" +
      filename;
    window.open(path, "_blank");
  };

  updateDataOnAddEditColumn = async ({
    columnData = undefined,
    guids = [],
  }) => {
    // await this.getTemplates()
    // await this.allColumnsOfTemplates();
    let {
      allcolumnsoftemp,
      columns,
      orderColumns,
      editTemplateModal,
      templates,
      selectedtempguid,
      originalData,
    } = this.state;
    let clearedValues = undefined;

    if (columnData) {
      allcolumnsoftemp = allcolumnsoftemp.filter(
        (column) => column.guid !== columnData.guid
      );
      allcolumnsoftemp.push(columnData);

      if (guids.length > 0) {
        columns = [];
        orderColumns = [];

        guids.map((guid) => {
          let column = allcolumnsoftemp.find((column) => column.guid === guid);
          if (column) {
            columns.push(column);
            orderColumns.push(column);
          }
        });

        editTemplateModal.Columns = guids;
        let selectedTemplate = templates.find(
          (template) => template.guid === selectedtempguid
        );
        if (selectedTemplate) {
          selectedTemplate.Columns = guids;
        }

        await this.setState({
          allcolumnsoftemp,
          columns,
          orderColumns,
          editTemplateModal,
          templates,
        });
        await this.headerColumnsInOrder();
        clearedValues = this.clearCalculationValues(
          originalData,
          allcolumnsoftemp
        );
        this.setState({
          updatedOriginalRows: clearedValues.updatedOriginalRows,
        });
        originalData = JSON.parse(JSON.stringify(clearedValues.originalData));
        await this.orderPivotData(originalData);
      } else {
        let column = columns.find((column) => column.guid === columnData.guid);
        if (column) {
          column.ColumnName = columnData.ColumnName;
          column.Width = columnData.Width;
          column.Alignment = columnData.Alignment;
          column.Hide = columnData.Hide;
        }

        let column1 = orderColumns.find(
          (column) => column.guid === columnData.guid
        );
        if (column1) {
          column1.ColumnName = columnData.ColumnName;
          column1.Width = columnData.Width;
          column1.Alignment = columnData.Alignment;
          column1.Hide = columnData.Hide;
        }

        await this.setState({
          allcolumnsoftemp,
          columns,
          orderColumns,
        });
      }
    }
  };

  clearCalculationValues = (originalData, allcolumnsoftemp) => {
    let calculatedColumns = allcolumnsoftemp.filter(
      (column) => column.Type.toUpperCase() === "CALCULATION"
    );
    let updatedOriginalRows = [];

    originalData.map((row) => {
      let check = undefined;
      let isUpdatedRow = false;
      row.Columns.map((cell) => {
        check = calculatedColumns.find(
          (calculatedColumn) => calculatedColumn.guid === cell.ColumnGuid
        );
        if (check) {
          if (!(cell.AmountValue === "0" && cell.TextValue === null)) {
            cell.AmountValue = "0";
            cell.TextValue = null;

            isUpdatedRow = true;
          }
        }
      });
      if (isUpdatedRow) {
        updatedOriginalRows.push(row);
      }
    });

    console.log("updatedOriginalRows----------------", updatedOriginalRows);
    return {
      originalData: originalData,
      updatedOriginalRows: updatedOriginalRows,
    };
  };

  apiCopyPivotData = ({ originalData = [], endFunction = undefined }) => {
    let lofdata = Math.ceil(originalData.length / 20);
    for (let i = 0; i < lofdata * 20; i = i + 20) {
      let arraytosend = originalData.slice(i, i + 20);
      API.post("pivot", "/copypivotdata", {
        body: {
          pivotdata: arraytosend,
        },
      })
        .then(() => {
          if (i === lofdata * 20 - 20) {
            if (typeof endFunction === "function") {
              endFunction();
            }
            // toast.success('Data replaced successfully.');
          }
        })
        .catch((error) => {
          this.setState({
            message_desc: "Data didn't replaced successfully.",
            message_heading: "Pivot Data",
            openMessageModal: true,
          });
        });
    }
  };

  removeState = (keys) => {
    let state = this.state;
    keys.map((key) => delete state[key]);
    this.setState(state);
  };

  onDeleteColumnLoadTable = async (columnguid) => {
    let { allcolumnsoftemp, editTemplateModal, columns } = this.state;
    if (columnguid) {
      allcolumnsoftemp = allcolumnsoftemp.filter(
        (column) => column.guid !== columnguid
      );
      editTemplateModal.Columns = editTemplateModal.Columns.filter(
        (guid) => guid !== columnguid
      );
      columns = columns.filter((column) => column.guid !== columnguid);
    }
    await this.setState({
      allcolumnsoftemp,
      columns,
      editTemplateModal,
    });
    await this.headerColumnsInOrder();
    let originalData = JSON.parse(JSON.stringify(this.state.originalData));
    await this.orderPivotData(originalData);
  };

  getTemplateDataOnChange = async (guid) => {
    await this.getTemplateByGuid(guid);

    var columns = [];
    var guids = this.state.editTemplateModal.Columns;

    // columns = await this.getColumnByTemplateGuidcall(guids);
    guids.map((guid) => {
      let column = this.state.allcolumnsoftemp.find(
        (column) => column.guid === guid
      );
      if (column) {
        columns.push(column);
      }
    });
    await this.setState({
      columns: columns,
    });

    await this.headerColumnsInOrder();
    let originalData = JSON.parse(JSON.stringify(this.state.originalData));
    await this.orderPivotData(originalData);
  };

  render() {
    // console.log(this.state.finaldata,'orderColumnsorderColumnsorderColumns')

    var x;
    let { selectedProject } = this.state;

    return (
      <div className="container-fluid pr-4">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="se-pre-con d-none" id="isLoading"></div>

        <div id="wrapper">
          <nav
            className="navbar navbar-inverse fixed-top"
            id="sidebar-wrapper"
            role="navigation"
          >
            <ul className="nav sidebar-nav">
              <li>
                <img
                  src="/images/s1.png"
                  alt=""
                  className="img-fluid float-left sid-img"
                />

                <Link
                  to={{
                    pathname: "/projects",
                    state: { from: this.props.location.pathname },
                  }}
                >
                  Projects
                </Link>
              </li>

              <li onClick={() => this.openModal("openProfileModal")}>
                <img
                  alt=""
                  src="/images/s3.png"
                  className="img-fluid float-left sid-img"
                />

                <Link to="#events">Profile</Link>
              </li>

              <li>
                <img
                  alt=""
                  src="/images/2/Group 946.png"
                  className="img-fluid float-left sid-img"
                />

                <Link to="#events">Help</Link>
              </li>

              <li onClick={this.logout}>
                <img
                  alt=""
                  src="/images/s2.png"
                  className="img-fluid float-left sid-img"
                />

                <Link to="#login">Logout</Link>
              </li>
            </ul>
          </nav>

          <div id="page-content-wrapper">
            <button
              type="button"
              className="hamburger animated fadeInLeft is-closed p-0"
              data-toggle="offcanvas"
            >
              <img src="/images/menu.svg" className="img-fluid" alt="menu" />
              {/* <span className="hamb-top"></span>

          <span className="hamb-middle"></span>

          <span className="hamb-bottom"></span> */}
            </button>
          </div>
        </div>

        <div id="wrapper2">
          <div id="closeRightSlider" className="overlay2"></div>

          <nav
            className="navbar navbar-inverse fixed-top2"
            id="sidebar-wrapper2"
            role="navigation"
          >
            <div className="cus-code">
              <div className="px-3">
                <p className="tre-group">
                  <b>Worktable Options</b>
                </p>

                {this.state.currentproject &&
                this.state.currentproject.Connection === "XERO" ? (
                  <div
                    className="p_bootom"
                    onKeyUp={(e) =>
                      e.keyCode === 13 ? this.openModal("openRefreshModal") : ""
                    }
                    // onClick={() => this.openModal("openRefreshModal")}
                    onClick={() => this.handleRefresh()}
                  >
                    <div
                      id="refresh_modal_btn"
                      className="dash_modal_btn"
                      tabIndex="111101"
                    >
                      <span className="fa fa-refresh float-left pr-2 mt-1"></span>
                      Refresh
                    </div>

                    <div className="clearfix"></div>
                  </div>
                ) : (
                  <></>
                )}

                {/* <div

                  className="p_bootom"
                  onKeyUp={(e) => e.keyCode === 13 ? this.openModal("openRefreshModal") : ""}
                  //  onClick={() => this.openModal("openRefreshModal")}
                  onClick={() => this.xeroAccountsCase2()}

                  >

                  <div id="refresh_modal_btn" className="dash_modal_btn" tabIndex="111101">

                    <span className="fa fa-refresh float-left pr-2 mt-1"></span>

                    Example

                  </div>

                  <div className="clearfix"></div>

                  </div> */}

                <div className="dash_add_layout p_bootom">
                  <div className="float-left font-weight-bold mons-bold">
                    Templates
                  </div>
                  <div className="float-right">
                    <img
                      tabIndex="111103"
                      onClick={this.openEditModalHandler}
                      onKeyUp={(e) =>
                        e.keyCode === 13 ? this.openEditModalHandler() : ""
                      }
                      id="edit_template_sidebar"
                      alt="edit"
                      src="/images/p2.png"
                      className="img-fluid float-right mr-2 point-c"
                    />

                    <img
                      tabIndex="111102"
                      onClick={() => this.openModal("openAddTemplateModal")}
                      onKeyUp={(e) =>
                        e.keyCode === 13
                          ? this.openModal("openAddTemplateModal")
                          : ""
                      }
                      alt="add"
                      src="/images/p3.png"
                      className="img-fluid float-right mr-2 point-c"
                    />
                  </div>
                </div>

                <div className="clearfix"></div>

                <div className="form-group dash_select">
                  <Select
                    tabIndex="111104"
                    className="width-selector"
                    id="templates_focus"
                    onChange={this.handleSelectChange}
                    defaultValue={{
                      label: this.state.templateselectvalue,

                      value: this.state.templateselectvalue,
                    }}
                    value={{
                      label: this.state.templateselectvalue,

                      value: this.state.templateselectvalue,
                    }}
                    classNamePrefix="dash_width-selector-inner"
                    options={this.state.options}
                    theme={(theme) => ({
                      ...theme,

                      border: 0,

                      borderRadius: 0,

                      colors: {
                        ...theme.colors,

                        primary25: "#f2f2f2",

                        primary: "#f2f2f2",
                      },
                    })}
                  />

                  <div className="text-danger error-12">
                    {this.state.formErrors.editTemplateModal !== ""
                      ? this.state.formErrors.editTemplateModal
                      : ""}
                  </div>
                </div>

                <p className="mb-1">Exclude</p>

                <div className="r-c-style">
                  <p>
                    <label className="dash_container dash_remember">
                      Zero Rows
                      <input
                        type="checkbox"
                        id="exclude_tab"
                        name="check_zero_rows"
                        checked={this.state.check_zero_rows}
                        onChange={(e) =>
                          this.handleChangeCheckbox(
                            "check_zero_rows",

                            e.target.checked
                          )
                        }
                      />
                      <span className="dash_checkmark"></span>
                    </label>
                  </p>

                  <p>
                    <label className="dash_container dash_remember">
                      Blank Rows
                      <input
                        type="checkbox"
                        name="check_blank_row"
                        checked={this.state.check_blank_row}
                        onChange={(e) =>
                          this.handleChangeCheckbox(
                            "check_blank_row",

                            e.target.checked
                          )
                        }
                      />
                      <span className="dash_checkmark"></span>
                    </label>
                  </p>

                  <p>
                    <label className="dash_container dash_remember">
                      Hidden Columns
                      <input
                        type="checkbox"
                        name="check_hidden_columns"
                        checked={this.state.check_hidden_columns}
                        onChange={(e) =>
                          this.handleChangeCheckbox(
                            "check_hidden_columns",

                            e.target.checked
                          )
                        }
                      />
                      <span className="dash_checkmark"></span>
                    </label>
                  </p>

                  <p>
                    <label className="dash_container dash_remember">
                      Headings & Totals
                      <input
                        type="checkbox"
                        name="check_heading_totals"
                        checked={this.state.check_heading_totals}
                        onChange={(e) =>
                          this.handleChangeCheckbox(
                            "check_heading_totals",

                            e.target.checked
                          )
                        }
                      />
                      <span className="dash_checkmark"></span>
                    </label>
                  </p>
                </div>

                <div className="p_bootom">
                  {" "}
                  <button
                    type="button"
                    onClick={this.applyExcludeHandler}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13) {
                        e.stopPropagation();
                        this.applyExcludeHandler();
                      }
                    }}
                    id="apply-d"
                    className="dash_modal_btn2 mb-2 mt-3"
                  >
                    {" "}
                    Apply{" "}
                  </button>
                  <div className="clearfix"></div>
                </div>
              </div>

              <hr className="mt-0" />

              <div
                className="px-3 dash_report_top dashSideTabs"
                id="dSide_111109"
                tabIndex="111109"
              >
                <div className="form-group dash_select dash_font_border">
                  <label>Font</label>

                  <Select
                    className="width-selector"
                    defaultValue={{
                      label: this.state.fontsizetemplate,

                      value: this.state.fontsizetemplate,
                    }}
                    value={{
                      label: this.state.fontsizetemplate,

                      value: this.state.fontsizetemplate,
                    }}
                    onChange={this.changefont}
                    classNamePrefix="dash_width-selector-inner"
                    options={this.state.fontOptions}
                    theme={(theme) => ({
                      ...theme,

                      border: 0,

                      borderRadius: 0,

                      colors: {
                        ...theme.colors,

                        primary25: "#f2f2f2",

                        primary: "#f2f2f2",
                      },
                    })}
                  />
                </div>
              </div>

              <div
                className="dashSideTabs"
                id="dSide_111110"
                tabIndex="111110"
                onClick={() => this.openModal("openReportsModal")}
              >
                <p className=" sid-bar-nav px-3">
                  Reports{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
              </div>
              <div
                className="dashSideTabs"
                id="dSide_111111"
                tabIndex="111111"
                onClick={() => this.openModal("openPeriodCloseModal")}
              >
                <p className=" sid-bar-nav px-3">
                  Period Close
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
              </div>

              <div
                className="dashSideTabs"
                id="dSide_111112"
                tabIndex="111112"
                onClick={this.getGroupsHandler}
              >
                <p className=" sid-bar-nav px-3">
                  Groups List{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
              </div>

              <div
                className="dashSideTabs"
                id="dSide_111113"
                tabIndex="111113"
                onClick={(e) => this.goToActivity(e)}
              >
                <p className=" sid-bar-nav px-3">
                  Activity Log{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
              </div>
              <div
                className="dashSideTabs"
                id="dSide_111114"
                tabIndex="111114"
                onClick={this.exportdata}
              >
                <p className=" sid-bar-nav px-3">
                  Export{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
              </div>
              <div
                className="dashSideTabs"
                id="dSide_111115"
                tabIndex="111115"
                onClick={this.ImportModalHandler}
              >
                <p className=" sid-bar-nav px-3 pad-b-0">
                  Import{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
                {/* <input className="d-none" id="csv_pad" type="file" onChange={this.importexcel} /> */}
                <input
                  className="d-none"
                  id="csv_pad"
                  type="file"
                  onChange={this.importExcelValidation}
                />
              </div>

              {/* <div className="form-group">

                <div className="row no-gutters input-group mb-2">

                  <div className="dash_form_upload_message col-12">


                    <div
                      className="dashSideTabs"
                      tabIndex="111116"
                      id="dSide_111116"
                    >
                      <input id="csv_pad" type="file" onChange={this.importexcel} />
                      <label id="csv_pad_label" htmlFor="csv_pad" className="d-block">Paste Pad</label>
                    </div>


                  </div>






                  <div onClick={this.onImportArrow} className="input-group-prepend dash_paste_btn" style={{ zIndex: "11111" }}>

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

              {/* {
                    this.state.currentproject && this.state.currentproject.Connection === "CSV" ? 
                        <div
                            className="dashSideTabs"
                            id="dSide_111117"
                            tabIndex="111117"
                            onClick={this.CsvModalHandler}>
                            <p className="sid-bar-nav px-3 mb-2 pad-b-5">

                              CSV{" "}

                              <img

                                alt="edit"

                                src="/images/2/Group 331.png"

                                className="img-fluid mt-1 float-right pr-3"

                              />

                            </p>
                            <input className="d-none" type="file" id="import_pad" onChange={this.importcsvfinal} />
                          </div> :  <></>
                } */}

              <div
                className="dashSideTabs"
                id="dSide_111117"
                tabIndex="111117"
                onClick={this.CsvModalHandler}
              >
                <p className="sid-bar-nav px-3 mb-2 pad-b-5">
                  CSV{" "}
                  <img
                    alt="edit"
                    src="/images/2/Group 331.png"
                    className="img-fluid mt-1 float-right pr-3"
                  />
                </p>
                <input
                  className="d-none"
                  type="file"
                  id="import_pad"
                  onChange={this.importcsvfinal}
                />
              </div>

              {/* <div className="form-group mb-0">

                <div className="row no-gutters input-group mt-1">

                  <div className="dash_form_upload_message col-12">
                    <div
                      className="dashSideTabs"
                      id="dSide_111118"
                      tabIndex="111118"
                    >

                      <input type="file" id="import_pad" onChange={this.importcsvfinal} />

                      <label id="paste_pad_label" htmlFor="import_pad" className="d-block">Paste Pad</label>

                    </div>

                  </div>

                  <div onClick={this.onCsvArrow} className="input-group-prepend dash_paste_btn" style={{ zIndex: "11111" }}>

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
            </div>

            {/* <ul className="nav sidebar-nav2">

             <li onClick={() => this.openModal('openReportsModal')}><img  src='/images/2/Group 946.png' className="img-fluid float-left sid-img" /><p>Reports</p></li>

             <li onClick={() => this.openModal('openPeriodCloseModal')}><img src='/images/2/Group 946.png' className="img-fluid float-left sid-img" />Period Close</li>

             <li onClick={() => this.openModal('openGroupListModal')}><img src='/images/2/Group 946.png' className="img-fluid float-left sid-img" /><Link to="#events">Groups List</Link></li>

             <li><img src='/images/2/Group 946.png' className="img-fluid float-left sid-img" /><Link to="/activity">Activity Log</Link></li>

             <li><img src='/images/2/Group 946.png' className="img-fluid float-left sid-img" /><Link to="#export">Export</Link></li>

             <li onClick={() => this.openModal('openImportModal')}><img src='/images/2/Group 946.png' className="img-fluid float-left sid-img" /><Link to="#import">Import</Link></li>

           </ul> */}
          </nav>

          <div id="page-content-wrapper2">
            {this.state.disableUser ? (
              <></>
            ) : (
              <button
                type="button"
                className="hamburger2 animated fadeInLeft is-closed2"
                data-toggle="offcanvas2"
                id="closeRightSliderArrow"
              >
                <img
                  alt=""
                  src="/images/2/Group 331.png"
                  className="img-fluid float-left"
                />
              </button>
            )}
          </div>
        </div>

        <div className="main-head" id="dash_header_nav">
          <div className="row">
            <div className="col-12 col-lg-3 col-md-2 col-sm-5 pl-60">
              <Link className="navbar-brand " to="#">
                {" "}
                <img
                  src="/images/pivot.png"
                  className="float-right"
                  alt="Logo"
                />
              </Link>
            </div>

            <div className="col-12 col-lg-6 col-md-6 col-sm-12 text-center">
              <div className="icon-fa">
                {!this.state.disableUser ? (
                  <>
                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 3 ? e.Desc : ""
                        )
                      }
                    >
                      <a>
                        {" "}
                        <img
                          onClick={this.handleUndo}
                          src="/images/2/Group -56.png"
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    {/* ny codes */}
                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={"Reclac"}
                    >
                      <a>
                        <img
                          onClick={this.recalc}
                          src={recalcimg}
                          className="img-fluid fa"
                          alt="Recalc"
                        />
                      </a>
                    </Tooltip>

                    {/* ny codes */}

                    {/* <Tooltip delayShow={1000} placement="top" trigger="hover" tooltip={this.state.required_tips && this.state.required_tips.map(e => e.ID == 4 ? e.Desc : '')}>

                      <a>

                        {" "}

                      <img

                        onClick={this.handleRedo}

                        src="/images/2/Group -55.png"

                        className="img-fluid fa"

                        alt=""

                        />

                      </a>

                      </Tooltip> */}

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 5 ? e.Desc : ""
                        )
                      }
                    >
                      <a onClick={this.checkBetweenHandler}>
                        {" "}
                        <img
                          src="/images/2/Group 401.png"
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 6 ? e.Desc : ""
                        )
                      }
                    >
                      <a onClick={this.insertRowHandler}>
                        {" "}
                        <img
                          src="/images/2/Group 62.png"
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 7 ? e.Desc : ""
                        )
                      }
                    >
                      <a>
                        {" "}
                        <img
                          onClick={this.onDeleteRow}
                          src="/images/2/Group 82.png"
                          className="img-fluid fa del_imgg"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 8 ? e.Desc : ""
                        )
                      }
                    >
                      <img
                        onClick={this.clickgroups}
                        src="/images/1/Path 128.png"
                        className="img-fluid fa group_imgg"
                        alt=""
                      />
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 9 ? e.Desc : ""
                        )
                      }
                    >
                      <a>
                        {" "}
                        <img
                          src="/images/1/Path 45.png"
                          onClick={this.insertHeaderTotal}
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 10 ? e.Desc : ""
                        )
                      }
                    >
                      <a>
                        {" "}
                        <img
                          onClick={this.cutRows}
                          src="/images/1/Path 48.png"
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 11 ? e.Desc : ""
                        )
                      }
                    >
                      <a>
                        {" "}
                        <img
                          onClick={this.pasteRow}
                          src="/images/2/Group 344.png"
                          className="img-fluid fa"
                          alt=""
                        />
                      </a>
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 12 ? e.Desc : ""
                        )
                      }
                    >
                      <img
                        onClick={() => {
                          this.removeCutRows();
                          this.openModal("openFilterModal");
                        }}
                        src="/images/1/Path 50.png"
                        className="img-fluid fa"
                        alt=""
                      />
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 13 ? e.Desc : ""
                        )
                      }
                    >
                      <img
                        onClick={this.openAddEditModal}
                        src="/images/1/Path 129.png"
                        className="img-fluid fa"
                        alt=""
                      />
                    </Tooltip>

                    <Tooltip
                      delayShow={1000}
                      placement="top"
                      trigger="hover"
                      tooltip={
                        this.state.required_tips &&
                        this.state.required_tips.map((e) =>
                          e.ID == 14 ? e.Desc : ""
                        )
                      }
                    >
                      <img
                        onClick={() => {
                          this.removeCutRows();
                          this.openModal("openShareModal");
                        }}
                        src="/images/2/Group 867.png"
                        className="img-fluid fa"
                        alt=""
                      />
                    </Tooltip>
                  </>
                ) : (
                  <></>
                )}
                <Tooltip
                  delayShow={1000}
                  placement="top"
                  trigger="hover"
                  tooltip={
                    this.state.required_tips &&
                    this.state.required_tips.map((e) =>
                      e.ID == 15 ? e.Desc : ""
                    )
                  }
                >
                  <img
                    onClick={this.handleRunReport}
                    src="/images/2/Group 868.png"
                    className="img-fluid fa"
                    alt=""
                  />
                </Tooltip>
              </div>
            </div>

            <div
              style={{ marginTop: "3px" }}
              className="col-12 col-lg-3 col-md-4 col-sm-7 text-right"
            >
              <div className="dash_user_profile_head">
                <Link to="/projects" className="goToDash">
                  <Tooltip
                    delayShow={1000}
                    placement="bottom"
                    trigger="hover"
                    tooltip={"Projects"}
                  >
                    {/*<img

                      src="/images/2/Group -390.png"

                      className="img-fluid"

                      alt="Edit Icon"

                      />*/}
                    <img
                      src="images/left-arrow-dash.png"
                      className="d-block font-modify"
                      alt="arrow"
                    />
                  </Tooltip>
                </Link>

                <div
                  onClick={() => this.openModal("openProfileModal")}
                  className="pl-sm-3 float-right"
                >
                  {" "}
                  <img
                    alt=""
                    src={
                      this.state.profile_image !== ""
                        ? this.state.profile_image
                        : "/images/avatar.jpg"
                    }
                    className="pro-img"
                  />
                  <Tooltip
                    delayShow={1000}
                    placement="top"
                    trigger="hover"
                    tooltip={
                      this.state.required_tips &&
                      this.state.required_tips.map((e) =>
                        e.ID == 18 ? e.Desc : ""
                      )
                    }
                  >
                    <Link to="/login" className="pl-sm-2">
                      {" "}
                      <img
                        style={{ marginTop: "5px" }}
                        onClick={this.logout}
                        src="/images/1/Path-2544.png"
                        className="img-fluid fa"
                        alt="hellaa"
                      />
                    </Link>
                  </Tooltip>
                </div>

                <div className="dropdown float-right">
                  <Dropdown onSelect={this.switchProject}>
                    <Dropdown.Toggle
                      letiant="success"
                      className="btn-main-drop"
                      id="dash_user_drop"
                    >
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {this.state.currentproject.Name}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {this.state.projects.length > 0
                        ? this.state.projects.map((value, index) => (
                            <Dropdown.Item
                              id={value.guid}
                              active={
                                this.state.currentproject.guid == value.guid
                                  ? true
                                  : false
                              }
                              eventKey={value.guid}
                            >
                              {value.Name}
                            </Dropdown.Item>
                          ))
                        : "no projects"}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-table table-responsive  ">
          {this.state.orderColumns.length > 0 ? (
            <table className="scroll table dash-table">
              <thead className="he">
                <tr>
                  <th
                    style={{
                      fontSize:
                        this.state.fontsizetemplate == 0
                          ? ""
                          : this.state.fontsizetemplate,
                      width: "60px",
                    }}
                  >
                    <label className="dash_container dash_remember table-check">
                      <input
                        type="checkbox"
                        name="type"
                        checked={this.state.select_all_check}
                        onChange={(e) => this.allcheck(e)}
                      />

                      <span className="dash_checkmark"></span>
                    </label>
                  </th>

                  {this.state.orderColumns.map((value, index) =>
                    value.Hide == false ? (
                      <>
                        {value.ColumnName.toUpperCase() == "DESCRIPTION" ? (
                          <>
                            <th
                              onClick={this.onAllNodes}
                              style={{
                                fontSize:
                                  this.state.fontsizetemplate == 0
                                    ? ""
                                    : this.state.fontsizetemplate,
                                width: "20px",
                                "text-align": "center",
                              }}
                            >
                              <img
                                alt="edit"
                                src="/images/2/Group -54@2x.png"
                                id="allopen"
                                className={
                                  this.state.allNodes
                                    ? " pr-1 rotate rotate-icon-90 "
                                    : " pr-1 caret-90deg"
                                }
                              />
                            </th>

                            <th
                              style={{
                                fontSize:
                                  this.state.fontsizetemplate == 0
                                    ? ""
                                    : this.state.fontsizetemplate,
                                width: value.Width * 6 + "px",
                              }}
                              className={"text-left filter" + value.guid}
                              onClick={() => this.editColumn(value)}
                            >
                              {value.ColumnName}
                            </th>
                          </>
                        ) : (
                          <th
                            style={{
                              fontSize:
                                this.state.fontsizetemplate == 0
                                  ? ""
                                  : this.state.fontsizetemplate,
                              width: value.Width * 6 + "px",
                            }}
                            className={"filter" + value.guid}
                            onClick={() => this.editColumn(value)}
                          >
                            {value.ColumnName}
                          </th>
                        )}
                      </>
                    ) : this.state.hiddencolumn === false ? (
                      <>
                        {value.ColumnName.toUpperCase() == "DESCRIPTION" ? (
                          <>
                            <th
                              style={{
                                fontSize:
                                  this.state.fontsizetemplate == 0
                                    ? ""
                                    : this.state.fontsizetemplate,
                                width: "20px",
                                "text-align": "left",
                              }}
                              className={"filter" + value.guid}
                              onClick={() => this.editColumn(value)}
                            >
                              <img
                                alt="edit"
                                src="/images/2/Group -54@2x.png"
                                className="mt-1 float-left pr-1"
                              />

                              {value.ColumnName}
                            </th>
                          </>
                        ) : (
                          <th
                            style={{
                              fontSize:
                                this.state.fontsizetemplate == 0
                                  ? ""
                                  : this.state.fontsizetemplate,
                              width: value.Width * 6 + "px",
                            }}
                            className={"filter" + value.guid}
                            onClick={() => this.editColumn(value)}
                          >
                            {value.ColumnName}
                          </th>
                        )}
                      </>
                    ) : (
                      ""
                    )
                  )}
                </tr>
              </thead>

              <tbody
                id="table_height"
                className="table-scrollbar"
                style={{ height: "auto" }}
              >
                {/* <tbody id="table_height" className="table-scrollbar" style={{height: "252px"}}>*/}

                {this.state.finaldata.length > 0
                  ? this.state.finaldata.map((data, findex) => (
                      <tr
                        className={
                          data.Type == "Header"
                            ? "bold_row bg-b"
                            : data.carrot == false &&
                              data.Type === "Detail" &&
                              data.Type !== "Blank" &&
                              data.Type != "Total"
                            ? "bg-b gray_row"
                            : data.Type == "Total"
                            ? "total_row"
                            : data.Type == "Blank"
                            ? ""
                            : "bg-b"
                        }
                      >
                        <td
                          style={{
                            fontSize:
                              this.state.fontsizetemplate == 0
                                ? ""
                                : this.state.fontsizetemplate,
                            width: "60px",
                          }}
                          suppressContentEditableWarning={true}
                        >
                          <label className="dash_container dash_remember table-check">
                            <input
                              type="checkbox"
                              name={data.guid}
                              id={data.guid}
                              checked={data.checkbox}
                              onChange={(e) =>
                                this.checkboxHandler(
                                  data.guid,

                                  e.target.checked,

                                  findex
                                )
                              }
                            />

                            <span
                              id={`${data.guid}_span`}
                              className="dash_checkmark"
                            ></span>
                          </label>
                        </td>

                        {data.Columns.length > 0 ? (
                          data.Columns.map((cd, i) =>
                            this.state.orderColumns[i].Hide == false ? (
                              this.state.orderColumns[
                                i
                              ].ColumnName.toUpperCase() == "DESCRIPTION" ? (
                                <>
                                  {cd.obj.TextValue == " " ||
                                  cd.obj.TextValue == null ? (
                                    <>
                                      <td
                                        tagNext={"true"}
                                        className={
                                          data.clicked
                                            ? "opened cursor-pointer"
                                            : "closed cursor-pointer"
                                        }
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width: "20px",
                                        }}
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          e.keyCode == 32
                                            ? data.carrot
                                              ? this.ongroupclick(e, data.guid)
                                              : ""
                                            : e.preventDefault()
                                        }
                                        tabindex={i}
                                        onClick={(e) =>
                                          this.ongroupclick(
                                            e,

                                            data.guid
                                          )
                                        }
                                      >
                                        {" "}
                                        {data.carrot ? (
                                          <b className="main-row-table">
                                            <img
                                              alt="edit"
                                              src="/images/2/Group 331.png"
                                              className={
                                                data.clicked
                                                  ? "pr-1 rotate rotate-icon-90"
                                                  : "pr-1 rotate"
                                              }
                                              id={findex}
                                            />
                                          </b>
                                        ) : (
                                          ""
                                        )}
                                      </td>

                                      <td
                                        tagNext={"true"}
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width:
                                            this.state.orderColumns[i].Width *
                                              6 +
                                            "px",
                                          "text-align":
                                            cd.obj.ColumnGuid ===
                                            this.state.orderColumns[i].guid
                                              ? this.state.orderColumns[i]
                                                  .Alignment
                                              : "text-center",
                                        }}
                                        onBlur={(e) =>
                                          this.handleChangeCellOnEnter(
                                            e,

                                            cd.obj.uniqueCellId,

                                            data,

                                            cd,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue,
                                            this.state.orderColumns[i].Format
                                          )
                                        }
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          this.handleChangeCell(
                                            e,
                                            this.state.orderColumns[i].Format,
                                            data
                                          )
                                        }
                                        onFocus={() =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                        }
                                        onClick={() =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                        }
                                        contentEditable="true"
                                        tabindex={i}
                                        className={
                                          this.state.orderColumns[i].Format ==
                                          "TEXT"
                                            ? "text-left"
                                            : ""
                                        }
                                      >
                                        {this.state.orderColumns[i].Format ==
                                          "TEXT" &&
                                        cd.obj.AmountValue == 0 &&
                                        cd.obj.TextValue == null
                                          ? ""
                                          : this.state.orderColumns[i].Format ==
                                              "TEXT" && cd.obj.TextValue == ""
                                          ? " "
                                          : cd.obj.AmountValue}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td
                                        tagNext={"true"}
                                        className={
                                          data.clicked
                                            ? "opened cursor-pointer"
                                            : "closed cursor-pointer"
                                        }
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width: "20px",
                                        }}
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          e.keyCode == 32
                                            ? data.carrot
                                              ? this.ongroupclick(e, data.guid)
                                              : ""
                                            : e.preventDefault()
                                        }
                                        tabindex={i}
                                        onClick={(ev) =>
                                          this.ongroupclick(
                                            ev,

                                            data.guid
                                          )
                                        }
                                      >
                                        {" "}
                                        {data.carrot ? (
                                          <b className="main-row-table">
                                            <img
                                              alt="edit"
                                              src="/images/2/Group 331.png"
                                              className={
                                                data.clicked
                                                  ? "pr-1 rotate rotate-icon-90"
                                                  : "pr-1 rotate"
                                              }
                                              id={findex}
                                            />
                                          </b>
                                        ) : (
                                          ""
                                        )}
                                      </td>

                                      <td
                                        tagNext={"true"}
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width:
                                            this.state.orderColumns[i].Width *
                                              6 +
                                            "px",
                                          "text-align":
                                            cd.obj.ColumnGuid ===
                                            this.state.orderColumns[i].guid
                                              ? this.state.orderColumns[i]
                                                  .Alignment
                                              : "text-center",
                                        }}
                                        onBlur={(e) =>
                                          this.handleChangeCellOnEnter(
                                            e,

                                            cd.obj.uniqueCellId,

                                            data,

                                            cd,

                                            cd.obj.TextValue,
                                            this.state.orderColumns[i].Format
                                          )
                                        }
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          this.handleChangeCell(
                                            e,
                                            this.state.orderColumns[i].Format,
                                            data
                                          )
                                        }
                                        onFocus={() =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                        }
                                        onClick={() =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                        }
                                        contentEditable="true"
                                        tabindex={i}
                                        className={
                                          this.state.orderColumns[i].Format ==
                                          "TEXT"
                                            ? "point-c "
                                            : "point-c"
                                        }
                                      >
                                        {cd.obj.TextValue}
                                      </td>
                                    </>
                                  )}
                                </>
                              ) : cd.obj.TextValue == " " ||
                                cd.obj.TextValue == null ? (
                                <td
                                  tagNext={
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() === "ACCOUNT" ||
                                    this.state.orderColumns[i].Type === "Entry"
                                      ? "true"
                                      : "false"
                                  }
                                  style={{
                                    fontSize:
                                      this.state.fontsizetemplate == 0
                                        ? ""
                                        : this.state.fontsizetemplate,
                                    color: this.formatValidation(
                                      this.state.orderColumns[i].Format ==
                                        "TEXT" &&
                                        cd.obj.AmountValue == 0 &&
                                        cd.obj.TextValue == null
                                        ? ""
                                        : this.state.orderColumns[i].Format ==
                                            "TEXT" && cd.obj.TextValue == ""
                                        ? " "
                                        : cd.obj.AmountValue,
                                      this.state.orderColumns[i].Format
                                    )[0].color,
                                    width:
                                      this.state.orderColumns[i].Width * 6 +
                                      "px",
                                    "text-align":
                                      cd.obj.ColumnGuid ===
                                      this.state.orderColumns[i].guid
                                        ? this.state.orderColumns[i].Alignment
                                        : "text-center",
                                  }}
                                  suppressContentEditableWarning={true}
                                  onKeyDown={(e) =>
                                    this.handleChangeCell(
                                      e,
                                      this.state.orderColumns[i].Format,
                                      data
                                    )
                                  }
                                  contentEditable={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry" &&
                                      data.isAccountEmpty === false) ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? "true"
                                      : "false"
                                  }
                                  tabindex={i}
                                  className={
                                    this.state.orderColumns[i].Format == "TEXT"
                                      ? data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                        ? "text-primary"
                                        : ""
                                      : data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                      ? ""
                                      : ""
                                  }
                                  onFocus={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onClick={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onBlur={(e) =>
                                    this.handleChangeCellOnEnter(
                                      e,

                                      cd.obj.uniqueCellId,

                                      data,

                                      cd,

                                      this.state.orderColumns[i].Format ==
                                        "TEXT" &&
                                        cd.obj.AmountValue == "0" &&
                                        cd.obj.TextValue == null
                                        ? " "
                                        : cd.obj.AmountValue,
                                      this.state.orderColumns[i].Format
                                    )
                                  }
                                >
                                  {data.Type === "Detail" &&
                                  data.isAccountEmpty === true
                                    ? ""
                                    : this.formatValidation(
                                        this.state.orderColumns[i].Format ==
                                          "TEXT" &&
                                          cd.obj.AmountValue == 0 &&
                                          cd.obj.TextValue == null
                                          ? ""
                                          : this.state.orderColumns[i].Format ==
                                              "TEXT" && cd.obj.TextValue == ""
                                          ? " "
                                          : cd.obj.AmountValue,
                                        this.state.orderColumns[i].Format
                                      )[0].value}
                                </td>
                              ) : (
                                <td
                                  tagNext={
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() === "ACCOUNT" ||
                                    this.state.orderColumns[i].Type === "Entry"
                                      ? "true"
                                      : "false"
                                  }
                                  style={{
                                    fontSize:
                                      this.state.fontsizetemplate == 0
                                        ? ""
                                        : this.state.fontsizetemplate,
                                    color: this.formatValidation(
                                      cd.obj.TextValue,
                                      this.state.orderColumns[i].Format
                                    )[0].color,
                                    width:
                                      this.state.orderColumns[i].Width * 6 +
                                      "px",
                                    "text-align":
                                      cd.obj.ColumnGuid ===
                                      this.state.orderColumns[i].guid
                                        ? this.state.orderColumns[i].Alignment
                                        : "text-center",
                                  }}
                                  suppressContentEditableWarning={true}
                                  onKeyDown={(e) =>
                                    this.handleChangeCell(
                                      e,
                                      this.state.orderColumns[i].Format,
                                      data
                                    )
                                  }
                                  contentEditable={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry" &&
                                      data.isAccountEmpty === false) ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? "true"
                                      : "false"
                                  }
                                  tabindex={i}
                                  className={
                                    (cd.obj.ColumnGuid ===
                                    this.state.orderColumns[i].guid
                                      ? "text-" +
                                        this.state.orderColumns[i].Alignment
                                      : "",
                                    this.state.orderColumns[i].Format == "TEXT"
                                      ? data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                        ? "text-primary"
                                        : ""
                                      : data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                      ? ""
                                      : "")
                                  }
                                  onFocus={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onClick={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onBlur={(e) =>
                                    this.handleChangeCellOnEnter(
                                      e,

                                      cd.obj.uniqueCellId,

                                      data,

                                      cd,

                                      cd.obj.TextValue,
                                      this.state.orderColumns[i].Format
                                    )
                                  }
                                >
                                  {data.Type === "Detail" &&
                                  data.isAccountEmpty === true
                                    ? ""
                                    : this.formatValidation(
                                        cd.obj.TextValue,
                                        this.state.orderColumns[i].Format
                                      )[0].value}
                                </td>
                              )
                            ) : this.state.hiddencolumn == false ? (
                              this.state.orderColumns[
                                i
                              ].ColumnName.toUpperCase() == "DESCRIPTION" ? (
                                <>
                                  {cd.obj.TextValue == " " ||
                                  cd.obj.TextValue == null ? (
                                    <>
                                      <td
                                        tagNext={"true"}
                                        className={
                                          data.clicked
                                            ? "opened cursor-pointer"
                                            : "closed cursor-pointer"
                                        }
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width: "20px",
                                        }}
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          e.keyCode == 32
                                            ? data.carrot
                                              ? this.ongroupclick(e, data.guid)
                                              : ""
                                            : e.preventDefault()
                                        }
                                        tabindex={i}
                                        onClick={(e) =>
                                          this.ongroupclick(
                                            e,

                                            data.guid
                                          )
                                        }
                                      >
                                        {" "}
                                        {data.carrot ? (
                                          <b className="main-row-table">
                                            <img
                                              alt="edit"
                                              src="/images/2/Group 331.png"
                                              className={
                                                data.clicked
                                                  ? "pr-1 rotate rotate-icon-90"
                                                  : "pr-1 rotate"
                                              }
                                              id={findex}
                                            />
                                          </b>
                                        ) : (
                                          ""
                                        )}
                                      </td>

                                      <td
                                        tagNext={"true"}
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width:
                                            this.state.orderColumns[i].Width *
                                              6 +
                                            "px",
                                        }}
                                        onBlur={(e) =>
                                          this.handleChangeCellOnEnter(
                                            e,

                                            cd.obj.uniqueCellId,

                                            data,

                                            cd,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue,
                                            this.state.orderColumns[i].Format
                                          )
                                        }
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          this.handleChangeCell(
                                            e,
                                            this.state.orderColumns[i].Format,
                                            data
                                          )
                                        }
                                        onFocus={() =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                        }
                                        onClick={() =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                        }
                                        contentEditable="true"
                                        tabindex={i}
                                        className={
                                          this.state.orderColumns[i].Format ==
                                          "TEXT"
                                            ? "text-left"
                                            : "text-right"
                                        }
                                      >
                                        {this.state.orderColumns[i].Format ==
                                          "TEXT" &&
                                        cd.obj.AmountValue == 0 &&
                                        cd.obj.TextValue == null
                                          ? ""
                                          : cd.obj.AmountValue}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td
                                        tagNext={"true"}
                                        className={
                                          data.clicked
                                            ? "opened cursor-pointer"
                                            : "closed cursor-pointer"
                                        }
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width: "20px",
                                        }}
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          e.keyCode == 32
                                            ? data.carrot
                                              ? this.ongroupclick(e, data.guid)
                                              : ""
                                            : e.preventDefault()
                                        }
                                        tabindex={i}
                                      >
                                        {" "}
                                        {data.carrot ? (
                                          <b
                                            className="main-row-table"
                                            onClick={(ev) =>
                                              this.ongroupclick(
                                                ev,

                                                data.guid
                                              )
                                            }
                                          >
                                            <img
                                              alt="edit"
                                              src="/images/2/Group 331.png"
                                              className={
                                                data.clicked
                                                  ? "pr-1 rotate rotate-icon-90"
                                                  : "pr-1 rotate"
                                              }
                                              id={findex}
                                            />
                                          </b>
                                        ) : (
                                          ""
                                        )}
                                      </td>

                                      <td
                                        tagNext={"true"}
                                        style={{
                                          fontSize:
                                            this.state.fontsizetemplate == 0
                                              ? ""
                                              : this.state.fontsizetemplate,
                                          width:
                                            this.state.orderColumns[i].Width *
                                              6 +
                                            "px",
                                        }}
                                        onBlur={(e) =>
                                          this.handleChangeCellOnEnter(
                                            e,

                                            cd.obj.uniqueCellId,

                                            data,

                                            cd,

                                            cd.obj.TextValue,
                                            this.state.orderColumns[i].Format
                                          )
                                        }
                                        suppressContentEditableWarning={true}
                                        onKeyDown={(e) =>
                                          this.handleChangeCell(
                                            e,
                                            this.state.orderColumns[i].Format,
                                            data
                                          )
                                        }
                                        onFocus={() =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                        }
                                        onClick={() =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                        }
                                        contentEditable="true"
                                        tabindex={i}
                                        className={
                                          this.state.orderColumns[i].Format ==
                                          "TEXT"
                                            ? "point-c text-left"
                                            : "point-c text-right"
                                        }
                                      >
                                        {cd.obj.TextValue}
                                      </td>
                                    </>
                                  )}
                                </>
                              ) : cd.obj.TextValue == " " ||
                                cd.obj.TextValue == null ? (
                                <td
                                  tagNext={
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() === "ACCOUNT" ||
                                    this.state.orderColumns[i].Type === "Entry"
                                      ? "true"
                                      : "false"
                                  }
                                  style={{
                                    fontSize:
                                      this.state.fontsizetemplate == 0
                                        ? ""
                                        : this.state.fontsizetemplate,
                                    color: this.formatValidation(
                                      this.state.orderColumns[i].Format ==
                                        "TEXT" &&
                                        cd.obj.AmountValue == 0 &&
                                        cd.obj.TextValue == null
                                        ? ""
                                        : cd.obj.AmountValue,
                                      this.state.orderColumns[i].Format
                                    )[0].color,
                                    width:
                                      this.state.orderColumns[i].Width * 6 +
                                      "px",
                                    "text-align":
                                      cd.obj.ColumnGuid ===
                                      this.state.orderColumns[i].guid
                                        ? this.state.orderColumns[i].Alignment
                                        : "text-center",
                                  }}
                                  suppressContentEditableWarning={true}
                                  onKeyDown={(e) =>
                                    this.handleChangeCell(
                                      e,
                                      this.state.orderColumns[i].Format,
                                      data
                                    )
                                  }
                                  contentEditable={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry" &&
                                      data.isAccountEmpty === false) ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? "true"
                                      : "false"
                                  }
                                  tabindex={i}
                                  className={
                                    this.state.orderColumns[i].Format == "TEXT"
                                      ? data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                        ? "text-primary "
                                        : "text-left"
                                      : data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                      ? ""
                                      : "text-right"
                                  }
                                  onFocus={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onClick={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            this.state.orderColumns[i].Format ==
                                              "TEXT" &&
                                              cd.obj.AmountValue == "0" &&
                                              cd.obj.TextValue == null
                                              ? " "
                                              : cd.obj.AmountValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onBlur={(e) =>
                                    this.handleChangeCellOnEnter(
                                      e,

                                      cd.obj.uniqueCellId,

                                      data,

                                      cd,

                                      this.state.orderColumns[i].Format ==
                                        "TEXT" &&
                                        cd.obj.AmountValue == "0" &&
                                        cd.obj.TextValue == null
                                        ? " "
                                        : cd.obj.AmountValue,
                                      this.state.orderColumns[i].Format
                                    )
                                  }
                                >
                                  {data.Type === "Detail" &&
                                  data.isAccountEmpty === true
                                    ? ""
                                    : this.formatValidation(
                                        this.state.orderColumns[i].Format ==
                                          "TEXT" &&
                                          cd.obj.AmountValue == 0 &&
                                          cd.obj.TextValue == null
                                          ? ""
                                          : cd.obj.AmountValue,
                                        this.state.orderColumns[i].Format
                                      )[0].value}
                                </td>
                              ) : (
                                <td
                                  tagNext={
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() === "ACCOUNT" ||
                                    this.state.orderColumns[i].Type === "Entry"
                                      ? "true"
                                      : "false"
                                  }
                                  style={{
                                    fontSize:
                                      this.state.fontsizetemplate == 0
                                        ? ""
                                        : this.state.fontsizetemplate,
                                    color: this.formatValidation(
                                      cd.obj.TextValue,
                                      this.state.orderColumns[i].Format
                                    )[0].color,
                                    width:
                                      this.state.orderColumns[i].Width * 6 +
                                      "px",
                                    "text-align":
                                      cd.obj.ColumnGuid ===
                                      this.state.orderColumns[i].guid
                                        ? this.state.orderColumns[i].Alignment
                                        : "text-center",
                                  }}
                                  suppressContentEditableWarning={true}
                                  onKeyDown={(e) =>
                                    this.handleChangeCell(
                                      e,
                                      this.state.orderColumns[i].Format,
                                      data
                                    )
                                  }
                                  contentEditable={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry" &&
                                      data.isAccountEmpty === false) ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? "true"
                                      : "false"
                                  }
                                  tabindex={i}
                                  className={
                                    this.state.orderColumns[i].Format == "TEXT"
                                      ? data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                        ? "text-primary"
                                        : "text-left"
                                      : data.Type === "Detail" &&
                                        this.state.orderColumns[i].Type ===
                                          "Entry"
                                      ? ""
                                      : "text-right"
                                  }
                                  onFocus={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onClick={
                                    (data.Type === "Detail" &&
                                      this.state.orderColumns[i].Type ===
                                        "Entry") ||
                                    this.state.orderColumns[
                                      i
                                    ].ColumnName.toUpperCase() == "ACCOUNT"
                                      ? () =>
                                          this.handleClickOnCell1(
                                            cd.obj.uniqueCellId,

                                            data,

                                            cd.obj.TextValue
                                          )
                                      : this.handleChangeCellonBlur
                                  }
                                  onBlur={(e) =>
                                    this.handleChangeCellOnEnter(
                                      e,

                                      cd.obj.uniqueCellId,

                                      data,

                                      cd,

                                      cd.obj.TextValue,
                                      this.state.orderColumns[i].Format
                                    )
                                  }
                                >
                                  {data.Type === "Detail" &&
                                  data.isAccountEmpty === false
                                    ? ""
                                    : this.formatValidation(
                                        cd.obj.TextValue,
                                        this.state.orderColumns[i].Format
                                      )[0].value}
                                </td>
                              )
                            ) : (
                              ""
                            )
                          )
                        ) : (
                          <>
                            {this.state.orderColumns.map((value, i) =>
                              this.state.hiddencolumn == true ? (
                                this.state.orderColumns[i].Hide == false ? (
                                  <td
                                    style={{
                                      fontSize:
                                        this.state.fontsizetemplate == 0
                                          ? ""
                                          : this.state.fontsizetemplate,
                                      width:
                                        this.state.orderColumns[i].Width * 6 +
                                        "px",
                                    }}
                                    suppressContentEditableWarning={true}
                                    tabindex={i}
                                    onFocus={this.handleChangeCellonBlur}
                                  ></td>
                                ) : (
                                  ""
                                )
                              ) : (
                                <td
                                  style={{
                                    fontSize:
                                      this.state.fontsizetemplate == 0
                                        ? ""
                                        : this.state.fontsizetemplate,
                                    width:
                                      this.state.orderColumns[i].Width * 6 +
                                      "px",
                                  }}
                                  suppressContentEditableWarning={true}
                                  tabindex={i}
                                  onFocus={this.handleChangeCellonBlur}
                                ></td>
                              )
                            )}
                            <td
                              suppressContentEditableWarning={true}
                              tabindex={this.state.orderColumns.length}
                              onFocus={this.handleChangeCellonBlur}
                            ></td>
                          </>
                        )}
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </div>

        {/* modal */}
        <ReportsModal
          layouts={this.state.layouts}
          openModal={this.state.openReportsModal}
          getLayouts={this.getLayouts}
          getLayoutsFromReports={this.getLayoutsFromReports}
          current_template={
            this.state.editTemplateModal.guid
              ? this.state.temp_report !== ""
                ? this.state.temp_report
                : this.state.editTemplateModal.guid
              : ""
          }
          closeModal={() => this.closeModal("openReportsModal")}
          template_list={this.state.templates}
          reload={this.reload}
          reportdata={this.state.reportdata}
          getReportdata={this.getReportdata}
          currentproject={this.state.currentproject}
          generatereport={this.generatereport}
          user={this.state.user}
        />

        <FilterModal
          openModal={this.state.openFilterModal}
          columns={this.state.orderColumns}
          handleColumnvalue={(e) => this.handleColumnvalue(e)}
          handleComparisonValue={(e) => this.handleComparisonValue(e)}
          handlevalue={(e) => this.handlevalue(e)}
          filterdata={this.filterdata}
          clearfilter={this.clearfilter}
          closeFilterModal={this.closeFilterModal}
          columnValue={this.state.columnValue}
          comparsionValue={this.state.comparsionValue}
          value={this.state.value}
          filter_formErrors={this.state.filter_formErrors}
          closeModal={() => this.closeModal("openFilterModal")}
        />

        <AddEditColumnModal
          recalc={this.state.recalc}
          xeroTrackingCategories={this.xeroTrackingCategories}
          catagories={this.state.catagories}
          errorcat={this.state.errorcat}
          gettemplateanddata={this.gettemplateanddata}
          allColumnsOfTemplates={this.allColumnsOfTemplates}
          openModal={this.state.openAddEditColumn}
          closeModal={() => this.closeModal("openAddEditColumn")}
          columnData={this.state.columnData}
          editColumn={this.state.editColumn}
          orderColumns={this.state.orderColumns}
          allColumns={this.state.allcolumnsoftemp}
          templateList={this.state.templates}
          selectedtempguid={this.state.selectedtempguid}
          selectedTemp={this.state.editTemplateModal}
          isLoading={this.isLoading}
          required_messages={this.state.required_messages}
          currentproject={this.state.currentproject}
          config={this.state.config}
          orignalData={this.state.originalData}
          undoValue={this.undoValue}
          getColumnByTemplateGuid={this.getColumnByTemplateGuidcall}
          updateDataOnAddEditColumn={this.updateDataOnAddEditColumn}
          onDeleteColumnLoadTable={this.onDeleteColumnLoadTable}
          updatedOriginalRows={this.state.updatedOriginalRows}
          apiCopyPivotData={this.apiCopyPivotData}
          removeState={this.removeState}
        />

        <Profile
          openModal={this.state.openProfileModal}
          closeModal={() => this.closeModal("openProfileModal")}
          getUserByGuid={() => this.getUserByGuid()}
          profile_image={this.state.profile_image}
        />

        <RefreshModal
          openModal={this.state.openRefreshModal}
          closeModal={() => this.closeModal("openRefreshModal")}
          handleRefresh={() => this.Refreshapicall()}
          reload={this.reload}
        />

        <GroupListModal
          openModal={this.state.openGroupListModal}
          closeModal={() => this.closeModal("openGroupListModal")}
          getGroups={this.state.get_groupsd}
          template_guid={this.state.selectedtempguid}
          getGroupsHandler={() => this.getGroupsHandler()}
          required_messages={this.state.required_messages}
          updateGroups={this.updateGroups}
          handleChangeCheckbox={this.handleChangeCheckbox}
          selectedProjectOnConflict={
            this.state.selectedProject
              ? this.state.selectedProject.OnConflict
              : false
          }
          selectedProject={this.state.selectedProject}
          finaldata={this.state.finaldata}
          replaceHistory={this.replaceHistory}
        />

        <AddTemplateModal
          openModal={this.state.openAddTemplateModal}
          closeModal={() => this.closeModal("openAddTemplateModal")}
          required_messages={this.state.required_messages}
          addTemplateModalHandler={this.addTemplateModalHandler}
        />

        <EditTemplateModal
          openModal={this.state.openEditTemplateModal}
          closeModal={() => this.closeModal("openEditTemplateModal")}
          editTemplateModalHandler={this.editTemplateModalHandler}
          completedata={this.state.editTemplateModal}
          deletetemplate={this.deletetemplate}
          updateTemplate={this.updateTemplate}
          templateName={this.state.editTemplateModal.TemplateName}
        />

        <PeriodClose
          openModal={this.state.openPeriodCloseModal}
          closeModal={() => this.closeModal("openPeriodCloseModal")}
          selectedProject={this.state.selectedProject}
          reload={this.reload}
          periodClose={this.periodClose}
          allColumnsOfTemplates={this.state.allcolumnsoftemp}
        />

        <ImportModal
          openModal={this.state.openImportModal}
          closeModal={() => this.closeModal("openImportModal")}
          reload={this.reload}
        />

        <ApplyGroup
          openModal={this.state.openApplyGroupModal}
          gvalue={this.state.groupValue}
          checkcount={
            this.state.checkedcount > 0 ? this.state.checkedcount : ""
          }
          closeModal={() => this.closeModal("openApplyGroupModal")}
          getGroupsf={this.getGroups}
          getGroupsData={this.state.get_groupsd}
          getGroupCheckedValue={this.groupcheckedvalue}
          updateGroupsHelper={this.updateGroupsHelper}
          redRowHandler={this.redRowHandler}
          selectedProject={this.state.selectedProject}
          undoValue={this.undoValue}
        />

        <ShareModal
          openModal={this.state.openShareModal}
          closeModal={() => this.closeModal("openShareModal")}
          selectedProject={this.state.selectedProject}
        />

        <EditProjectModal
          openModal={this.state.openEditProjectModal}
          closeModal={() => this.closeModal("openEditProjectModal")}
        />

        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading}
          optionalOkFunction={this.state.optionalOkFunction}
          optionalCloseFunction={this.state.optionalCloseFunction}
          clearStates={this.clearStates}
        >
          {this.state.message_desc}
        </Message>

        <DeleteModal
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          confirmDelete={this.deleteRow}
        />
        {this.state.exceldata ? (
          <ExcelFile element={<button id="test1">Download Data</button>}>
            <ExcelSheet data={this.state.exceldata} name="pivotData">
              <ExcelColumn label={"Template"} value={"Header"} />

              {this.state.templatecols
                ? this.state.templatecols.map((o) => (
                    <ExcelColumn
                      label={
                        o.Type == "System"
                          ? "System"
                          : this.state.templates.find(
                              (e) => e.guid == o.TemplateGuid
                            ) !== undefined
                          ? this.state.templates.find(
                              (e) => e.guid == o.TemplateGuid
                            ).TemplateName
                          : ""
                      }
                      value={o.guid}
                    />
                  ))
                : ""}

              <ExcelColumn label={"System"} value={"gCode"} />

              <ExcelColumn label={"System"} value={"description"} />

              <ExcelColumn label={"System"} value={"hide"} />
            </ExcelSheet>
          </ExcelFile>
        ) : (
          ""
        )}
        {/* modal end */}
      </div>
    );
  }
}
const mapStateToProps = (arg) => ({
  isAuthenticated: arg.result.isAuthenticated,
});
export default connect(mapStateToProps, { currentsessioncheck, signinout })(
  Dashboard
);
