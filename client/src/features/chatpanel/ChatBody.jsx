import React,{useRef,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux';
import { useState } from 'react';
import { arriveMessage, getMessage } from '../messages/messageActions';
import FlipMove from 'react-flip-move';
import axios from 'axios';
import { asyncActionFinish, asyncActionStart } from '../../app/async/asyncReducer';

function ChatBody({socket, user,room}) {
    const msg = useSelector(state=>state.msg);
    const dispatch = useDispatch();
    const messageEndRef = useRef(null);
    const [limit,setLimit] = useState(20);
    const messageStartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const guest = useSelector(state=>state.guest);
    const scrollRef = useRef(null);
    const [sendStatus, setSendStatus] = useState("fa fa-clock-o")
    
    useEffect(() => {
        dispatch(getMessage(room,limit));
        messageEndRef.current.scrollIntoView();
    }, [dispatch,room,guest])
    useEffect(() => {
        messageEndRef.current.scrollIntoView();
    }, [])
    useEffect(() => {
        if(!loaded)
        messageEndRef.current.scrollIntoView();
    }, [msg])
    

    useEffect(()=>{

        if(socket && guest.id){
        
            socket.on('arrivemessage',({uid,message,name,gid})=>{
            if(gid === user._id && uid === guest.id){
                dispatch(arriveMessage(message,uid,name))
            }else{
                setSendStatus('fa fa-check')
            }
        })
    }
    return ()=>{
        if(socket)
        socket.off('arrivemessage')
    }
    },[socket,guest.id])

    async function loadMsg(){
            setLoading(true);
            setLoaded(true);
            setLimit(prev=>prev+20);
            await dispatch(getMessage(room,limit));
            setTimeout(()=>{
                setLoading(false);
                setLoaded(false);
            },1000)
           
    }
    async function deleteMsg(uuid){
        dispatch(asyncActionStart())
            await axios(`/api/deletemessage/${uuid}`)
        dispatch(asyncActionFinish())
    }
    return (
        <div id="chatBody">
            <div ref={scrollRef} tabIndex={0} id="message-wrapper" onScroll={e=>{
                 if(e.target.scrollTop === 0){
                     loadMsg()
                     e.target.scrollTop = 10;
                 }
            }}>
                <div id='messages'>
                <div className="load" style={{opacity:loading?'1':'0'}} ref={messageStartRef}></div>
                <FlipMove leaveAnimation={false}>
                    {msg.map((e, i) => {
                    return <div key={i} className={e.from === guest.id ? 'other' : 'self'}>
                        <div key={i} className={e.from === guest.id ? 'othermessage' : 'selfmessage'}>
                            <span className={e.from === guest.id ? 'guestname' : 'selfname'}>{
                            
                            e.name.split(' ').length > 1 ? e.name.split(' ')[0]+" "+e.name.split(' ')[1] : e.name
                            
                            }</span>
                        {e.from !== guest.id && <span className="deleteMsg" onClick={(eve)=>{
                            eve.target.parentNode.parentNode.removeChild(eve.target.parentNode);
                            deleteMsg(e.uuid)}}>x</span>}
                        {e.message}
                        {e.newmsg && e.from !== guest.id && i===msg.length - 1 ? <i className={`sendS ${sendStatus}`}></i> : ''}
                        </div>
                    </div>
                    })}
                </FlipMove>
                <div style={{opacity:'0'}} ref={messageEndRef}>hello</div>
                </div>
             

            </div>
        </div>
    )
}

export default ChatBody
