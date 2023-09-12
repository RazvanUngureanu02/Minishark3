const handleThemeSelection = (event) => {

  const newBody = document.createElement('body');

  const target = event.target; // Access the target element
  const theme = target.getAttribute('data-theme');
  //const isPressed = target.getAttribute('aria-pressed');
  //document.documentElement.setAttribute("data-selected-theme", theme);
  //target.setAttribute('aria-pressed', 'true');

  // updating 
  
// Create a temporary element
  const tempElement = document.createElement('div');

  // Add the .theme-orange class to the temporary element
  tempElement.classList.add(`theme-${theme}`);

  // Append the temporary element to the document body (to ensure it's part of the rendered DOM)
  document.body.appendChild(tempElement);

  const computedStyles = getComputedStyle(tempElement);
  var colorBackground = computedStyles.getPropertyValue('--color-background');
  var colorText = computedStyles.getPropertyValue('--color-text');
  var colorTableHover = computedStyles.getPropertyValue('--color-table-hover');
  var colorTableHeader = computedStyles.getPropertyValue('--color-table-header');
  var colorTableSelectedRow = computedStyles.getPropertyValue('--color-table-selected-row');
  var colorTab = computedStyles.getPropertyValue('--color-tab');
  var colorTabActive = computedStyles.getPropertyValue('--color-tab-active');
  var colorTabHover = computedStyles.getPropertyValue('--color-tab-hover');
  var tableContentDetailsTitle = computedStyles.getPropertyValue('--table-content-details-title');
  var buttons = computedStyles.getPropertyValue('--buttons');
  var selectBoxBackground = computedStyles.getPropertyValue('--select-box-background');
  var selectBoxBorder = computedStyles.getPropertyValue('--select-box-border');
  var selectBoxBorderHover = computedStyles.getPropertyValue('--select-box-border-hover');
  var packetDetailsButtonBackground = computedStyles.getPropertyValue('--packet-details-button-background');
  var packetDetailsButtonHover = computedStyles.getPropertyValue('--packet-details-button-hover');
  var sidePanelBackground = computedStyles.getPropertyValue('--side-panel-background');

  // Update the global CSS variables on the document's root element
  document.documentElement.style.setProperty('--color-background-global', colorBackground);
  document.documentElement.style.setProperty('--color-text-global', colorText);
  document.documentElement.style.setProperty('--color-table-hover-global', colorTableHover);
  document.documentElement.style.setProperty('--color-table-header-global', colorTableHeader);
  document.documentElement.style.setProperty('--color-table-selected-row-global', colorTableSelectedRow);
  document.documentElement.style.setProperty('--color-tab-global', colorTab);
  document.documentElement.style.setProperty('--color-tab-active-global', colorTabActive);
  document.documentElement.style.setProperty('--color-tab-hover-global', colorTabHover);
  document.documentElement.style.setProperty('--table-content-details-title-global', tableContentDetailsTitle);
  document.documentElement.style.setProperty('--buttons-global', buttons);
  document.documentElement.style.setProperty('--select-box-background-global', selectBoxBackground);
  document.documentElement.style.setProperty('--select-box-border-global', selectBoxBorder);
  document.documentElement.style.setProperty('--select-box-border-hover-global', selectBoxBorderHover);
  document.documentElement.style.setProperty('--packet-details-button-background-global', packetDetailsButtonBackground);
  document.documentElement.style.setProperty('--packet-details-button-hover-global', packetDetailsButtonHover);
  document.documentElement.style.setProperty('--side-panel-background-global', sidePanelBackground);

  // Remove the temporary element from the document body
  document.body.removeChild(tempElement);

  // adding gradient
  const body = document.body;
  body.classList = '';
  
}

function initializeThemeButtons() {
  const buttons = document.querySelectorAll('.theme-button');

  buttons.forEach((button) => {
    button.addEventListener('click', handleThemeSelection);
  });

  // custom theme button
}

function rgbToHex(rgbColor) {
  var rgbArray = rgbColor.match(/\d+/g); // Extract RGB values
  var r = parseInt(rgbArray[0]);
  var g = parseInt(rgbArray[1]);
  var b = parseInt(rgbArray[2]);
  var hexColor = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return hexColor;
}

function hexToRgb(hexColor) {
  // Remove the "#" symbol from the beginning of the hexadecimal color string
  hexColor = hexColor.replace("#", "");

  // Split the hexadecimal color string into three parts: red, green, and blue
  var r = parseInt(hexColor.substring(0, 2), 16);
  var g = parseInt(hexColor.substring(2, 4), 16);
  var b = parseInt(hexColor.substring(4, 6), 16);

  // Return the RGB color string in the "rgb(r, g, b)" format
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
