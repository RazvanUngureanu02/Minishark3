window.onload = function() {
    myFunction();
  };
  
  async function myFunction() {
    const data = await api.getPcapData();
    // process the data here
    
    const table = document.getElementById("printDataTable");
    const tbody = table.getElementsByTagName("tbody")[0];

    data.forEach(obj => {
      const row = tbody.insertRow();
      row.insertCell().textContent = obj.index;
      row.insertCell().textContent = obj.timeElapsed;
      row.insertCell().textContent = obj.destinationIP;
      row.insertCell().textContent = obj.sourceIP;
      row.insertCell().textContent = obj.protocol;
      row.insertCell().textContent = obj.originalPacketLength;
      row.insertCell().textContent = obj.infoData;
    });
  }