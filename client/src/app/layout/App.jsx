import React from "react";
import { Route } from "react-router-dom";
import Chat from './Chat';
import Login from '../../features/user/Login';

function App(){
    return <>
    <Route exact path="/" component={Login}></Route>
    <Route exact path="/chat" component={Chat}></Route>
    </>
};
export default App;