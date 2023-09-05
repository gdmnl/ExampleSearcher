import React, {createContext, Component} from 'react'

export const MapControlContext = createContext();

class MapControlContextProvider extends Component{
    state={
        key:"",
        data:""
    }
    setControl = (value) =>{
        this.setState({key:value.key, data:value.data});
    }
    render(){
        return(
            <MapControlContext.Provider value={{...this.state, setControl: this.setControl}}>
                {this.props.children}
            </MapControlContext.Provider>
        );
    }
}


export default MapControlContextProvider;