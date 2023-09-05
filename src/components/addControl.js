import React, { Component } from "react"
import { TextField, Button, Grid,IconButton,Tooltip} from '@mui/material';
import { AddLocationOneContext } from '../context/addLocationOne';
import { AddPointsContext } from '../context/addSearch'
import {AddCircleOutlineRounded, ClearRounded} from '@mui/icons-material'
class AddControl extends Component{
    state={
        locOne:"",
        bool:false
    }
    render(){
        const handleLocationOne = (e) =>{
            this.setState({locOne: e.target.value, bool:this.state.bool});
        };
        const handleClear1Icon = () =>{
            this.setState({locOne: "", bool:this.state.bool});
        };
        const handleClear = () =>{
            this.setState({locOne: "", bool:this.state.bool});
        };
            window.addEventListener('storage', ()=>{
                    const flag  = localStorage.getItem("SSbE_disable_btn");
                    const flagRes = JSON.parse(flag)
                    this.setState({locOne: this.state.locOne, bool:flagRes});
            }, false)
        const adjustH = this.props.height*68/100;
        return(
            <AddPointsContext.Consumer>{(addPointContext) => (
                <AddLocationOneContext.Consumer>{(addLocationOneContext)  => {
                    return(
                        <Grid sx={{maxHeight:adjustH, width:"100%"}}>
                            <Grid container direction="column" justifyContent="flex-start" alignItems="center"  spacing={1}>
                                <Grid item container direction="column" spacing={0} justifyContent="center" alignItems="center" xs={5}>
                                {/* Row 1 */}
                                    <br/>
                                    <Grid item container direction="row" justifyContent="center" alignItems="center" >
                                            <TextField fullWidth id="location1" type="text" label="Enter location" value={this.state.locOne} 
                                                onChange={handleLocationOne} sx={{width:"70%"}} className="txtbox"/>
                                        
                                            <Tooltip title="Add Location">
                                                <IconButton onClick={()=>{if(toString(this.state.locOne).trim() !== ""){
                                                                            addPointContext.addPoints(this.state.locOne);
                                                                            this.setState({locOne: "", bool:this.state.bool});
                                                                        }}} disabled={this.state.bool}>
                                                    <AddCircleOutlineRounded  className="addIcon"/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Clear Location">
                                                <IconButton onClick={()=>{handleClear1Icon()}} disabled={this.state.bool}>
                                                    <ClearRounded className="clearIcon"/>
                                                </IconButton>
                                            </Tooltip>
                                    </Grid>
                                </Grid>
                                <br/>
                                <Grid item container direction="row" spacing={13}  justifyContent="center" alignItems="center"  >
                                    <Grid item xs="auto">
                                        <Button id="reset" onClick={()=>{handleClear();
                                        
                                        addLocationOneContext.addLocationOne("CLEAR");}} 
                                                    size="small" variant="contained" color="warning" className="clearBtn"
                                                    disabled={this.state.bool} >Clear</Button>
                                    </Grid>
                                    <Grid item xs="auto">
                                        <Button id="run" onClick={()=>{addLocationOneContext.addLocationOne("RUN");
                                        this.setState({locOne: this.state.locOne, bool:true})}} 
                                        size="small"  variant="contained" color="secondary" className="searchBtn" disabled={this.state.bool}>Search</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        );
                    }}</AddLocationOneContext.Consumer>
            )}</AddPointsContext.Consumer>
        );
    }
}

export default AddControl