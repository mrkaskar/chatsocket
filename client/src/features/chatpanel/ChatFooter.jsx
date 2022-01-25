import React,{useEffect, useRef, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {useDispatch} from 'react-redux';
import { sendMessage } from '../messages/messageActions';
let typing = false;
let timeout;

function ChatFooter({guest,socket,user,room}) {
    const [message,setMessage] = useState('')
    const dispatch = useDispatch();
    const messageRef = useRef(null);
   
    useEffect(()=>{
        messageRef.current.focus();
    },[])

    
    useEffect(()=>{
        if(socket && message){
        // clearTimeout(timeout);
        if(!typing){
            socket.emit('typing',{
                uid:user._id,
                to:guest.id,
                room
            })
        typing = true;
        timeout = setTimeout(()=>{
            typing = false;
        },3000)
        }
    }
    return ()=>{
       
    }
    },[message,socket])

    function sendMsg(){
        const uuid = uuidv4();
        socket.emit('sendMessage',{
            uid:user._id,
            message,
            to:guest.id,
            uuid,
            room,
            name:user.name
        })
        setMessage('');
        messageRef.current.focus();
        dispatch(sendMessage(user._id,message,guest.id,uuid,user.name,true))
      
    }

    return (
        <div id="chatFooter">
            <div className='inputbox'>
                <input 
                ref={messageRef}
                onChange={(e)=>{
                    setMessage(e.target.value)
                }} 
                value={message} 
                type="text" 
                className='messageinput' 
                onKeyPress={e=>{
                    if(e.key==="Enter")
                    sendMsg();
                }}
                />
                <span className='sendbtn' onClick={sendMsg}>
                    <li className='fa fa-send'></li>
                </span>
            </div>
        </div>
    )
}

export default ChatFooter
