import axios from 'axios';
import {
        asyncActionError,
        asyncActionFinish,
        asyncActionStart
} from '../../app/async/asyncReducer';
import { getContacts } from '../contact/contactActions';
import { getUsers } from '../user/userActions';

import {GET_RESPONSE} from './responseConstants';
import {ACCEPT_RESPONSE} from './responseConstants';
import {DENY_RESPONSE} from './responseConstants';

export function getResponse(){
    return async function (dispatch){
 
        try{
            const res = await axios.get("/api/response");
            dispatch({
                type: GET_RESPONSE,
                payload: res.data,
              });
        }
        catch(error){
            console.log(error)
        }
    }
}

export function acceptResponse(userid){
    return async function (dispatch){
        dispatch(asyncActionStart());
     
        try{
            await axios.get(`/api/responseaccept/${userid}`);
            const res = await axios.get("/api/response");

            dispatch({
                type: ACCEPT_RESPONSE,
                payload: res.data,
              });
            
            dispatch(getContacts());
            dispatch(getUsers());
            dispatch(asyncActionFinish());

        }
        catch(error){
            dispatch(asyncActionError(error))

        }
    }
}

export function denyResponse(userid){
    return async function (dispatch){
        dispatch(asyncActionStart());
        try{
            await axios.get(`/api/responsedeny/${userid}`);
            const res = await axios.get("/api/response");

            dispatch({
                type: DENY_RESPONSE,
                payload: res.data,
              });
            dispatch(getUsers());
            dispatch(asyncActionFinish());
        }
        catch(error){
        dispatch(asyncActionError(error))
        }
    }
}