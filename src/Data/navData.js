import React from 'react';
import { Avatar, IconButton, makeStyles } from '@material-ui/core';
import { ChatBubble, ExploreRounded, FavoriteRounded, Home, Send, SignalWifi1BarLockSharp } from '@material-ui/icons';


export const navData = [
      {
          icon : <IconButton><Home style={{ color: "black" }}></Home></IconButton> ,
          name : 'home',
          

      } ,

      {
        icon : <IconButton><ChatBubble style={{ color: "black" }}/></IconButton>,
        name : 'message',
        

    } ,

    {
        icon : <IconButton></IconButton><ExploreRounded style={{ color: "black" }}/></IconButton>,
        name : 'explore',
        

    } ,
    {
        icon : <FavoriteRounded style={{ color: "black" }}/>,
        name : 'notification',
        

    } ,
]