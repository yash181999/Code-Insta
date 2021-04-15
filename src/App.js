import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Home from "./Views/Home";
import Login from "./Views/Login";
import Profile from "./Views/Profile";
import Signup from "./Views/SignUp";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log("The User Is >>>", authUser);

      if (authUser) {
        //the user is logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        console.log("logged out");
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [auth]);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/home">
            <Navbar />
            <Home />
          </Route>

          <Route exact path="/signup">
            <Signup />
          </Route>

          <Route exact path="/profile">
            <Navbar />
            <Profile/>
          </Route>

          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
