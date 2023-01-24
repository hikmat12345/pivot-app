import {
  signup,
  signin,
  signupconfirm,
  confirmsignin,
  signout,
  currentsession,
  emailuser,
  clearstates,
  forgotPassword,
  updatePassword,
  changePassword
} from "../actions/types";

const initialState = {
  updatePasswordErr: "",
  updatePassword: "",
  signupresult: "",
  signinresult: '',
  errorsignup: "",
  errorsignin: "",
  confirmsignin: {},
  confirmsigninerr: "",
  signoutresult: "",
  confirmsignupdata: "",
  confirmsignuperr: "",
  signouterr: "",
  isAuthenticated: false,
  dynamocheckemail: [],
  dynamoerror: "",
  forgotPassword: "",
  forgotPasswordErr: "",
  changePassword: "",
  changePasswordErr: ""
};
export default function(state = initialState, action) {
  switch (action.type) {
    case signup:
      return {
        ...state,
        signupresult: action.payload
      };

    case "signuperr":
      return {
        ...state,
        errorsignup: action.payload
      };
    case signin:
      return {
        ...state,
        signinresult: action.payload
      };

    case "signinerror":
      return {
        ...state,
        errorsignin: action.payload
      };
    case confirmsignin:
      return {
        ...state,
        signinresult: action.payload
      };

    case "confirmsigninerr":
      return {
        ...state,
        errorsignin: action.payload
      };
    case signout:
      return {
        ...state,
        signoutresult: action.payload
      };
    case "signouterr":
      return {
        ...state,
        signouterr: action.payload
      };
    case currentsession:
      return {
        ...state,
        isAuthenticated: true
      };
    case "currentsessionerr":
      return {
        ...state,
        isAuthenticated: false
      };
    case emailuser:
      if (action.payload.length) {
        if(action.payload[0].guid){
          localStorage.setItem(
            "guid", action.payload[0].guid
          );
        }
        if(action.payload[0].tenantguid){
          localStorage.setItem(
            "tenantguid", action.payload[0].tenantguid
          );
        }
        if(action.payload[0].Email){
          localStorage.setItem(
            "Email", action.payload[0].Email
          );
        }
      }
      return {
        ...state,
        dynamocheckemail: action.payload
      };
    case "emailusererr":
      console.log("mmmm", action.payload);
      return {
        ...state,
        dynamoerror: action.payload
      };

    case signupconfirm:
      return { ...state, confirmsignupdata: action.payload };
    case "signupconfirmerr":
      return {
        ...state,
        confirmsignuperr: action.payload
      };
    case clearstates:
      return {
        ...state,
        updatePasswordErr: "",
        updatePassword: "",
        errorsignup: "",
        errorsignin: "",
        confirmsignuperr: "",
        confirmsigninerr: "",
        forgotPassword: "",
        forgotPasswordErr: "",
        dynamoerror: "",
        signouterr: "",
        changePassword: "",
        changePasswordErr: ""
      };
    case "clearallstates":
      return {
        updatePasswordErr: "",
        updatePassword: "",
        signupresult: "",
        forgotPassword: "",
        forgotPasswordErr: "",
        signinresult: '',
        errorsignup: "",
        errorsignin: "",
        confirmsignin: {},
        confirmsigninerr: "",
        signoutresult: "",
        confirmsignupdata: "",
        confirmsignuperr: "",
        signouterr: "",
        isAuthenticated: false,
      //  dynamocheckemail: [],
        dynamoerror: ""
      };

    case forgotPassword:
      return {
        ...state,
        forgotPassword: action.payload
      };
    case "forgotPasswordErr":
      return {
        ...state,
        forgotPasswordErr: action.payload
      };
    case updatePassword:
      return {
        ...state,
        updatePassword: action.payload
      };
    case "updatePasswordErr":
      return {
        ...state,
        updatePasswordErr: action.payload
      };
    case changePassword:
      return {
        ...state,
        changePassword: action.payload
      };
    case "changePasswordErr":
      return {
        ...state,
        changePasswordErr: action.payload
      };
    default:
      return state;
  }
}
