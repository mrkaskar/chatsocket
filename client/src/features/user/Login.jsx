import React, { useEffect, useState } from 'react'
import './Login.css';

function Login() {
    return (
        <div id="login">
            <img id="logo" src="images/logo.png" alt="logo" />
            <a id="google" href="/auth/google"><img src="images/google.png" alt="google" />Continue with Google</a>
            <a id="facebook" href="/auth/facebook"><img src="images/facebook.png" alt="facebook" />Continue with Facebook</a>
        </div>
    )
}

export default Login
