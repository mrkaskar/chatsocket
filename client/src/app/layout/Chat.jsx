import React,{useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import SideBar from '../../features/sidebar/Sidebar';
import ChatRoom from '../../features/chatpanel/ChatRoom';
import io from "socket.io-client";
import { useState } from 'react';
import { getResponse } from '../../features/response/responseActions';
import { getRequest } from '../../features/request/requestActions';
import { getContacts } from '../../features/contact/contactActions';
import {useHistory, useLocation} from 'react-router-dom';


// const ENDPOINT = "localhost:5000/";
let socket;

function Chat() {
    const search = useLocation().search;
    const room = new URLSearchParams(search).get('room');
    const user = useSelector((state) => state.user);
    const [online, setOnline] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    let join = false;
    useEffect(()=>{
        var timeout = setTimeout(()=>{
            if(!user._id)
            history.push("/");
        },5000)
        return()=>{
            clearTimeout(timeout)
        }
    },[user])

    useEffect(()=>{
        if(socket && room){
        socket.on('updateDelete',({did,droom})=>{
            if(did === user._id){
                dispatch(getContacts());
                if(room === droom){
                    history.push('/chat');
                }
            }
        })
        return ()=>{
            socket.off('updateDelete')
        }
    }
    },[room])

    useEffect(()=>{
        if(user._id && !join){
            socket = io();
            socket.emit('join',{
            uid:user._id
        })
        socket.on('updateOnline',message=>{
            setOnline(message);
        })

        socket.on('updateResponse',({to})=>{
            if(to === user._id){
                dispatch(getResponse());
            }
        })

        socket.on('updateRequestandContact',({to})=>{
            if(to === user._id){
           
                dispatch(getRequest());
                dispatch(getContacts());
            }
        })

        socket.on('updateRequest',({to})=>{
           
            if(to === user._id){
         
                dispatch(getRequest());
            }
        })

        join = true;
    }
    return ()=>{
      
    }
    },[user])

    return (
        <div>
            <SideBar socket={socket} online={online.map(e=>e.uid)} room={room}>
                    {room && <ChatRoom online={online.map(e=>e.uid)} room={room} socket={socket}/>}
            </SideBar>
           
        </div>
    )
}

export default Chat
