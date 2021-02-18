import React from "react";

//MOMENT
import Moment from "moment";

export default function MessageList({ messages, users, friends, toggle }) {
  // POPUP TOGGLE
  // if (messages.length > 0) {
  //   let element = document.querySelector(".Messagelist").children;
  //   for (let i = 0; i < element.length; i++) {
  //     element[i].children[1].addEventListener("click", (e) => {
  //       for (let j = 0; j < element.length; j++) {
  //         if (j === i) {
  //           if (element[j].children[2].classList.contains("popupinActive")) {
  //             element[j].children[2].classList = "popup";
  //           } else {
  //             element[j].children[2].classList = "popup popupinActive";
  //           }
  //         } else {
  //           element[j].children[2].classList = "popup popupinActive";
  //         }
  //       }
  //       console.log(i);
  //     });
  //   }
  // }
  //HANDELING REQUEST SENT
  // function handelRequestSend(username) {
  //   fetch("/serverside/api/adduser/" + username, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + authContext.data.token,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res2) => {
  //       if (!res2.message) {
  //         alert(res2.error);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }

  // function handelUnfriend(username) {
  //   fetch("/serverside/api/unfriend/" + username, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + authContext.data.token,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res2) => console.log(res2))
  //     .catch((err) => console.log(err));
  // }

  // function handelDeleteMessage(username) {
  //   fetch("/serverside/api/deletemessage/" + username, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + authContext.data.token,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res2) => console.log(res2))
  //     .catch((err) => console.log(err));
  // }

  function activeMessage(username, id) {
    localStorage.setItem(
      "activeMsg",
      JSON.stringify({ username: username, id: id })
    );
  }

  return (
    <>
      <div className="title">
        <span>Contacts</span>
      </div>
      <div className="Messagelist">
        {messages
          .sort((a, b) => {
            if (b.message.length > 0 && a.message.length > 0) {
              return (
                new Date(b.message[b.message.length - 1].time) -
                new Date(a.message[a.message.length - 1].time)
              );
            } else {
              return new Date(b.time) - new Date(a.time);
            }
          })
          .filter((i) => i.state === "approved")
          .map((item) => {
            if (!localStorage.getItem("activeMsg")) {
              localStorage.setItem(
                "activeMsg",
                JSON.stringify({ username: item.username, id: item._id })
              );
            }
            return (
              <div className="userLi" key={item._id} onClick={toggle}>
                <div
                  className="left"
                  onClick={() => activeMessage(item.username, item._id)}
                >
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
                    <span className="ml-3 name">@{item.username}</span>
                    <span className="status">
                      {item.message.length > 0
                        ? item.message[item.message.length - 1].identifier ===
                          "photo"
                          ? "Send a Photo : " +
                            Moment(
                              new Date(
                                item.message[item.message.length - 1].time
                              )
                            ).fromNow()
                          : item.message[item.message.length - 1].identifier ===
                            "file"
                          ? "Send a File : " +
                            Moment(
                              new Date(
                                item.message[item.message.length - 1].time
                              )
                            ).fromNow()
                          : item.message[item.message.length - 1].msg.split(" ")
                              .length -
                              1 <
                            2
                          ? item.message[item.message.length - 1].msg +
                            " :" +
                            Moment(
                              new Date(
                                item.message[item.message.length - 1].time
                              )
                            ).fromNow()
                          : `${
                              item.message[item.message.length - 1].msg.split(
                                " "
                              )[0]
                            } ${
                              item.message[item.message.length - 1].msg.split(
                                " "
                              )[1]
                            }  ${
                              item.message[item.message.length - 1].msg.split(
                                " "
                              )[2]
                            }... : ${Moment(
                              new Date(
                                item.message[item.message.length - 1].time
                              )
                            ).fromNow()}`
                        : "Start a Chat"}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
