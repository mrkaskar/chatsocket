import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getUser, getUsers } from "../../features/user/userActions";
import { getRequest, sendRequest } from "../../features/request/requestActions";
import { getResponse, acceptResponse, denyResponse } from "../../features/response/responseActions";
import { getContacts } from '../../features/contact/contactActions';
import { Link } from 'react-router-dom';
import Loading from "../../app/layout/Loading";
import '../../css/chat.css';
import Modal from './Modal';

function Sidebar({socket,online,children,room}) {
    const dispatch = useDispatch();

    //selectors
    const user = useSelector((state) => state.user);
    const { loading } = useSelector((state) => state.async);
    const contacts = useSelector((state) => state.contact);
    const allusers = useSelector((state) => state.users);
    const req = useSelector((state) => state.req);
    const res = useSelector((state) => state.res);
    //states

    const [sidebar, setSidebar] = useState("noactive");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
   
    useEffect(() => {
        dispatch(getUser());
        dispatch(getContacts());
        dispatch(getUsers());
        dispatch(getRequest());
        dispatch(getResponse());
        return () => {
        }
    }, [dispatch])

    useEffect(()=>{
        if(room)
        setSidebar("active");
    },[room])

    useEffect(() => {
        if (allusers.length > 0) {
            const result = allusers.filter(e => {
                return e.name.toLowerCase().includes(search);
            });
            setSearchResult(result);
            if (!search)
                setSearchResult([]);
        }
    }, [search, allusers])

    useEffect(() => {
        function setsearch() {
            setSearchResult([]);
        }
        if (searchResult.length !== 0) {
            window.addEventListener('click', setsearch)
        }
        
        return () => window.removeEventListener('click', setsearch)
    }, [searchResult])




    return (
        <>
            {loading && <Loading />}
            <div className='wrapper d-flex align-items-stretch'>
                <nav id='sidebar' className={sidebar}>
                    <div className='custom-menu'>
                        <button
                            type='button'
                            id='sidebarCollapse'
                            className='btn btn-primary'
                            onClick={(e) => {
                                e.stopPropagation();
                                sidebar==="active" ? setSidebar("noactive") : setSidebar("active")}}
                        >

                            <i
                                className='fa fa-outdent'
                                aria-hidden='true'
                                style={{ marginTop: "5px" }}></i>
                            <span className='sr-only'>Toggle Menu</span>
                        </button>
                    </div>
                    <div className='p-4 pt-5'>
                        <h1>
                            <Link to="/chat" className='logo'>
                                <img src="/images/logo.png"/>
                            </Link>
                        </h1>
                        <ul className='list-unstyled components mb-5'>
                            <li><img alt="userphoto" style={{ width: '30px', borderRadius: '50%', marginRight: '20px' }} src={user.pic} />{user.name}</li>
                            <hr style={{ backgroundColor: "white" }} />
                            <li>Contact Lists</li>
                            {contacts.map((e, i) => {
                                return <Link key={i} to={`/chat?room=${e.room}`}><li className='users'>
                                    <span className={online.includes(e.id) ? 'connect':'disconnect'}></span>
                                    <img src={e.pic} />
                                    <span className="contactname">{e.name}</span>
                                    <Modal did={e.id} room={e.room} socket={socket}/>
                                </li></Link>
                            })}

                            <hr style={{ backgroundColor: "white" }} />
                            {res.length > 0 && <>
                                <li>To Response</li>
                                {
                                    res.map((e, i) => {
                                        return <li key={i} className="rusers">
                                            <img src={e.pic} />
                                            <span>{e.name}</span>
                                            <i id={`a${e.id}`} onClick={(e)=> {   

                                                dispatch(acceptResponse(e.target.id.substring(1)))   
                                                socket.emit('acceptResponse',{
                                                    to:e.target.id.substring(1)
                                                })

                                                }} title="Accept" className="fa fa-comment"></i>
                                            <i id={`d${e.id}`} onClick={(e)=> {

                                                dispatch(denyResponse(e.target.id.substring(1)))
                                                socket.emit('denyResponse',{
                                                    to:e.target.id.substring(1)
                                                })
   
                                                }} title="Deny" className="fa fa-minus-square"></i>
                                        </li>
                                    })
                                }
                                <hr style={{ backgroundColor: "white" }} />
                            </>
                            }

                            {req.length > 0 && <><li>Request Lists</li>

                                {
                                    req.map((e, i) => {
                                        return <li key={i} className="rusers"><img src={e.pic} /><span>{e.name}</span></li>
                                    })
                                }

                                <hr style={{ backgroundColor: "white" }} /></>}



                            <li>Search Users</li>

                            <input
                                className='search form-control'
                                style={{ color: "white" }}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    //   if(allusers)
                                }}
                            />
                            <div className="searchResult">
                                {searchResult.length > 0 && searchResult.map((e, i) => {
                                    return <li className="searchlist" key={i} onClick={(event) => {
                                        event.stopPropagation();
                                    }}><img alt="userphoto" src={e.pic} />{e.name}<i id={`z${e._id}`} onClick={(e) => {
                                        setSearch('');
                                        setSearchResult([]);
                                        dispatch(sendRequest(e.target.id.substring(1)));
                                        socket.emit('sendRequest',{
                                            to:e.target.id.substring(1)
                                        })

                                    }} title="Request" className="fa fa-commenting"></i></li>
                                })}
                            </div>
                            <Link to="/"><li className='logout'>Switch Account</li></Link>
                   
                        </ul>
                    </div>
                </nav>
                {children}
            </div>
        </>
    )
}

export default Sidebar
