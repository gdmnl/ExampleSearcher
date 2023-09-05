import React, {createContext, Component} from 'react'

export const ModeContext = createContext();

class ModeContextProvider extends Component{
    state={
        mode:""
    }
    updateMode = (value) =>{
        this.setState({mode:value.mode});
    }
    render(){
        return(
            <ModeContext.Provider value={{...this.state, updateMode: this.updateMode}}>
                {this.props.children}
            </ModeContext.Provider>
        );
    }
}


export default ModeContextProvider;