import axios from 'axios';
import {
        asyncActionError,
        asyncActionFinish,
        asyncActionStart
} from '../../app/async/asyncReducer';
import {GET_CONTACTS} from './contactConstants';

export function getContacts(){
    return async function (dispatch){
        try{
            const res = await axios.get("/api/contacts");
          

            dispatch({
                type: GET_CONTACTS,
                payload: res.data,
              });
         
        }
        catch(error){
        console.log(error)
        }
    }
}

export function deleteContact(userid,room){
    return async function (dispatch){
        dispatch(asyncActionStart());
        try{
        await axios(`/api/deletecontact/${userid}/${room}`);
        dispatch(asyncActionFinish());
        dispatch(getContacts());
        }
        catch(err){
            dispatch(asyncActionError());
        }
      
    }
}