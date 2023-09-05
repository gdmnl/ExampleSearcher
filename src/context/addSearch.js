import React, {createContext, Component} from 'react'

export const AddPointsContext = createContext();

class AddPointsContextProvider extends Component{
    state={
        location:""
    }
    addPoints = (value) =>{
        this.setState({location:value});
    }
    render(){
        return(
            <AddPointsContext.Provider value={{...this.state, addPoints: this.addPoints}}>
                {this.props.children}
            </AddPointsContext.Provider>
        );
    }
}


export default AddPointsContextProvider;