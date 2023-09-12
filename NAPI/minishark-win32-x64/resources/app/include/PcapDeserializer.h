#ifndef PCAPDESERIALIZER_H
#define PCAPDESERIALIZER_H
#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include "../include/PcapData.h"
#include <unordered_map>

class PcapDeserializer
{
private:
    std::vector<PcapData> parsedData;

public:
    // getters
    std::string getProtocolName(uint8_t) const;
    std::string getInfo(const PacketRecord&) const;
    std::vector<PcapData> getPcapInformations() const;

    // parsing the pcap file to get all the informations needed
    void parseFile(std::string);

    // reading the pcap file to get the Packet Record
    void readFile(std::string,std::vector<PacketRecord>&);

    // parsing content from PacketRecord such as destination IP, source IP, protocol and so on
    void getData(std::vector<PacketRecord>, std::vector<FrontEndData>&);

    // transfering the data parsed to our vector of type PcapData so we can send it to the front end
    void transferData(std::vector<PacketRecord>, std::vector<FrontEndData>);

    // constructors
    PcapDeserializer(std::string);

    // destructors
    ~PcapDeserializer();

};

#endif // PCAPDESERIALIZER_H
