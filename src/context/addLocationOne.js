import React, {createContext, Component} from 'react'

export const AddLocationOneContext = createContext();

class AddLocationOneContextProvider extends Component{
    state={
        value:""
    }
    addLocationOne = (x) =>{
        this.setState({value: x});
    }
    render(){
        return(
            <AddLocationOneContext.Provider value={{...this.state, addLocationOne: this.addLocationOne}}>
                {this.props.children}
            </AddLocationOneContext.Provider>
        );
    }
}


export default AddLocationOneContextProvider;