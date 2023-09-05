import { useEffect, useContext } from 'react'
import { ShepherdTourContext } from 'react-shepherd'

export const StartTourTabs = (props) => {
    const tour = useContext(ShepherdTourContext);
    const sessionVal = sessionStorage.getItem(props.tabName);
    const tabVal = JSON.parse(sessionVal)
    useEffect(() => {
      if( !tour.isActive() & !tabVal){
        setTimeout(() => {
          sessionStorage.setItem(props.tabName, JSON.stringify(true))
          tour.start()
        }, 100)
      }
    }, [props.autoStart])
    return null
}