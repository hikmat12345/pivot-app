import React from "react";
import { Route } from "react-router-dom";

export const AppliedRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route {...rest} render={props => <C {...props} {...cProps} />} />
);
