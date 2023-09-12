#ifndef PCAPDATA_H
#define PCAPDATA_H
#include <iostream>
#include <vector>

using Seconds = uint32_t;
using Microseconds = uint32_t;
using Elapsed = double;

struct PacketRecord
{
    Seconds seconds;
    Microseconds microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

struct FrontEndData
{
    uint32_t index;
    Elapsed timeElapsed;
    std::string sourceIP;
    std::string destinationIP;
    std::string protocol;
    std::string info;
};

class PcapData
{
private:

    PacketRecord packetRecord;
    FrontEndData frontEndData;

public:

    // setters
    void setPacketRecord(PacketRecord);
    void setFrontEndData(FrontEndData);

    // getters
    PacketRecord getPacketRecord() const;
    FrontEndData getFrontEndData() const;

    // getters FrontEndData
    uint32_t getIndex() const;
    Elapsed getTimeElapsed() const;
    std::string getSourceIP() const;
    std::string getDestinationIP() const;
    std::string getProtocol() const;
    std::string getInfo() const;

    // getters PacketRecord
    Seconds getSeconds() const;
    Microseconds getMicroseconds() const;
    uint32_t getCapturedPacketLength() const;
    uint32_t getOriginalPacketLength() const;
    std::vector<uint8_t> getPacketContent() const;

    // constructors
    PcapData();

    // destructors
    ~PcapData();

};

#endif // PCAPDATA_H
