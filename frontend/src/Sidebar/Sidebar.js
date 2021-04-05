import { useState, useEffect } from "react";
import "./Sidebar.css"
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat/SidebarChat";
import axios from "../Axios";
import { useStateValue } from "../StateProvider";
// import { GoogleLogout } from "react-google-login";
// import { actionTypes } from "../reducer";
// import { useHistory } from "react-router-dom";


const Sidebar = () => {
    const [rooms, setRooms] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    // const history = useHistory();

    useEffect(() => {
        axios.get("/rooms").then((response) => setRooms(response.data)).catch(error => console.log(error));
    }, []);

    // const logout = () => {
    //     dispatch({
    //         user: null,
    //         type: actionTypes.SET_USER,
    //     });
    //     history.push("/auth");
    // };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.imageUrl || "https://avatars.githubusercontent.com/u/69106317?s=400&u=d37e6d1ef96eecc000a6b1f90671833532aaf2e0&v=4"} />
                <div className="sidebar__headerRight">
                {/* <GoogleLogout
      clientId="407551877909-iqectq5mla3tsf4m69cqn3stm1rj8mbo.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
    >
    </GoogleLogout> */}
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new Chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {rooms.map((room) => (
                    <SidebarChat key={room._id} roomName={room.name} id={room._id} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;