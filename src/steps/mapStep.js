
const step = [   
    {   id:"welcome",
    title: "Introduction",
      text: [
        `
        <p>
         This web application is developed for a Final Year Project using Spatial Search By Example which uses an example to search instead of criteria filtering.
         </p>
         <p>
           The remaining of the guide will introduce you to the basics of the web application.
           </p>
         <p>
            You can always start this tour again 
           by clicking on the information icon in the top left of the web application.
         </p>
        `
      ],
      attachTo:  {
        element: '.infoIcon',
        // on: 'bottom'
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
    {   id:"introduction",
    text: [
        `
        Click this button to open up the controls for the web application.
        <p> 
          Upon clicking the button a drawer will be opened, depending on the screen resolution, tabs may be hidden due to the size limit 
          as shown in the picture below. Use the arrow button (boxed in red) to access the hidden tabs.
        </p>
        <img src=/assets/images/settingBar.png  style="width:375px;float:left;margin-right:20px;"/>
        <p>
          Each tab has a tour to guide you along, and can be reactivated as well.
        </p>
        `
      ],
      attachTo:  {
        element: '.menuBtn',
        on: 'left'
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
            { name: 'offset', options: { offset: [0, 30] }}
          ]
          
        }
    },
    {   id:"map",
    text: 
        `
        <p>
        This area displays an interactive map. 
        </p>
        <p>
          By left clicking on the map, it will generate a marker, which is used to create a point to be used as the input. Upon
          clicking on the marker itself, the marker will be removed.
        </p>
        <p>
          <img src=/assets/images/numberMarker.png  />
        </p>
        <p>
          By right clicking on the map, it will shift the center marker, indicated by "C", to the point. Clicking on the marker will toggle
          the circle which indicates the search area.
        </p>
        <p>
        <img src=/assets/images/centerMarker.png />
        </p>
        `
      ,
      attachTo:  {
        element: '.map',
        // on: 'left'
      } ,
      canClickTarget: false,
      // classes: "shepherd shepherd-welcome",
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
  
