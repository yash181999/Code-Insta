import {
  Avatar,
  Button,
  Fade,
  makeStyles,
  MobileStepper,
  Modal,
  useTheme,
} from "@material-ui/core";
import {
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


// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

//dumy images
const tutorialSteps = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "NeONBRAND Digital Marketing, Las Vegas, United States",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Goč, Serbia",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
]; //dumy imgages

//style for material compoent
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
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
  const [video, setVideo] = useState(null);
  const [videoToUpload,setVideoToUpload] = useState(null);
  const maxSteps = image.length;

  const [{ user }] = useStateValue();

  const [openModal, setOpenModal] = useState(false);

  const [modalType, setModalType] = useState("");

  const imageRef = useRef();
  const videoRef = useRef();

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
    // e.preventDefault();
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
      setVideo(URL.createObjectURL(event.target.files[0]));
      setVideoToUpload(event.target.files[0])
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

  //uploading images to firbase storage
  const uploadImages = async (e) => {
    // e.preventDefault();
    console.log("uploading");
    console.log(image[0]);
    //  user && await  storageRef.child('hello').put(image[0]);
    if(user) {
      const currentDate = Date.now();
      for (let i = 0; i < image.length; i++) {
        
        let uploadTask = storageRef.child(user.uid).child('images').child(Date.now().toString());
        await uploadTask.put(image[i]).then(
          (snapshot) => {
             uploadTask.getDownloadURL().then((url) => {
                 db.collection("Users")
                   .doc(user.uid)
                   .collection("Posts")
                   .doc()
                   .set({
                     date:currentDate,
                     type: 'image',
                     url : url,
                   });
             })
          }
        )
      }

     


    }
   
    console.log("images uploaded");
  };


   const uploadVideo = async (e) => {
     // e.preventDefault();
     console.log("uploading");
     console.log(video);
     //  user && await  storageRef.child('hello').put(image[0]);
     if (user) {
       const currentDate = Date.now();
       
         let uploadTask = storageRef
           .child(user.uid)
           .child("videos")
           .child(Date.now().toString());
         await uploadTask.put(videoToUpload).then((snapshot) => {
           uploadTask.getDownloadURL().then((url) => {
             db.collection("Users")
               .doc(user.uid)
               .collection("Posts")
               .doc()
               .set({
                 date: currentDate,
                 type: "video",
                 url: url,
               });
           });
         });
       }
     

     console.log("Videos uploaded");
   };



  return (
    <div className="home">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
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
                  <Button
                    onClick={uploadImages}
                    className={classes.uploadButton}
                  >
                    Upload
                  </Button>
                )}
              </div>
            )}
            {/* image type close */}

            {/* video type start       */}

            {modalType === "VIDEO" && (
              <div>
                <video
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  controls
                  width="500"
                >
                  <source src={video}></source>
                </video>
                {video && (
                  <Button onClick={uploadVideo} className={classes.uploadButton}>Upload</Button>
                )}
              </div>
            )}
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
            <div className="home__post"></div>
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

        <div className="activity__container">
          <div className="activity__head">
            <Avatar></Avatar>
            <p>Name</p>
          </div>

          <div className="activity__containt"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
