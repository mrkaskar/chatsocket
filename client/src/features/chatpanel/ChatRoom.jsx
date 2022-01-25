import React from 'react'
import "./ChatRoom.css";
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import ChatBody from './ChatBody';
import { useEffect } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { clearMessage, getMessage } from '../messages/messageActions';
import { getGuest } from '../guest/guestActions';

function ChatRoom({online,room,socket}) {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const guest = useSelector(state=>state.guest);


    useEffect(()=>{
        dispatch(clearMessage());
        dispatch(getMessage(room,20));
        if(guest && user && socket){
        socket.emit('joinroom',{
            uid:user._id,
            room,
            name:user.name
        })
        dispatch(getGuest(room));        
    }
    return ()=>{
       
    }
    },[socket,room])

    return (
        guest ? 
        <div id="chatRoom">
            <ChatHeader online={online} socket={socket} />
            <ChatBody socket={socket} user={user} room={room}/>
            <ChatFooter guest={guest} socket={socket} user={user} room={room}/>
        </div>
        :
        <div id="chatRoom">
            <h1 style={{textAlign:'center'}}>Wrong Room!</h1>
        </div>
    )
}

export default ChatRoom
