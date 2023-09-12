#ifndef PCAPSERIALIZER_H
#define PCAPSERIALIZER_H
#include <iostream>
#include <vector>
#include <pcap.h>
#include "../include/PcapData.h"
#include <algorithm>

class PcapSerializer
{
private:
    std::string filePath;

public:
    
    void savePcap(std::vector<PacketRecord>);
    void init(std::string);

    PcapSerializer();
    ~PcapSerializer();

};

#endif // PCAPSERIALIZER_H
