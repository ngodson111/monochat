import React, { useRef, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

//CSS
import "../assets/css/signin.css";

//IMAGE
import Auth from "../assets/img/Auth1.png";
import { AuthContext } from "../../reducers/auth";

export default function Signin() {
  const history = useHistory();
  const username = useRef();
  let [rememberUser, setrememberUser] = useState();
  const password = useRef();
  const remember = useRef();
  const { dispatch } = useContext(AuthContext);

  //DISPATCHING USER DETAILS IF LOGIN
  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      let details = JSON.parse(localStorage.getItem("user")).user;
      let token = JSON.parse(localStorage.getItem("token")).token;
      dispatch({
        type: "AUTH_LOGIN",
        payload: { details, token },
      });
      history.push("/home");
    }
  }, [history, dispatch]);

  //CHECKING FOR REMEMBER USERNAME
  useEffect(() => {
    //REMEMBER BUTTON ACTION
    if (localStorage.getItem("remember")) {
      setrememberUser(localStorage.getItem("remember"));
    }
  }, []);

  //HANDELING SIGNIN
  const handelSignin = () => {
    if (username.current.value !== "" || password.current.value !== "") {
      fetch("/serverside/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.current.value,
          password: password.current.value,
        }),
      })
        .then((res) => res.json())
        .then((res2) => {
          if (!res2.error) {
            //DISPATCHING SIGNIN
            dispatch({
              type: "AUTH_LOGIN",
              payload: res2.details,
            });
            //STORING ON LOCALSTORAGE
            localStorage.setItem(
              "user",
              JSON.stringify({ user: res2.details })
            );
            localStorage.setItem(
              "token",
              JSON.stringify({ token: res2.token })
            );

            //REMEMBERING THE USER
            if (remember.current.checked) {
              localStorage.setItem("remember", res2.details.username);
            }
            history.push("/home");
          } else {
            alert(res2.error);
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("empty fields");
    }
  };
  return (
    <div className="container-fluid" id="signin">
      <div className="row justify-content-center">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 p-0">
          <div id="wrapper">
            <div className="heading">
              <img src={Auth} alt="" />
              <span>Welcome</span>
            </div>
            <div className="form">
              <div className="username">
                <span>username</span>
                <input ref={username} defaultValue={rememberUser} type="text" />
              </div>
              <div className="password">
                <span>password</span>
                <input ref={password} type="password" />
              </div>
              <div className="remember">
                <input type="checkbox" ref={remember} />
                <span>Remember username</span>
              </div>
              <hr />
              <button onClick={handelSignin}>Signin</button>
              <button onClick={() => history.push("/signup")}>Signup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
