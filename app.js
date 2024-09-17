const express = require('express');
const path = require("path");
const app = express();
const dotenv = require('dotenv')

const http = require('http');
const socket = require('socket.io');

const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(dotenv())

io.on("connection", (socket)=>{
    socket.on("send-location", (data)=>{
        console.log(data);
        
      io.emit("receive-location", {id: socket.id, ...data})
    })

    socket.on("disconnect", ()=>{
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", (req,res)=>{
    res.render("index")
});

server.listen(process.env.PORT || 5000);