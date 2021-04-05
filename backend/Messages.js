import mongoose from "mongoose";

// const whatsappSchema = new mongoose.Schema({
//     message: String,
//     name: String,
//     timeStamp: String,
//     recieved: Boolean
// });

const messageSchema = new mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

const roomSchema = new mongoose.Schema({
    name: String,
    messages: [messageSchema],
});

const Room = mongoose.model("room", roomSchema);

const Message = mongoose.model("message", messageSchema);

export { Room };

export default Message;


// const roomSchema = new mongoose.Schema({
//     name: String,
//     messages: [whatsappSchema],
// });

// const Room = mongoose.model("room", roomSchema);

// export { Room };

// export default mongoose.model("message", whatsappSchema);