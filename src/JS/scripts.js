let data
let tabCounter = 1;

let selectedTableLine = {};

let textBoxValues = {};

let indexCaptureTab = {};
let timeCaptureTab = {};

let tabContent = {};
let tabFilePath = {};
let isLiveCapture = {};

let isLiveCaptureInProgress = {};

let networkInterfaceTab = {};

let activeTabId = null;

let capturedPackets = {};

let dataPackets = {};

let patterns = {};

window.onload = function() {
  createHomeTab();
  initializeThemeButtons();
};

function submitForm() {
  const fileInput = document.getElementById("file-upload");
  const filePath = fileInput.files[0].path;

  addTab(filePath);
 // myFunction(filePath);

  // create a new button element
};

// async function handleInterfacenames()
// {
//    data = await api.getInterfaceNames();

//    console.log(data);
// }

// async function handleLiveCapture()
// {
//   data = await api.OperationsLiveCapture(7);

//   console.log(data);
// }

async function liveCaptureFunction()
{
  interfaces = await api.getInterfaceNames();

  interfaceMenu(interfaces);

  //dataPackets[currentID] = data;

  //myFunction(dataPackets[currentID],currentID);
}
  
async function parsePcapFile(currentID)
{
  if(dataPackets[currentID] === undefined) {
  data = await api.Operations(tabFilePath[currentID]);

  dataPackets[currentID] = data;
  }

  myFunction(dataPackets[currentID],currentID);
}

async function myFunction(data, currentID) {
  const table = document.getElementById("printDataTable-" + currentID);
  const tbody = table.getElementsByTagName("tbody")[0];

  // Retrieve the patterns for the currentID
  const currentPatterns = patterns[currentID];

  filteredData = data;

  if (currentPatterns) {
    // Filter the data using the patterns
    filteredData = data.filter(obj => {
      return (
        currentPatterns.indexRegex.test(obj.index) &&
        currentPatterns.timeRegex.test(obj.timeElapsed) &&
        currentPatterns.destinationRegex.test(obj.destinationIP) &&
        currentPatterns.sourceRegex.test(obj.sourceIP) &&
        currentPatterns.protocolRegex.test(obj.protocol) &&
        currentPatterns.lengthRegex.test(obj.originalPacketLength) &&
        currentPatterns.infoRegex.test(obj.infoData)
      );
    });
  }

  filteredData.forEach(obj => {
    const row = tbody.insertRow();
    row.insertCell().textContent = obj.index;
    row.insertCell().textContent = obj.timeElapsed;
    row.insertCell().textContent = obj.destinationIP;
    row.insertCell().textContent = obj.sourceIP;
    row.insertCell().textContent = obj.protocol;
    row.insertCell().textContent = obj.originalPacketLength;
    row.insertCell().textContent = obj.infoData;

    // Add onclick event to each row
    row.onclick = function(event) {
      displayInfoData(obj, currentID, event);
    }
  });

  if(tbody.getElementsByTagName('tr')[0] != undefined){
    if(selectedTableLine[currentID] === undefined){
    tbody.getElementsByTagName('tr')[0].classList.add("selected-row");
    displayInfoData(filteredData[0], currentID);
    selectedTableLine[currentID] = 1;
  }
  }
}



//create a map to store the protocol and their full name
let protocolMap = new Map();
protocolMap.set("ARP", "Address Resolution Protocol");
protocolMap.set("ICMP", "Internet Control Message Protocol");
protocolMap.set("TCP", "Transmission Control Protocol");
protocolMap.set("UDP", "User Datagram Protocol");
protocolMap.set("HTTP", "Hypertext Transfer Protocol");
protocolMap.set("HTTPS", "Hypertext Transfer Protocol Secure");
protocolMap.set("DNS", "Domain Name System");
protocolMap.set("DHCP", "Dynamic Host Configuration Protocol");

function displayInfoData(obj,currentID, event) {
  const hexField = document.getElementById("hex-" + currentID);
  const readableField = document.getElementById("readableString-" + currentID);
  const dropdownField = document.getElementById("dropdown-" + currentID);

  //search for obj.protocol in the map and get the full name
  let protocolFullName = protocolMap.get(obj.protocol);
  // i had .textContent before
  dropdownField.innerHTML = `
  <h2 class='table-content-details-title' style='font-size: 24px; padding-bottom: 10px;text-align:center'>Packet details </h2>

  <button class="collapsible" onclick="collapse(1)">Frame ${obj.index}: ${obj.originalPacketLength} bytes on wire (${obj.originalPacketLength * 8} bits), ${obj.capturedPacketLength} bytes captured (${obj.capturedPacketLength * 8} bits)</button>
  <div class="content" id="content-1">
    <a>Frame number: ${obj.index}</a>
    <a>Frame length: ${obj.originalPacketLength} bytes (${obj.originalPacketLength * 8} bits) </a>
    <a>Capture length: ${obj.capturedPacketLength} bytes (${obj.capturedPacketLength * 8} bits) </a>
  </div>
  <button class="collapsible" onclick="collapse(2)">Ethernet II</button>
  <div class="content" id="content-2">
    <a href="#">Destination: ${obj.destinationMac}</a>
    <a href="#">Source: ${obj.sourceMac}</a>
    <a href="#">Type: IPv4</a>
  </div>
  <button class="collapsible" onclick="collapse(3)">Internet protocol version 4, Src: ${obj.sourceIP}, Dst: ${obj.destinationIP}</button>
  <div class="content" id="content-3">
    <a href="#">Protocol: ${obj.protocol}</a>
    <a href="#">Source adress: ${obj.sourceIP}</a>
    <a href="#">Destination adress: ${obj.destinationIP}</a>
  </div>
  <button class="collapsible" onclick="collapse(4)">${protocolFullName}</button>
  <div class="content" id="content-4">
    <a href="#">${obj.infoData}</a>
  </div>
  `;

  hexField.innerHTML =
  "<p class='table-content-details-title' style='font-size: 14px; padding-bottom: 10px;text-align:left'>" + obj.hexValues + "</p>";

  readableField.innerHTML =
    "<p class='table-content-details-title' style='font-size: 14px; padding-bottom: 10px;text-align:left'>" + obj.readableString + "</p>";

    /*this might slow down the application*/

  // Check if the event parameter is defined
  if (event && event.currentTarget) {
    // Remove the class from all rows
    const rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove("selected-row");
    }
  
    // Add the class to the selected row
    event.currentTarget.classList.add("selected-row");
  }

}

function openNav(index) {
  var elementId = "mySidepanel-" + index;
  document.getElementById(elementId).style.width = "50%";
  document.getElementById(elementId).style.height = "50%";
}

function closeNav(index) {
  var elementId = "mySidepanel-" + index;
  document.getElementById(elementId).style.width = "0%";
  document.getElementById(elementId).style.height = "0%";
}


function collapse(index){
  var elementId = "content-" + index;
  if(document.getElementById(elementId).style.maxHeight){
    document.getElementById(elementId).style.maxHeight = null;

  }
  else{
    document.getElementById(elementId).style.maxHeight = document.getElementById(elementId).scrollHeight + "px";
  }
    
}

