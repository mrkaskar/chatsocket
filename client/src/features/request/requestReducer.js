import {GET_REQUEST} from './requestConstants';
import {SEND_REQUEST} from './requestConstants';

export default function (state = [], {type,payload}){
    switch(type){
        case GET_REQUEST:
            return payload;
            case SEND_REQUEST:
                return payload;
            default:
                return state;
    }
}

