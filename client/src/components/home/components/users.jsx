import React, { useRef } from "react";

//CSS
import "../../assets/css/users.css";

//COMPONENTS
import Header from "./users/header";
import AddFriends from "./users/addfriends";
import MessageList from "./users/messagelist";
import RequestList from "./users/requestlist";
import PendingList from "./users/pendinglist";

export default function Users({ users, messages, friends, toggle }) {
  const headerElement = useRef();

  //SCROLLING EFFECT
  function handelScroll(e) {
    if (e.target.scrollTop > 30) {
      headerElement.current.style.boxShadow =
        "3px 0px 10px 0px rgba(34, 34, 34, 0.116)";
    } else {
      headerElement.current.style.boxShadow = "";
    }
  }

  // SEARCHING LIST
  function handelListSearch(e) {
    let keyword = e.target.value;
    let element = document.querySelector(".Messagelist").children;
    for (let i = 0; i < element.length; i++) {
      if (
        element[i].children[0].children[1].children[0].innerHTML
          .toLocaleLowerCase()
          .indexOf(keyword) > -1
      ) {
        element[i].style.display = "";
      } else {
        element[i].style.display = "none";
      }
    }
  }

  return (
    <>
      <div id="users" onScroll={(e) => handelScroll(e)}>
        <Header headerElement={headerElement} />
        <div id="scrollWrapper">
          <main className="search">
            <div className="searchWrapper">
              <i className="fas fa-search mx-2"></i>
              <input
                onChange={(e) => handelListSearch(e)}
                type="text"
                className="w-100"
                placeholder="Search Messages"
              />
            </div>
          </main>
          <main className="usersList">
            <PendingList users={users} friends={friends} />
            <RequestList users={users} friends={friends} />
            <MessageList
              toggle={toggle}
              friends={friends}
              users={users}
              messages={messages}
            />
          </main>
        </div>
      </div>
      <AddFriends users={users} friends={friends} />
    </>
  );
}
