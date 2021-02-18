import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../../reducers/auth";

export default function Header({ headerElement }) {
  const history = useHistory();
  const [settingPopup, setsettingPopup] = useState(false);
  const { data, dispatch } = useContext(AuthContext);

  //HANDELING SIGNOUT
  const handelSignout = () => {
    //UPDATING STATUS
    fetch("/serverside/api/offline", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + data.token,
      },
    })
      .then((res) => res.json())
      .then((res2) => {
        if (!res2.error) {
          dispatch({
            type: "AUTH_SIGNOUT",
          });
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("activeMsg");
          history.push("/signin");
        } else {
          alert(res2.error);
        }
      })
      .catch((err) => console.log(err));
  };

  //HANDELING PROFILE CHANGE
  const handelProfileChangeToggler = () => {
    document.querySelector("#uploadimage").click();
  };
  function handelProfileChange(e) {
    let file = e.target.files[0];
    const data = new FormData();
    data.append("profileImg", file);
    fetch("/serverside/api/updateprofile", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + data.token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res2) => {
        if (res2.details) {
          //STORING ON LOCALSTORAGE
          localStorage.setItem("user", JSON.stringify({ user: res2.details }));
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <header className="header" ref={headerElement}>
      <div className="left">
        <div className="image">
          <img
            src={`userProfile/${
              localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).user.photo
                : "initialUser.png"
            }`}
            alt=""
          />
        </div>
        <span className="ml-3">Chats</span>
      </div>
      <div className="right">
        <div className="settings">
          <i
            onClick={() => setsettingPopup(!settingPopup)}
            className="fas fa-cog mr-2"
          ></i>
          {!settingPopup ? null : (
            <ul className="settingPopup">
              <li onClick={handelProfileChangeToggler}>
                <span>Change Profile</span>
                <input
                  id="uploadimage"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handelProfileChange(e)}
                  accept=".jpg,.png,.jpeg"
                />
              </li>
              <li onClick={handelSignout}>Signout</li>
              <li>Delete Account</li>
            </ul>
          )}
        </div>
        <div className="newChat">
          <i
            className="fas fa-plus"
            data-toggle="modal"
            data-target="#Addfriends"
          ></i>
        </div>
      </div>
    </header>
  );
}
