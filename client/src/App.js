import React, { useReducer } from "react";
import { BrowserRouter, Route } from "react-router-dom";

//COMPONENTS
import Home from "./components/home/home";
import Signin from "./components/signin/signin";
import Signup from "./components/signup/signup";
import { AuthContext, authReducer, initialState } from "./reducers/auth";

const Routes = () => {
  return (
    <>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
    </>
  );
};

function App() {
  const [data, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ data, dispatch }}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
