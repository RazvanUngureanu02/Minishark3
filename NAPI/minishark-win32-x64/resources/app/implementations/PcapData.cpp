#include "../include/PcapData.h"

// setters
void PcapData::setPacketRecord(PacketRecord packetRecord)
{
    this->packetRecord = packetRecord;
}

void PcapData::setFrontEndData(FrontEndData frontEndData)
{
    this->frontEndData = frontEndData;
}

// getters
PacketRecord PcapData::getPacketRecord() const
{
    return this->packetRecord;
}

FrontEndData PcapData::getFrontEndData() const
{
    return this->frontEndData;
}

// getters FrontEndData
uint32_t PcapData::getIndex() const 
{
    return this->frontEndData.index;
}

Elapsed PcapData::getTimeElapsed() const 
{
    return this->frontEndData.timeElapsed;
}

std::string PcapData::getSourceIP() const 
{
    return this->frontEndData.sourceIP;
}

std::string PcapData::getDestinationIP() const 
{
    return this->frontEndData.destinationIP;
}

std::string PcapData::getProtocol() const 
{
    return this->frontEndData.protocol;
}

std::string PcapData::getInfo() const 
{
    return this->frontEndData.info;
}

// getters Packet Record
Seconds PcapData::getSeconds() const 
{
    return this->packetRecord.seconds;
}

Microseconds PcapData::getMicroseconds() const 
{
    return this->packetRecord.microseconds; 
}

uint32_t PcapData::getCapturedPacketLength() const 
{
    return this->packetRecord.capturedPacketLength;
}

uint32_t PcapData::getOriginalPacketLength() const 
{
    return this->packetRecord.originalPacketLength;
}

std::vector<uint8_t> PcapData::getPacketContent() const 
{
    return this->packetRecord.packetContent;
}

// constructors
PcapData::PcapData()
{

}

// destructors
PcapData::~PcapData()
{

}
