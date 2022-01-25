import axios from 'axios';
import {
        asyncActionError,
        asyncActionFinish,
        asyncActionStart
} from '../../app/async/asyncReducer';
import { getUsers } from '../user/userActions';

import {GET_REQUEST} from './requestConstants';
import {SEND_REQUEST} from './requestConstants';

export function getRequest(){

    return async function (dispatch){

      
        try{
            const res = await axios.get("/api/request");

            dispatch({
                type: GET_REQUEST,
                payload: res.data,
              });
      
        }
        catch(error){
         console.log(error)
        
        }
    }
}

export function sendRequest(userid){
    return async function (dispatch){
        dispatch(asyncActionStart());
        try{
            await axios.get(`/api/requestcontact/${userid}`);
            const res = await axios.get("/api/request");
            dispatch({
                type: SEND_REQUEST,
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