const step = [
    {
      id:"tabTour",
      text: [
        `
        <p>
         This tab displays the results from the query. Click on next to view the explanation on the tab. 
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
      id:"locLegend",
      text: [
        `
        <p>
        This section displays the list locations that is used as the example. Each example is assigned a colour,
         where the results with the same type will have the same colour.
        </p>
        `
      ],
      attachTo:  {
        element: '.exampleList',
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
    {   id:"OrderBy",
        text: [
            `
             This section allows you to sort the results based of the default ordering or by shape similarity. 
             <p>
             When the results are sorted by shape similarity, the results will be ordered in the increasing order.
             </p>
             <p>
              After selecting the order type,
              click the arrow button to update the display.
             </p>
            `
          ],
          attachTo:  {
            element: '.orderSection',
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
    {   id:"navigate",
    text: [
        `
         This section allows you to navigate through the results list.
        `
      ],
      attachTo:  {
        element: '.navgateSection',
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
      {   id:"route",
      text: [
          `
            This section displays the locations of the current result.
          `
        ],
        attachTo:  {
          element: '.routeSection',
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
      // {   id:"dist",
      // text: [
      //     `
      //       This section displays how similar are the distance, in percentage, between the results and the example inputted.
      //       <p>
      //         Where 100% indicates a total match. A lower value indicates that the distance is generally shorter while a higher value indicates 
      //         that the distance is generally longer than the example.
      //       </p>
      //     `
      //   ],
      //   attachTo:  {
      //     element: '.distSection',
      //     on: 'left'
      //   } ,
      //   canClickTarget: false,
      //   classes: "shepherd shepherd-welcome",
      //   buttons: [
      //         {
      //         type: "back",
      //         classes: "shepherd-button-secondary",
      //         text: "Back"
      //         },
      //         {
      //         type: "next",
      //         text: "Next"
      //         }
      //     ],
      //     popperOptions:{
      //       modifiers: [
      //         { name: 'offset', options: { offset: [0, 15] }}
      //       ]
            
      //     }
      // },
      {   id:"shape",
      text: [
          ` 
          This section displays how similar are the shape, in percentage, formed by the results against the example inputted.
          <p>
            Note that the shape is determined by the backend logic, therefore, it may differ from the input order of the markers pinned by you.
          </p>
          `
        ],
        attachTo:  {
          element: '.shapeSection',
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
  