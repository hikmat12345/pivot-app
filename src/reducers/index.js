import { combineReducers } from 'redux';
import importgeneralreducer from './generalreducer';
import commonreducer from './commonreducer';
export default combineReducers({

    result:importgeneralreducer,
    commonRresult:commonreducer
})