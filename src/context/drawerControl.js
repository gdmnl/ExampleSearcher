import React, {createContext, Component} from 'react'

export const DrawerContext = createContext();

class DrawerContextProvider extends Component{
    state={
        flag:""
    }
    setFlag = (value) =>{
        this.setState({flag:value.flag});
    }
    render(){
        return(
            <DrawerContext.Provider value={{...this.state, setFlag: this.setFlag}}>
                {this.props.children}
            </DrawerContext.Provider>
        );
    }
}


export default DrawerContextProvider;