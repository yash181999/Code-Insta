import React, { useState } from "react";
import { Avatar, IconButton, makeStyles, Popover } from "@material-ui/core";
import { useHistory } from "react-router";

import {
  ChatBubble,
  ExploreRounded,
  FavoriteRounded,
  Home,
  Send,
  SignalWifi1BarLockSharp,
} from "@material-ui/icons";
import "./Navbar.css";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  popover: {
    width: "200px",
  },
}));

function Navbar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userSnapshot, setUserSnapshot] = useState([]);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();


  const handleClick = (event) => {
    console.log('ehlo')
    
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

 const handleOnChange = (e) => {
   e.preventDefault();
   setSearchText(e.target.value);
   getUsers();
 }

  const getUsers = () => {
    db.collection("Users").orderBy('name').startAt(searchText).onSnapshot((querySnashot) => {
      setUserSnapshot(querySnashot.docs);
    });
  };

  const goToProfile = (searchedUserId) => {
    localStorage.setItem('searchedUserId', searchedUserId)
    history.push('/profile');
  }

  return (
    <nav className="nav">
      {/* logo */}

      <img
        className="nav__logo"
        alt="logo"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
      />

      <div className="nav__search">
        <input
          value = {searchText}
          onChange={handleOnChange}
          onClick={handleClick}
          placeholder="SEARCH"
        />
        <Popover
          id={id}
          open={open}
          disableAutoFocus={true}
          disableEnforceFocus={true}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div
            style={{
              padding: "10px",
              width: "300px",
              display: "flex",
              flexDirection : 'column',
              alignItems : 'flex-start'
            }}
          >
            {userSnapshot.length > 0 &&
              userSnapshot.map((value) => {
                 return (
                
                  <div
                    onClick = {() => goToProfile(value.data().uid)}
                    style={{
                      padding: "10px",
                      width: "300px",
                      display: "flex",
                      flexDirection : 'column',
                      alignItems: "center",
                    }}
                  >
                    <Avatar className={classes.small}></Avatar>
                    <div style={{ marginLeft: "10px", position: "relative" }}>
                      {value.data().name}
                    </div>
                  </div>
                );
              })}
          </div>
        </Popover>
      </div>

      <div className="nav__navigationContainer">
        <div className="nav__iconButton">
          <IconButton>
            <Home style={{ color: "black" }}></Home>
          </IconButton>
        </div>

        <IconButton>
          <ChatBubble style={{ color: "black" }}></ChatBubble>
        </IconButton>

        <IconButton>
          <ExploreRounded style={{ color: "black" }} />
        </IconButton>

        <IconButton>
          <FavoriteRounded style={{ color: "black" }} />
        </IconButton>

        <IconButton>
          <Avatar style={{ color: "black" }} className={classes.small} />
        </IconButton>
      </div>
    </nav>
  );
}

export default Navbar;
