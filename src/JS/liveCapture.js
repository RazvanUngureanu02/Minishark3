api.receiveMessageFromMain((packet, index) => {
  //console.log(packet, index); // Output: "Hello from main process!"
  if(packet != undefined)
  {
    if(dataPackets[index] === undefined)
    {
      dataPackets[index] = [];
    }

    for(let i=0; i<packet.length; i++)
    {
      dataPackets[index].push(packet[i]);
      dataPackets[index][ dataPackets[index].length - 1 ].index = dataPackets[index].length;
      dataPackets[index][ dataPackets[index].length - 1 ].timeElapsed = (dataPackets[index][ dataPackets[index].length - 1 ].seconds + dataPackets[index][ dataPackets[index].length - 1 ].microseconds / 1000000.0) -
                                                                        (dataPackets[index][0].seconds + dataPackets[index][0].microseconds / 1000000.0);


      //(packet.seconds + packet.microseconds / 1000000.0) - (packets[0].seconds + packets[0].microseconds / 1000000.0);
    }    

    //myFunction(packet,activeTabId);
    if(activeTabId == index)
    {
      myFunction(packet,index);
    }
  }
});

async function getLiveCapturePacket(tabId)
{
  dataPackets[tabId] = await api.OperationsLiveCapture(parseInt(networkInterfaceTab[tabId]));

  myFunction(dataPackets[tabId],tabId);
}

async function interfaceForLiveCapture(interfaceIndex)
{
  addTabLiveCapture(interfaceIndex);
}

async function interfaceMenu(interfaces) {
  // var features = "width=800,height=600,top=100,left=100";
  // var newWindow = window.open("", "_blank", features);

  // newWindow.document.title = "Network Interfaces";
  // newWindow.document.body.style.background = "#000";

  var buttonContainer = document.getElementById("live-capture");

  document.getElementById("showliveBtn").disabled = true;

  interfaces.forEach(function(interface) {
    var button = document.createElement("button");
    button.textContent = interface;
    button.classList.add("livebtn");
   

    button.addEventListener("click", function() {
      interfaceForLiveCapture(interfaces.indexOf(interface));
      //newWindow.close();
    });

    buttonContainer.appendChild(button);
  });

}

async function startFunction()
{
  console.log("Start function!");
  isLiveCaptureInProgress[activeTabId] = true;
  startCapture(activeTabId,networkInterfaceTab[activeTabId]);
}

async function stopFunction()
{
    console.log("Stop function!");
    isLiveCaptureInProgress[activeTabId] = false;
    stopCapture(activeTabId);
}

function restartFunction()
{
    //console.log("Restart function!");
}

function addTabLiveCapture(interfaceIndex){
    const tabList = document.querySelector('.tab-list');
  
    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabCounter);
  
    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = "Live Capture";
  
    // create close button for the tab
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-tab');
    closeButton.setAttribute('data-tab', tabCounter);
    closeButton.textContent = '×';
  
    // add the title and close button to the tab
    tab.appendChild(tabTitle);
    tab.appendChild(closeButton);
  
    // add the tab to the tab list
    tabList.appendChild(tab);
  
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = generateTableContainer(tabCounter);

// add the table container to the classic div
//const classic = document.querySelector('#classic');
//classic.appendChild(tableContainer);

//const classic = document.querySelector('#classic');

//classic.innerHTML = "";

//classic.innerHTML = tableContainer;

//myFunction(tabCounter);

tabContent[tabCounter] = tableContainer;

isLiveCapture[tabCounter] = true;

isLiveCaptureInProgress[tabCounter] = true;

networkInterfaceTab[tabCounter] = interfaceIndex;

// classic.innerHTML = "";

    // add click event listener to the tab
    tab.addEventListener('click', activateTab);
  
    // add click event listener to the close button
    closeButton.addEventListener('click', closeTab);
  
    // activate the new tab
    activateTab({ target: tab });

    // increment the tab counter
    tabCounter++;
  }