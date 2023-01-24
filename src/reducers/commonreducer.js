import { updatefieldtype, getUserEntity } from "../actions/types";

const initialState = {
  fieldupdatestatus: "",
  fieldupdateerr: "",
  
  getUserEntity: '',
  getUserEntityErr: ''
};
export default function(state = initialState, action) {
  switch (action.type) {
    case updatefieldtype:
      return {
        ...state,
        fieldupdatestatus: action.payload
      };

    case "updatefielderr":
      return {
        ...state,
        fieldupdateerr: action.payload
      };
      case getUserEntity:
        if(action.payload!={}){
          localStorage.setItem(
            "temptenant",
            JSON.stringify(action.payload)
          );}
        return {
          ...state,
          getUserEntity: action.payload
        };
  
      case "getUserEntityErr":
        return {
          ...state,
          getUserEntityErr: action.payload
        };
    case "clearallerrorcommon":
      return {
        fieldupdatestatus: "",
        fieldupdateerr: "",
        getUserEntity: '',
        getUserEntityErr: ''
      };
    default:
      return {
        ...state
      };
  }
}
