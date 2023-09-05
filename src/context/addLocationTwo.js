import React, {createContext, Component} from 'react'

export const AddLocationTwoContext = createContext();

class AddLocationTwoContextProvider extends Component{
    state={
        newvalue:"",
        oldvalue:"",
    }
    addLocationTwo = (value) =>{
        this.setState({newvalue:value.new, oldvalue:value.old});
    }
    render(){
        return(
            <AddLocationTwoContext.Provider value={{...this.state, addLocation: this.addLocationTwo}}>
                {this.props.children}
            </AddLocationTwoContext.Provider>
        );
    }
}


export default AddLocationTwoContextProvider;