import {combineReducers} from 'redux';
import asynReducer from '../async/asyncReducer';
import userReducer from '../../features/user/userReducer';
import usersReducer from '../../features/user/usersReducer';
import contactReducer from '../../features/contact/contactReducer';
import requestReducer from '../../features/request/requestReducer';
import responseReducer from '../../features/response/responseReducer';
import messageReducer from '../../features/messages/messageReducers';
import guestReducer from '../../features/guest/guestReducer';

const rootReducer = combineReducers({
    async:asynReducer,
    user:userReducer,
    users:usersReducer,
    contact:contactReducer,
    req:requestReducer,
    res:responseReducer,
    msg:messageReducer,
    guest:guestReducer
})

export default rootReducer;