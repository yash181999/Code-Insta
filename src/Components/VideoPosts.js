import { Avatar, Button, IconButton } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";

function VideoPosts({ videoData, userDetails }) {
  const [{ user }] = useStateValue();
  const [inputComment, setInputComment] = useState("");
  const [commentSnapshot, setCommentSnapshot] = useState([]);
  const [liked, setLiked] = useState(false);

  const likePost = () => {
    user &&
      db.collection("Posts").doc(videoData.id).collection("Likes").doc().set({
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
        .doc(videoData.id)
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
        .doc(videoData.id)
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
        .doc(videoData.id)
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
        <Avatar src={videoData.data()?.profileImage}></Avatar>
        <p>{videoData.data().userName}</p>
      </div>
      <div className="activity_containt">

          <video controls style = {{width: '100%' , height : '100%'}} >
              <source src  = {videoData.data().url}></source>
          </video>

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
  );
}

export default VideoPosts;
