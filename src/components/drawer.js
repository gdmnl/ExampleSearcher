import React, { useContext } from "react"
import { IconButton, Drawer, Tooltip, Tabs, Tab, Box, Divider } from '@mui/material';
import {  ChevronRight, InfoOutlined } from '@mui/icons-material'
import { DrawerContext } from "../context/drawerControl";
import { styled } from '@mui/material/styles';
import useWindowDimensions from './getWindowSize';
import {PropTypes} from 'prop-types'
import AddControl from "./addControl";
import SelectedList from "./selectedList"
import LegendLoc from "./legend";
import MarkerCompo from "./markerControl";
import MapControl from "./mapControl";
import {ShepherdTour, ShepherdTourContext} from "react-shepherd"
import textSteps from "../steps/textStep";
import markSteps from "../steps/markStep";
import resultSteps from "../steps/resultStep";
import settingSteps from "../steps/settingStep";
import { StartTourTabs } from "./startTourTabs";
import "shepherd.js/dist/css/shepherd.css";


const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    }
  },
  useModalOverlay: true
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function TourButton(){
  const tour = useContext(ShepherdTourContext);
  return(
    <IconButton onClick={tour.start}  style={{position:"absolute", bottom:0, right:0}} className="tabTour">
      <Tooltip title="Guide">
        <InfoOutlined />
      </Tooltip>
    </IconButton>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

function DrawerCompo(){
    const {height, width} =  useWindowDimensions();
    const [open, setDrawer] = React.useState(false);
    const [loadtab, setValue] = React.useState(-1);
    const drawerHeight = height*91.8/100;
    const drawerWidth = width*35/100;
    const addHeight = drawerHeight/2;
    const handleChange = (event, newValue) =>{
      console.log(newValue)
      setValue(newValue)
    }
    return(  
        
        <DrawerContext.Consumer>{(drawContext)=>{
            if(drawContext.flag !== "" & drawContext.flag === "true"){
              setDrawer(true);
              if(loadtab === -1){
                setValue(0);
              }
              drawContext.setFlag({flag:""});
            }
            return(
            <Drawer sx={{
                width: drawerWidth,
                flexShrink: 1,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                }
              }}
              variant="persistent"
              anchor="right"
              open={open}
              >
            <DrawerHeader>
                <IconButton onClick={()=>{
                          drawContext.setFlag({flag:"false"});
                          setDrawer(false);}}>
                    <Tooltip title="Close Drawer">
                      <ChevronRight />
                    </Tooltip>
                </IconButton>
              <Tabs onChange={handleChange} value={loadtab} variant="scrollable" scrollButtons="auto" >
                <Tab value={0} label="Search by Text" {...a11yProps(0)} sx={{fontSize:'12px'}} />
                <Tab value={1} label="Search by Markers" {...a11yProps(1)}  sx={{fontSize:'12px'}} />
                <Tab value={2} label="Result Details" {...a11yProps(2)}  sx={{fontSize:'12px'}} />
                <Tab value={3} label="Search Settings" {...a11yProps(3)}  sx={{fontSize:'12px'}} />
              </Tabs>
            </DrawerHeader>
        <Divider />
          <TabPanel value={loadtab} index={0}>
            <ShepherdTour steps={textSteps} tourOptions={tourOptions}>
                {<StartTourTabs autoStart={true} tabName={"SSbE_textTab"}/>}
                  <TourButton/>
            </ShepherdTour>
                  <AddControl height={addHeight} width={drawerWidth} />
                  <br/>
                  <Divider />
                  <SelectedList  height={addHeight} />
          </TabPanel>
          <TabPanel value={loadtab} index={1}>
            <ShepherdTour steps={markSteps} tourOptions={tourOptions}>
                  {<StartTourTabs autoStart={true} tabName={"SSbE_markTab"}/>}
                  <TourButton/>
            </ShepherdTour>
              <MarkerCompo height={drawerHeight} width={drawerWidth}/>
          </TabPanel>
          <TabPanel value={loadtab} index={2}>
            <ShepherdTour steps={resultSteps} tourOptions={tourOptions}>
              {<StartTourTabs autoStart={true} tabName={"SSbE_resultTab"}/>}
                  <TourButton/>
            </ShepherdTour>
              <LegendLoc height={drawerHeight} width={drawerWidth}/>
          </TabPanel>
          <TabPanel value={loadtab} index={3}>
            <ShepherdTour steps={settingSteps} tourOptions={tourOptions}>
              {<StartTourTabs autoStart={true} tabName={"SSbE_settingTab"}/>}
                  <TourButton/>
            </ShepherdTour>
              <MapControl height={drawerHeight} width={drawerWidth}/>
          </TabPanel>
        </Drawer>
            );
        }}</DrawerContext.Consumer>
    );
}

export default DrawerCompo