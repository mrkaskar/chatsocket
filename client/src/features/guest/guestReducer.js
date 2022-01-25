import {GET_GUEST} from './guestConstants';


export default function (state = {}, {type,payload}){
    switch(type){
        case GET_GUEST:
            return payload;
            default:
                return state;
    }
}

