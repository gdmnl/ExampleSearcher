import { useEffect, useContext } from 'react'
import { ShepherdTourContext } from 'react-shepherd'

export const StartTour = (props) => {
    const tour = useContext(ShepherdTourContext);
    useEffect(() => {
      if(props.autoStart &! tour.isActive()){
        setTimeout(() => {
          tour.start()
        }, 1000)
      }
    }, [props.autoStart])
    return null
}
