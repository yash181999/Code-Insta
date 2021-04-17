import React, { useEffect, useState } from "react";
import { Avatar, IconButton, makeStyles, Popover } from "@material-ui/core";
import { useHistory, useLocation } from "react-router";
import logo from "../logo.png";

import {
  ChatBubble,
  ExploreRounded,
  FavoriteRounded,
  Home,
  Search,
  Send,
  SignalWifi1BarLockSharp,
} from "@material-ui/icons";
import "./Navbar.css";
import { db } from "../firebase";
import { useGlobalContext } from "../context";
import { useStateValue } from "../StateProvider";

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
  const [searchText, setSearchText] = useState("");
  const history = useHistory();
  const { selected, setSelected } = useGlobalContext();
  const [{ user }] = useStateValue();

  const { searchedUserId, setSearchedUserId } = useGlobalContext();

  const [userDetails, setUserDetails] = useState();
  const location = useLocation();

  const getUserDetails = () => {
    user &&
      db
        .collection("Users")
        .doc(user.uid)
        .onSnapshot((querySnashot) => {
          setUserDetails(querySnashot.data());
        });
  };

  const getCurrentLocation = () => {
    if (location.pathname === "/home") {
      setSelected("HOME");
    } else if (location.pathname === "/explore") {
      setSelected("EXPLORE");
    } else {
      setSelected("PROFILE");
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
    setAnchorEl(null);
    setSearchText("");
    setUserSnapshot([]);
  };

  const goToMyProfile = () => {
    if (user) {
      setSelected("PROFILE");
      localStorage.setItem("searchedUserId", user.uid);
      setSearchedUserId(user.uid);
      user && history.push(`/profile/${user.uid}`);
    }
  };

  const goToHome = () => {
    setSelected("HOME");
    history.push("/home");
  };

  const goToExplore = () => {
    setSelected("EXPLORE");
    history.push("/explore");
  };

  useEffect(() => {
    getUserDetails();
    getCurrentLocation();
  }, [user]);

  // useEffect(() => {
  //   // localStorage.setItem("searchedUserId", searchedUserId);
  // },[searchedUserId])

  return (
    <nav className="nav">
      {/* logo */}

      <img
        onClick={() => history.push("/home")}
        className="nav__logo"
        alt="logo"
        src={logo}
      />

      <div className="nav__search">
        <input
          value={searchText}
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
            }}
          >
            {userSnapshot.length > 0 &&
              userSnapshot.map((value) => {
                return (
                  <div
                    onClick={() => goToProfile(value)}
                    style={{
                      padding: "10px",
                      width: "300px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={value.data()?.profileImage}
                      className={classes.small}
                    ></Avatar>
                    <div style={{ marginLeft: "10px", position: "relative" }}>
                      {value.data().name}
                    </div>
                  </div>
                );
              })}
          </div>
        </Popover>
      </div>

      <div className="nav__navigationContainer ">
        <div onClick = {() => history.push('/search')} className = 'nav__searchIcon'>
          <IconButton>
            <Search
              src={userDetails?.profileImage}
              style={{ color: "black" }}
              className={classes.small}
            />
          </IconButton>
        </div>

        <div
          onClick={goToHome}
          className={selected === "HOME" && "nav__iconButton"}
        >
          <IconButton>
            <Home style={{ color: "black" }}></Home>
          </IconButton>
        </div>

        <div
          onClick={goToExplore}
          className={selected === "EXPLORE" && "nav__iconButton"}
        >
          <IconButton>
            <ExploreRounded style={{ color: "black" }} />
          </IconButton>
        </div>

        <div
          onClick={goToMyProfile}
          className={selected === "PROFILE" && "nav__iconButton"}
        >
          <IconButton>
            <Avatar
              src={userDetails?.profileImage}
              style={{ color: "black" }}
              className={classes.small}
            />
          </IconButton>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
