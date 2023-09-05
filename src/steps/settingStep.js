const step = [
  {
    id:"tabTour",
    text: [
      `
      <p>
       Use this tab to adjust the settings for the search. Click on next to view the explanation on the tab. 
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
  {
    id:"centerCont",
    text: [
      `
      <p>
      This section allows you to shift the view of the map to the desired area, be it a street, building or country.
      </p>
      <p>
        Click the arrow button to shift.
      </p>
      `
    ],
    attachTo:  {
      element: '.centerCont',
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
          }
      ],
      popperOptions:{
        modifiers: [
          { name: 'offset', options: { offset: [0, 15] }}
        ]
        
      }
  },
  {   id:"searchRad",
      text: [
          `
           This section allows you to adjust the size of the search radius, around the center marker. 
           <p>
           <img src=/assets/images/centerMarkerWCircle.png> 
           </p>
           <p>
            The search area is indicated by the blue circle with black border around the center marker. Click the marker to toggle the display 
            of the circle.
           </p>
           <p>
             Increasing the search radius value does not necessary increase the number of data per example input.
           </p>
           <p>
            Click the arrow button to update the value.
          </p>
          `
        ],
        attachTo:  {
          element: '.searchRadCont',
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
              }
          ],
          popperOptions:{
            modifiers: [
              { name: 'offset', options: { offset: [0, 15] }}
            ]
            
          }
  },
  {   id:"moreData",
      text: [
          `
           This section allows you to increase the number of similar data for each example point.
           <p>
              If the value is set to "No", the maximum number of data will be 20 for each point
           </p>
           <p>
            If the value is set to "Yes", the maximum number of data will be 60 for each point
           </p>
           <p>
            Click the arrow button to update the value.
          </p>
          `
        ],
        attachTo:  {
          element: '.moreDataCont',
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
              }
          ],
          popperOptions:{
            modifiers: [
              { name: 'offset', options: { offset: [0, 15] }}
            ]
            
          }
  },
  {   id:"result",
      text: [
          `
           This section allows you to increase the number of results calculated.
           <p>
              Limited value ranges from 1 to 15.
           </p>
          `
        ],
        attachTo:  {
          element: '.resultCont',
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
              }
          ],
          popperOptions:{
            modifiers: [
              { name: 'offset', options: { offset: [0, 15] }}
            ]
            
          }
  },
  
  {   id:"result",
      text: [
          `
           <p>
              Please note that the larger the number of data the longer time taken to process.
           </p>
          `
        ],
        canClickTarget: false,
        classes: "shepherd shepherd-welcome",
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
              }
          ],
          popperOptions:{
            modifiers: [
              { name: 'offset', options: { offset: [0, 15] }}
            ]
            
          }
  },
  ]

export default step;
  