import React, { useState } from 'react'
import "../styles/Home.css"
import {v4} from "uuid"
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import logo from "../images/Logo maker project.png"

const Home = () => {
    const navigate = useNavigate();
    const [roomId,setRoomId] = useState();
    const [username,setUsername] = useState("");

    const createRoomId = (e)=>{
        e.preventDefault();
        const id = v4();
        setRoomId(id);
        toast.success("Room Created Successfully");
    }

    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error("Please fill all fields");
            return;
        }

        //redirect
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            }
        });
    }

    const handleInputEnter=(e)=>{
        if(e.key==='Enter'){
            joinRoom();
        }
    }

    return (
        <div id="HomePage">
            <div id="loginPage">
                <div className="loginPageLeft">
                    <img src={logo} id='homeLogo' alt="codeCollab" />
                </div>
                <div className='loginPageRight'>
                    <h1>JOIN ROOM</h1>
                    <div className='roomfield'>
                        <input type="text" placeholder='Room ID' value={roomId} onChange={(e)=>setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
                        <input type="text" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)} onKeyUp={handleInputEnter}/>
                        <button onClick={joinRoom}>Enter</button>
                    </div>
                    <div className='createNewRoom'>Don't have Room Id ? 
                        <span id='newRoomBtn' onClick={createRoomId}> Create new room</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
