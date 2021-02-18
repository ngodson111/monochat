import React, { useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../reducers/auth";

export default function ChatContent({ users, messages, friends }) {
  const messageInput = useRef();
  const messageContainer = useRef();
  const authContext = useContext(AuthContext);
  const [showOption, setOption] = useState(false);
  const [scroll, setscroll] = useState(true);

  const handelSendMessage = () => {
    if (messageInput.current.value === "") {
      return null;
    }
    fetch("/serverside/api/sendmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authContext.data.token,
      },
      body: JSON.stringify({
        message: messageInput.current.value,
        username: JSON.parse(localStorage.getItem("activeMsg")).username,
        id: JSON.parse(localStorage.getItem("activeMsg")).id,
      }),
    })
      .then((res) => res.json())
      .then((res2) => {
        if (res2.message) {
          messageInput.current.value = "";
          setOption(false);
          setTimeout(() => {
            setscroll(true);
          }, 500);
        }
      })
      .catch((err) => console.log(err));
  };

  function handelSendImage(e) {
    let username = JSON.parse(localStorage.getItem("activeMsg")).username;
    let file = e.target.files[0];
    const data = new FormData();
    data.append("messageImage", file);
    fetch("/serverside/api/sendimage/" + username, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authContext.data.token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res2) => {
        if (res2.message) {
          console.log(res2.message);
          setOption(false);
          setTimeout(() => {
            setscroll(true);
          }, 500);
        }
      })
      .catch((err) => console.log(err));
  }

  function handelSendFile(e) {
    let username = JSON.parse(localStorage.getItem("activeMsg")).username;
    let file = e.target.files[0];
    const data = new FormData();
    data.append("messageFile", file);
    fetch("/serverside/api/sendfile/" + username, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authContext.data.token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res2) => {
        if (res2.message) {
          console.log(res2.message);
          setOption(false);
          setTimeout(() => {
            setscroll(true);
          }, 500);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (scroll) {
      document
        .querySelector(".message")
        .scrollTo(0, messageContainer.current.scrollHeight);
    }
  });

  const cancelScroll = () => {
    setscroll(false);
  };

  return (
    <div className="chatContent">
      <div
        className="message"
        ref={messageContainer}
        onScrollCapture={cancelScroll}
      >
        {messages
          .filter((i) => {
            if (localStorage.getItem("activeMsg")) {
              return (
                i.username ===
                JSON.parse(localStorage.getItem("activeMsg")).username
              );
            } else {
              return;
            }
          })
          .map((item) => {
            return item.message.map((m) => {
              return (
                <div className="MessageItem" key={m._id}>
                  {m.id !==
                  JSON.parse(localStorage.getItem("user")).user._id ? (
                    <div className="left mt-1">
                      <img
                        className="userimg"
                        src={`userProfile/${item.photo}`}
                        alt=""
                      />

                      {m.identifier === "photo" ? (
                        <img
                          className="msgimg rounded ml-3"
                          src={`messageImage/${m.msg}`}
                          alt=""
                        />
                      ) : null}
                      {m.identifier === "text" ? (
                        <div className="msg ml-3">
                          <span>{m.msg}</span>
                        </div>
                      ) : null}
                      {m.identifier === "file" ? (
                        <div className="msg ml-3">
                          <a
                            className="text-dark"
                            href={`messageFile/${m.msg}`}
                            download
                          >
                            {m.msg}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="right mt-1">
                      {m.identifier === "photo" ? (
                        <img
                          className="msgimg rounded ml-3"
                          src={`messageImage/${m.msg}`}
                          alt=""
                        />
                      ) : null}
                      {m.identifier === "text" ? (
                        <div className="msg ml-3">
                          <span>{m.msg}</span>
                        </div>
                      ) : null}
                      {m.identifier === "file" ? (
                        <div className="msg ml-3">
                          <a
                            className="text-white"
                            download
                            href={`messageFile/${m.msg}`}
                          >
                            {m.msg}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            });
          })}
      </div>
      <div className="createMessage">
        <i
          onClick={() => setOption(!showOption)}
          title="Send Image"
          className="fas fa-plus mr-4"
        ></i>
        {!showOption ? null : (
          <ul className="msgoptionContentPopup">
            <li
              onClick={() => document.querySelector("#sendimagetouser").click()}
            >
              Send Photo
              <input
                type="file"
                id="sendimagetouser"
                style={{ display: "none" }}
                onChange={(e) => handelSendImage(e)}
                accept=".jpg,.png,.jpeg"
              />
            </li>
            <li
              onClick={() => document.querySelector("#sendfiletouser").click()}
            >
              Send File
              <input
                type="file"
                id="sendfiletouser"
                style={{ display: "none" }}
                onChange={(e) => handelSendFile(e)}
              />
            </li>
            <li>Send Voice</li>
          </ul>
        )}
        <input
          placeholder="Type a message..."
          type="text"
          className="w-100"
          ref={messageInput}
        />
        <span onClick={handelSendMessage} className="ml-4">
          Send
        </span>
      </div>
    </div>
  );
}
