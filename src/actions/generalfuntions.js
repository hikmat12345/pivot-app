import { updatefieldtype, getUserEntity } from "./types";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

export const updatefield = (
  table,
  guid,
  fieldname,
  value
) => async dispatch => {
  await API.post("pivot", "/updatefields", {
    body: {
      table,
      guid,
      fieldname,
      value
    }
  })
    .then(data =>
      dispatch({
        type: updatefieldtype,
        payload: "Sucessfully Update your field"
      })
    )
    .catch(err =>
      dispatch({
        type: "updatefielderr",
        payload: err
      })
    );
};

export const getUserEntities = guid => async dispatch => {
  await API.post("pivot", "/getuserentity", {
    body: {
      tenantguid: guid
    }
  })
    .then(data =>
      dispatch({
        type: getUserEntity,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "getUserEntityErr",
        payload: err
      })
    );
};
export const clearStatesCommon = () => async dispatch => {
  dispatch({
    type: "clearallerrorcommon"
  });
};
