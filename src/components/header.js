import React, { useState, useEffect, useContext } from "react"
import {  Grid, Typography,AppBar,IconButton,Tooltip } from '@mui/material';
import { makeStyles } from "@mui/styles";
import useWindowDimensions from './getWindowSize';
import { Menu, InfoOutlined } from '@mui/icons-material'
import { DrawerContext } from "../context/drawerControl";
import mapSteps from "../steps/mapStep";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd"
import "shepherd.js/dist/css/shepherd.css";
import "../steps/step.css"
import { StartTour } from "./startTour";

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    }
  },
  useModalOverlay: true
};

const useStyles = makeStyles((theme) => ({

    appbar:{
      background: '#75EEDA',
      position: 'sticky', 
      fontFamily: 'Nunito',
    },
    appbarWrapper: {
      display:'flex',
      width: '90%',
   
    },
    appbarTitle: {
      display:'flex',
      flexGrow:0,
  
    },
    title:{
      color: 'black',
      fontFamily: '-apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: 15,
      bottom:5,
      left:10
    }
  
  
  }));
  
  function TourButton(props){
    const tour = useContext(ShepherdTourContext);
    return(
      <IconButton onClick={tour.start}  style={{position:"absolute", top:1, left:0}} disabled={props.disable} className={props.className}>
        <Tooltip title="Guide">
          <InfoOutlined />
        </Tooltip>
      </IconButton>
    )
  }

function Header(){
    const {height} =  useWindowDimensions();
    const classes = useStyles();
    const headerHeight = height*6/100
    const [open, setDrawer] = React.useState(false);
    const [autoTour, setAutoTour] = React.useState(true);
    const [isLoading, setLoading] = useState(true);
    function handleDrawerOpen(context){
      context.setFlag({flag:"true"});
      setDrawer(true);
    }

    useEffect(() => {
      async function fetchdata()
      {
          
          // let response = await fetch('http://localhost:5000/');
          setLoading(false)
      }
      fetchdata()  
      
      },[isLoading])

    return( isLoading ? <></> :
      <DrawerContext.Consumer>{(drawContext)=>{
      if(drawContext.flag !== "" & drawContext.flag === "false"){
        setDrawer(false);
        drawContext.setFlag("");
      }
      return (
        <AppBar  className = {classes.appbar} elevation={0} sx={{height:headerHeight,borderBottom: '1px solid black'}}>
              
              <ShepherdTour steps={mapSteps} tourOptions={tourOptions}>
                  {(autoTour)&&
                    <StartTour autoStart={autoTour}/>
                  }
                    <TourButton disable={open} className={"infoIcon"}/>
              </ShepherdTour>
              <Grid container direction="row" mt={1} ml={5} sx={{width:"95%"}}>
              <Typography  variant="h4" sx={{ color: 'black',
                                                    fontFamily: '-apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                                    fontSize: 20, flexGrow:4
                                                    }}  >Example Searcher</Typography>
                    <IconButton aria-label="drawer"
                              edge="end"
                              onClick={()=>{handleDrawerOpen(drawContext)}}
                              sx={{ ...(open && { display: 'none' }),blockSize:"25px" }} className="menuBtn">
                          <Tooltip title="Open Drawer">
                              <Menu/>
                            </Tooltip>
                    </IconButton>
                    </Grid>
          </AppBar>);
    }}</DrawerContext.Consumer>
            
        );
}

export default Header