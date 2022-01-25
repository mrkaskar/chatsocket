import axios from 'axios';
import {
        asyncActionError,
        asyncActionFinish,
        asyncActionStart
} from '../../app/async/asyncReducer';
import {GET_GUEST} from './guestConstants';

export function getGuest(room){
    return async function (dispatch){
        dispatch(asyncActionStart());
       
        try{
            const res = await axios.get("/api/contacts");
            const guest = res.data.filter(e=>e.room === room)[0];
            dispatch({
                type:GET_GUEST,
                payload:guest
            })
        dispatch(asyncActionFinish());

        }
        catch(error){
            dispatch(asyncActionError());
        }
    }
}