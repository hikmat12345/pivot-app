import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Amplify from "aws-amplify";
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID
  },
      Storage: {
      region:process.env.REACT_APP_S3_REGION,
      bucket: process.env.REACT_APP_S3_BUCKET,
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID
    },
  API: {
    endpoints: [
      {
        name: "pivot",
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_API_REGION
      }
    ]
  }
});

ReactDOM.render(
  <Router>
    {" "}
    <App />{" "}
  </Router>,
  document.getElementById("root")
);

serviceWorker.unregister();

//=========================================================


