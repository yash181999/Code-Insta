import { Explore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import { useGlobalContext } from "./context";
import { auth, db } from "./firebase";
import { useStateValue } from "./StateProvider";
import ExplorePage from "./Views/ExplorePage";
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



 


  const {searchedUserId, setSearchedUserId} = useGlobalContext();

  useEffect(()=> {
    setSearchedUserId(localStorage.getItem('searchedUserId'));
  },[])
 

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route  exact path="/home">
            <Navbar />
            <Home />
          </Route>

          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/explore">
            <Navbar></Navbar>
            <ExplorePage />
          </Route>

          <Route path={`/profile/${searchedUserId}`}>
            <Navbar />
            <Profile />
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
