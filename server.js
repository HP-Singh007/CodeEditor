const express = require("express")
const dotenv = require("dotenv")
const http = require('http')
const cors = require('cors')
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const path = require("path");

//config path
dotenv.config({path:"./src/data/config.env"});

const app = express();
app.use(cors({
    origin: ["http://localhost:3000",process.env.FRONTEND_URL],
    methods: ["GET", "POST"]
}))

app.use(express.static('build'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server,{
cors: {
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
}});

const userSocketMap={};

function getAllClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map(
        (socketId)=>{
        return{
            socketId,
            username:userSocketMap[socketId]
        }
    });
}

io.on('connection',(socket)=>{
    console.log("socket connected : ",socket.id);

    socket.on(ACTIONS.JOIN,({roomId, username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id
            })
        })
        socket.data.username = username;
        socket.data.roomId = roomId;
        socket.data.socketId = socket.id;
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on('disconnecting',()=>{
        const {username,roomId,socketId} = socket.data?socket.data:{};
        socket.to(roomId).emit(ACTIONS.DISCONNECTED,{username,socketId});
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

server.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})

