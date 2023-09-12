cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(operations)

add_definitions(-DNAPI_VERSION=4)

include_directories(${CMAKE_JS_INC})

# Add the directory containing your class headers
include_directories("../include")
include_directories("../NAPI/npcap/Include")

# Add the directory containing the Npcap library files
link_directories("../NAPI/npcap/Lib/x64")

file(GLOB SOURCE_FILES "../NAPI/operations.cc")

# Add the source files for your classes
list(APPEND SOURCE_FILES "../implementations/PcapData.cpp")
list(APPEND SOURCE_FILES "../implementations/PcapDeserializer.cpp")
list(APPEND SOURCE_FILES "../implementations/LiveCapture.cpp")
list(APPEND SOURCE_FILES "../implementations/PcapSerializer.cpp")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} wpcap.lib Packet.lib)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()