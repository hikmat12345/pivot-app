import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Routes from "./Routes/Routes";
import "./App.css";
import { Provider } from "react-redux";
import store from "./Components/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
  render() {
    const childProps = {};
    return (
      <Provider store={store}>
        <div>
          <ToastContainer />
          <Routes childProps={childProps} />
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);
