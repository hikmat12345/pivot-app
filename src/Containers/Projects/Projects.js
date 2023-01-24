import "./Projects.css";

import { API, Storage } from "aws-amplify";
import React, { Component, Fragment } from "react";
import {
  clearStatesCommon,
  getUserEntities
} from "../../actions/generalfuntions";
import { currentsessioncheck, signinout } from "../../actions/loginactions";

import $ from "jquery";
import AddProjectModal from "../Modals/Projects/AddProject/AddProject";
import AddUsersListModal from "../Modals/Projects/UsersList/UsersList";
import EditEntityModal from "../Modals/Projects/EditEntity/EditEntity";
import EditProjectModal from "../Modals/Projects/EditProject/EditProject";
import { Link } from "react-router-dom";
import Message from "../Modals/message/message";
import Select from "react-select";
import axios from 'axios';
import { checkindynamosignin } from "../../actions/loginactions";
import { connect } from "react-redux";
import moment from 'moment'
import { toast } from "react-toastify";

const sha256 = require("sha256");
const base64url = require('base64url');
class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user_tenant: "",
      usersfortwofactor: [],
      complete_tenant_entity: "",
      projectsforaccess: [],
      required_tips: [],
      newAddedProject: '',
      image_from_bucket: "",
      project_access: [],
      user_type: '',
      login_user_email: "",
      complete_tenant_guid: "",
      show: false,
      isLoading: false,
      showConfirm: false,
      openEditProjectModal: false,
      openAddProjectModal: false,
      openAddUsersListModal: false,
      openEditEntityModal: false,
      allusers: [],
      required_messages: [],
      openUsersModal: false,
      openEntityModal: false,
      openAddUserModal: false,
      openEditUserModal: false,
      openApplyGroupModal: false,
      openGroupListModal: false,
      openEditColumnModal: false,
      openEditColumn2Modal: false,
      openEditColumn3Modal: false,
      openEditColumn4Modal: false,
      openEditColumn5Modal: false,
      openMessageModal: false,
      selectedEntity: [],
      projects: [],
      singleProject: "", //get project data when click on edit project
      sEntityOptions: [],
      subscription: "",
      activities: [],
      projectsForAddEdit: [],
      subscriptions: undefined,
      subscribedUsers: 0,
      subscribedProjects: 0,
      tenantProjectsLength: 0,
      isSubscriptionExpired: undefined,
      message_desc: "",
      message_heading: "",
      openMessageModal: false,
      tenants: []
    };
  }

  /*  componentWillMount = async () => {
      await this.props.currentsessioncheck();
      if (!this.props.isAuthenticated) {
        this.props.history.push("/login");
      }
    };*/

  getprojects = async () => {
    let projects = []
    let tenantguid = this.state.login_user_tenant;
    let { tenantProjectsLength } = this.state;

    if (this.state.user_type !== "SYSTEM") {
      let flag1 = false
      let bodypost1 = {
        tenantguid: tenantguid
      }
      while (flag1 === false) {
        await API.post("pivot", "/getProjects", {
          body: bodypost1
        })
          .then(data => {
            // toast.success("Pivot Data Fetched Successfully");
            tenantProjectsLength = data.Items.length;
            data.Items.map(s => {
              projects.push(s)
            })
            if (data.LastEvaluatedKey) {
              bodypost1.LastEvaluatedKey = data.LastEvaluatedKey
            } else {
              flag1 = true
            }
          })
          .catch(err => {
            this.setState({
              message_desc: "Pivot Data Fetched Failed.",
              message_heading: "Pivot Data",
              openMessageModal: true,
            })
            flag1 = true;
            // toast.error('Pivot Data Fetched Failed')
          })
      }

      let flag2 = false
      let bodypost2 = {
        tenantguid: "SYSTEM"
      }
      while (flag2 === false) {
        await API.post("pivot", "/getProjects", {
          body: bodypost2
        })
          .then(data => {
            // toast.success("Pivot Data Fetched Successfully");
            data.Items.map(s => {
              projects.push(s)
            })
            if (data.LastEvaluatedKey) {
              bodypost2.LastEvaluatedKey = data.LastEvaluatedKey
            } else {
              flag2 = true
            }
          })
          .catch(err => {
            this.setState({
              message_desc: "Pivot Data Fetched Failed.",
              message_heading: "Pivot Data",
              openMessageModal: true,
            })
            flag2 = true;
            // toast.error('Pivot Data Fetched Failed')
          })
      }

    } else {
      let flag3 = false
      let bodypost3 = {
        tenantguid: "SYSTEM"
      }
      while (flag3 === false) {
        await API.post("pivot", "/getProjectsForSystem", {
          body: bodypost3
        })
          .then(data => {
            // toast.success("Pivot Data Fetched Successfully");
            data.Items.map(s => {
              projects.push(s)
            })
            if (data.LastEvaluatedKey) {
              bodypost3.LastEvaluatedKey = data.LastEvaluatedKey
            } else {
              flag3 = true
            }
          })
          .catch(err => {
            this.setState({
              message_desc: "Pivot Data Fetched Failed.",
              message_heading: "Pivot Data",
              openMessageModal: true,
            })
            flag3 = true;
            // toast.error('Pivot Data Fetched Failed')
          })
      }
    }

    if (projects.length > 0) {
      this.getProjectsWorking(projects, tenantguid)
    }

    this.setState({ tenantProjectsLength });
  };

  getProjectsWorking = async (data, tenantguid) => {

    if (this.state.user_type == "SYSTEM") {
      data.sort(function (a, b) {
        if (a.Name.toUpperCase() < b.Name.toUpperCase()) { return -1; }
        if (a.Name.toUpperCase() > b.Name.toUpperCase()) { return 1; }
        return 0;
      })

      this.setState({
        projects: data,
        projectsforaccess: data
      });

    } else if (this.state.user_type == "Owner") {
      data.sort(function (a, b) {
        if (a.Name.toUpperCase() < b.Name.toUpperCase()) { return -1; }
        if (a.Name.toUpperCase() > b.Name.toUpperCase()) { return 1; }
        return 0;
      })
      var tes = [];
      tes = data.filter(e => {
        return e.TenantGuid == tenantguid
      });

      this.setState({
        projects: tes,
        projectsforaccess: data.filter(e => {
          return e.TenantGuid == tenantguid || e.TenantGuid == "SYSTEM"
        })
      });
    } else {
      var tes = [];
      tes = data.filter(e => {
        return e.TenantGuid == tenantguid || e.TenantGuid == "SYSTEM"
      });


      tes.sort(function (a, b) {
        if (a.Name.toUpperCase() < b.Name.toUpperCase()) { return -1; }
        if (a.Name.toUpperCase() > b.Name.toUpperCase()) { return 1; }
        return;
      })

      this.setState({
        projects: tes.filter(e => { return this.state.project_access.indexOf(e.guid) > -1 && e.guid != 'DEFAULT' }),
        projectsforaccess: tes.filter(e => { return this.state.project_access.indexOf(e.guid) > -1 || e.TenantGuid == "SYSTEM" })
      });
    }
    this.setState({
      projectsForAddEdit: data.filter(project => project.TenantGuid == tenantguid || project.TenantGuid == "SYSTEM")
    });
    // toast.success("Projects Get Successfully");

    var v = $(".pl_project>li").attr("tabindex");
    $('#tofocus_main' + v).focus();

    $('.pl_project li:last-child').keydown(function (e) {
      var v = $('.pl_project li:last-child').attr("tabindex");
      var tb = v - 1;
      if (e.shiftKey) {
        e.preventDefault();
        if (e.keyCode == 9) {
          $('#tofocus_main' + tb).focus();
        }
      } else
        if (e.keyCode == 9) {
          e.preventDefault();
          $("button#first_tab_index").focus();
        }
    });
    $('#first_tab_index').keydown(function (e) {
      var v = $('.pl_project li:last-child').attr("tabindex");
      if (e.shiftKey) {
        e.preventDefault();
        if (e.keyCode == 9) {
          $('#tofocus_main' + v).focus();
        }
      }
    });

  }

  getConfigs = () => {
    API.post("pivot", "/getconfig", {
      body: {
        guid: "MESSAGES"
      }
    })
      .then(data => {
        this.setState({
          required_messages: data.Message
        })
        localStorage.setItem("RequiredMessages", JSON.stringify(data.Message))
        // this.setState({ config: data });
        // toast.success("Formats Get Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Messages",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Messages")
      });
  };

  getSubscription = async () => {
    await API.post("pivot", "/getconfig", {
      body: {
        guid: "SUBSCRIPTION"
      }
    })
      .then(data => {
        this.setState({
          subscription: data.Webpage
        });
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Subscription",
          message_heading: "Subscription",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Subscription")
      });
  };

  getConfigsTool = () => {
    API.post("pivot", "/getconfig", {
      body: {
        guid: "TOOLTIPS"
      }
    })
      .then(data => {
        this.setState({
          required_tips: data.ToolTip
        })
        // console.log(data,'TOOLTIPSTOOLTIPSTOOLTIPS');
        localStorage.setItem("ToolTip", JSON.stringify(data.ToolTip))
        // this.setState({ config: data });
        // toast.success("Formats Get Successfully");
      })
      .catch(err => {
        this.setState({
          message_desc: "Error While Getting Messages",
          message_heading: "Messages",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Messages")
      });
  };

  getColumsByMultipleTemplates = async (guids) => {
    let filterGuids = [];
    let columns = [];
    guids.map(function (item) {
      if (filterGuids.find(secitem => secitem === item) === undefined) {
        filterGuids.push(item);
      }
    });
    guids = filterGuids;

    let loftemp = guids.length / 90;
    for (let i = 0; i < Math.ceil(loftemp) * 90; i = i + 90) {
      let arraytosend = guids.slice(i, i + 90);
      await API.post('pivot', '/getColumsbyMultipleTemplates', {
        body: {
          templates: arraytosend,
        },
      })
        .then((data) => {
          columns = columns.concat(data.Responses.PivotColumns);
        })
        .catch((error) => {
          this.setState({
            message_desc: "Columns didn't fetch. Kindly repeat this process again.",
            message_heading: "Columns",
            openMessageModal: true,
          })
          // toast.error("Columns didn't fetch. Kindly repeat this process again.");
        });
    }
    return columns;
  }

  componentDidMount = async () => {
    await this.props.currentsessioncheck();
    if (!this.props.isAuthenticated) {
      this.props.history.push("/login", {
        from: '/projects'
      });
    } else {

      let tenantguid = localStorage.getItem("tenantguid");

      await this.setState({
        isLoading: true
      });

      await this.props.getUserEntities(tenantguid);
      await this.setState({
        subscriptions: this.props.getUserEntity
      });
      if (this.props.getUserEntity) {
        localStorage.setItem(
          "completetenent",
          JSON.stringify(this.props.getUserEntity)
        );
      }
      await this.getUserByGuid();
      await this.getUsers(false);
      await this.getprojects();
      await this.verifiySubscriptions();
      await this.getSubscription();
      await this.getActivities();

      if (this.props.getUserEntityErr) {
        this.setState({
          message_desc: "Error While Getting Entities",
          message_heading: "Entities",
          openMessageModal: true,
        })
        // toast.error("Error While Getting Entities");
        this.props.clearStatesCommon();
      }
      if (this.props.getUserEntity) {
        localStorage.setItem(
          "completetenent",
          JSON.stringify(this.props.getUserEntity)
        );
        this.props.clearStatesCommon();
        var entity = JSON.parse(localStorage.getItem("completetenent")).Item;
        const option = [{ label: entity.name, value: entity.guid }];

        await this.switchEntityName(option);
        // toast.success("Entities Get Successfully");
      }

    }

    await this.endOfProject();
    await this.setState({
      isLoading: false
    });

    this.getConfigs();
    this.getConfigsTool();
  };

  endOfProject = async () => {
    let xeroActivity = await localStorage.getItem("xeroActivity");
    if (xeroActivity && xeroActivity !== "null") {
      xeroActivity = JSON.parse(xeroActivity);
      if (this.props.location.state && this.props.location.state.from === "/redirect") {

        let dateTime = new Date().getTime();
        this.activityRecord([
          {
            "User": localStorage.getItem('Email'),
            "Datetime": dateTime,
            "Module": "Project List",
            "Description": "Connect API",
            "ProjectName": xeroActivity['projectName'],
            "Projectguid": xeroActivity['projectGuid'],
            "ColumnName": "",
            "ValueFrom": "",
            "ValueTo": xeroActivity['connectedCompany'],
            "Tenantid": localStorage.getItem('tenantguid')
          }
        ]);
        localStorage.setItem('xeroActivity', null);
      }
    }

    let that = this;
    setInterval(async function () {
      await that.props.currentsessioncheck();
      if (!that.props.isAuthenticated) {
        that.props.history.push('/login', {
          from: '/dashboard'
        });
      }
    }, 120 * 60 * 1000)


    let { allusers, login_user_email } = this.state;
    let user = allusers.find(user => user.Email === login_user_email)
    let xero = JSON.parse(localStorage.getItem('xero'))
    if (
      this.props.history.location.state &&
      this.props.history.location.state.from &&
      this.props.history.location.state.from === "/redirect" &&
      xero && user.XeroTokenObject
    ) {
      let guid = xero.selectedProjectId
      let modal = xero.lastLocation === 'AddProject' ? 'openAddProjectModal' : 'openEditProjectModal'

      if (guid) {
        await API.post("pivot", "/getProjectByGuid", {
          body: { guid }
        })
          .then(async data => {
            await this.setState({
              singleProject: data
            });

            $(document).ready(function () {
              $(this).find('#p-name_edit_project').focus();
            })
          })
          .catch(err => {
            this.setState({
              message_desc: "Project Not Found",
              message_heading: "Project",
              openMessageModal: true,
            })
            // toast.error("Project Not Found");
          });
      }

      await this.getXeroTenants()
      await this.setState({
        [modal]: true
      })
      localStorage.removeItem('xero')
    }

    return true
  };

  getUserByGuid = async () => {
    let guid = localStorage.getItem('guid')
    await API.post("pivot", "/getUserByGuid", {
      body: { guid }
    })
      .then(async data => {

        await this.setState({
          project_access: data.Item.projectAccess,
          user_type: data.Item.type,
          login_user_email: data.Item.Email,
          login_user_tenant: data.Item.tenantguid
        });

      })
      .catch(err => {
        this.setState({
          message_desc: "User Not Found",
          message_heading: "User",
          openMessageModal: true,
        })
        // toast.error("User Not Found");
        this.setState({ openMessageModal: true })
        $(document).ready(function () {
          $(this).find('#ok_button').focus();
        })
      });
    // await this.getImageFromBucket();
  };

  openModal = async name => {
    if (name === "openAddUsersListModal") {
      await this.getUsers();
      $(document).ready(function (e) {
        var u = $(".user_Lists>li:first-child").attr("tabindex");
        // alert(u)
        $('#userFocus_' + u).focus();
        // aaaaaaa
        $('.user_Lists>li:last-child').focus(function () {
          // $('#user_tab_index').focus();  
          var u = $(".user_Lists>li:first-child").attr("tabindex");
          var y = parseInt(u)
          var z = y + 1;
          $('#closed_user').attr('tabindex', z);

        });
      })
    }
    if (name === "openEditEntityModal") {
      let guid = JSON.parse(localStorage.getItem("completetenent")).Item.guid;
      this.setState({ isLoading: true });
      await this.props.getUserEntities(guid);
      await this.getusersagainstentity(guid);
      this.setState({ openEditEntityModal: true });
      $(document).ready(function () {
        $(this).find('#company_edit_entity').focus();
      })
      this.setState({ isLoading: false });
    }
    else if (name === "openAddProjectModal") {
      await this.setState({ isLoading: true })
      await this.getXeroTenants()
      await this.setState({
        openAddProjectModal: true,
        isLoading: false,
      })
      $(document).ready(function () {
        $(this).find('#p-name').focus();
      })
    }
    else {
      this.setState({ [name]: true });
    }
  };

  closeModal = name => {
    this.setState({ [name]: false });
    this.clearStates()
  };

  getUsers = async (openAddUsersModal = true) => {
    let tenantguid = localStorage.getItem("tenantguid");
    await API.get("pivot", "/users")
      .then(data => {
        data.sort(function (a, b) {
          if (a.Email < b.Email) { return -1; }
          if (a.Email > b.Email) { return 1; }
          return 0;
        })
        var filter_user = [];
        if (this.state.user_type == "SYSTEM") {
          this.setState({
            allusers: data,
            openAddUsersListModal: openAddUsersModal
          });
        }

        else {
          for (var b = 0; b < data.length; b++) {
            if (data[b].tenantguid == tenantguid) {
              filter_user.push(data[b])
            }
          }
          this.setState({
            allusers: filter_user,
            openAddUsersListModal: openAddUsersModal
          });
        }

      })
      .catch(err => {
        this.setState({
          message_desc: "All users not found",
          message_heading: "Users",
          openMessageModal: true,
        })
        // toast.error("all users not found");
      });
  };

  handleSwitchEntity = val => {
    const selectedEntity = this.state.selectedEntity;
    selectedEntity.push(val);
    this.setState({ selectedEntity });
    //console.log(this.state.selectedEntity,'this.state.selectedEntity')
  };

  logout = async () => {
    let dateTime = new Date().getTime();
    this.activityRecord([
      {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Projects",
        "Description": "Logout",
        "ProjectName": "",
        "ColumnName": "",
        "ValueFrom": "",
        "ValueTo": "",
        "Tenantid": localStorage.getItem('tenantguid')
      }
    ]);

    await this.props.signinout();
    if (this.props.signoutresult !== "") {
      localStorage.removeItem("guid");
      localStorage.removeItem("tenantguid");
      localStorage.removeItem("Email");
      // toast.success("Successfully Logout");
      this.props.history.push("/login");
    }
  };

  editUser = async (event, guid) => {
    event.stopPropagation();
    let { projects } = this.state
    await this.setState({
      isLoading: true
    });
    await API.post("pivot", "/getProjectByGuid", {
      body: { guid }
    })
      .then(async data => {
        await this.setState({
          singleProject: data
        })
        await this.getXeroTenants()

        $(document).ready(function () {
          $(this).find('#p-name_edit_project').focus();
        })

        await this.setState({
          openEditProjectModal: true,
        });
      })
      .catch(err => {
        this.setState({
          message_desc: "Project Not Found",
          message_heading: "Project",
          openMessageModal: true,
        })
        // toast.error("Project Not Found");
      });
    await this.setState({
      isLoading: false
    });
  };

  goToDashboad = async (event, guid) => {
    let { isSubscriptionExpired, subscribedUsers, subscribedProjects, tenantProjectsLength, projects, user_type, allusers } = this.state;

    if (this.state.login_user_tenant !== "SYSTEM" && isSubscriptionExpired) {
      this.setState({
        message_desc: "Click subscritpion to renew.",
        message_heading: "Subscritpion Expired",
        openMessageModal: true
      });

    } else if (this.state.login_user_tenant !== "SYSTEM" && subscribedProjects < tenantProjectsLength) {
      this.setState({
        message_desc: "Click subscritpion to increase project limit.",
        message_heading: "Project Limit Reached",
        openMessageModal: true
      });

    } else if (this.state.login_user_tenant !== "SYSTEM" && subscribedUsers < allusers.length) {
      this.setState({
        message_desc: " Click subscritpion to increase user limit.",
        message_heading: "User Limit Reached",
        openMessageModal: true
      });

    } else {
      event.stopPropagation();

      let dateTime = new Date().getTime();
      this.activityRecord([
        {
          "User": localStorage.getItem('Email'),
          "Datetime": dateTime,
          "Module": "Project List",
          "Description": "Select Project",
          "ProjectName": projects.find(project => project.guid === guid).Name,
          "Projectguid": projects.find(project => project.guid === guid).guid,
          "ColumnName": "",
          "ValueFrom": "",
          "ValueTo": "",
          "Tenantid": localStorage.getItem('tenantguid')
        }
      ]);

      this.props.history.push("/dashboard", {
        guid,
        projects: projects,
        user_type: user_type,
        from: "/projects"
      });
    }
  };

  switchEntityName = name => {
    this.setState({
      sEntityOptions: name
    });
  };

  NewProjectValue = async (new_project) => {
    await this.setState({
      isLoading: true
    });
    await this.getUsers(false);
    let { allusers, project_access } = this.state;
    let currentUserGuid = localStorage.getItem('guid');
    let currentUserObject = allusers.find(user => user.guid === currentUserGuid);
    let currentUserPA = JSON.parse(JSON.stringify(currentUserObject.projectAccess));

    allusers.map(async (user, index) => {

      let allSelection = true;
      /**
       * If user = current user and type = "Admin" || "Owner".
       */

      if (user.type === "SYSTEM" || user.type === "Admin" || user.type === "Owner") {
        allSelection = true;
      } else {
        // allSelection = currentUserPA.find(cuGuid => !user.projectAccess.includes(cuGuid)) === undefined;
        allSelection = user.ProjectAccessAll ? user.ProjectAccessAll : false;
      }

      if (allSelection === true) {
        user.projectAccess.push(new_project);
        console.log(user.projectAccess);

        await API.post("pivot", "/updatefields", {
          body: {
            table: "PivotUser",
            guid: user.guid,
            fieldname: "projectAccess",
            value: user.projectAccess
          }
        })
          .then(async data => {
            if ((allusers.length - 1) === index) {
              // toast.success("Update Project Access");
            }
          })
          .catch(err => {
            this.setState({
              message_desc: "Can't Update Project Access",
              message_heading: "Project",
              openMessageModal: true,
            })
            // toast.error("Can't Update Project Access");
          });
      }
    });

    project_access.push(new_project);
    await this.setState({
      allusers: allusers,
      newAddedProject: new_project,
      project_access: project_access
    });
    await this.getprojects();
    await this.setState({
      isLoading: false
    });
  }

  // NewProjectValue = async (new_project) => {

  //   await this.setState({
  //     newAddedProject: new_project,
  //     isLoading: true
  //   })
  //   this.state.project_access.push(this.state.newAddedProject);

  //   let user_guid = localStorage.getItem('guid');
  //   await API.post("pivot", "/updatefields", {
  //     body: {
  //       table: "PivotUser",
  //       guid: user_guid,
  //       fieldname: "projectAccess",
  //       value: this.state.project_access
  //     }
  //   })
  //     .then(async data => {
  //       toast.success("Update Project Access");
  //     })
  //     .catch(err => {
  //       toast.error("Can't Update Project Access");
  //     });
  //   this.setState({
  //     isLoading: false
  //   })
  // }

  getusersagainstentity = async (tenant) => {
    await API.post('pivot', '/getusersbytenant', {
      body: {
        tenantguid: tenant
      }
    }).then(data => {

      this.setState({
        usersfortwofactor: data
      })

    }).catch(err => { })
  }

  onEnterKeyProject = (e, v) => {
    if (e.which === 13) {
      e.preventDefault();
      var r = `tofocus_${v}`;
      document.getElementById(r).click()
    }
  }

  // xeroConnection = async (guid) => {
  //   let { projects } = this.state;
  //   let selectedproject = projects.find(project => project.guid === guid);
  //   if(selectedproject.Connection === "XERO") {
  //     await this.setState({
  //       isLoading: true,
  //     });
  //     localStorage.setItem("selectedProjectId", guid);
  //     localStorage.setItem("xeroSelectedProjectXeroDB", selectedproject.XeroDB);
  //     localStorage.setItem('lastLocation', '/projects');
  //     let object = {
  //       "projectName": selectedproject.Name, 
  //       "projectGuid": selectedproject.guid, 
  //       "connectedCompany": ""
  //     }
  //     localStorage.setItem('xeroActivity', JSON.stringify(object));

  //     let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
  //     if (refresh_token && refresh_token !== null && refresh_token !== "") {
  //       await this.deleteXeroApp();
  //     }

  //     window.location.assign(
  //       "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=" + process.env.REACT_APP_XERO_APP_CLIENTID + "&redirect_uri=" + process.env.REACT_APP_XERO_APP_URL + "redirect&scope=openid profile email accounting.reports.read accounting.transactions accounting.settings accounting.reports.read projects offline_access&state=123"
  //     );
  //   } else {
  //     toast.info('Project Connection must be XERO');
  //   }
  // }

  handleSubscription = async () => {
    let dateTime = new Date().getTime();
    let { subscription } = this.state;

    this.activityRecord([
      {
        "User": localStorage.getItem('Email'),
        "Datetime": dateTime,
        "Module": "Project List",
        "Description": "Subscription",
        "ProjectName": "",
        "ColumnName": "",
        "ValueFrom": "",
        "ValueTo": "",
        "Tenantid": localStorage.getItem('tenantguid')
      }
    ]);

    if (subscription) {
      window.open("https://" + subscription, '_blank');
    }
  };

  activityRecord = async (finalarray) => {
    await API.post("pivot", "/addactivities", {
      body: {
        activities: finalarray
      }
    })
      .then(async data => {
        // toast.success('Activity successfully recorded.')
        return true;
      })
      .catch(err => {
        // toast.success('Activity failed to record.')
      });
  };

  getActivities = async () => {
    await API.post("pivot", "/getactivities", {
      body: {
        Tenantid: localStorage.getItem("tenantguid"),
      },
    })
      .then(async (data) => {
        // toast.success("Activities successfully retrieved.");
        await this.setActivities(data)
      })
      .catch((err) => {
        this.setState({
          message_desc: "Activities failed to retrieved.",
          message_heading: "Activities",
          openMessageModal: true,
        })
        // toast.error("Activities failed to retrieved.");
      });
  };

  setActivities = (data) => {
    let { projects } = this.state;

    data = data.sort(function (a, b) {
      var dateA = new Date(a.Datetime), dateB = new Date(b.Datetime);
      return dateB - dateA;
    });

    projects.map(project => {
      let activities = [];
      activities = data.filter(activity => activity.Projectguid === project.guid);
      if (activities.length > 0) {
        activities = activities.sort(function (a, b) {
          var dateA = new Date(a.Datetime), dateB = new Date(b.Datetime);
          return dateB - dateA;
        });
        project['LastActivityUser'] = activities[0].User;
        project['LastActivity'] = activities[0].Datetime;
      }
    });

    this.setState({
      activities: data,
      projects: projects
    });
  };

  addActivities = async (newActivities) => {
    let { activities } = this.state
    activities.concat(newActivities)
    await this.setActivities(activities)
  };

  // deleteXeroApp = async () => {
  //   let refresh_token = JSON.parse(localStorage.getItem("refresh_token"));
  //   let data="token="+refresh_token;
  //   await axios({
  //     method: "POST",
  //     url: "https://identity.xero.com/connect/revocation",
  //     data: data,
  //     headers: {
  //       authorization:
  //         "Basic " +
  //         base64url(
  //           process.env.REACT_APP_XERO_APP_CLIENTID +
  //             ":" +
  //             process.env.REACT_APP_XERO_APP_SECRET_KEY
  //         ),
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   })
  //     .then(async (response) => {
  //       toast.success("Xero App Successfully Deleted.");
  //     })
  //     .catch(async (error) => {
  //       toast.error("Xero App Failed To Delete.");
  //     });
  // }

  verifiySubscriptions = () => {
    let { subscriptions } = this.state;
    if (subscriptions) {
      console.log("verifiySubscriptions", subscriptions);

      let dates = subscriptions.Item.Subscription.map(item => (item.SubscritionExpires * 1000));
      let subscribedUsers = 0;
      let subscribedProjects = 0;
      let currentDate = new Date().getTime();
      let orderedDates = undefined;
      let isSubscriptionExpired = undefined;


      subscriptions.Item.Subscription.map(item => {
        if (item.Users) {
          subscribedUsers += item.Users
        }
        if (item.Projects) {
          subscribedProjects += item.Projects;
        }
      });

      orderedDates = dates.sort((a, b) => {
        return a > b
      });

      orderedDates.map(date => {
        console.log("orderedDates", new Date(date));
      });


      isSubscriptionExpired = new Date(currentDate) > new Date(orderedDates[orderedDates.length - 1]);

      this.setState({
        subscribedUsers,
        subscribedProjects,
        isSubscriptionExpired
      });
    }
  }

  isSubscriptionValid = () => {
    let { isSubscriptionExpired, subscribedUsers, subscribedProjects, tenantProjectsLength, allusers } = this.state;

    if (isSubscriptionExpired) {
      // isSubscriptionExpired is the property which represent that either subscription is expired or not. This is determine by the time.
      return false;

    } else if (subscribedProjects < tenantProjectsLength) {
      // projects.length means length of those projects which are created by the logged-in user and they are still exist.
      return false;

    } else if (subscribedUsers < allusers.length) {
      // allusers.length means length of those users which are created by the tenant(Pivot Company) and they are still exist.
      return false;

    }
    return true;
  }

  refreshXeroToken = async () => {
    let { allusers, login_user_email } = this.state;
    let user = allusers.find(user => user.Email === login_user_email)

    if (user.XeroTokenObject && ((user.XeroTokenObject.expires_at * 1000) < new Date().getTime())) {
      await API.post("pivot", "/xerorefreshtoken", {
        body: {
          clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
          clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
          redirectUris: process.env.REACT_APP_XERO_APP_URL,
          scopes: process.env.REACT_APP_XERO_APP_SCOPES,
          token: user.XeroTokenObject
        }
      })
        .then(async (token) => {

          await API.post('pivot', '/updatefields', {
            body: {
              table: 'PivotUser',
              guid: user.guid,
              fieldname: 'XeroTokenObject',
              value: token
            }
          })
            .then(async () => {
              user.XeroTokenObject = token
              await this.setState({
                allusers
              })
            })
            .catch(err => {
              toast.error('Xero token failed to assign to user.')
            })

        })
        .catch(async (myBlob) => {
          this.setState({
            message_desc: 'Connect to database to refresh data.',
            message_heading: "XERO",
            openMessageModal: true,
          })
          return false
        });
    }
  }

  getXeroTenants = async () => {
    let { allusers, login_user_email } = this.state;
    let user = allusers.find(user => user.Email === login_user_email)
    await this.refreshXeroToken()

    if (user.XeroTokenObject) {
      await API.post('pivot', '/xerotenants', {
        body: {
          clientId: process.env.REACT_APP_XERO_APP_CLIENTID,
          clientSecret: process.env.REACT_APP_XERO_APP_SECRET_KEY,
          redirectUris: process.env.REACT_APP_XERO_APP_URL,
          scopes: process.env.REACT_APP_XERO_APP_SCOPES,
          token: user.XeroTokenObject
        }
      })
        .then(async data => {
          await this.setState({
            tenants: data.tenants
          });
        })
        .catch(error => {
          toast.error('/xerotenants: Failed')
        })
    }
  }

  clearStates = () => {
    this.setState({
      tenants: null,
      addProjectData: null,
      tenants: []
    })
  }

  render() {
    let xeroTenantName =
      localStorage.getItem("xeroTenantName") ?
        localStorage.getItem("xeroTenantName") :
        "";

    return (
      <div className="container-fluid">
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="pl_main_wrapper">
          <div className="row d-flex h-100">
            <div className="col-12 col-lg-6 offset-lg-3 col-md-10 offset-md-1 justify-content-center align-self-center pl_form_mx_width">
              <div className="pl_signup_form_main">
                <div className="pl_signup_header">
                  <div className="row">
                    <img src="/images/2/close.png" onClick={this.logout} className="d-block img-fluid modal_closed_btn" alt="close" />

                    <div className="col-12 col-sm-8 pl_order-xs-2">
                      <h4>Projects</h4>
                    </div>
                    <div className="col-12 col-sm-3 pl_order-xs-1">
                      <img
                        src="/images/pivot.png"
                        className="img-fluid float-right"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 no-padding">
                  <div className="pl_project_modals">
                    {this.state.user_type == 'View' || this.state.user_type == 'Edit' ? '' :
                      <ul>
                        <li>
                          <button
                            id="first_tab_index"
                            tabIndex="1"
                            onClick={() => this.openModal("openAddProjectModal")}
                            type="button"
                            className="pl_theme_btn pl_modal_btn"
                          >
                            <img alt="add" src="/images/p3.png" class="img-fluid float-left width-13" /> Project
                        </button>
                        </li>
                        <li>
                          <button
                            tabIndex="2"
                            onClick={() =>
                              this.openModal("openAddUsersListModal")
                            }
                            type="button"
                            className="pl_theme_btn pl_modal_btn"
                          >
                            <img alt="add" src="/images/p2.png" class="img-fluid float-left width-13" /> Users
                        </button>
                        </li>
                        <li>
                          <button
                            tabIndex="3"
                            onClick={() => this.openModal("openEditEntityModal")}
                            type="button"
                            className="pl_theme_btn pl_modal_btn"
                          >
                            <img alt="add" src="/images/p2.png" class="img-fluid float-left width-13" /> Entity
                        </button>
                        </li>
                        {
                          this.state.user_type === "Owner" ?
                            <li>
                              <button id="sub_id" onClick={this.handleSubscription} type="button" className="pl_theme_btn pl_sub" tabIndex="4">
                                Subscription
                              </button>
                            </li> :
                            <></>
                        }
                      </ul>
                    }
                  </div>
                </div>
                <div className="pl_signup_body">
                  <div className="row">
                    <div className="col-12">
                      <div className="pl_project_scroll">
                        <ul className="pl_project">
                          {this.state.projects.length > 0 ? (
                            this.state.projects.map((p, index) => (



                              <li>
                                <div
                                  className={
                                    "pl_projects_list pointer-cursor" + (this.isSubscriptionValid() ? "" : " pl_red")
                                  }
                                  tabIndex={index + 5}
                                  id={'tofocus_main' + (index + 5)}
                                  onKeyDown={(e) => this.onEnterKeyProject(e, index + 5)}
                                  onClick={(event) => this.goToDashboad(event, p.guid)}
                                >
                                  <img
                                    onClick={(event) => this.editUser(event, p.guid)}
                                    alt="add"
                                    src="/images/p2.png"
                                    class="img-fluid float-left width-13" />

                                  {/* <i
                                      className="fa fa-pencil"
                                      onClick={() => this.editUser(p.guid)}
                                    ></i> */}
                                  <i className={
                                    "fa " + (this.isSubscriptionValid() ? "fa-check" : "fa-times") + " pl_user_label"
                                  }></i>
                                  <div
                                    className="pointer-cursor"
                                    id={'tofocus_' + (index + 5)}
                                  >
                                    {" "}
                                    <h4>{p.Name} </h4>
                                    <p>
                                      Created on {moment(p.Created).format('LLL')}.
                                      </p>
                                    <p>
                                      {
                                        p.LastActivityUser && p.LastActivity ?
                                          "Last activity " + p.LastActivityUser + " " + moment(new Date(p.LastActivity)).format('LLL') :
                                          ""
                                      }
                                    </p>
                                  </div>
                                </div>
                                {/* {
                                      p.Connection === "XERO" ? 
                                      <div 
                                        className="zero_link"> 
                                          <img 
                                            onClick={() => this.xeroConnection(p.guid)} 
                                            alt="add" 
                                            src="/images/iot.png" 
                                            class="img-fluid width-13 d-block mx-auto" />
                                          {p.XeroDB}
                                        </div>
                                        : 
                                      <div></div> 
                                    } */}

                              </li>


                            ))
                          ) : (
                              <p className="pl_center">
                                Click [+ Project] to continue.
                              </p>
                            )}
                          {/* {this.state.projects.map((data, key) => (
                            <li key={key}>
                              <div className="pl_projects_list pl_orange">
                                <i
                                  className="fa fa-pencil"
                                  onClick={() =>
                                    this.openModal("openEditProjectModal")
                                  }
                                ></i>
                                <i className="fa fa-asterisk pl_user_label"></i>
                                <Link to="/dashboard">
                                  {" "}
                                  <h4>The Butcher Series 1 </h4>
                                  <p>
                                    Created on 5-Jul-19. Last activity Kevin
                                    Plummer 7-Jul-19
                                  </p>
                                </Link>
                              </div>
                            </li>
                          ))} */}
                          {/* {this.state.projects.map((data, key) => (
                            <li key={key}>
                              <div className="pl_projects_list">
                                <i
                                  className="fa fa-pencil"
                                  onClick={() =>
                                    this.openModal("openEditProjectModal")
                                  }
                                ></i>

                                <Link to="/dashboard">
                                  {" "}
                                  <h4>The Butcher Series 1 </h4>
                                  <p>
                                    Created on 5-Jul-19. Last activity Kevin
                                    Plummer 7-Jul-19
                                  </p>
                                </Link>
                              </div>
                            </li>
                          ))} */}
                        </ul>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="pl_signup_form">
                        {/*<div className="form-group pl_select dropup-s">
                          <label>Switch Entity:</label>
                          <Select
                            className="width-selector"
                            defaultValue={this.state.sEntityOptions}
                            classNamePrefix="pl_width-selector-inner"
                            options={this.state.sEntityOptions}
                            value={this.state.sEntityOptions}
                            onChange={slectedVal =>
                              this.handleSwitchEntity(slectedVal)
                            }
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
                          />
                        </div>*/}
                        <div className="pl_custom-radio">
                          <label className="pl_remember w-100 text-center">
                            Terms of use. Privacy policy
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal */}
        <EditProjectModal
          openModal={this.state.openEditProjectModal}
          closeModal={() => this.closeModal("openEditProjectModal")}
          singleProject={this.state.singleProject}
          projects={this.state.projectsforaccess}
          project_access_user={this.state.project_access}
          getprojects={this.getprojects}
          required_messages={this.state.required_messages}
          getUserByGuid={() => this.getUserByGuid()}
          allusers={this.state.allusers}
          login_user_email={this.state.login_user_email}
          getUsers={this.getUsers}
          clientID={process.env.REACT_APP_XERO_APP_CLIENTID}
          xeroAppUrl={process.env.REACT_APP_XERO_APP_URL}
          projectsForAddEdit={this.state.projectsForAddEdit}
          getColumsByMultipleTemplates={this.getColumsByMultipleTemplates}
          clearStates={this.clearStates}
          tenants={this.state.tenants}
          addActivities={this.addActivities}
        />

        <AddProjectModal
          openModal={this.state.openAddProjectModal}
          closeModal={() => this.closeModal("openAddProjectModal")}
          projects={this.state.projectsforaccess}
          getprojects={this.getprojects}
          onAddNewProject={this.NewProjectValue}
          required_messages={this.state.required_messages}
          clientID={process.env.REACT_APP_XERO_APP_CLIENTID}
          xeroAppUrl={process.env.REACT_APP_XERO_APP_URL}
          projectsForAddEdit={this.state.projectsForAddEdit}
          getColumsByMultipleTemplates={this.getColumsByMultipleTemplates}
          allusers={this.state.allusers}
          login_user_email={this.state.login_user_email}
          tenants={this.state.tenants}
          addActivities={this.addActivities}
        />

        <AddUsersListModal
          projectslength={this.state.projects.length}
          openModal={this.state.openAddUsersListModal}
          userslist={this.state.allusers}
          getUsers={this.getUsers}
          user_type={this.state.user_type}
          closeModal={() => this.closeModal("openAddUsersListModal")}
          projectsList={this.state.projectsforaccess}
          required_messages={this.state.required_messages}
          login_user_email={this.state.login_user_email}
          subscriptions={this.state.subscriptions}
        />

        <EditEntityModal
          openModal={this.state.openEditEntityModal}
          closeModal={() => this.closeModal("openEditEntityModal")}
          entityresult={this.props.getUserEntity}
          entityValue={value => this.switchEntityName(value)}
          required_messages={this.state.required_messages}
          usersfortwofactor={this.state.usersfortwofactor}
          required_tips={this.state.required_tips}
        />

        <Message
          openModal={this.state.openMessageModal}
          closeModal={() => this.closeModal("openMessageModal")}
          heading={this.state.message_heading.length > 0 ? this.state.message_heading : 'Email/Password'}
        >
          {this.state.message_desc.length > 0 ? this.state.message_desc : "Check and try again."}
        </Message>

        {/* modal end */}
      </div>
    );
  }
}

const mapStateToProps = arg => ({
  isAuthenticated: arg.result.isAuthenticated,
  signoutresult: arg.result.signoutresult,

  dynamocheckemail: arg.result.dynamocheckemail,

  getUserEntity: arg.commonRresult.getUserEntity,
  getUserEntityErr: arg.commonRresult.getUserEntityErr
});
export default connect(
  mapStateToProps,
  { signinout, currentsessioncheck, getUserEntities, checkindynamosignin, clearStatesCommon }
)(Projects);
