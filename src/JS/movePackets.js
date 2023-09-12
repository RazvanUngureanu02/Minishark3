function movePacketsFunction(){
  const movePacketsOptions = document.getElementById('movingPacketsOptions');

  if (movePacketsOptions.style.display === 'none' || movePacketsOptions.style.display === '') {
    movePacketsOptions.style.display = 'block';

    const table = document.getElementById(`printDataTable-${activeTabId}`);
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      const firstCell = row.querySelector('td:first-child');
      firstCell.insertBefore(checkbox, firstCell.firstChild);
    });
  } else {
    movePacketsOptions.style.display = 'none';
    const table = document.getElementById(`printDataTable-${activeTabId}`);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      checkbox.parentNode.removeChild(checkbox);
    });
  }
  deletePacketsFromTabs();
}

function getCheckedRowIndexesPackets() {
  const table = document.getElementById(`printDataTable-${activeTabId}`);
  const checkboxes = table.querySelectorAll('input[type="checkbox"]');
  const checkedIndexes = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedIndexes.push(index);
    }
  });

  return checkedIndexes;
}

function getCheckedSidePanelIndexes() {
  const sidePanel = document.getElementById('mySidepanel-0');
  const checkboxes = sidePanel.querySelectorAll('input[type="checkbox"]');
  const checkedIndexes = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const tabIndex = checkbox.getAttribute('data-tab-index');
      checkedIndexes.push(parseInt(tabIndex));
    }
  });

  return checkedIndexes;
}

function transferRowsToTabs(rowIndexes, tabIndexes) {

  tabIndexes.forEach((indexTab) => {
    let newDataContent = [];
    let indexPacketInTable = 1;
    let j = 0;

    for(let i = 0; i< dataPackets[indexTab].length; i++)
    {
      while(j < rowIndexes.length)
      {
          const indexPacket = rowIndexes[j];
          if(dataPackets[activeTabId][indexPacket].timeElapsed < dataPackets[indexTab][i].timeElapsed)
          {
              newDataContent.push({...dataPackets[activeTabId][indexPacket]});

              j++;
          }
          else
          {
              break;
          }
      }
      newDataContent.push({...dataPackets[indexTab][i]});
    }

    while(j < rowIndexes.length)
    {
      const indexPacket = rowIndexes[j];

      newDataContent.push({...dataPackets[activeTabId][indexPacket]});

      j++;
    }

      dataPackets[indexTab] = newDataContent;

      dataPackets[indexTab].forEach((obj) => {
          obj.index = indexPacketInTable;
          indexPacketInTable++;
      });

  });

}

function movePacketsToAnotherTab() {
  let checkedIndexesPackets = getCheckedRowIndexesPackets();
  let checkedIndexesTabs = getCheckedSidePanelIndexes();

  let movedPacketsToSameTab = false;
  checkedIndexesTabs.forEach((index) => {
    // Perform actions with the index
    if(index == activeTabId)
    {
      movedPacketsToSameTab = true;
    }
  });

  transferRowsToTabs(checkedIndexesPackets, checkedIndexesTabs);

  closeNavPackets(0);

  if(movedPacketsToSameTab == true){
    refreshCurrentTab();
  }

}

function updateSidePanelContent() {
  const sidePanel = document.getElementById('mySidepanel-0');
  const tabList = document.querySelector('.tab-list');


  if (!sidePanel || !tabList) {
    return; // Exit if elements not found
  }

  const tabs = tabList.querySelectorAll('.tab');
  const sidePanelContent = sidePanel.querySelector('ul');

  // Clear previous content
  sidePanelContent.innerHTML = '';

  tabs.forEach((tab) => {
    const tabId = tab.getAttribute('data-tab');
    const tabName = tab.querySelector('span:not(.close-tab)').textContent;
  
    if(tabId!=0){ // if is not home tab
    const li = document.createElement('li');
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-tab-index', tabId); 
  
    const label = document.createElement('label');
    // label.textContent = `${tabName} - ID: ${tabId}`;
    label.textContent = `${tabName}`;

    // Add event listener to label
    label.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
    });
  
    li.appendChild(checkbox);
    li.appendChild(label);
  
    sidePanelContent.appendChild(li);
    }
  });
}

function openNavPackets(index) {
  var elementId = "mySidepanel-" + index;
  document.getElementById(elementId).style.width = "100%";
  document.getElementById(elementId).style.height = "45vh";

  const sidePanel = document.getElementById('mySidepanel-0');
  const sidePanelContent = sidePanel.querySelector('ul');
  sidePanelContent.innerHTML = '';

  updateSidePanelContent();
}

function closeNavPackets(index) {
  var elementId = "mySidepanel-" + index;
  document.getElementById(elementId).style.width = "0%";
  document.getElementById(elementId).style.height = "0vh";
}