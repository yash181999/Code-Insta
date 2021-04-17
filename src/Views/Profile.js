import {
  Avatar,
  Button,
  Divider,
  Grid,
  GridList,
  GridListTile,
  IconButton,
  List,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context";
import { db, storageRef } from "../firebase";
import { useStateValue } from "../StateProvider";
import "./Profile.css";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Close, ListOutlined } from "@material-ui/icons";
import { useHistory } from "react-router";

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
  modal: {
    display: "block",
    width: "40%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
    maxHeight: "80%",
    overflow: "scroll",
    ["@media (max-width:400px)"]: {
      width: "80%",
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid white",
    borderRadius: "10px",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Profile() {
  const classes = useStyles();
  const [{ user }] = useStateValue();
  const [userData, setUserData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  // const [searchedUserId, setSearchedUserId] = useState();
  const history = useHistory();

  const { searchedUserId, setSearchedUserId } = useGlobalContext();
  const [searchedUserData, setSearchedUserData] = useState(null);
  const [followBtn, setFollowBtn] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [type, setType] = useState();
  const [currentUserDetails, setCurrentUserDetails] = useState();
  const imageRef = useRef();
  const [profileImage, setProfileImage]  = useState();

  const changeProfilePhoto = () =>{
    if(user && searchedUserId === user.uid) {
      imageRef.current.click();

    }

  }

  const uploadImage = async(e) => {
  

       if (user && e.target.files[0]) {
         const currentDate = Date.now();
         const image =  e.target.files[0];

         let uploadTask =  storageRef
           .child(user.uid)
           .child("profilePhoto")
           .child(Date.now().toString());
         await uploadTask.put(image).then((snapshot) => {
           uploadTask.getDownloadURL().then((url) => {
             db.collection("Users").doc(user.uid).update({
                profileImage : url,
             });
           });
         });
       }

  }

  const getCurrentUserDetails = async () => {
    user &&
      (await db
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((value) => {
          setCurrentUserDetails(value.data());
        }));
  };

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
    searchedUserId &&
      db
        .collection("Users")
        .doc(searchedUserId)
        .onSnapshot((data) => {
          setSearchedUserData(data.data());
        });
  };

  useEffect(() => {
    getSearchedUserData();
  }, [searchedUserId]);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    setSearchedUserId(localStorage.getItem("searchedUserId"));

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getFollowers();
    getFollowing();
  }, [user, searchedUserId]);

  const follow = async () => {
    user &&
      currentUserDetails &&
      (await db
        .collection("Users")
        .doc(searchedUserId)
        .collection("Followers")
        .doc(user.uid)
        .set({
          uid: user.uid,
          name: currentUserDetails.name,
          profileImage:
            currentUserDetails.profileImage && currentUserDetails.profileImage,
        }));

    // console.log(currentUserData && currentUserData);

    user &&
      currentUserDetails &&
      (await db
        .collection("Users")
        .doc(user.uid)
        .collection("Following")
        .doc(searchedUserId)
        .set({
          uid: searchedUserId,
          name: searchedUserData.name,
          profileImage: searchedUserData.profileImage && searchedUserData.profileImage,
        }));

    setFollowBtn(false);
  };

  const unFollow = async () => {
    user &&
      (await db
        .collection("Users")
        .doc(searchedUserId)
        .collection("Followers")
        .doc(user.uid)
        .delete());

    user &&
      (await db
        .collection("Users")
        .doc(user.uid)
        .collection("Following")
        .doc(searchedUserId)
        .delete());
    setFollowBtn(true);
  };

  const getFollowers = () => {
    user &&
      db
        .collection("Users")
        .doc(searchedUserId)
        .collection("Followers")
        .onSnapshot((querySnapshot) => {
          setFollowers(querySnapshot.docs);
        });
  };

  const checkFollowing = async () => {
    user &&
      (await db
        .collection("Users")
        .doc(user.uid)
        .collection("Following")
        .doc(searchedUserId)
        .get()
        .then((value) => {
          if (value.exists) {
            setFollowBtn(false);
          }
        }));
  };

  const getFollowing = () => {
    db.collection("Users")
      .doc(searchedUserId)
      .collection("Following")
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.exists) {
          setFollowing(querySnapshot.docs);
        }
      });
  };

  const openFollowers = () => {
    setType("FOLLOWERS");
    handleOpen(true);
  };

  const openFollowing = () => {
    setType("FOLLOWING");
    handleOpen(true);
  };

  useEffect(() => {
    getUserData();
  }, [searchedUserId]);

  useEffect(() => {
    getCurrentUserDetails();
    checkFollowing();
  }, [user]);

  //for madal functions
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const goToProfile = (value) => {
    // setSearchedUserId(value.id);
    // console.log(searchedUserId);
    localStorage.setItem("searchedUserId", value.id);
    setSearchedUserId(value.id);
    value && history.push(`/profile/${value.id}`);
    setModalOpen(false);
  };

  return (
    <div className="profile">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            {/* modal head */}
            <div className="modal__head">
              <h4>{type}</h4>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </div>
            <Divider></Divider>

            {type === "FOLLOWERS" &&
              followers.length > 0 &&
              followers.map((value) => {
                return (
                  <div onClick={() => goToProfile(value)} className="list-tile">
                    <Avatar src = {value.data()?.profileImage}></Avatar>
                    <p>{value.data().name}</p>
                  </div>
                );
              })}

            {type === "FOLLOWING" &&
              following.length > 0 &&
              following.map((value) => {
                return (
                  <div className="list-tile">
                    <Avatar src={value.data()?.profileImage}></Avatar>
                    <p>{value.data().name}</p>
                  </div>
                );
              })}
          </div>
          {/* modal head closed*/}

          {/* list */}
        </Fade>
      </Modal>

      <div className="profile__head">
        <Avatar
          src = {searchedUserData && searchedUserData?.profileImage}
          onClick={changeProfilePhoto}
          className={isMobile ? classes.small : classes.large}
        ></Avatar>
        <input
          hidden
          onChange={uploadImage}
          ref={imageRef}
          id="fileUpload"
          type="file"
          accept="image/*"
        />
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

        {user && searchedUserId !== user.uid && (
          <Button
            onClick={followBtn ? follow : unFollow}
            style={{ backgroundColor: "#42ddf5", color: "white" }}
          >
            {followBtn ? "Follow" : "Unfollow"}
          </Button>
        )}
      </div>

      <div className="followers__container">
        <Button onClick={openFollowers} className="follower__btn">
          {`${followers.length} Followers`}
        </Button>
        <Button onClick={openFollowing} className="follower__btn">
          
          {`${following.length} Following`}
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
                  <GridListTile style={{ padding: "20px" }} cols={1}>
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
