import {
    GET_MESSAGE,
    SEND_MESSAGE,
    ARRIVE_MESSAGE,
    CLEAR_MESSAGE
} from './messageConstants';


export default function (state = [], {type,payload}){
    switch(type){
        case GET_MESSAGE:
            return payload.reverse();
            case SEND_MESSAGE:
                return [...state,payload];
                case ARRIVE_MESSAGE:
                    return [...state,payload];
                    case CLEAR_MESSAGE:
                        return [];
                        default:
                            return state;
    }
}

