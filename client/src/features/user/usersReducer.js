import { GET_USERS } from './userConstants';

export default function (state = [], {type,payload}){
    switch(type){
        case GET_USERS:
            return payload;
            default:
                return state;
    }
}