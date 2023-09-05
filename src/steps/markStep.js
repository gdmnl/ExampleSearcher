
const step = [  
  {
    id:"tabTour",
    text: [
      `
      <p>
       Use this tab to search by the markers that you have pinned on the map. Click on next to view the explanation on the tab. 
      </p>
      <p>
      You can always open the tour again using the provided button at the bottom right corner of the tab.
      </p>
      `
    ],
    attachTo:  {
      element: '.tabTour'
    } ,
    canClickTarget: false,
    classes: "shepherd shepherd-welcome",
    buttons: [
          {
          type: "cancel",
          classes: "shepherd-button-secondary",
          text: "Exit"
          },
          {
          type: "next",
          text: "Next"
          }
      ],
      popperOptions:{
        modifiers: [
          { name: 'offset', options: { offset: [0, 15] }}
        ]
        
      }
  }, 
    {   id:"Clear",
      text: [
        `
        Click this to clear both the markers placed on the map and the results shown in the map.
        `
      ],
      attachTo:  {
        element: '.clearBtnM',
        on: 'bottom'
      } ,
      canClickTarget: false,
      classes: "shepherd shepherd-welcome",
      buttons: [
            {
            type: "back",
            classes: "shepherd-button-secondary",
            text: "Back"
            },
            {
            type: "next",
            text: "Next"
            }
        ],
        popperOptions:{
          modifiers: [
            { name: 'offset', options: { offset: [0, 15] }}
          ]
          
        }
        
    },
    {   id:"Search",
    text: [
        `
        Click this to use the markers placed on the map to search for results based on the settings.
        `
      ],
      attachTo:  {
        element: '.searchBtnM',
        on: 'bottom'
      } ,
      canClickTarget: false,
      classes: "shepherd shepherd-welcome",
      buttons: [
            {
            type: "back",
            classes: "shepherd-button-secondary",
            text: "Back"
            },
            {
            type: "next",
            text: "Next"
            },
        ],
        popperOptions:{
          modifiers: [
            { name: 'offset', options: { offset: [0, 15] }}
          ]
          
        }
    },
    {   id:"Example",
    text: [
        `
        <p>
        This section displays a list of data based on the markers <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAsCAYAAAAEuLqPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAT1SURBVFhHvZhJbxxVFIVPzdXuBg9xZBJITAYlIQkQLIwUMQZQIEhM4jewQ+zgN6CwY1iw4wfAwsoCZQECMQgpEhIiIguIFJERO8Ty3EMNnFP9HHfbPVS3Gz6p7Kp777vvvPnZ1sLScoouJEmCxcUlFMIChoshPH4DLOZ69YCoxh8WrCCgza3bSJqmfFg+TTA/v4g4iRGGAWzbNhEslUeAYyGr1FlZQvWXC6j+/D3iv64gmf8n89ujO+DsfRDByWfgT03DGh6B5VNMQ0Wra2XcmV9AocAGeBsiOwqwLAseK3fnbqH81Tk+M0hXlo23NVaxhMKZ1xGeeQ3O/XuaeuT6zVkEgQ/fNz1H2gqQdj+JgEsXsfzJh4hv3qg7cuLs2o3SO+/Be/gErMKQWoPZOfYYf0uEGidaCpAviCIkF37C8sdn2eoV4+kNq1hE6d33s6GRiIWlFayVy03zYGOQGvA4ofDHpW1VLlR2+aOziH7/DYg1AX3+SrLJuc4WAbbG/PatrOB2Kl9HOZaYK75xFZ7jIOVkTpIOAnwqLX9zngWuGcv2Ua7K1+dhVSpcAR57IbrbC00CbA6+u7aC8syXxjI4Vme+QLq8yGUYNA1DkwCXAqoXf80CB41y1pg74LJsOwQud7Tqj9+Zr8FT+eFbOLVqtsrWaRJgcXuNrlw2X+2J2H1XyxV8fm0Wb1+8jD9Xy8bTmSw3t2XHse/uA80C1D3zd8xXe87NzuODy9dRYKJVjmdelNvm+eFwNWwRoElhWfzkgdGNNyfG8Omx/Tg9PoISReRGubnO3YbtOStdq0VYXV1DXK3A3jmROf4LlDut1ZpOQ7tarUKPq02Cs8DZu8+4Bo9ybx4wu1KpIeThMDoyDLc4hGD6pHENHp+5Y2ej+4Wdclb6ns9x4cTgBPEem4Y9Nm7cg0M5vROPI9I50wCHgzOZJ1S1WqvvUENFBKdOG/fgUM6EuZOGg0jYYRgi4tE7d/sObv09h4VqBJ/B9n27Tcj2Ua7g+ZdQ4zmwGVtdLxEh9+hA5zS/04ldCF95Q/1jwlozyqvVZ8cP4OBQaCwtYA7lSimicQteJ6tBO5NOKV2VHK7RiPc5/8nn4B1/NAvaDsqhXDXOr63VGwGbiTlO0cgowlffgnXvsLH2jsoqh3IpZyva9nFMxTbVhxy7flFZ5VCudrQVoNkaFYrwn30R7sHDxpoflVFZ5dg88xvpOMtirtmEV2tdsa1CwVi7o1iVUVnl6ERHAdIdBQXYU09kEykvilUZlW3f9jodBQidkvHwKPynT9X/0OiCYhSrMo2333Z0F8An278PHUXwwstas3VHK+jLYhirMt2rzyFAqCXaRt1HpuAePmqsW5FPMYrN03qRS4CImS+d3I/gqVPcXXxjbYA2+RSj2LzkFqCcie/DOfQQvCNbe0E2+RTTQ/35BQhd1lJeKjzO8KarLd9lk6/7ha6ZngRoWBOeE/bkPjgP7DVWzj2+yyZfzqG/S08CRMLWWhxn98gxY1H3H6PtQObrlZ4FZA3csZOtnsy+hbOH7zvGexr7dXoXoCXJ7dUaHYPNSvVgZCyz5V16jfQsQKgai5Xa7Ak9eu+n9aIvAbrlWKUS7GIxe/Te7fbUjr57AMUSK74ne/T+//YAx9riNdvhatCj957XnyHX/wlb4XLFBebvwgqv81GfXdC3gEHR3xAMDOBfpPHE66EKMHUAAAAASUVORK5CYII=" />
        on the map. 
        </p>
        <p>
          A sample is as follow:
        </p>
        <p>
         <img src=/assets/images/markerImage.png style="width:300px;height:300px;"/>
        </p>
        <p>
          The number boxed in black is the reference number for each marker.
          The selectable list boxed in blue is the list of available locations within 25 meters of the marker. By selecting 
          a location in the list, the selected value will be used 
          as the input for the search. 
        </p>
        </div>
        `
      ],
      attachTo:  {
        element: '.markerList',
        on: 'left'
      } ,
      canClickTarget: false,
      classes: "shepherd width-model",
      buttons: [
            {
            type: "back",
            classes: "shepherd-button-secondary",
            text: "Back"
            },
            {
            type: "cancel",
            classes: "shepherd-button-secondary",
            text: "Exit"
            },
        ],
        popperOptions:{
          modifiers: [
            { name: 'offset', options: { offset: [0, 15] }}
          ]
          
        }
    },
  
  ]

export default step;
  