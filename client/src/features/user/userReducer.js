import { GET_USER } from './userConstants';

export default function (state = {}, {type,payload}){
    switch(type){
        case GET_USER:
            return payload[0];
            default:
                return state;
    }
}