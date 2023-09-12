#include "../include/PcapDeserializer.h"

/*getters*/

// function that gets the info field
std::string PcapDeserializer::getInfo(const PacketRecord& packet) const
{
    uint8_t protocol = packet.packetContent[23];
    std::string info;

    /* to modify this function to add more protocols
    */

    /* protocols that we could add:
    - UDP
    - TCP
    - RTCP
    - TLSv1.2
    - ARP
    - DNS
    - MDNS
    - QUICK
    */

    if (protocol == 6)   // TCP
        {
            uint16_t srcPort = (packet.packetContent[34] << 8) | packet.packetContent[35];
            uint16_t dstPort = (packet.packetContent[36] << 8) | packet.packetContent[37];
            uint8_t flags = packet.packetContent[47];

            // Construct the "Info" field
            std::ostringstream oss;
            oss << "TCP " << srcPort << " → " << dstPort;
            if (flags & 0x02) oss << " [SYN]";
            if (flags & 0x10) oss << " [ACK]";
            if (flags & 0x01) oss << " [FIN]";
            info = oss.str();
        }
    else if (protocol == 17)     // UDP
        {
            uint16_t srcPort = (packet.packetContent[34] << 8) | packet.packetContent[35];
            uint16_t dstPort = (packet.packetContent[36] << 8) | packet.packetContent[37];

            // Construct the "Info" field
            std::ostringstream oss;
            oss << "UDP " << srcPort << " → " << dstPort;
            info = oss.str();
        }
    else if (protocol == 1)     // ICMP
        {
            uint8_t type = packet.packetContent[34];
            uint8_t code = packet.packetContent[35];

            // Construct the "Info" field
            std::ostringstream oss;
            oss << "ICMP type " << static_cast<int>(type) << " code " << static_cast<int>(code);
            info = oss.str();
        }
    else
        {
            // For other protocols, include the protocol name
            std::string protocolName = getProtocolName(protocol);

            // Construct the "Info" field
            std::ostringstream oss;
            oss << protocolName << " packet";
            info = oss.str();
        }

    return info;
}

// function to get the protocol name based on int value
std::string PcapDeserializer::getProtocolName(uint8_t protocol) const
{
    static const std::unordered_map<uint8_t, std::string> protocolMap
    {
        { 1, "ICMP" },
        { 6, "TCP" },
        { 17, "UDP" },
        // Add more protocol mappings here as needed

        /* i will get these protocols from a file later */
    };

    auto it = protocolMap.find(protocol);
    if (it != protocolMap.end())
        {
            return it->second;
        }
    else
        {
            return "Unknown";
        }
}

// reading pcap file and getting Packet Record
void PcapDeserializer::readFile(std::string fileName, std::vector<PacketRecord> &packets)
{
    // opening the file
    std::ifstream file(fileName, std::ios::binary);

    if (!file.is_open())
        {
            // handle error opening file
        }

    // skip pcap file header
    file.seekg(24, std::ios::beg);



    PacketRecord packet;
    // reading the pcap file to get the Packet Record
    while (file.peek() != EOF)
        {
            file.read(reinterpret_cast<char*>(&packet.seconds), sizeof(packet.seconds));
            file.read(reinterpret_cast<char*>(&packet.microseconds), sizeof(packet.microseconds));
            file.read(reinterpret_cast<char*>(&packet.capturedPacketLength), sizeof(packet.capturedPacketLength));
            file.read(reinterpret_cast<char*>(&packet.originalPacketLength), sizeof(packet.originalPacketLength));

            packet.packetContent.resize(packet.capturedPacketLength);

            // std::cout << std::hex << packet.packetContent.data();
            file.read(reinterpret_cast<char*>(packet.packetContent.data()), packet.capturedPacketLength);

            packets.push_back(packet);
        }
    
    file.close();
}

// parsing the packet content from Packet Record
void PcapDeserializer::getData(std::vector<PacketRecord> packets, std::vector<FrontEndData> &frontEndData)
{
    int counter = 1;

    FrontEndData parseFrontEnd;

    for (const auto& packet : packets)
        {
            /*
            std::cout << "Seconds: " << packet.seconds << std::endl;
            std::cout << "Microseconds: " << packet.microseconds << std::endl;
            std::cout << "Captured Packet Length: " << packet.capturedPacketLength << std::endl;
            std::cout << "Original Packet Length: " << packet.originalPacketLength << std::endl;
            std::cout << "Packet Content: ";
            */

            std::string destinationIP, sourceIP, protocolName, informations;

            uint32_t srcIp = (packet.packetContent[26] << 24) | (packet.packetContent[27] << 16) | (packet.packetContent[28] << 8) | packet.packetContent[29];
            uint32_t dstIp = (packet.packetContent[30] << 24) | (packet.packetContent[31] << 16) | (packet.packetContent[32] << 8) | packet.packetContent[33];

            std::ostringstream oss;
            oss << ((srcIp >> 24) & 0xff) << "." << ((srcIp >> 16) & 0xff) << "." << ((srcIp >> 8) & 0xff) << "." << (srcIp & 0xff);
            sourceIP = oss.str();

            oss.str("");

            oss <<((dstIp >> 24) & 0xff) << "." << ((dstIp >> 16) & 0xff) << "." << ((dstIp >> 8) & 0xff) << "." << (dstIp & 0xff);
            destinationIP = oss.str();

            protocolName = this->getProtocolName(packet.packetContent[23]);

            informations = this->getInfo(packet);


            parseFrontEnd.index = counter;
            parseFrontEnd.sourceIP = sourceIP;
            parseFrontEnd.destinationIP = destinationIP;
            parseFrontEnd.protocol = protocolName;
            parseFrontEnd.info = informations;
            parseFrontEnd.timeElapsed = (packet.seconds + packet.microseconds / 1000000.0) - (packets[0].seconds + packets[0].microseconds / 1000000.0);

            frontEndData.push_back(parseFrontEnd);

            /*
            std::cout << "Source IP: " << sourceIP << '\n';
            std::cout << "Destination IP: " << destinationIP << '\n';
            std::cout << "Protocol: " << protocolName << '\n';
            std::cout << "Info: " << informations << '\n';
            std::cout<<'\n';
            */

            /*
                for (const auto& byte : packet.packetContent)
                    {
                        std::cout << std::hex << static_cast<int>(byte) << " ";
                    }

                std::cout << std::dec << std::endl << std::endl;
                */

            counter++;
        }
}

std::vector <PcapData> PcapDeserializer::getPcapInformations() const
{
    return this->parsedData;
}

void PcapDeserializer::parseFile(std::string fileName)
{
    std::vector <PacketRecord> packets; // the vector containing the Packet Records
    std::vector <FrontEndData> frontEndData;

    this->readFile(fileName,packets);

    this->getData(packets,frontEndData);

    this->transferData(packets,frontEndData);
}

void PcapDeserializer::transferData(std::vector<PacketRecord> packets, std::vector<FrontEndData> frontEndData)
{
    PcapData data;

    for(unsigned i=0; i<packets.size(); i++)
        {
            data.setFrontEndData(frontEndData[i]);
            data.setPacketRecord(packets[i]);

            this->parsedData.push_back(data);
        }
}

PcapDeserializer::PcapDeserializer(std::string fileName)
{
    this->parseFile(fileName);
}

PcapDeserializer::~PcapDeserializer()
{

}