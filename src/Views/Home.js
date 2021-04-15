import {
  Avatar,
  Button,
  Fade,
  IconButton,
  makeStyles,
  MobileStepper,
  Modal,
  TextareaAutosize,
  useTheme,
} from "@material-ui/core";
import {
  Close,
  DriveEta,
  Image,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Videocam,
} from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import "./Home.css";
import Backdrop from "@material-ui/core/Backdrop";

import React, { useEffect, useRef, useState } from "react";
import { useFilePicker } from "use-file-picker";
import { useGlobalContext } from "../context";
import ReactPlayer from "react-player";
import { db, storageRef, uploadImageToStorage } from "../firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import ProgressBar from "../Components/ProgressBar";
import Posts from "../Components/Posts";
import VideoPosts from "../Components/VideoPosts";
import TextPosts from "../Components/TextPosts";

//style for material compoent
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  modal: {
    display: "block",
    width: "50%",
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
  modalImage: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "80%",
    overflow: "hidden",
    width: "50%",
  },

  uploadButton: {
    "&:hover": { backgroundColor: "white", color: "orange" },
    backgroundColor: "orange",
    color: "white",
    width: "100%",
  },
})); //style for material compoent

//Home Component
function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const [image, setImage] = useState([]);
  const [videoToUpload, setVideoToUpload] = useState();
  const [textPost, setTextPost] = useState("");
  const maxSteps = image.length;

  const [{ user }] = useStateValue();

  const [userDetails, setUserDetails] = useState();

  const [openModal, setOpenModal] = useState(false);

  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();
  const videoRef = useRef();

  const [postSnapShot, setPostSnapShot] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const openImageSelector = (e) => {
    imageRef.current.click();
    setModalType("IMAGE");
    setOpenModal(true);
  };

  const openVideoSelector = (e) => {
    // e.stopPropagation();
    // console.log('clicked')
    videoRef.current.click();
    setModalType("VIDEO");
    setOpenModal(true);
  };

  const getVideo = (event) => {
    if (event.target.files[0]) {
      setVideoToUpload(event.target.files[0]);
    }
  };

  //getting images from device
  const getImage = (event) => {
    let imageArray = [];
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        imageArray[i] = event.target.files[i];
      }
    }
    setImage(imageArray);
  }; //getting images from device

  const getAllPosts = () => {
    db.collection("Posts").onSnapshot((querySnapshot) => {
      setPostSnapShot(querySnapshot.docs);
    });
  };

  const getUserDetails = async () => {
    user &&
      (await db
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((value) => {
          setUserDetails(value.data());
        }));
  };

  useEffect(() => {
    getUserDetails();
  }, [user]);

  useEffect(() => {
    getAllPosts();
  }, []);

  //uploading images to firbase storage
  const uploadImages = async (e) => {
    setLoading(true);

    if (user) {
      const currentDate = Date.now();
      const imageUrls = [];
      for (let i = 0; i < image.length; i++) {
        //reference to storage/// path....
        let uploadTask = storageRef
          .child(user.uid)
          .child("images")
          .child(Date.now().toString());

        //push to file storage
        await uploadTask.put(image[i]).then((snapshot) => {
          uploadTask.getDownloadURL().then((url) => {
            imageUrls[i] = url;
          });
        });
      }

      imageUrls.length > 0 &&
        db.collection("Posts").doc().set({
          date: currentDate,
          type: "image",
          urls: imageUrls,
          userId: user.uid,
          userName: userDetails.name,
        });
    }

    setLoading(false);
    setOpenModal(false);
  };

  const uploadVideo = async (e) => {
    setLoading(true);

    if (user) {
      const currentDate = Date.now();

      let uploadTask = storageRef
        .child(user.uid)
        .child("videos")
        .child(Date.now().toString());
      await uploadTask.put(videoToUpload).then((snapshot) => {
        uploadTask.getDownloadURL().then((url) => {
          db.collection("Posts").doc().set({
            date: currentDate,
            type: "video",
            url: url,
            userId: user.uid,
            userName: userDetails.name,
          });
        });
      });
    }

    setLoading(false);
    setOpenModal(false);
  };

  const closeModal = (e) => {
    setVideoToUpload(null);
    if (loading) {
      setOpenModal(true);
    } else {
      // setImage([]);
      setOpenModal(false);
    }
  };

  const openTextPost = () => {
    setModalType("TEXT");
    setOpenModal(true);
  };

  const uploadTextPost = async() => {
      setLoading(true);
      await db.collection("Posts").doc().set({
         date: Date.now(),
         type: "text",
         content : textPost,
         userId: user.uid,
         userName: userDetails.name,
       });
       setLoading(false);
       setTextPost('');
       setOpenModal(false);

  };

  return (
    <div className="home">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            {!loading && (
              <div>
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  Create a post
                  <IconButton onClick={closeModal}>
                    <Close></Close>
                  </IconButton>
                </div>
                {modalType === "IMAGE" && (
                  <div>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={activeStep}
                      onChangeIndex={handleStepChange}
                      enableMouseEvents
                    >
                      {image.map((step, index) => (
                        <div key={step}>
                          {Math.abs(activeStep - index) <= 2 ? (
                            <img
                              className={classes.modalImage}
                              src={URL.createObjectURL(step)}
                              alt={step}
                            />
                          ) : null}
                        </div>
                      ))}
                    </SwipeableViews>
                    <MobileStepper
                      steps={maxSteps}
                      position="static"
                      variant="dots"
                      activeStep={activeStep}
                      nextButton={
                        <Button
                          size="small"
                          onClick={handleNext}
                          disabled={activeStep === image.length - 1}
                        >
                          {theme.direction === "rtl" ? (
                            <KeyboardArrowLeft />
                          ) : (
                            <KeyboardArrowRight />
                          )}
                        </Button>
                      }
                      backButton={
                        <Button
                          size="small"
                          onClick={handleBack}
                          disabled={activeStep === 0}
                        >
                          {theme.direction === "rtl" ? (
                            <KeyboardArrowRight />
                          ) : (
                            <KeyboardArrowLeft />
                          )}
                        </Button>
                      }
                      className="photo__stepper"
                    />

                    {image.length > 0 && (
                      <div>
                        <Button
                          onClick={uploadImages}
                          className={classes.uploadButton}
                        >
                          Upload
                        </Button>
                        <Button
                          onClick={() => setImage([])}
                          className={classes.uploadButton}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* image type close */}

            {/* video type start       */}

            {!loading && (
              <div>
                {modalType === "VIDEO" && (
                  <div>
                    {videoToUpload && (
                      <video
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        controls
                        style={{ width: "100%", height: "100%" }}
                      >
                        <source
                          src={URL.createObjectURL(videoToUpload)}
                        ></source>
                      </video>
                    )}

                    {videoToUpload && (
                      <div>
                        <Button
                          onClick={uploadVideo}
                          className={classes.uploadButton}
                        >
                          Upload
                        </Button>
                        <Button
                          onClick={closeModal}
                          className={classes.uploadButton}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* write text post */}

            {!loading && modalType === "TEXT" && (
              <div>
                <textarea
                  onChange={(e) => setTextPost(e.target.value)}
                  placeholder="What do you want to talk about"
                  className="post__textarea"
                />
                <Button
                  onClick={uploadTextPost }
                  disabled={textPost === "" ? true : false}
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  POST
                </Button>
              </div>
            )}

            {loading && <ProgressBar></ProgressBar>}
          </div>
        </Fade>
      </Modal>

      <div className="home__activity">
        <div className="home__storyContainer">
          <div className="home__story">
            <div>
              <Avatar></Avatar>
            </div>
            <div style={{ fontSize: "8px" }}>Yash</div>
          </div>
        </div>

        <div className="home__postActivity">
          <div className="home__postContainer">
            <Avatar></Avatar>
            <div onClick={openTextPost} className="home__post"></div>
          </div>

          <div className="home__postMedia">
            <Button onClick={openImageSelector}>
              <Image style={{ color: "green" }}></Image>
              Photo
              <input
                hidden
                onChange={getImage}
                multiple
                ref={imageRef}
                id="fileUpload"
                type="file"
                accept="image/*"
              />
            </Button>
            <Button onClick={openVideoSelector}>
              <Videocam style={{ color: "red" }} />
              Video
              <input
                hidden
                onChange={getVideo}
                ref={videoRef}
                id="fileUpload"
                type="file"
                accept="video/*"
              />
            </Button>
          </div>
        </div>

        {postSnapShot.map((post) => {
          if (post.data().type === "image") {
            return <Posts data={post} userDetails={userDetails}></Posts>;
          } else if (post.data().type === "video") {
            return (
              <VideoPosts
                videoData={post}
                userDetails={userDetails}
              ></VideoPosts>
            );
          }
          else if(post.data().type ==='text') {
            return (
              <TextPosts textData = {post} useDetails = {userDetails} ></TextPosts>
            )
          }
        })}
      </div>
    </div>
  );
}

export default Home;
