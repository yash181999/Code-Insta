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
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
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
      db.collection("Posts").doc(data.id).collection("Likes").doc().set({
        likedBy: user.uid,
        date: Date.now(),
        userName: userDetails.name,
      });
    setLiked(true);
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
      <div className="activity__head">
        <Avatar src = {data.data()?.profileImage}></Avatar>
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


          <IconButton onClick={likePost}>
            {!liked && <FavoriteBorder />}
            {liked && <Favorite color="error" />}
          </IconButton>

          {commentSnapshot.length > 0 &&
            commentSnapshot.map((value) => {
              return (
                value.data() && (
                  <div className="comments">
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
