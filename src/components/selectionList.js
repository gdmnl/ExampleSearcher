import React, { Component } from 'react';
import { Stack, ListItem, ListItemText, Button, Box, Tooltip, IconButton } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { AddLocationOneContext } from '../context/addLocationOne';
import { AddLocationTwoContext } from '../context/addLocationTwo';
import { LooksOneOutlined, LooksTwoOutlined} from '@mui/icons-material'


const  commonObjects = [
    "Apartment Building",
    "Restaurant",
    "Supermarket",
    "Coffee Shop",
    "Cafe",
    "Community Center",
    "Gym",
    "Park",
    "Tourist Attraction",
    "Shopping Mall"
];


function commonItems(props){
    const {index,style} = props;
    return(
            
        <AddLocationOneContext.Consumer>{(locOneContext)  => (
            <AddLocationTwoContext.Consumer>{(locTwoContext) => {
                return(
                    <ListItem style={style} key={index} component="div" sx={{borderBottom:"0.2px dashed grey",borderRadius:1}} > 
                        <ListItemText  primaryTypographyProps={{fontSize: '20px'}}  primary={(commonObjects[index]) }/>
                        <Stack spacing={1} direction="row">
                            <Tooltip title="Load to Location 1">
                                <IconButton  onClick={()=> locOneContext.addLocation((commonObjects[index]))}  size="large" color="secondary">
                                    <LooksOneOutlined size="large"/>
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Load to Location 2">
                                <IconButton  onClick={()=> locTwoContext.addLocation((commonObjects[index]))}  size="large" color="secondary">
                                        <LooksTwoOutlined size="large"/>
                                    </IconButton>
                            </Tooltip>
                        </Stack>
                    </ListItem>
                );
                }}</AddLocationTwoContext.Consumer>
            )}</AddLocationOneContext.Consumer>
        );

}


class SelectionList extends Component{
    render(){
        
        const adjustH = this.props.height*86/100;

                    return(
                        <Box  sx={{width: "100%", maxHeight: this.props.height, backgroundColor:"lightblue"}}>
                            <FixedSizeList height={adjustH}
                                            itemSize={60}
                                            itemCount={commonObjects.length}
                                            overscanCount={5}>
                                {commonItems}
                            </FixedSizeList>

                        </Box>
    
                
                    );
    }
}

export default SelectionList


