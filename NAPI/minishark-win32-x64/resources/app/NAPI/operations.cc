#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "../include/PcapDeserializer.h"
#include "../include/PcapData.h"

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

napi_value Operations(napi_env env, napi_callback_info info)
{
  PcapDeserializer ob("D:/GitHub/Minishark/Records3.pcap");

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
    std::string protocol = pcapParsedData[i].getProtocol();
    std::string infoData = pcapParsedData[i].getInfo();

    //Packet record

    std::uint32_t originalPacketLength = pcapParsedData[i].getOriginalPacketLength();

    napi_value obj;
    napi_create_object(env, &obj);

    //NAPI variables for frontend data

    napi_value napiDestinationIP, napiSourceIP, napiProtocol, napiInfoData, napiIndex, napiTimeElapsed;

    //NAPI variables for packet record

    napi_value napiOriginalPacketLength;

    //NAPI for packet record
    NAPI_CALL(env, napi_create_uint32(env, originalPacketLength, &napiOriginalPacketLength));

    NAPI_CALL(env, napi_set_named_property(env, obj, "originalPacketLength", napiOriginalPacketLength));

    // NAPI for frontend data
    NAPI_CALL(env, napi_create_uint32(env, index, &napiIndex));
    NAPI_CALL(env, napi_create_double(env, timeElapsed, &napiTimeElapsed));
    NAPI_CALL(env, napi_create_string_utf8(env, destinationIP.c_str(), destinationIP.length(), &napiDestinationIP));
    NAPI_CALL(env, napi_create_string_utf8(env, sourceIP.c_str(), sourceIP.length(), &napiSourceIP));
    NAPI_CALL(env, napi_create_string_utf8(env, protocol.c_str(), protocol.length(), &napiProtocol));
    NAPI_CALL(env, napi_create_string_utf8(env, infoData.c_str(), infoData.length(), &napiInfoData));

    NAPI_CALL(env, napi_set_named_property(env, obj, "index", napiIndex));
    NAPI_CALL(env, napi_set_named_property(env, obj, "timeElapsed", napiTimeElapsed));
    NAPI_CALL(env, napi_set_named_property(env, obj, "destinationIP", napiDestinationIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "sourceIP", napiSourceIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "protocol", napiProtocol));
    NAPI_CALL(env, napi_set_named_property(env, obj, "infoData", napiInfoData));

    objectValues.push_back(obj);
  }

  NAPI_CALL(env, napi_create_array_with_length(env, objectValues.size(), &output));

  for (size_t i = 0; i < objectValues.size(); i++)
  {
    NAPI_CALL(env, napi_set_element(env, output, i, objectValues[i]));
  }

  return output;
}

napi_value init(napi_env env, napi_value exports)
{
  napi_value operations;

  napi_create_function(env, nullptr, 0, Operations, nullptr, &operations);

  return operations;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);