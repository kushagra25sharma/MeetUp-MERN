import express from "express";
import Message from "./Messages.js";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import { Room } from "./Messages.js";
import dotenv from "dotenv";


const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    useTLS: true
});

app.use(express.json());

app.use(cors());

mongoose.connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.6nepz.mongodb.net/whatsappDB`, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.once("open", () => {
    console.log("db is connected");
    const msgCollection = db.collection("messages");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => { // whenever a change occur we will save it in and use it iin the function
        console.log("change: ", change);
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            console.log("messageDetails: ", messageDetails);
            // 1st parameter ("messages") is the name of the channel 2nd is event ("inserted") we are inserting a new data and 3rd is the data we are inserting
            pusher.trigger("messages", "inserted", 
                {
                    message: messageDetails.message,
                    name: messageDetails.name,
                    timestamp: messageDetails.timestamp,
                    recieved: messageDetails.recieved
                });
        } else {
            console.log("Error triggering the pusher");
        }
    });
});


app.get("/", (req, res) => {
    return res.status(200).send("Hello from the server");
});


app.post("/createRoom", async (req, res) => {
    const room = req.body;
    const message = new Message({
        message: `Welcome to ${room.name}`,
        name: "Chat Bot",
        timestamp: new Date().toDateString(),
        received: false,
    });
    try {
        await message.save();
        const chatArray = [message];
        const newRoom = new Room({
            name: room.name,
            messages: chatArray,
        });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(409).json(error);
    }

});


app.get("/rooms", async (req, res) => {
    try {
        const rooms = await Room.find();

        res.status(200).json(rooms);
    } catch (error) {
        res.status(409).json(error);
    }
});


app.get("/rooms/:roomId", async (req, res) => {
    const roomId= req.params.roomId;
    try {
        const room = await Room.findById(roomId);

        res.status(200).json(room.name);
    } catch (error) {
        res.status(409).json(error);
    }
});


// app.delete("/rooms/:roomId", async (req, res) => {
//     const roomId = req.parms.roomId;
//     if (!mongoose.Types.ObjectId.isValid(roomId)) return res.status(404).send(`No room with id: ${roomId}`);

//     await Room.findByIdAndRemove(roomId);
//     res.json({ message: "Room deleted successfully" });
// });


app.get("/messages/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    
    try{
        const room = await Room.findById(roomId);
        const messages = room.messages;

        res.status(200).json(messages);
    } catch (error) {
        res.status(404).json(error);
    }
});


app.post("/create/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    const newMessage = new Message({
        message: req.body.message,
        name: req.body.name,
        timestamp: req.body.timestamp,
        received: req.body.received,
    });
    try {
        await newMessage.save();

        const room = await Room.findById(roomId);
        room.messages.push(newMessage);

        await room.save();
        
    } catch (error) {
        res.status(409).json(error);
    }
});


// app.delete("/messages/delete/:roomId/:messageId", async (req, res) => {
//     const roomId = req.params.roomId;
//     const messageId = req.params.messageId;
//     try {
//        await Room.findOneAndUpdate({_id: roomId}, { $pull: {messages: { _id: messageId }}});
//        res.json({message: "Message deleted"});
        
//     } catch (error) {
//         res.json({message: error});
//     }
// });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

