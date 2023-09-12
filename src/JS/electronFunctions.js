window.api.receive('save', () => {
    saveFunction();
  });

  window.api.receive('startCapture', () => {
    startFunction();
  });
  
  window.api.receive('stopCapture', () => {
    stopFunction();
  });
  
  window.api.receive('restartCapture', () => {
    restartFunction();
  });

  window.api.receive('movePackets', () => {
    movePacketsFunction();
  });

  window.api.receive('deletePackets', () => {
    deletePacketsFunction();
  });


function saveFunction() {
    console.log('Save event received!');

    window.api.showSaveDialog({
        defaultPath: 'filename.pcap',
        properties: ['createDirectory']
    }).then(result => {
        if (!result.canceled) {
        const filePath = result.filePath;
        handleFileSelection(filePath);
        } else {
        // Handle dialog cancellation
        }
    }).catch(error => {
        // Handle errors
        console.error('File save error:', error);
    });
}

function handleFileSelection(filePath) {
    console.log('Selected file path:', filePath);

    // Implement your saving logic here

    // Implement logic for tabs

    api.SavePCAP(dataPackets[activeTabId], filePath);
}