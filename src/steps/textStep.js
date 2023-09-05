const step = [
    {
      id:"tabTour",
      text: [
        `
        <p>
         Use this tab to search by text. Click on next to view the explanation on the tab. 
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
      id:"TextBox",
      text: [
        `
        Enter the example location into this textfield. 
        `
      ],
      attachTo:  {
        element: '.txtbox',
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
    {   id:"Add",
        text: [
            `
            Click this to add the example location to the search list.
            `
          ],
          attachTo:  {
            element: '.addIcon',
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
    {   id:"Delete",
        text: [
            `
            Click this to clear the textfield.
            `
          ],
          attachTo:  {
            element: '.clearIcon',
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
    {   id:"Clear",
      text: [
        `
        Click this to clear both the added list and the results shown in the map.
        `
      ],
      attachTo:  {
        element: '.clearBtn',
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
        Click this to use the added example locations to search for results based on the settings.
        `
      ],
      attachTo:  {
        element: '.searchBtn',
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
    {   id:"List",
    text: [
        `
        <p>
        This area displays the list of added locations inputted.
      </p>
      <p>
      Clicking the icon <img src=/assets/images/deleteIcon.png /> 
      will remove the respective location from the list.
      </p>
      `
      ],
      attachTo:  {
        element: '.listData',
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
            type: "complete",
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
  