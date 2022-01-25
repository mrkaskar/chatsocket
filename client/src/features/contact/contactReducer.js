import {GET_CONTACTS} from './contactConstants';

export default function (state = [], {type,payload}){
    switch(type){
        case GET_CONTACTS:
            return payload;
            default:
                return state;
    }
}

