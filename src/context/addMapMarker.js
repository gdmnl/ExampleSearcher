import React, {createContext, Component} from 'react'

export const AddMapMarkerContext = createContext();

class AddMapMarkerContextProvider extends Component{
    state={
        data:"",
        fun:"",
        mode:""
    }
    setMap = (value) =>{
        this.setState({data:value.data,fun:value.fun, mode:value.mode});
    }
    render(){
        return(
            <AddMapMarkerContext.Provider value={{...this.state, setMap: this.setMap}}>
                {this.props.children}
            </AddMapMarkerContext.Provider>
        );
    }
}


export default AddMapMarkerContextProvider;