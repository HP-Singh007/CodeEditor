import React, { useEffect, useRef, useState } from 'react'
import "../styles/EditorPage.css"
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import logo from "../images/logo2.png"

const EditorPage = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const {roomId} = useParams();

  const [clients,setClients] = useState([])

  function handleError(err){
    console.log(err);
    toast.error("Socket connection Error, try again later!");
    reactNavigate("/");
  }

  const init = async()=>{
    socketRef.current = await initSocket();

    socketRef.current.on('connect_error',(err)=>handleError(err));
    socketRef.current.on('connect_failed',(err)=>handleError(err));

    socketRef.current.emit(ACTIONS.JOIN,{
      roomId,
      username : location.state?.username,      
    });

    socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
      if(username != location.state?.username){
        toast.success(`${username} joined the room`);
      }
      setClients(clients);
      socketRef.current.emit(ACTIONS.SYNC_CODE,{socketId,code:codeRef.current})
    })

    socketRef.current.on(ACTIONS.DISCONNECTED,({username,socketId})=>{
      toast.success(`${username} left the room`);
      setClients((prev)=>{
        return prev.filter((client)=>client.socketId != socketId);
      });
    })
  }

  const handleCopy=async()=>{
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied to Clipboard");
    }catch(err){
      console.log(err);
      toast.error("Can't copy to clipboard !");
    }
  }

  const handleLeave=()=>{
    reactNavigate("/");
  }
  
  useEffect(()=>{
    init();
    return ()=>{
      socketRef.current && socketRef.current.off(ACTIONS.JOINED);
      socketRef.current && socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current && socketRef.current.off(ACTIONS.SYNC_CODE);
      socketRef.current && socketRef.current.disconnect();
    }
  },[])
    
  if(!location.state){
    return <Navigate to="/" />
  }

  return (
    <div id="EditorPageMain">
      <div id="sidebar">
        <div>
          <img id='editorLogo' src={logo} alt="CodeCollab" />
        </div>
        <div className='connectedClientsPage'>
            <h2>Connected Clients</h2>
            <div id="connectedClients">
                {
                    clients.map((client)=>(
                        <Client key={client.socketId} username={client.username}/>
                    ))
                }
            </div>
        </div>
        <div id='btnGroup'>
            <div className='editorBtn' id='copyBtn' onClick={handleCopy}>Copy Room ID</div>
            <div className='editorBtn' id='leaveBtn' onClick={handleLeave}>Leave </div>
        </div>
      </div>
      <div id="editorOuter">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}} />
      </div>
    </div>
  )
}

export default EditorPage
