import React, { useRef, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

//CSS
import "../assets/css/signup.css";

//IMAGE
import Auth from "../assets/img/Auth1.png";
import { AuthContext } from "../../reducers/auth";

export default function Signup() {
  const history = useHistory();
  const username = useRef();
  const password = useRef();

  const { dispatch } = useContext(AuthContext);

  //DISPATCHING USER IF LOGIN
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

  //HANDELING SIGNUP
  const handelSignup = () => {
    if (username.current.value !== "" || password.current.value !== "") {
      fetch("/serverside/api/createuser", {
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
                  history.push("/home");
                }
              })
              .catch((err) => console.log(err));
          } else {
            alert(res2.error);
            username.current.value = "";
            password.current.value = "";
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("empty fields");
    }
  };
  return (
    <div className="container-fluid" id="signup">
      <div className="row justify-content-center">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 p-0">
          <div id="wrapper">
            <div className="heading">
              <img src={Auth} alt="" />
              <span>Signup</span>
            </div>
            <div className="form">
              <div className="username">
                <span>username</span>
                <input ref={username} type="text" />
              </div>
              <div className="password">
                <span>password</span>
                <input ref={password} type="password" />
              </div>
              <hr />
              <button onClick={handelSignup}>Signup</button>
              <button onClick={() => history.push("/signin")}>Signin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
