import React,{useEffect, useState} from 'react'
import {useSelector} from 'react-redux';

function ChatHeader({online,socket}) {
  const guest = useSelector(state=>state.guest);
  const [status, setStatus] = useState("Loading");
  

  useEffect(()=>{
    setStatus(online.includes(guest.id) ? 'Online':'Offline');
  },[online,guest])

  useEffect(()=>{
    if(socket && guest.id){
        socket.on('arriveTyping',({uid,name,gid})=>{
        if(uid === guest.id){
           setStatus('Typing');
           setTimeout(()=>{
            setStatus('Online');
           },3000)
        }
    })
}
  return ()=>{
    
  }
},[socket,guest.id])
    return (
        <>
        <div className='chatheader'>
        <div className='userimg'>
          <img
            className='uimg'
            src={guest.pic}
            alt="Guest Photo"
          />
        </div>
        <p className='username'>{guest.name}</p>
      </div>
      <div className='status'>
      <span className={online.includes(guest.id) ? 'useronline':'useroffline'}></span>
          <span className='userstatus'>{status}</span>
      </div>
      </>
    )
}

export default ChatHeader
