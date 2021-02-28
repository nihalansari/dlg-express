var simpleResponse = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Simple response",
              "displayText": "Simple response"
            }
          }
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};

var simpleChatResponse = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
         
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


var simpleFallbackResponse = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
         
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};

var sessionId, contextName;

var simpleResponsePassword = {
  "payload": {
    "google": {
      "expectUserResponse": true, 
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Incorrect password!",
              "displayText": "Incorrect password!"
            }
          },
          {
            "simpleResponse": {
              "textToSpeech": "Please enter your password again.",
              "displayText": "Please enter your password again."
            }
          }
          
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


var suggestionChipTemplate = 
{
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Please choose one option."
            }
          }
        ],
        "suggestions": [
          {
            "title": "Start over"
          },
          {
            "title": "Continue"
          },
          {
            "title": "Exit"
          }
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};

var simpleCardTemplate = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "You have a high priority notification in your worklist. Do you want me to help you with it?"
            }
          },
          {
            "basicCard": {
              "title": "Urgent requisition needed!",
              "subtitle": "",
              "formattedText": "***Material shortage observed***",
              "image": {
                //"url": "https://comps.canstockphoto.co.nz/shortage-warning-road-sign-illustration-clip-art-vector_csp16838569.jpg",
                "url": "https://us.123rf.com/450wm/emrahavci/emrahavci1803/emrahavci180300199/97992082-stock-vector-vector-illustration-concept-of-red-sales-bar-chart-graph-moving-down-with-x-mark-icon-.jpg?ver=6",
                "accessibilityText": "Shortage of Raw Material!"
              },
              "buttons": [],
              "imageDisplayOptions": "CROPPED"
            }
          }

        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


var simpleCardTemplateBOM = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Here are the error messages."
            }
          },
          {
            "basicCard": {
              "title": "BOM Error!",
              "subtitle": "From Plant #1010",
              "formattedText": "***BOM Error***",
              "image": {
                "url": "https://blogs.solidworks.com/tech/wp-content/uploads/sites/4/13-2.png",
                "accessibilityText": "Plant 1010!"
              },
              "buttons": [],
              "imageDisplayOptions": "CROPPED"
            }
          }

        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


var errorCardTemplate = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Server returned an Error!"
            }
          },
          {
            "basicCard": {
              "title": "Error",
              "subtitle": "Server Error",
              "formattedText": "",
              "image": {
                "url": "https://img.icons8.com/clouds/2x/close-window.png",
                "accessibilityText": "Error!"
              },

              "buttons": [],
              "imageDisplayOptions": "CROPPED"
            }
          }
        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


var cardSimpleTableTemplate = {
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [

          
          {
            "simpleResponse": {
              "textToSpeech": "Here are the MRP Simulation results for you."
            }
          },
          {
            "simpleResponse": {
              "textToSpeech": "No wonder! You were stressed out at the start. Hope the results give you some respite. Here we go!"
            }
          },
          {
            "tableCard": {
              "rows": [
                {
                  "cells": [
                    {
                      "text": "1"
                    },
                    {
                      "text": "10300001"
                    }
                  ],
                  "dividerAfter": true
                },
                {
                  "cells": [
                    {
                      "text": "2"
                    },
                    {
                      "text": "10300002"
                    }
                  ],
                  "dividerAfter": true
                },{
                  "cells": [
                    {
                      "text": "3"
                    },
                    {
                      "text": "10300006"
                    }
                  ],
                  "dividerAfter": true
                }
              ],
              "columnProperties": [
                {
                  "header": "Serial Number"
                },
                {
                  "header": "Available Vendor"
                }
              ]
            }
          }

        ]
      }
    }
  },
  
  "outputContexts": [
    
  ]
};


var simpleCardTemplatePO = {
  
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "",
              "displayText": ""
            }
          },
          {
            "simpleResponse": {
              "textToSpeech": "",
              "displayText": ""
            }
          },
          {
            "basicCard": {
              "title": "Purchase Order Created!",
              "subtitle": "FG21",
              "formattedText": "", //PO Id
              "image": {
                "url": "https://www.spscommerce.com/wp-content/uploads/2017/11/purchase-order-291x300.png",
                "accessibilityText": "Successfully placed a purchase order."
              },
              "buttons": [],
              "imageDisplayOptions": "CROPPED"
            }
          }

        ]
      }
    }
  },
  "outputContexts": [
    
  ]
};


exports.suggestionChipTemplate = suggestionChipTemplate;
exports.simpleResponse = simpleResponse;
exports.errorCardTemplate = errorCardTemplate;
exports.simpleResponsePassword = simpleResponsePassword;
exports.simpleCardTemplate = simpleCardTemplate;
exports.simpleChatResponse = simpleChatResponse;
exports.cardSimpleTableTemplate = cardSimpleTableTemplate;
exports.simpleCardTemplateBOM = simpleCardTemplateBOM;
exports.simpleCardTemplatePO = simpleCardTemplatePO; 
exports.simpleFallbackResponse = simpleFallbackResponse;