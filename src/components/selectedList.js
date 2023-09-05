import React, { useState, useEffect } from 'react';
import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material'
import { AddPointsContext } from '../context/addSearch';
import { AddLocationOneContext } from '../context/addLocationOne';
import { AddMapMarkerContext } from '../context/addMapMarker';

function SelectedList(props){
    const [state, setState]=useState({objectList:[]});
    const [isLoading, setLoading] = useState(true);
    function handleReset (){
        setState({
            objectList:[]
        })
        
        sessionStorage.setItem("SSbE_text", JSON.stringify([]))
    }
    function handleDelete(e){
        const object = state.objectList;
        const row = object.indexOf(e);
        object.splice(row,1);
        setState({
            objectList:object
        })
        sessionStorage.setItem("SSbE_text", JSON.stringify(object))
        console.log(e)
    }
    function handleAdd(e){

        sessionStorage.setItem("SSbE_text", JSON.stringify(state.objectList))
    }
    const adjustH = props.height*77/100;
    useEffect(() => {
        async function fetchdata()
        {
            const data  = sessionStorage.getItem("SSbE_text")
            const response = JSON.parse(data);
            setState({objectList:response})
            setLoading(false)
        }
        fetchdata()  
        
    },[isLoading])
    return(
        isLoading ? <></> :
        <AddMapMarkerContext.Consumer>{(addMapMarkerContext)=> (
        <AddLocationOneContext.Consumer>{(addLocationOneContext)=> (
        <AddPointsContext.Consumer>{(addPointContext)=>{
            if(addPointContext.location !== ""){
                console.log(addPointContext.location)
                const trimLocation = addPointContext.location.trim();
                const object = state.objectList;
                if(object.findIndex(x => x === trimLocation) === -1){
                    object.push(trimLocation);
                    handleAdd(addPointContext.location);
                    setState({objectList:object})
                }
                else{
                    alert(addPointContext.location + " has been added before!")
                }
                addPointContext.addPoints("");
            }
            if(addLocationOneContext.value !== ""){
                if(addLocationOneContext.value === "RUN"){
                    addMapMarkerContext.setMap({data:state.objectList, fun: "RUN", mode:"TEXT"})
                }
                else if(addLocationOneContext.value === "CLEAR"){
                    addMapMarkerContext.setMap({data:state.objectList, fun: "CLEAR", mode:"TEXT"})
                    handleReset();
                }
                addLocationOneContext.addLocationOne("");
            }
            return(
                <TableContainer sx={{maxHeight:adjustH, width:"100%"}} className="listData">
                    <Table stickyHeader  size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell  align='center' colSpan={2}>List of added locations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.objectList.map(tra=>(
                                <TableRow key={tra}>
                                    <TableCell align='center' colSpan={1}>{tra}</TableCell>
                                    <TableCell align='center' colSpan={1} >
                                        <Tooltip title="Delete Row">
                                            <IconButton aria-label="delete" size="small" onClick={()=>{handleDelete(tra)}}>
                                                <DeleteOutline size="inherit"/>
                                            </IconButton>
                                        </Tooltip>
                                        </TableCell>
                                </TableRow>    

                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            );
        }}</AddPointsContext.Consumer>
        )}</AddLocationOneContext.Consumer>
        )}</AddMapMarkerContext.Consumer>
        
    );
}

export default SelectedList