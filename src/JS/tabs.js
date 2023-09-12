window.onload = function() {
    createHomeTab();
    initializeThemeButtons();
  };

function createHomeTab() {
  const tabList = document.querySelector('.tab-list');
  const tab = document.createElement('div');
  tab.classList.add('tab');
  tab.setAttribute('data-tab', 0);

  const tabTitle = document.createElement('span');
  tabTitle.innerHTML = '<i class="fa-solid fa-house"></i>';

  tab.appendChild(tabTitle);

  tabList.appendChild(tab);

  const tableContainer = document.createElement('div');
  tableContainer.innerHTML = `
  <h1 class="shark-title">Welcome to MiniShark!
        <div id="bubbles"></div>
        <div id="shark">
          <div class="shark-body"></div>
          <div class="shark-eye"></div>
          <div class="aleta"></div>
          <div class="tail"></div>
          <div class="fin"></div>
          <div class="gill gill-1"></div>
          <div class="gill gill-2"></div>
          <div class="gill gill-3"></div>
        </div>
      </h1>

  <div style="margin-top:10px;display:flex;max-width:1400px">

  <div id="live-capture" class="live-capture">
      <i class="fa-solid fa-tower-cell" aria-hidden="true"></i><br>
      <button id="showliveBtn" onclick="liveCaptureFunction()" class="defaultbtn"> Live Capture </button>
  </div>

  <div style="clear: both;"></div>

  <form id="file-upload-form" class="uploader" style="text-align: center;">
  <input id="file-upload" type="file" name="fileUpload"/>

  <label for="file-upload" id="file-drag">
      <div id="start">
      <i class="fa fa-download" aria-hidden="true"></i>
      <div id="select-file-name">Select file</div>
      <span id="file-upload-btn" class="btn btn-primary" onclick="getFileName()">Select file</span>
      <input class="btn btn-primary" type="button" value="Submit" onclick="submitForm()">
      </div>
  </label>
  </form>

  </div>

  <div class="theme-container">
  <h1 class="custom-title">Themes</h1>

  <div class="theme-switcher">
  <button data-theme="default" class="theme-button gradient"><i class="fa fa-sun-o"></i></button>
  <button data-theme="dark" class="theme-button gradient-dark"><i class="fa fa-moon-o" style='color:white'></i></button>
  </div>

  </div>

  <style>
      #showliveBtn {
          font-weight:700;
      }
  </style>

  `;

  tabContent[0] = tableContainer;
  tab.addEventListener('click', activateTab);
  activateTab({ target: tab });
}

function generateTableContainer(tabCounter) {
  return `
    <div style="height: 6vh;">

      <div class="dropdown">
        <button onclick="dropdownFunction()" class="dropbtn"><i class="fas fa-search"></i></button>
        <div id="myDropdown" class="dropdown-content">
          <input type="text" id="textbox1" class="textbox" style="width: 200px;" placeholder="Index">
          <input type="text" id="textbox2" class="textbox" style="width: 200px;" placeholder="Time">
          <input type="text" id="textbox3" class="textbox" style="width: 200px;" placeholder="Destination IP">
          <input type="text" id="textbox4" class="textbox" style="width: 200px;" placeholder="Source IP">
          <input type="text" id="textbox5" class="textbox" style="width: 200px;" placeholder="Protocol">
          <input type="text" id="textbox6" class="textbox" style="width: 200px;" placeholder="Length">
          <input type="text" id="textbox7" class="textbox" style="width: 200px;" placeholder="Info">

          <div style="text-align: left">
            <button onclick="retrieveTextboxValues()" class="defaultbtn"> Apply filters </button>
            <button onclick="clearFilters()" class="defaultbtn"> Clear filters </button>
          </div>
        </div>
      </div>

    </div>

    <div class="table-container">
      <table id="printDataTable-${tabCounter}">
        <thead>
          <tr>
            <th>Index</th>
            <th>Time</th>
            <th>Destination</th>
            <th>Source</th>
            <th>Protocol</th>
            <th>Length</th>
            <th>Info</th>
          </tr>
        </thead>

        <tbody>
            <div id="mySidepanel-0" class="sidepanel-packets">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNavPackets(0)">×</a>
            <ul></ul>
            <button onclick="movePacketsToAnotherTab()" class="defaultbtn"> Send packets </button>
            <button onclick="deletePacketsFromTabs()" class="defaultbtn"> Delete packets </button>
            </div>

            <div id="movingPacketsOptions">
            <button onclick="openNavPackets(0)" class="defaultbtn"> Move to </button>
            <button onclick="openNavPackets(0)" class="defaultbtn"> Delete packets </button>
            <button onclick="movePacketsFunction()" class="defaultbtn"> Cancel </button>
            </div>
        </tbody>


      </table>
      <div class="table-details" id="dropdown-${tabCounter}"></div>
      <div class="table-content-details" id="hex-${tabCounter}" style="margin-left:50%"></div>
      <div class="table-content-details-readable" id="readableString-${tabCounter}" style="margin-left:85%"></div>
    </div>
  `;
}


function dropdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
function addTab(filePath) {
    const tabList = document.querySelector('.tab-list');

    // create new tab and set its class and data attributes
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabCounter);

    // create tab title and set its text
    const tabTitle = document.createElement('span');
    tabTitle.textContent = filePath.split('\\').pop();

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

    //const classic = document.querySelector('#classic');

    //classic.innerHTML = "";

    //classic.innerHTML = tableContainer;

    tabContent[tabCounter] = tableContainer;

    tabFilePath[tabCounter] = filePath;

    isLiveCapture[tabCounter] = false;

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

function refreshCurrentTab() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
      activeTab.dispatchEvent(new Event('click'));
    }
}

function activateTab(event) {
    const tab = event.target.closest('.tab');
    const tabList = tab.parentElement;
    const activeTab = tabList.querySelector('.active');

    if (activeTab) {
        activeTab.classList.remove('active');
    }

    tab.classList.add('active');

    const tabId = tab.getAttribute('data-tab');

    activeTabId = tabId;

    selectedTableLine[tabId] = undefined;

    const classic = document.querySelector('#classic');

    classic.innerHTML = tabContent[tabId].innerHTML;

    if(tabId != 0)
    {
        if(isLiveCapture[tabId] === false)
        {
            parsePcapFile(tabId); // saving the content of the tab in data
            //parsePcapFile(tabFilePath[tabId],tabId);
        }
        else
        {
            if(dataPackets[tabId] != undefined)
            {
                myFunction(dataPackets[tabId],tabId);
            }

            if(isLiveCaptureInProgress[tabId] === true){
            startCapture(tabId,networkInterfaceTab[tabId]);
            isLiveCaptureInProgress[tabId] = true
            }
        }
    }
    else
    {
        initializeThemeButtons();
    }
}
  
function closeTab(event) {
    event.stopPropagation();

    const tab = event.target.closest('.tab');
    const tabList = tab.parentElement;

    isLiveCaptureInProgress[activeTabId] = false;
    stopCapture(activeTabId);

    if (tab.classList.contains('active')) {
        const tabs = tabList.querySelectorAll('.tab');
        const index = Array.from(tabs).indexOf(tab);

        if (index === 0) {
        activateTab({ target: tabs[1] });
        } else {
        activateTab({ target: tabs[index - 1] });
        }
    }

    tabList.removeChild(tab);
}