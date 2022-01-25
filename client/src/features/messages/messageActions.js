import axios from 'axios';

import {
    GET_MESSAGE,
    SEND_MESSAGE,
    ARRIVE_MESSAGE,
    CLEAR_MESSAGE
} from './messageConstants';


export function getMessage(roomid,limit){
    return async function (dispatch){
        try{
            const res = await axios.get(`/api/messages/${roomid}/${limit}`);
            dispatch({
                type: GET_MESSAGE,
                payload: res.data,
              });
        }
        catch(error){
         console.log(error)
        }
    }
}

export function sendMessage(uid,message,to,uuid,name,newmsg){
    return function (dispatch){
       dispatch({
           type:SEND_MESSAGE,
           payload:{
               message,
               from:uid,
               uuid,
               name,
               newmsg
           }
       })
    }
}

export function arriveMessage(message,from,name){
    return function (dispatch){
       dispatch({
           type:ARRIVE_MESSAGE,
           payload:{
               message,
               from,
               name
           }
       })
    }
}

export function clearMessage(){
    return function (dispatch){
       dispatch({
           type:CLEAR_MESSAGE
       })
    }
}
