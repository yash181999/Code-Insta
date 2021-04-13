import React from 'react'
import { Avatar, IconButton, makeStyles } from '@material-ui/core';
import { ChatBubble, ExploreRounded, FavoriteRounded, Home, Send, SignalWifi1BarLockSharp } from '@material-ui/icons';
import './Navbar.css'


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
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
    
  }));

function Navbar() {
    const classes = useStyles();

    return (
        <nav className='nav'>
       
     
        {/* logo */}
      
        <img className='nav__logo' alt='logo' 
        src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'/>
    
      

      <div className = 'nav__search'>
         <input/>
      </div>

      <div className = 'nav__navigationContainer'>
         <div className='nav__iconButton'>
            <IconButton >
             <Home style={{ color: "black" }}></Home>
            </IconButton>
         </div>  
          

          <IconButton>
            <ChatBubble style={{ color: "black" }}></ChatBubble>
          </IconButton>

          <IconButton>
            <ExploreRounded style={{ color: "black" }}/>
          </IconButton>

          <IconButton>
            <FavoriteRounded style={{ color: "black" }}/>
          </IconButton>

          <IconButton>
            <Avatar style={{ color: "black" }} className={classes.small}/>
          </IconButton>


          
      </div>
     


    </nav>
    )
}

export default Navbar
