import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { Avatar, IconButton, Input } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import "./Posts.css";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

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
    height: "100%",
    display: "flex",
    cursor: "pointer",
    width: "100%",
    overflow: "hidden",
    maxHeight: "500px",
    objectFit: "cover",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[10],
    outline: "none",
    border: "none",
    height: "50%",
    width: "50%",
    borderRadius: "10px",

    padding: "10px",
  },
}));

function Posts({ data, userDetails }) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = data.data().urls.length;
  const [{ user }] = useStateValue();
  const [inputComment, setInputComment] = useState("");
  const [commentSnapshot, setCommentSnapshot] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [clickedImageUrl, setClickedImageUrl] = useState("");

  const handleOpen = (imageUrl) => {
    setOpen(true);
    setClickedImageUrl(imageUrl);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const [liked, setLiked] = useState(false);

  const likePost = () => {
    user &&
      db
        .collection("Posts")
        .doc(data.id)
        .collection("Likes")
        .doc(user.uid)
        .set({
          likedBy: user.uid,
          date: Date.now(),
          userName: userDetails.name,
        });
    setLiked(true);
  };

  const disLikePost = () => {
    if (liked === true) {
      user &&
        db
          .collection("Posts")
          .doc(data.id)
          .collection("Likes")
          .doc(user.uid)
          .delete();
      setLiked(false);
    }
  };

  const getLiked = () => {
    user &&
      db
        .collection("Posts")
        .doc(data.id)
        .collection("Likes")
        .where("likedBy", "==", user.uid)
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            setLiked(true);
          }
        });
  };

  const postComment = async () => {
    user &&
      (await db
        .collection("Posts")
        .doc(data.id)
        .collection("Comments")
        .doc()
        .set({
          commentedBy: user.uid,
          date: Date.now(),
          userName: userDetails.name,
          comment: inputComment,
        }));
    setInputComment("");
  };

  const getComments = () => {
    user &&
      db
        .collection("Posts")
        .doc(data.id)
        .collection("Comments")
        .onSnapshot((querySnapshot) => {
          setCommentSnapshot(querySnapshot.docs);
        });
  };

  useEffect(() => {
    getLiked();
    getComments();
  }, []);

  return (
    <div className="activity__container">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={clickedImageUrl}
              controls
            ></img>
          </div>
        </Fade>
      </Modal>
      <div className="activity__head">
        <Avatar src={data.data()?.profileImage}></Avatar>
        <p>{data.data().userName}</p>
      </div>
      <div className="activity_containt">
        <div className={classes.root}>
          <div>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {data.data().urls &&
                data
                  .data()
                  .urls.map((step, index) => (
                    <div key={step.label}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <img
                          onClick={() => handleOpen(step)}
                          className={classes.img}
                          src={step}
                          alt={step.label}
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
                  disabled={activeStep === maxSteps - 1}
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
            />
          </div>

          <IconButton onClick={() => (liked ? disLikePost() : likePost())}>
            {!liked && <FavoriteBorder />}
            {liked && <Favorite color="error" />}
          </IconButton>

          {commentSnapshot.length > 0 &&
            commentSnapshot.map((value) => {
              return (
                value.data() && (
                  <div key={value.id} className="comments">
                    <p className="commentedBy">{value.data().userName}</p>
                    <p className="comment">{value.data().comment}</p>
                  </div>
                )
              );
            })}

          <div className="divider"></div>

          <div className="comment__box">
            <input
              placeholder={"ADD A COMMENT"}
              value={inputComment}
              onChange={(e) => {
                setInputComment(e.target.value);
              }}
            ></input>
            <Button
              disabled={inputComment === "" ? true : false}
              style={{ color: "green" }}
              onClick={postComment}
            >
              POST
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
