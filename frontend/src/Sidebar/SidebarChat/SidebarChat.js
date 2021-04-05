import { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "../../Axios";


const SidebarChat = ({ addNewChat, id, roomName }) => {
    const [seed, setSeed] = useState(0);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(id){
            axios.get(`/messages/${id}`).then((response) => {
                setMessages(response.data);
            }).catch((error) => console.log("error in retrieving messages: ", error));
        }
    }, [id]);
 
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => {
        const input = prompt("add new room name");
        if(input.length){
            axios.post("/createRoom", {
                name: input,
            });
        }
    }


    return (
        (!addNewChat) ? (
            <Link to={`/rooms/${id}`} >
                <div className="sidebarChat">
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div key={id} className="sidebarChat__info" >
                        <h1>{roomName}</h1>
                        <p>{messages[messages.length - 1]?.message.substring(0,50)}
                           <span style={{color: "green"}}>{messages[messages.length -1]?.message.length > 50 && "  ....."}</span>
                        </p>
                    </div>
                </div>
            </Link>
        ) : (
            <div className="sidebarChat" onClick={createChat} >
                <h2>Add new Chat</h2>
            </div>
        )
    );
}

export default SidebarChat;