#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include <iomanip>
#include "../include/PcapDeserializer.h"
#include "../include/PcapData.h"
#include "../include/LiveCapture.h"
#include "../include/PcapSerializer.h"
#include <pcap.h>
#include <functional>
#include <thread>
#include <iostream>

#define NAPI_CALL(env, call)                                      \
  do                                                              \
  {                                                               \
    napi_status status = (call);                                  \
    if (status != napi_ok)                                        \
    {                                                             \
      const napi_extended_error_info *error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      if (!is_pending)                                            \
      {                                                           \
        const char *message = (error_info->error_message == NULL) \
                                  ? "empty error message"         \
                                  : error_info->error_message;    \
        napi_throw_error((env), NULL, message);                   \
        return NULL;                                              \
      }                                                           \
    }                                                             \
  } while (0)


napi_value GetInterfaceNames(napi_env env, napi_callback_info info) {
  LiveCapture liveCapture;
  liveCapture.getNetworkInterfaces();
  std::vector<char*> interfaceNames = liveCapture.getInterfaceNames();

  napi_value output;
  NAPI_CALL(env, napi_create_array_with_length(env, interfaceNames.size(), &output));

  for (size_t i = 0; i < interfaceNames.size(); i++) {
    napi_value name;
    NAPI_CALL(env, napi_create_string_utf8(env, interfaceNames[i], NAPI_AUTO_LENGTH, &name));
    NAPI_CALL(env, napi_set_element(env, output, i, name));
  }

  return output;
}

napi_value getOutput(napi_env env, napi_callback_info info, PcapDeserializer &ob)
{
  std::vector<PcapData> pcapParsedData = ob.getPcapInformations();

  // if pcapParsedData.size == 0, use try catch to solve this
  
  std::vector<napi_value> objectValues;
  napi_value output;

  for (int i = 0; i < pcapParsedData.size(); i++)
  {
    // Frontend Data
    std::uint32_t index = pcapParsedData[i].getIndex();
    double timeElapsed = pcapParsedData[i].getTimeElapsed();
    std::string destinationIP = pcapParsedData[i].getDestinationIP();
    std::string sourceIP = pcapParsedData[i].getSourceIP();
    std::string destinationMac = pcapParsedData[i].getDestinationMac();
    std::string sourceMac = pcapParsedData[i].getSourceMac();
    std::string protocol = pcapParsedData[i].getProtocol();
    std::string infoData = pcapParsedData[i].getInfo();

    std::string readableString = pcapParsedData[i].getReadableString();
    std::string hexValues = pcapParsedData[i].getHexValues();


    //Packet record
    std::uint32_t originalPacketLength = pcapParsedData[i].getOriginalPacketLength();
    std::uint32_t capturedPacketLength = pcapParsedData[i].getCapturedPacketLength();
    Seconds seconds = pcapParsedData[i].getSeconds();
    Microseconds microseconds = pcapParsedData[i].getMicroseconds();

    napi_value obj;
    napi_create_object(env, &obj);

    //NAPI variables for frontend data

    napi_value napiDestinationIP, napiSourceIP, napiProtocol, napiInfoData, napiIndex, napiTimeElapsed, napiHexValues, napiReadableString, napiDestinationMac, napiSourceMac;

    //NAPI variables for packet record

    napi_value napiOriginalPacketLength;
    napi_value napiCapturedPacketLength;
    napi_value napiSeconds;
    napi_value napiMicroseconds;

    //NAPI for packet record
    NAPI_CALL(env, napi_create_uint32(env, originalPacketLength, &napiOriginalPacketLength));
    NAPI_CALL(env, napi_create_uint32(env, capturedPacketLength, &napiCapturedPacketLength));
    NAPI_CALL(env, napi_create_uint32(env, seconds, &napiSeconds));
    NAPI_CALL(env, napi_create_uint32(env, microseconds, &napiMicroseconds));

    NAPI_CALL(env, napi_set_named_property(env, obj, "originalPacketLength", napiOriginalPacketLength));
    NAPI_CALL(env, napi_set_named_property(env, obj, "capturedPacketLength", napiCapturedPacketLength));
    NAPI_CALL(env, napi_set_named_property(env, obj, "seconds", napiSeconds));
    NAPI_CALL(env, napi_set_named_property(env, obj, "microseconds", napiMicroseconds));

    // NAPI for frontend data
    NAPI_CALL(env, napi_create_uint32(env, index, &napiIndex));
    NAPI_CALL(env, napi_create_double(env, timeElapsed, &napiTimeElapsed));
    NAPI_CALL(env, napi_create_string_utf8(env, destinationIP.c_str(), destinationIP.length(), &napiDestinationIP));
    NAPI_CALL(env, napi_create_string_utf8(env, sourceIP.c_str(), sourceIP.length(), &napiSourceIP));
    NAPI_CALL(env, napi_create_string_utf8(env, protocol.c_str(), protocol.length(), &napiProtocol));
    NAPI_CALL(env, napi_create_string_utf8(env, infoData.c_str(), infoData.length(), &napiInfoData));
    NAPI_CALL(env, napi_create_string_utf8(env, hexValues.c_str(), hexValues.length(), &napiHexValues));
    NAPI_CALL(env, napi_create_string_utf8(env, readableString.c_str(), readableString.length(), &napiReadableString));
    NAPI_CALL(env, napi_create_string_utf8(env, destinationMac.c_str(), destinationMac.length(), &napiDestinationMac));
    NAPI_CALL(env, napi_create_string_utf8(env, sourceMac.c_str(), sourceMac.length(), &napiSourceMac));

    NAPI_CALL(env, napi_set_named_property(env, obj, "index", napiIndex));
    NAPI_CALL(env, napi_set_named_property(env, obj, "timeElapsed", napiTimeElapsed));
    NAPI_CALL(env, napi_set_named_property(env, obj, "destinationIP", napiDestinationIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "sourceIP", napiSourceIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "protocol", napiProtocol));
    NAPI_CALL(env, napi_set_named_property(env, obj, "infoData", napiInfoData));
    NAPI_CALL(env, napi_set_named_property(env, obj, "hexValues", napiHexValues));
    NAPI_CALL(env, napi_set_named_property(env, obj, "readableString", napiReadableString));
    NAPI_CALL(env, napi_set_named_property(env, obj, "destinationMac", napiDestinationMac));
    NAPI_CALL(env, napi_set_named_property(env, obj, "sourceMac", napiSourceMac));

    objectValues.push_back(obj);
  }

  NAPI_CALL(env, napi_create_array_with_length(env, objectValues.size(), &output));

  for (size_t i = 0; i < objectValues.size(); i++)
  {
    NAPI_CALL(env, napi_set_element(env, output, i, objectValues[i]));
  }

  return output;
}

napi_value SavePCAP(napi_env env, napi_callback_info info)
{
  size_t argc = 2;
  napi_value args[2];

  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

  // get filepath
  std::string filePath;
  size_t str_size;
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], NULL, 0, &str_size));
  filePath.resize(str_size+1);
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], &filePath[1], str_size + 1, NULL));

  //std::cout<<filePath<<'\n';

  napi_value jsObject = args[0];

  napi_value propertyNamesArray;
  NAPI_CALL(env, napi_get_property_names(env, jsObject, &propertyNamesArray));

  uint32_t propertyCount;
  NAPI_CALL(env, napi_get_array_length(env, propertyNamesArray, &propertyCount));

  // saving packets here
  std::vector<PacketRecord> packetRecords;

    for (uint32_t i = 0; i < propertyCount; i++) {
    napi_value propertyName;
    NAPI_CALL(env, napi_get_element(env, propertyNamesArray, i, &propertyName));

    // Convert the property name to a C++ string
    size_t propertyNameSize;
    NAPI_CALL(env, napi_get_value_string_utf8(env, propertyName, nullptr, 0, &propertyNameSize));
    std::string propertyNameStr(propertyNameSize + 1, '\0');
    NAPI_CALL(env, napi_get_value_string_utf8(env, propertyName, &propertyNameStr[0], propertyNameSize + 1, nullptr));

      // Convert the property name to an index
      uint32_t index = std::stoi(propertyNameStr);

      // Get the corresponding element value from the array-like object
      napi_value elementValue;
      NAPI_CALL(env, napi_get_element(env, jsObject, index, &elementValue));

      PacketRecord packetRecord;

      // get original packet length
      napi_value jsOriginalPacketLength;
      NAPI_CALL(env, napi_get_named_property(env, elementValue, "originalPacketLength", &jsOriginalPacketLength));
      NAPI_CALL(env, napi_get_value_uint32(env, jsOriginalPacketLength, &packetRecord.originalPacketLength));

      // Get capturedPacketLength
      napi_value jsCapturedPacketLength;
      NAPI_CALL(env, napi_get_named_property(env, elementValue, "capturedPacketLength", &jsCapturedPacketLength));
      NAPI_CALL(env, napi_get_value_uint32(env, jsCapturedPacketLength, &packetRecord.capturedPacketLength));

      // Get seconds
      napi_value jsSeconds;
      NAPI_CALL(env, napi_get_named_property(env, elementValue, "seconds", &jsSeconds));
      NAPI_CALL(env, napi_get_value_uint32(env, jsSeconds, &packetRecord.seconds));

      // Get microseconds
      napi_value jsMicroseconds;
      NAPI_CALL(env, napi_get_named_property(env, elementValue, "microseconds", &jsMicroseconds));
      NAPI_CALL(env, napi_get_value_uint32(env, jsMicroseconds, &packetRecord.microseconds));

      // Get hex values so we can convert them to the original packet content
      napi_value jsHex;
      NAPI_CALL(env, napi_get_named_property(env, elementValue, "hexValues", &jsHex));

      size_t stringSize = 0;
      NAPI_CALL(env, napi_get_value_string_utf8(env, jsHex, nullptr, 0, &stringSize));

      std::vector<char> buffer(stringSize + 1); // +1 for null terminator

      NAPI_CALL(env, napi_get_value_string_utf8(env, jsHex, buffer.data(), buffer.size(), nullptr));

      std::string hexString(buffer.data());

      std::istringstream hexStream(hexString);
      std::string byteHex;
      //std::vector<uint8_t> originalPacketContent;

      while (hexStream >> byteHex)
      {
          uint8_t byte = static_cast<uint8_t>(std::stoi(byteHex, nullptr, 16));
          packetRecord.packetContent.push_back(byte);
      }

      packetRecords.push_back(packetRecord);
  }

  PcapSerializer ob;
  ob.init(filePath);
  ob.savePcap(packetRecords);
  
  return nullptr;
}

/* operations live capture start */
std::unordered_map<int, std::atomic<bool>> countingFlags;

// Function to send the number to Electron process
void SendNumberToElectron(int index, int number) {
    // TODO: Send the number to the Electron process using IPC
    // You can use Electron's ipcMain module to handle the received number
}

void CountingThread(int index) {
    std::atomic<bool>& isCountingRunning = countingFlags[index];
    int i = 1;
    while (isCountingRunning.load(std::memory_order_relaxed)) {
        // Perform counting operations here
        // ...

        // Sleep for a certain duration to avoid excessive CPU usage
        std::this_thread::sleep_for(std::chrono::milliseconds(100));

        // Example: Print the current count for the specific index
        std::cout << "Index " << index << ": " << i << std::endl;

                // Check if the number is divisible by 100
        if (i % 100 == 0) {
            // Send the number to Electron
            SendNumberToElectron(index, i);
        }
        
        i++;
    }

    // Counting loop has ended, perform any necessary cleanup or finalization
}

napi_value StartLiveCapture(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    int index = 0;

    // Get the value of the first argument passed to the function (index)
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &index));

    std::atomic<bool>& isCountingRunning = countingFlags[index];

    // Check if the counting is already running
    if (!isCountingRunning.load(std::memory_order_relaxed)) {
        isCountingRunning.store(true, std::memory_order_relaxed);

        // Start the counting in a separate thread for the specific index
        std::thread countingThread(CountingThread, index);
        countingThread.detach();
    }

    return nullptr;
}

napi_value StopLiveCapture(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    int index = 0;

    // Get the value of the first argument passed to the function (index)
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &index));

    std::atomic<bool>& isCountingRunning = countingFlags[index];

    isCountingRunning.store(false, std::memory_order_relaxed);

    return nullptr;
}

napi_value OperationsLiveCapture(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value args[1];
    int interfaceIndex = 0;
    //int tabIndex = 0;

    // Get the values of the arguments passed to the function
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

    // Convert the values to C++ integers
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &interfaceIndex));
    //NAPI_CALL(env, napi_get_value_int32(env, args[1], &tabIndex));

    // std::atomic<bool>& isCountingRunning = countingFlags[tabIndex];

    // //Check if the counting is already running
    // if (!isCountingRunning.load(std::memory_order_relaxed)) {
    //     isCountingRunning.store(true, std::memory_order_relaxed);

    //     // Start the counting in a separate thread for the specific index
    //     std::thread countingThread(CountingThread, tabIndex);
    //     countingThread.detach();
    // }

    // return nullptr;

  LiveCapture liveCapture;
  liveCapture.getNetworkInterfaces();
  liveCapture.selectNetworkInterface(interfaceIndex);
  liveCapture.captureLivePackets();

  PcapDeserializer ob;
  ob.liveCaptureDeserializer(liveCapture.getCapturedPackets());

  return getOutput(env, info, ob);
}

/* operations live capture end */

napi_value Operations(napi_env env, napi_callback_info info)
{
  //LiveCapture capt;
  //capt.getNetworkInterfaces();
  //capt.selectNetworkInterface(7);
  //capt.captureLivePackets();
  //PcapDeserializer ob1;
  //ob1.liveCaptureDeserializer(capt.getCapturedPackets());

  size_t argc = 1;
  napi_value args[1];
  std::string filePath;
  
  // Get the value of the first argument passed to the function
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  // Convert the value to a C++ string
  size_t str_size;
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &str_size));
  filePath.resize(str_size);
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], &filePath[0], str_size + 1, NULL));

  PcapDeserializer ob;
  ob.parseFile(filePath);

  return getOutput(env,info,ob);
}

napi_value init(napi_env env, napi_value exports)
{
  napi_value operations;
  napi_create_function(env, nullptr, 0, Operations, nullptr, &operations);

  napi_value operationsLiveCapture;
  napi_create_function(env, nullptr, 0, OperationsLiveCapture, nullptr, &operationsLiveCapture);

  napi_value getInterfaceNames;
  napi_create_function(env, nullptr, 0, GetInterfaceNames, nullptr, &getInterfaceNames);

  napi_value savePCAP;
  napi_create_function(env, nullptr, 0, SavePCAP, nullptr, &savePCAP);

  napi_value stopLiveCapture; 
  napi_create_function(env, nullptr, 0, StopLiveCapture, nullptr, &stopLiveCapture); 

  napi_value startLiveCapture;
  napi_create_function(env, nullptr, 0, StartLiveCapture, nullptr, &startLiveCapture); 

  napi_set_named_property(env, exports, "Operations", operations);
  napi_set_named_property(env, exports, "OperationsLiveCapture", operationsLiveCapture);
  napi_set_named_property(env, exports, "getInterfaceNames", getInterfaceNames);
  napi_set_named_property(env, exports, "SavePCAP", savePCAP);
  napi_set_named_property(env, exports, "StopLiveCapture", stopLiveCapture); 
  napi_set_named_property(env, exports, "StartLiveCapture", startLiveCapture); 

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init); 
