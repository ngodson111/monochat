import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../reducers/auth";

//MOMENT
import Moment from "moment";

export default function ChatHeader({ users, messages, friends, toggle }) {
  const [showinfo, setshowinfo] = useState(false);
  const authContext = useContext(AuthContext);
  //HANDELING REQUEST SENT
  function handelRequestSend(username) {
    fetch("/serverside/api/adduser/" + username, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authContext.data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => {
        if (!res2.message) {
          alert(res2.error);
        }
      })
      .catch((err) => console.log(err));
  }

  function handelUnfriend(username) {
    fetch("/serverside/api/unfriend/" + username, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authContext.data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => console.log(res2))
      .catch((err) => console.log(err));
  }

  function handelDeleteMessage(username) {
    fetch("/serverside/api/deletemessage/" + username, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authContext.data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => console.log(res2))
      .catch((err) => console.log(err));
  }
  return messages
    .filter((i) => {
      if (localStorage.getItem("activeMsg")) {
        return (
          i.username === JSON.parse(localStorage.getItem("activeMsg")).username
        );
      } else {
        return;
      }
    })
    .map((item) => {
      let fr = friends.filter((item1) => item1.username === item.username);
      return (
        <div className="chatHeader" key={item._id}>
          <div className="left">
            <div className="image">
              <img
                src={`userProfile/${item.photo}`}
                alt=""
                className="rounded-circle"
              />
              {users.map((i) =>
                i.username === item.username ? (
                  i.status === "Active" ? (
                    <div className="active" key={item._id}></div>
                  ) : (
                    <div className="inactive" key={item._id}></div>
                  )
                ) : null
              )}
            </div>
            <div className="details">
              <span className="name">@ {item.username}</span>
              <span className="status">
                {users.map((i) =>
                  i.username === item.username
                    ? i.status === "Active"
                      ? i.status
                      : Moment(new Date(i.status)).fromNow()
                    : null
                )}
              </span>
            </div>
          </div>
          <div className="right">
            <i className="fas fa-phone mr-4"></i>
            <i className="fas fa-video mr-4"></i>
            <i
              onClick={() => setshowinfo(!showinfo)}
              className="fas fa-info-circle"
            ></i>
            <i onClick={toggle} className="fas fa-times ml-4"></i>
          </div>
          {!showinfo ? null : (
            <ul className="msgContentPopup">
              {fr.length > 0 ? (
                <li
                  style={{ color: "red" }}
                  onClick={() => handelUnfriend(item.username)}
                >
                  UnFriend
                </li>
              ) : (
                <li
                  className="text-success"
                  onClick={() => handelRequestSend(item.username)}
                >
                  Add Friend
                </li>
              )}
              <li
                onClick={() => handelDeleteMessage(item.username)}
                style={{ color: "red" }}
              >
                Delete Message
              </li>
            </ul>
          )}
        </div>
      );
    });
}
