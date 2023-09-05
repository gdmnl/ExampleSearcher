import logo from './logo.svg';
import './App.css';
import WebLayout from './components/layout';
import Header from "./components/header";
import {Grid} from '@mui/material'
import DrawerContextProvider from "./context/drawerControl";
function App() {
  return( 
    <Grid> 
      <DrawerContextProvider>
        <Header/>
        <WebLayout />
      </DrawerContextProvider>
    </Grid>
  );
}

export default App;
