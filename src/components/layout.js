import React from "react"
import { Box } from '@mui/material';
import MapComponent from "./map";
import DrawerCompo from "./drawer";
import useWindowDimensions from './getWindowSize';
import AddPointsContextProvider from "../context/addSearch";
import AddLocationOneContextProvider from "../context/addLocationOne";
import AddLocationTwoContextProvider from "../context/addLocationTwo";
import AddMapMarkerContextProvider from "../context/addMapMarker";
import MapControlContextProvider from "../context/mapControl";

function WebLayout(){
        const {height} =  useWindowDimensions();
        const mapHeight = height*93.9/100;
        return(
            <MapControlContextProvider>
                <AddMapMarkerContextProvider>
                <AddPointsContextProvider>
                <AddLocationOneContextProvider>
                <AddLocationTwoContextProvider>
                    <Box sx={{width:'99.9%', height: mapHeight}}>
                        <MapComponent/> 
                    </Box>
                    <DrawerCompo/>
                </AddLocationTwoContextProvider>
                </AddLocationOneContextProvider>
                </AddPointsContextProvider>
                </AddMapMarkerContextProvider>
                </MapControlContextProvider>
        
        );
}

export default WebLayout