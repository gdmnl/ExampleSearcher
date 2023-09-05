import React, {useState, useEffect} from 'react'
import { IconButton, Stack, TextField, ListItemText, Slider ,ListItem, RadioGroup, Radio,FormControl,FormControlLabel, List   } from '@mui/material';
import { SendOutlined  } from '@mui/icons-material';
import { MapControlContext } from '../context/mapControl';

const marks = [
    {
        value: 1,
        label: "1"
    },
    {
        value: 5,
        label: "5"
    },
    {
        value: 10,
        label: "10"
    },
    {
        value: 15,
        label: "15"
    },
]

function MapControl(props){
    const [searchRad, setSearchRad] = useState(1);
    const [resultK, setresultK] = useState(5);
    const [jumpLocationData, setJumpLocation] = useState("");
    const [morePage, setMorePage] = useState("false");
    const [isLoading, setLoading] = useState(()=>true);
    
    const adjustW = props.width * 2 / 6;
    const adjustW2 = props.width * 2 / 6;
    function valuetext(value) {
        const newNum = Number(value);
        setSearchRad(newNum);
        sessionStorage.setItem("SSbE_searchRad", newNum);
      }
      function handleResultK(e){
        const newNum = Number(e.target.value);
        if(newNum > 15  | newNum < 1 | Number.isNaN(newNum))
        {
            alert("Only numbers (from 1 to 15) are allowed");
        }
        else{
            setresultK(newNum);
            sessionStorage.setItem("SSbE_K", newNum);
        }
      }
    function jumpLocation(){
    if(jumpLocationData !== ""){
        setJumpLocation("");
        return true;
    }
    else{
        alert("Please enter location!")
    }
    return false;
    }
    function handlejumpLocation(e){
        setJumpLocation(e.target.value);
    }
    function handleMorePage(e){
        setMorePage(e.target.value);
        sessionStorage.setItem("SSbE_morePage", e.target.value);
    }
    useEffect(() => {
        async function fetchdata()
        {
            const searchRadL = sessionStorage.getItem("SSbE_searchRad");
            const KL = sessionStorage.getItem("SSbE_K");
            const morePageL = sessionStorage.getItem("SSbE_morePage")
            const newNum = Number(searchRadL);
            if(!Number.isNaN(newNum))
            {
                setSearchRad(newNum);
            }
            setresultK(KL);
            setMorePage(morePageL);
            setLoading(false)
        }
        fetchdata()  
        
        },[isLoading])
    return( isLoading ? <></>
        :
        <MapControlContext.Consumer>{(mapControlContext) => {
            return(
                <List sx={{width:'99%'}}>
                    
                    {/* <br/> */}
                <ListItem component="div" sx={{borderBottom:"0.2px solid black"}} className="centerCont"> 
                    <Stack spacing={3} direction="row" justifyContent="space-evenly" alignItems="center">
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  
                            primary={"Centre Map at:"} sx={{width:adjustW2}}/>
                        
                        <br/>
                        <TextField id='country' value={jumpLocationData} onChange={(e)=>handlejumpLocation(e)} sx={{width:adjustW, fontSize:'15px'}}/>
                        <IconButton onClick={()=>{
                            if(jumpLocation()){
                                mapControlContext.setControl({ key:1, data:jumpLocationData,})
                            }
                            }}>
                            <SendOutlined/>
                        </IconButton>
                    </Stack>
                    <br/>
                    </ListItem>
                    <ListItem component="div" sx={{borderBottom:"0.2px solid black", width: '100%'}}  className="searchRadCont"> 
                    <Stack spacing={3} direction="row"  justifyContent="space-evenly" alignItems="center">
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Search Radius(KM):"}
                        sx={{width:adjustW2}}/>
                        
                        <br/>
                        <Slider  defaultValue={searchRad} marks={marks} step={1} min={1} max={15}  getAriaValueText={valuetext} valueLabelDisplay="auto"
                            sx={{width:adjustW}}/>
                             {/* id='searchRad' value={searchRad} onChange={(e)=>handleSearchRad(e)}/> */}
                            <IconButton onClick={()=>{
                                    mapControlContext.setControl({key:2, data:searchRad}) 
                            }}>
                            <SendOutlined/>
                        </IconButton>
                    </Stack>
                    </ListItem>
                    <ListItem component="div" sx={{borderBottom:"0.2px solid black"}}  className="moreDataCont"> 
                    <Stack spacing={3} direction="row"  justifyContent="space-evenly" alignItems="center">
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"More Data:"}
                         sx={{width:adjustW2}}/>
                        
                        <br/> 
                        <FormControl>
                            <RadioGroup
                                row
                                name="row-radio-buttons-group"
                                value={morePage}
                                onChange={(e)=>handleMorePage(e)}
                                sx={{width:adjustW}}>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                        <IconButton onClick={()=>{
                                var booleanV;
                                if(morePage === "false")
                                    booleanV = false;
                                else
                                    booleanV = true;
                                  mapControlContext.setControl({key:3, data:booleanV}) 
                            }}>
                            <SendOutlined/>
                        </IconButton>
                    </Stack>
                    </ListItem>
                    <ListItem component="div" sx={{borderBottom:"0.2px solid black"}}  className="resultCont"> 
                    <Stack spacing={3} direction="row"  justifyContent="space-evenly" alignItems="center">
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Number of results:"}
                         sx={{width:adjustW2}}/>
                        
                        <br/>
                        
                        <TextField id='K' value={resultK} onChange={(e)=>handleResultK(e)}  sx={{width:adjustW}}/>
                            {/* <IconButton onClick={()=>{
                                if(resultK < 5){
                                    alert("The minimum value for number of results is 5.")
                                }
                                else{
                                    sessionStorage.setItem("SSbE_K", resultK)
                                }
                            }}>
                            <SendOutlined/>
                        </IconButton> */}
                    </Stack>
                    </ListItem>
                    {/* <ListItem>
                        <Stack spacing={1} direction="column"  justifyContent="flex-start" alignItems="flex-start">
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  
                            primary={commentSearchRad}/>
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  
                        primary={commentNumOfPage}/>
                        <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  
                            primary={commentK}/>
                         <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  
                            primary={commentGeneral}/>
                        </Stack>
                    </ListItem> */}
                </List>
        )}}</MapControlContext.Consumer> 
    );
}

export default MapControl