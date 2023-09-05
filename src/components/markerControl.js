import React, {useState, useEffect} from 'react'
import { Button, List , Box, Stack, ListItem, ListItemText, Divider, Grid, Select, MenuItem } from '@mui/material';
import { AddMapMarkerContext } from '../context/addMapMarker';

function MarkerCompo(props){
    const [markerList, setMarkerList] = useState({list:[]});
    const [isLoading, setLoading] = useState(true);
    const [btnDis, setBtnDis] = useState({bool:false});
    const adjustH = props.height * 2 / 3;
    useEffect(() => {
        
        window.addEventListener('storage', ()=>{
                const markData = sessionStorage.getItem("SSbE_mark")
                const flag  = sessionStorage.getItem("SSbE_disable_btn");
                const response = JSON.parse(markData)
                const flagRes = JSON.parse(flag)
                setBtnDis({bool:flagRes})
                if(response.length > 0 ){;
                    setMarkerList({list:response})
                }
                else{
                    setMarkerList({list:[]});
                }
                sessionStorage.setItem("SSbE_event", "")
        }, false)
        async function fetchdata()
        {
            
            const markData = sessionStorage.getItem("SSbE_mark")
            const response = JSON.parse(markData)
            if(response.length > 0 ){;
                setMarkerList({list:response})
            }
            else{
                setMarkerList({list:[]});
            }
            setLoading(false)
        }
        fetchdata()  
        
        },[isLoading])
    return(
        isLoading ? <></> :
        <AddMapMarkerContext.Consumer>{(addMapMarkerContext) =>{
            return(
                <Box sx={{width:"99.9%"}}>
                    <br/> 
                    <Grid  container direction="row" spacing={13}  justifyContent="center" alignItems="center"  >
                        <Grid item xs="auto">
                        <Button onClick={()=>
                        {
                            addMapMarkerContext.setMap({data:"MARK", fun: "CLEAR", mode:"MARK"})
                            setMarkerList({list:[]});
                        }} 
                            size="small"  variant="contained" color="warning" className='clearBtnM' disabled={btnDis.bool}>Clear</Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button onClick={()=>
                        {
                            addMapMarkerContext.setMap({data:"MARK", fun: "RUN", mode:"MARK"})
                            setBtnDis({bool:true})
                        }} 
                            size="small"  variant="contained" color="secondary" className='searchBtnM' disabled={btnDis.bool}>Search</Button>
                        </Grid>
                    </Grid>
                    <br/>
                    <Divider/>
                        <List height={adjustH} className="markerList">
                        {markerList.list.map((m,index)=>(
                            <ListItem key={index} component="div" sx={{borderBottom:"0.2px solid black"}}> 
                            <Stack spacing={3} direction="row" justifyContent="space-evenly" alignItems="center">
                                <ListItemText  primaryTypographyProps={{fontSize: '18px', height:'100%', overflow:'visible'}}  primary={index}/>
                                <Select id={m.id} value={m.selection} 
                                    onChange={(event)=>{
                                        markerList.list[index].selection = event.target.value;
                                        setMarkerList({list:markerList.list})
                                        addMapMarkerContext.setMap({data:markerList.list, fun:"UPDATE", mode:"MARK"})
                                        sessionStorage.setItem("SSbE_mark", JSON.stringify(markerList.list))
                                    }} sx={{fontSize:'12px'}}>  
                                  
                                    {m.dataset.map((x,index2)=>(
                                        <MenuItem key={String(x) + String(index2)} value={index2} sx={{fontSize:'12px'}}>{x.name}</MenuItem>
                                    ))}
                                </Select>           
                            </Stack>
                        </ListItem>
                        ))}
                        </List>
                </Box>
            );
        }}</AddMapMarkerContext.Consumer>
    );
}

export default MarkerCompo