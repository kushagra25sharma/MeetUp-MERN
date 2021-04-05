import { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { MoreVert, SearchOutlined, AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import axios from "../Axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useStateValue } from "../StateProvider";
import Pusher from "pusher-js";


const Chat = () => {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState(0);
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();


useEffect(() => {
    //console.log("here3");
    axios.get(`/messages/${roomId}`).then((response) => {
      setMessages(response.data);
    }).catch((error) => console.log("error in retrieving messages: ", error));
    //console.log("here4");
  }, [roomId]);

  useEffect(() => {
    //console.log("here1");
    const pusher = new Pusher('b17e54db683ce3dee640', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind("inserted", (newMessage) => {
      //console.log("here22");
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });

    //console.log("here5");
    return () => {
      //console.log("here6");
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);

  console.log(messages);

    useEffect(() => {
        if(roomId){
            // axios.get(`/messages/${roomId}`).then((response) => {
            //     setMessages(response.data);
            // }).catch((error) => console.log("error in retrieving messages: ", error));

            axios.get(`/rooms/${roomId}`).then((response) => {
                setRoomName(response.data);
            }).catch((error) => console.log("error in retrieving roomName: ", error));
        }
    }, [roomId]);


    useEffect(() => {
        setSeed(Math.floor(Math.random()*5000));
    }, []);


    const handleSubmit = async (event) =>{
        event.preventDefault();
        await axios.post(`/create/${roomId}`, {
            message: input,
            name: user,
            timestamp: moment().format('LT'),
            received: false,
        });
        setInput("");
    }

    // const deleteFunction = (messageId) =>{
    //     const confirm = prompt("Type Y to delete the message");
    //     if(confirm?.length){
    //         axios.delete(`/messages/delete/${roomId}/${messageId}`);
    //     }
    // }


    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last message at{" "} {messages[messages.length - 1]?.timestamp}</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton><SearchOutlined /></IconButton>
                    <IconButton><AttachFile /></IconButton>
                    <IconButton><MoreVert /></IconButton>
                </div>
            </div>
            
            <div className="chat__body" >
                {messages.map((message, index) => (
                    <p  key={message._id} className={`chat__message ${message.name === user?.givenName && "chat__reciever"} ${!index && "chat__welcome"}`}>
                        {index > 0 && <span className="chat__name">{message.name}</span>}
                        {message.message}
                        {index > 0 && <span className="chat__timestamp">{message.timestamp}</span>}
                    </p>
                ))}
            </div>
            

            <div className="chat__footer">
                <IconButton><InsertEmoticon /></IconButton>
                <form>
                    <input placeholder="Type a message" type="input" value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit" onClick={handleSubmit} >Send the message</button>
                </form>
                <Mic />
            </div>

        </div>
    );
}

export default Chat;
