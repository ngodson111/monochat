import React, { useContext } from "react";

//MOMENT JS
import Moment from "moment";
import { AuthContext } from "../../../../reducers/auth";

export default function AddFriends({ friends, users }) {
  const authContext = useContext(AuthContext);

  //SEARCH HANDEL
  const handelSearch = (e) => {
    let keyword = e.target.value;
    let parent = document.querySelector(".modal-body").children;
    for (let i = 0; i < parent.length; i++) {
      if (
        parent[i].children[0].children[1].children[0].innerHTML
          .toLocaleLowerCase()
          .indexOf(keyword) > -1
      ) {
        parent[i].style.display = "";
      } else {
        parent[i].style.display = "none";
      }
    }
  };

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
  return (
    <>
      <div
        className="modal fade"
        id="Addfriends"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="Wrapper">
                <i className="fas fa-search mr-3"></i>
                <input
                  type="text"
                  className="w-100"
                  placeholder="Search users @name"
                  onChange={handelSearch}
                />
                <span data-dismiss="modal" className="ml-2">
                  &times;
                </span>
              </div>
            </div>
            <div className="modal-body">
              {users
                .filter(
                  (i) =>
                    i._id !== JSON.parse(localStorage.getItem("user")).user._id
                )
                .map((item) => {
                  let fr = friends.filter(
                    (item1) => item1.username === item.username
                  );
                  return fr.length > 0 ? null : (
                    <div className="userSearch" key={item._id}>
                      <div className="left">
                        <div className="image">
                          <img
                            src={`userProfile/${item.photo}`}
                            alt=""
                            className="rounded-circle"
                          />
                          {item.status === "Active" ? (
                            <div className="active"></div>
                          ) : (
                            <div className="inactive"></div>
                          )}
                        </div>
                        <div className="details">
                          <span className="ml-3 name">@{item.username}</span>
                          <span className="status">
                            {item.status === "Active"
                              ? item.status
                              : Moment(new Date(item.status)).fromNow()}
                          </span>
                        </div>
                      </div>
                      <div
                        className="right"
                        onClick={() => handelRequestSend(item.username)}
                      >
                        <span className="mr-1">Hi</span>
                        <span>✌</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
