import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    height : '100%',
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    padding : '10px',
    width: '100%',
    height: 450,
  },
 
}));

function ExplorePage() {
  const [postSnapShot, setPostSnapShot] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    db.collection("Posts").onSnapshot((querySnapshot) => {
      setPostSnapShot(querySnapshot.docs);
    });
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {postSnapShot.length > 0 &&
          postSnapShot.map((value) => {
            return (
              value.data().urls &&
              value.data().urls.map((image) => {
                return (
               
                    <GridListTile cols={1} key={value.id}>
                      <img src={image}></img>
                    </GridListTile>
                 
                );
              })
            );
          })}
      </GridList>
    </div>
  );
}

export default ExplorePage;
