import {
  signup,
  signin,
  confirmsignin,
  signout,
  currentsession,
  emailuser,
  clearstates,
    forgotPassword,
    changePassword,
updatePassword
,signupconfirm} from "./types";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
export const signupfunc = (
  username,
  email,
  password
 
) => async dispatch => {
  await Auth.signUp({
    username: username,
    password: password,
    attributes: {
      email: email
    }
  })
    .then(data =>
      dispatch({
        type: signup,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "signuperr",
        payload: err
      })
    );
};
export const signinfunc = (username, password) => async dispatch => {
  await Auth.signIn(username, password)
    .then(data =>
      dispatch({
        type: signin,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "signinerror",
        payload: err
      })
    );
};
export const signinconfirm = (user, code, mfaType) => async dispatch => {
    
  await Auth.confirmSignIn(user, code, mfaType)
    .then(data =>
      dispatch({
        type: confirmsignin,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "confirmsigninerr",
        payload: err
      })
    );
};

export const signinout = () => async dispatch => {
  await Auth.signOut()
    .then(data =>{
      dispatch({
        type: signout,
        payload: data
      })
          
      localStorage.removeItem("guid");
      localStorage.removeItem("tenantguid");
      localStorage.removeItem("tenantguids");
      localStorage.removeItem("Email");
      localStorage.removeItem("templateguid");
      // localStorage.removeItem("ToolTip");
      localStorage.removeItem("completetenent");
      // localStorage.removeItem("RequiredMessages");      
      localStorage.removeItem("xeroActivity");
      localStorage.removeItem("xeroSelectedProjectXeroDB");
      localStorage.removeItem("selectedProjectId");
      localStorage.removeItem("xeroTenantId");
      localStorage.removeItem("token");
      localStorage.removeItem("lastLocation");
      localStorage.removeItem("access_token");
      localStorage.removeItem("temptenant");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("xeroTenantName");
  }
    )
    .catch(err =>
      dispatch({
        type: "signouterr",
        payload: err
      })
    );
};
export const currentsessioncheck = () => async dispatch => {
   
  await Auth.currentSession()
    .then(data =>
      dispatch({
        type: currentsession,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "currentsessionerr",
        payload: err
      })
    );
};

export const checkindynamosignin = (email,password) => async dispatch => {
  await API.post("pivot", "/usergetbyemail", {
    body: {
      email: email,
      password: password
    }
  })
    .then(data =>
      dispatch({
        type: emailuser,
        payload: data
      })
    )
    .catch(err =>
      dispatch({
        type: "emailusererr",
        payload: err
      })
    );
};
export const signupconfirmcog =  (username,code) =>async dispatch=>{
    
   await Auth.confirmSignUp(username, code, {
   
       
}).then(data => dispatch({
        type:signupconfirm,
        payload:data
    }))
  .catch(err => dispatch({
        type:"signupconfirmerr",
        payload:err
    }));
    
}

export const clearStates = () => async dispatch => {
  dispatch({
    type: clearstates
  });
  
};
export const clearallstates = ()=>async dispatch=>{
  dispatch({
    type:"clearallstates"
  })
}
//forgot password
export const forgotPasswordFun = username => async dispatch => {

await Auth.forgotPassword(username)
.then(data =>
dispatch({
type: forgotPassword,
payload: data
})
)
.catch(err =>
dispatch({
type: "forgotPasswordErr",
payload: err
})
);
};
//update password in dynamo
export const updatePasswordInDynamo = (email, Password) => async dispatch => {
await API.post("pivot", "/updatePassword", {
body: {
email,
Password
}
})
.then(data =>
dispatch({
type: updatePassword,
payload: "Sucessfully Updated Password In Dynamo"
})
)
.catch(err =>
dispatch({
type: "updatePasswordErr",
payload: err
})
);
};

//change password in cognito
export const changePasswordFun = (oldPassword, newPassword) => async dispatch => {
await Auth.currentAuthenticatedUser()
.then(user => {
return Auth.changePassword(user, oldPassword, newPassword);
})
.then(data =>
dispatch({
type: changePassword,
payload: data
})
)
.catch(err =>
dispatch({
type: "changePasswordErr",
payload: err
})
);
};