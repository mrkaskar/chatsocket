import {GET_RESPONSE} from './responseConstants';
import {ACCEPT_RESPONSE} from './responseConstants';
import {DENY_RESPONSE} from './responseConstants';

export default function (state = [], {type,payload}){
    switch(type){
        case GET_RESPONSE:
            return payload;
            case ACCEPT_RESPONSE:
                return payload;
                case DENY_RESPONSE:
                    return payload;
            default:
                return state;
    }
}

