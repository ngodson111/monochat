import React from "react";

//CSS
import "../../assets/css/chat.css";

//COMPONENTS
import ChatHeader from "./chat/header";
import ChatContent from "./chat/content";

export default function Chats({ users, messages, friends, toggle }) {
  return (
    <div className="container-fluid" id="chats">
      <div className="row justify-content-center p-0">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 p-0">
          <ChatHeader
            toggle={toggle}
            users={users}
            messages={messages}
            friends={friends}
          />
          <ChatContent users={users} messages={messages} friends={friends} />
        </div>
      </div>
    </div>
  );
}
