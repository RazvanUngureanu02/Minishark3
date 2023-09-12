#ifndef PCAPDESERIALIZER_H
#define PCAPDESERIALIZER_H
#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include "../include/PcapData.h"
#include <unordered_map>
#include <iomanip>

class PcapDeserializer
{
private:
    // packets + informations about each packet
    std::vector<PcapData> parsedData;

    std::vector <PacketRecord> packets;
    std::vector <FrontEndData> frontEndData;

public:
    // getters
    std::string getProtocolName(const PacketRecord&) const;
    std::string getInfo(const PacketRecord&) const;
    std::vector<PcapData> getPcapInformations() const;

    void liveCaptureDeserializer(std::vector<PacketRecord>);

    // parsing the pcap file to get all the informations needed
    void parseFile(std::string);

    // reading the pcap file to get the Packet Record
    void readFile(std::string);

    // parsing content from PacketRecord such as destination IP, source IP, protocol and so on
    void getData();

    // clearing all the data
    void clearData();

    // constructors
    PcapDeserializer();

    // destructors
    ~PcapDeserializer();

};

#endif // PCAPDESERIALIZER_H
