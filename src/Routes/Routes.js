import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { AppliedRoute } from "../Components/AppliedRoute/AppliedRoute";
import ResetPassword from "../Containers/ResetPassword/ResetPassword"
import WizardLogin from "../Containers/WizardLogin/WizardLogin";
import WizardEntity from "../Containers/WizardEntity/WizardEntity";
import WizardSecurity from "../Containers/WizardSecurity/WizardSecurity";
import Login from "../Containers/Login/Login";

import LoginSecurity from "../Containers/LoginSecurity/LoginSecurity";
import LoginChangePassword from "../Containers/LoginChangePassword/LoginChangePassword";
import Projects from "../Containers/Projects/Projects";
import signup_security from "../Containers/signup_security/signup_security";
// import Redirect from "../Containers/Common/Redirect/redirect";
import CurrentRedirect from "../Containers/Common/Redirect/currentRedirect";
import reportpdf from "../Containers/Common/reportpdf/reportpdf";
import designer from "../Containers/Common/reportpdf/designer";


import Login_l3 from "../Containers/Login_l3/Login_l3";
import Dashboard from "../Containers/Dashboard/Dashboard";
import Signup_s1 from "../Containers/Signup_s1/Signup_s1";
import Signup_s3 from "../Containers/Signup_s3/Signup_s3";
import Activity from "../Containers/Dashboard2/Dashboard2";
// import Projects_List from "../Containers/Projects_List/Projects_List";

const My404Component = () => {
  return <h3>404 - Not found</h3>;
};

export default childProps => (
  <Router>
    <Switch>
      <AppliedRoute path="/" exact component={Login} props={childProps} />
      <AppliedRoute path="/reportpdf" exact component={reportpdf} props={childProps} />
      <AppliedRoute path="/designer" exact component={designer} props={childProps} />
      <AppliedRoute
        path="/wizard-login"
        exact
        component={WizardLogin}
        props={childProps}
      />
      <AppliedRoute
        path="/wizard-entity"
        exact
        component={WizardEntity}
        props={childProps}
      />
      <AppliedRoute
        path="/wizard-security"
        exact
        component={WizardSecurity}
        props={childProps}
      />
      <AppliedRoute path="/login" exact component={Login} props={childProps} />
     
      <AppliedRoute
        path="/login-security"
        exact
        component={LoginSecurity}
        props={childProps}
      />
      <AppliedRoute
        path="/login-change-password"
        exact
        component={LoginChangePassword}
        props={childProps}
      />
      <AppliedRoute
        path="/projects"
        exact
        component={Projects}
        props={childProps}
      />
      <AppliedRoute
        path="/login-3"
        exact
        component={Login_l3}
        props={childProps}
      />
      <AppliedRoute
        path="/signup"
        exact
        component={Signup_s1}
        props={childProps}
      />
      <AppliedRoute
        path="/signup-3"
        exact
        component={Signup_s3}
        props={childProps}
      />
      <AppliedRoute
        path="/dashboard"
        exact
        component={Dashboard}
        props={childProps}
      />
      <AppliedRoute
        path="/activity"
        exact
        component={Activity}
        props={childProps}
      />
      <AppliedRoute
        path="/signup-security"
        exact
        component={signup_security}
        props={childProps}
      />
      {/* <AppliedRoute
        path="/redirect"
        exact
        component={Redirect}
        props={childProps}
      /> */}
      <AppliedRoute
        path="/redirect"
        exact
        component={CurrentRedirect}
        props={childProps}
      />

      <AppliedRoute
        path="/reset-password"
        exact
        component={ResetPassword}
        props={childProps}
      />

      {/* <AppliedRoute path="/projects" exact component={Projects_List} props={childProps} /> */}
      <AppliedRoute path="*" exact={true} component={My404Component} />
    </Switch>
  </Router>
);
