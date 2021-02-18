import React, { useContext } from "react";
import { AuthContext } from "../../../../reducers/auth";

export default function RequestList({ friends, users }) {
  const { data } = useContext(AuthContext);

  function handelApprove(username) {
    fetch("/serverside/api/approverequest/" + username, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => console.log(res2))
      .catch((err) => console.log(err));
  }
  function handelDecline(username) {
    fetch("/serverside/api/declinerequest/" + username, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => console.log(res2))
      .catch((err) => console.log(err));
  }
  return (
    <>
      {friends.filter((i) => i.state === "request").length > 0 ? (
        <div className="title">
          <span>Message Request</span>
        </div>
      ) : null}
      <div className="Requestlist">
        {friends
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .filter((i) => i.state === "request")
          .map((item) => {
            return (
              <div className="reqLi" key={item._id}>
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
                    <span className="ml-3 name">@{item.username}</span>
                    <span
                      className="status"
                      style={{ fontWeight: "800", color: "black" }}
                    >
                      Hi ✌
                    </span>
                  </div>
                </div>
                <div className="right">
                  <i
                    onClick={() => handelApprove(item.username)}
                    className="fas fa-check mr-2 text-success"
                  ></i>
                  <i
                    onClick={() => handelDecline(item.username)}
                    className="fas fa-times text-danger"
                  ></i>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
