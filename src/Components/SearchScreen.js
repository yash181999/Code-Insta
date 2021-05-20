import { Avatar, Backdrop, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useGlobalContext } from "../context";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import "./SearchScreen.css";

function SearchScreen() {
  const { searchedUserId, setSearchedUserId } = useGlobalContext();
  const [{ user }] = useStateValue();
  const [searchText, setSearchText] = useState("");
  const [userSnapshot, setUserSnapshot] = useState([]);
  
  const history = useHistory();

  const handleOnChange = (e) => {
    
    setSearchText(e.target.value);
    getUsers();
  };

  const getUsers = (e) => {
    db.collection("Users")
      .orderBy("name")
      .startAt(searchText)
      .onSnapshot((querySnashot) => {
        setUserSnapshot(querySnashot.docs);
      });
  };


  const goToProfile = (value) => {
    // setSearchedUserId(value.id);
    // console.log(searchedUserId);
    localStorage.setItem("searchedUserId", value.id);
    setSearchedUserId(value.id);
    value && history.push(`/profile/${value.id}`);
    setSearchText("");
    setUserSnapshot('');
  };

  return (
    <div className="search_screen">
      <nav className="search_screenNav">
        <IconButton onClick = {() => history.goBack()}>
          <ArrowBack />
        </IconButton>
        <input placeholder = 'Search Users' onChange={handleOnChange} value={searchText}></input>
      </nav>
      <div style={{ padding: "20px" }}>
        {userSnapshot.map((value) => {
          return (
            <div onClick={() => goToProfile(value)} className="list-tile">
              <Avatar src={value.data()?.profileImage}></Avatar>
              <p>{value.data().name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchScreen;
