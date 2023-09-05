import React, { useState, useEffect} from "react";
import { Stack, ListItem, ListItemText, FormControl, Box, Radio, IconButton, TextField, colors, SvgIcon, Divider, FormControlLabel, RadioGroup, List, Typography} from '@mui/material';
import { FixedSizeList } from 'react-window';
import { ArrowBackIos, ArrowForwardIos, SendOutlined } from '@mui/icons-material'
import { AddLocationTwoContext } from '../context/addLocationTwo';

const iconColor = [
    colors.amber,
    colors.blue,
    colors.blueGrey,
    colors.brown,
    colors.deepPurple,
    colors.green,
    colors.indigo,
    colors.lightGreen,
    colors.lime,
    colors.pink,
    colors.cyan,
    colors.teal,
    colors.lightBlue,
    colors.grey,
    colors.deepOrange
  ];
function PointIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M24 36.9Q17.15 31.75 13.825 27.05Q10.5 22.35 10.5 17.8Q10.5 14.4 11.725 11.825Q12.95 9.25 14.9 7.5Q16.85 5.75 19.25 4.875Q21.65 4 24 4Q26.35 4 28.75 4.875Q31.15 5.75 33.1 7.5Q35.05 9.25 36.275 11.825Q37.5 14.4 37.5 17.8Q37.5 22.35 34.175 27.05Q30.85 31.75 24 36.9ZM24 21Q25.45 21 26.475 19.975Q27.5 18.95 27.5 17.5Q27.5 16.05 26.475 15.025Q25.45 14 24 14Q22.55 14 21.525 15.025Q20.5 16.05 20.5 17.5Q20.5 18.95 21.525 19.975Q22.55 21 24 21ZM10.5 44V41H37.5V44Z" />
        </SvgIcon>
    );
}
function legendListD(props){
    const {index,style} = props;
    return(
        <ListItem style={style} key={index} component="div" sx={{borderBottom:"0.2px solid black", height:"100%"}}> 
            <Stack spacing={5} direction="row">
                <PointIcon sx={{color:iconColor[index][700], fontSize:'15px', overflow:'visible'}}/>
                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%'}}  primary={props.legendList[index]}/>
            </Stack>
        </ListItem>
    );
}

function LegendLoc(props){
    const [legendList,setList] = useState([]);
    const [legendResult,setResult] = useState([]);
    const [isLoading, setLoading] = useState(()=>true);
    const [ranking, setRank] = useState(1);
    const [load, setLoad] = useState(()=>false);
    const [disable, setDisable] = useState(true);
    const [maxValue, setMaxValue] = useState(10);
    
    const [sortBy, setSortBy] = useState("default");
    const adjustH = props.height * 3.2 / 5;
    const adjustZ = props.height * 1.5 / 5;
    const adjustW = props.width * 4 / 5;
    const adjustWd2 = props.width * 1 / 6;
    function handleSortBy(e){
        setSortBy(e.target.value);
    }
    function updateSortBy(){
        
        const results = sessionStorage.getItem("SSbE_result");
        const responseR = JSON.parse(results);
        switch(sortBy){
            case "dist":
                responseR.sort(function(a, b){
                    return Number(a.dist) - Number(b.dist);
                } );
                setResult(responseR);                
                sessionStorage.setItem("SSbE_sort", "dist");
                sessionStorage.setItem("SSbE_result", JSON.stringify(responseR));
                break;
            case "spatial":
                responseR.sort(function(a, b){
                    return Number(a.spatial) - Number(b.spatial);
                } );
                setResult(responseR);
                sessionStorage.setItem("SSbE_sort", "spatial");
                sessionStorage.setItem("SSbE_result", JSON.stringify(responseR));
                break;
                
           default: 
                responseR.sort(function(a, b){
                    return Number(a.id) - Number(b.id);
                } );
                setResult(responseR);
                sessionStorage.setItem("SSbE_sort", "default");
                sessionStorage.setItem("SSbE_result", JSON.stringify(responseR));
                break;
        }
    }
    function handleRankChange(e){
        const newNum = Number(e.target.value);
        if(newNum > maxValue | newNum < 1 | Number.isNaN(newNum))
        {
            alert("Only numbers (from 1 to "   + maxValue +  ") are allowed");
            return false;
        }
        else{
            setRank(newNum);
            return true;
        }
    }
    useEffect(() => {
        async function fetchdata()
        {
            const searchType = sessionStorage.getItem("SSbE_searchType");
            const response = JSON.parse(searchType);
            const sort = sessionStorage.getItem("SSbE_sort")
            setSortBy(sort);
            if(response.length > 0 ){
                setList(response);
            }
            else{
                setList([]);
            }
            const results = sessionStorage.getItem("SSbE_result");
            const responseR = JSON.parse(results);
            if(responseR.length > 0 ){
                setResult(responseR);
                setLoad(true);
                setDisable(false)
                setMaxValue(responseR.length);
                console.log(responseR)
            }
            else{
                setLoad(false);
                setDisable(true)
                setMaxValue(10);
                setResult([]);
            }
            setLoading(false)
        }
        fetchdata()  
        
        },[isLoading])
        
    return( isLoading ? 
            <></>
            :
        <AddLocationTwoContext.Consumer>{(addLocTwoContext)=>{
            return(
                <Box sx={{width:"97.5%", maxHeight:adjustH}}>
                    <FixedSizeList height={adjustZ}
                                        itemSize={50}
                                        itemCount={legendList.length}
                                        overscanCount={5} className="exampleList">
                        {(props)=>legendListD({...props, legendList})}
                    </FixedSizeList>
                    <Divider/>
                    <List sx={{width:"99%", height: adjustH}} >
                        <Stack alignContent="center" spacing={1} direction="row"  justifyContent='space-evenly'   className="orderSection">
                            <ListItem component="div" sx={{borderBottom:"0.2px solid black"}} >
                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Order by: "}
                                 sx={{maxWidth:adjustWd2}}/>
                            <br/>
                            <FormControl disabled={disable ? true : false}>
                                    <RadioGroup
                                        row
                                        value={sortBy}
                                        onChange={(e)=>handleSortBy(e)}
                                        >
                                            <FormControlLabel value="default"  control={<Radio size="small" />} label={<Typography sx={{fontSize:'12px'}} >Default</Typography>} />
                                            {/* <FormControlLabel value="dist"  control={<Radio size="small"/>}  label={<Typography sx={{fontSize:'12px'}}>Distance</Typography>} /> */}
                                            <FormControlLabel value="spatial" control={<Radio size="small"/>} label={<Typography sx={{fontSize:'12px'}} >Shape</Typography>} />
                                    </RadioGroup>
                                </FormControl>
                                <IconButton onClick={()=>{
                                    updateSortBy();
                                    addLocTwoContext.addLocation({new:-1, old:-1})
                                        }} disabled={disable ? true : false} size="small">
                                        <SendOutlined />
                                    </IconButton>
                                    </ListItem>
                        </Stack>
                        <br/>
                        <Stack alignContent="center" spacing={5} direction="row" sx={{justifyContent:"center"}} className="navgateSection">
                            <IconButton onClick={()=>{
                                setRank(ranking-1);
                                addLocTwoContext.addLocation({new:ranking-1, old:ranking});
                            }} disabled={disable ? true : ranking===1 ? true : false} >
                                <ArrowBackIos size='small'/>    
                            </IconButton>
                            <TextField  id="value" type="text" value={ranking} onChange={(e)=>{
                                    if(handleRankChange(e)){
                                        const newNum = Number(e.target.value);
                                        addLocTwoContext.addLocation({new:newNum, old:ranking});
                                    }}}
                                sx={{width:"50px"}} disabled={disable}/>
                            <IconButton onClick={()=>{
                                setRank(ranking+1);
                                addLocTwoContext.addLocation({new:ranking+1, old:ranking});
                            }} disabled={disable ? true : ranking===maxValue ? true : false} >
                                <ArrowForwardIos size='small'/>    
                            </IconButton>
                        </Stack>
                        <br/>
                        <Stack spacing={0} direction="column"   sx={{borderTop:"0.2px solid black"}}>
                                <ListItem component="div" sx={{borderBottom:"0.2px solid black"}} className="routeSection">
                                    <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Locations: "}
                                    sx={{width:adjustWd2}}/>
                                    <Stack direction="column" >
                                        {load ?
                                        
                                    
                                            legendResult[ranking-1].travList.split("/^/").map(x=>(
                                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible', maxWidth:adjustW}}  primary={x}/>
                                                ) ): 
                                            <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible', maxWidth:adjustW}}  primary={""}/>
                                        }
                                    
                                    </Stack>
                                </ListItem>
                            {/* <ListItem component="div" sx={{borderBottom:"0.2px solid black"}} className="distSection">
                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Distance Similarity: "}
                                sx={{width:adjustWd2}}/>
                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={ load ? legendResult[ranking-1].dist + " %" : "" }/>
                            </ListItem> */}
                            <ListItem component="div" sx={{borderBottom:"0.2px solid black"}} className="shapeSection">
                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={"Shape Similarity:"}
                                sx={{width:adjustWd2}}/>
                                <ListItemText  primaryTypographyProps={{fontSize: '15px', height:'100%', overflow:'visible'}}  primary={load ? legendResult[ranking-1].spatial + " %" : ""}/>
                            </ListItem>
                        </Stack>
                        
                       
                    </List>

                </Box>
            );
        }}</AddLocationTwoContext.Consumer>
            
      );
}

export default LegendLoc