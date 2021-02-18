import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../reducers/auth";
import { useHistory } from "react-router-dom";

//CSS
import "../assets/css/home.css";

//COMPONENTS
import Users from "./components/users";
import Chats from "./components/chat";

export default function Home() {
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);
  const [messages, setmessages] = useState([]);
  const [friends, setfriends] = useState([]);
  const [users, setusers] = useState([]);

  //DISPATCHING USER
  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("user")) {
      let details = JSON.parse(localStorage.getItem("user")).user;
      let token = JSON.parse(localStorage.getItem("token")).token;
      dispatch({
        type: "AUTH_LOGIN",
        payload: { details, token },
      });
    } else {
      history.push("/signin");
    }
  }, [history, dispatch]);

  //ALL USERS
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch("/serverside/api/alluser", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).token,
        },
      })
        .then((res) => res.json())
        .then((res2) => {
          setusers(res2.users);
        })
        .catch((err) => console.log(err));
    }
  }, [users]);

  //FRIENDS
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch("/serverside/api/friends", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).token,
        },
      })
        .then((res) => res.json())
        .then((res2) => {
          setmessages(res2.user.messages);
          setfriends(res2.user.friends);
        })
        .catch((err) => console.log(err));
    }
  }, [friends]);

  const chatsWrapper = () => {
    let element = document.querySelector("#chatsWrapper");
    if (element.classList.contains("chatsWrapperActive")) {
      element.classList.remove("chatsWrapperActive");
    } else {
      element.classList.add("chatsWrapperActive");
    }
  };
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div
          className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12 p-0"
          id="usersWrapper"
        >
          <Users
            toggle={chatsWrapper}
            users={users}
            friends={friends}
            messages={messages}
          />
        </div>
        <div
          className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 p-0"
          id="chatsWrapper"
        >
          <Chats
            toggle={chatsWrapper}
            users={users}
            friends={friends}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
}
