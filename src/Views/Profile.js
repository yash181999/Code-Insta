import {
  Avatar,
  Button,
  Divider,
  Grid,
  GridList,
  GridListTile,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import "./Profile.css";

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
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  gridList: {
    width: "100%",
    height: "100%",
  },
}));

function Profile() {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [userData, setUserData] = useState([]);
  const [isMobile,setIsMobile] = useState(false);
  const [searchedUserId , setSearchedUserId] = useState(null)
  const [searchedUserData, setSearchedUserData] = useState(null);

  const getUserData = () => {
    searchedUserId &&
      db
        .collection("Posts")
        .where("userId", "==", searchedUserId)
        .onSnapshot((querySnapshot) => {
          setUserData(querySnapshot.docs);
        });
  };

  

  const getSearchedUserData = () => {
     searchedUserId &&  db.collection('Users').doc(searchedUserId).onSnapshot((data) => {
            setSearchedUserData(data.data());
     })
  }

  useEffect(() => {
      getSearchedUserData();
  },[searchedUserId]);
  

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
       setSearchedUserId(  localStorage.getItem("searchedUserId", searchedUserId) );
    
    window.addEventListener("resize", handleResize);
  },[]);
 

  useEffect(() => {
    getUserData();
  }, [user]);

  return (
    <div className="profile">
      <div className="profile__head">
        <Avatar className={isMobile ? classes.small : classes.large}></Avatar>
        {!isMobile && (
          <h2 style={{ position: "relative", marginLeft: "15px" }}>
            {searchedUserData && searchedUserData.name}
          </h2>
        )}
        {isMobile && (
          <h5 style={{ position: "relative", marginLeft: "15px" }}>
            {searchedUserData && searchedUserData.name}
          </h5>
        )}
        <Button style={{ backgroundColor: "#42ddf5", color: "white" }}>
          Follow
        </Button>
      </div>

      <Divider style={{ marginTop: "40px", marginBottom: "30px" }}></Divider>

      <GridList
        cellHeight={180}
        className={classes.gridList}
        cols={isMobile ? 1 : 2}
      >
        {userData &&
          userData.map((value) => {
            if (value.data().type === "image") {
              return value.data().urls.map((image) => {
                return (
                  <GridListTile cols={1}>
                    <img src={image} alt={"images"} />
                  </GridListTile>
                );
              });
            } else if (value.data().type === "video") {
              return (
                <GridListTile cols={1}>
                  <video style={{ width: "100%", height: "100%" }} controls>
                    <source src={value.data().url}></source>
                  </video>
                </GridListTile>
              );
            }
          })}
      </GridList>
    </div>
  );
}

export default Profile;
