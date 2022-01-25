import axios from 'axios';
import {
        asyncActionError,
        asyncActionFinish,
        asyncActionStart
} from '../../app/async/asyncReducer';
import { GET_USER } from './userConstants';
import { GET_USERS } from './userConstants';

export function getUser(){
    return async function (dispatch){
        dispatch(asyncActionStart());
        try{
            const res = await axios.get("/api/user");
            dispatch({
                type: GET_USER,
                payload: res.data,
              });
            dispatch(asyncActionFinish());
        }
        catch(error){
        dispatch(asyncActionError(error))
        }
    }
}
export function getUsers(){
    return async function (dispatch){
        dispatch(asyncActionStart());
        try{
            const res = await axios.get("/api/users");
            dispatch({
                type: GET_USERS,
                payload: res.data,
              });
            dispatch(asyncActionFinish());
        }
        catch(error){
        dispatch(asyncActionError(error))
        }
    }
}