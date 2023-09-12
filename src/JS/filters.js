function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function retrieveTextboxValues() {
  let indexValue = document.getElementById('textbox1').value;
  let timeValue = document.getElementById('textbox2').value;
  let destinationValue = document.getElementById('textbox3').value;
  let sourceValue = document.getElementById('textbox4').value;
  let protocolValue = document.getElementById('textbox5').value;
  let lengthValue = document.getElementById('textbox6').value;
  let infoValue = document.getElementById('textbox7').value;

  patterns[activeTabId] = {
    indexRegex: indexValue !== '' ? new RegExp(`^${escapeRegExp(indexValue)}$`, 'i') : new RegExp('', 'i'),
    timeRegex: new RegExp(timeValue, 'i'),
    destinationRegex: new RegExp(destinationValue, 'i'),
    sourceRegex: new RegExp(sourceValue, 'i'),
    protocolRegex: new RegExp(protocolValue, 'i'),
    lengthRegex: lengthValue !== '' ? new RegExp(`^${escapeRegExp(lengthValue)}$`, 'i') : new RegExp('', 'i'),
    infoRegex: new RegExp(infoValue, 'i')
  };

  textBoxValues[activeTabId] = {
    index: indexValue,
    time: timeValue,
    destination: destinationValue,
    source: sourceValue,
    protocol: protocolValue,
    length: lengthValue,
    info: infoValue
  };

  refreshCurrentTab();

  // Set the values of the textboxes using the stored values
  document.getElementById('textbox1').value = textBoxValues[activeTabId].index;
  document.getElementById('textbox2').value = textBoxValues[activeTabId].time;
  document.getElementById('textbox3').value = textBoxValues[activeTabId].destination;
  document.getElementById('textbox4').value = textBoxValues[activeTabId].source;
  document.getElementById('textbox5').value = textBoxValues[activeTabId].protocol;
  document.getElementById('textbox6').value = textBoxValues[activeTabId].length;
  document.getElementById('textbox7').value = textBoxValues[activeTabId].info;
}

function clearFilters()
{
  let indexValue = document.getElementById('textbox1');
  let timeValue = document.getElementById('textbox2');
  let destinationValue = document.getElementById('textbox3');
  let sourceValue = document.getElementById('textbox4');
  let protocolValue = document.getElementById('textbox5');
  let lengthValue = document.getElementById('textbox6');
  let infoValue = document.getElementById('textbox7');

  indexValue.value = '';
  timeValue.value = '';
  destinationValue.value = '';
  sourceValue.value = '';
  protocolValue.value = '';
  lengthValue.value = '';
  infoValue.value = '';

  patterns[activeTabId] = {
      indexRegex: new RegExp(''),
      timeRegex: new RegExp(''),
      destinationRegex: new RegExp(''),
      sourceRegex: new RegExp(''),
      protocolRegex: new RegExp(''),
      lengthRegex: new RegExp(''),
      infoRegex: new RegExp('')
    };
  
    textBoxValues[activeTabId] = {
      index: '',
      time: '',
      destination: '',
      source: '',
      protocol: '',
      length: '',
      info: ''
    };
  
  refreshCurrentTab();
}