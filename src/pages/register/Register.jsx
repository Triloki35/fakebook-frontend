import React from 'react';
import "./register.css";
import { useRef } from 'react';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const matchPassword = useRef();
    const navigate = useNavigate();
    const handleRegister = async(e) => {
        e.preventDefault();
        if(matchPassword.current.value !== password.current.value){
            matchPassword.current.setCustomValidity("Password don't match");
        }else{
            const user = {
                username : username.current.value,
                email : email.current.value,
                password : password.current.value,
            }
            try {
                const res = await axios.post("/auth/register",user);
                console.log(res.data);    
                navigate("/login");
            } catch (error) {
                console.log(error);
            }
        }

       
    }
  return (
    <div className='registerContainer'>
        <div className="registerWrapper">
            <div className="registerLeft">
                <h1 className='registerLogo'>fakebook</h1>
                <span className='registerDesc'>Connecting with your friends, family and people you know.</span>
            </div>
            <div className="registerRight">
                <form className="registerBox" onSubmit={handleRegister}>
                    <input required type="text" className='registerInput' placeholder="Username" ref={username}  />
                    <input required type="email" className='registerInput' placeholder='Email' ref={email}/>
                    <input required minLength={6} type="password" className='registerInput' placeholder='Password'ref={password} />
                    <input required type="password" className='registerInput' placeholder='Repeat Password' ref={matchPassword} />
                    <button className='registerButton' type='submit'>Sign Up</button>
                    <hr />
                    <Link to={"/login"} style={{textDecoration:"none",textAlign:"center"}}><span className='already'>Already have an account?</span></Link>
                </form>
            </div>
        </div>
    </div>
  )
}
