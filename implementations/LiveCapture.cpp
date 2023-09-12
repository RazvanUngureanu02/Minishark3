#include "../include/LiveCapture.h"

/* getters */
std::vector <PacketRecord> LiveCapture::getCapturedPackets()
{
    return this->capturedPackets;
}

std::vector <char*> LiveCapture::getInterfaceNames()
{
    return this->interfaceDescriptions;
}

int LiveCapture::getNumberOfPackets()
{
    return this->capturedPackets.size();
}

void LiveCapture::getNetworkInterfaces()
{
    interfaceNames.clear();
    interfaceDescriptions.clear();
    pcap_if_t* alldevs;
    char errbuf[PCAP_ERRBUF_SIZE];

    // Retrieve the list of network interfaces
    if (pcap_findalldevs_ex(PCAP_SRC_IF_STRING, NULL, &alldevs, errbuf) == -1) {
        std::cout << "Error finding network interfaces: " << errbuf << std::endl;
        return;
    }

    // create a map with all the interfaces names for the encoded version of device name
    std::map<std::string, std::string> interfaceNamesMap;
    for (pcap_if_t* dev = alldevs; dev != nullptr; dev = dev->next) {
        interfaceNamesMap[dev->name] = dev->description;
    }
    // Iterate through the list of interfaces and store their names
    for (pcap_if_t* dev = alldevs; dev != nullptr; dev = dev->next) {
        // printf("Interface: %s\n", dev->name);
        // if (dev->description)
        //     printf("Description: %s\n", dev->description);
        // printf("\n");


        interfaceDescriptions.push_back(dev->description);
        interfaceNames.push_back(dev->name);
    }

    // Free the memory allocated for the list of interfaces
    pcap_freealldevs(alldevs);
}

void LiveCapture::selectNetworkInterface(int index)
{
    if(index >= this->interfaceNames.size())
    {
        std::cout<<"Error selecting the interface, the selected interface's index is out of bounds'"<<'\n';
    }
    else
    {
        this->currentNetworkInterface = this->interfaceNames[index];
    }
}

void LiveCapture::captureLivePackets() {
    char errbuf[PCAP_ERRBUF_SIZE];

    // Open the network interface for live capture
    pcap_t* handle = pcap_open_live(this->currentNetworkInterface, BUFSIZ, 1, 1000, errbuf);
    if (handle == nullptr) {
        std::cout << "Error opening interface " << this->currentNetworkInterface << ": " << errbuf << std::endl;
        return;
    }

    // Define the filter expression to capture specific protocols
    const char* filterExpression = "";

    // Compile the filter expression
    struct bpf_program fp;
    if (pcap_compile(handle, &fp, filterExpression, 0, PCAP_NETMASK_UNKNOWN) == -1) {
        std::cout << "Error compiling filter: " << pcap_geterr(handle) << std::endl;
        pcap_close(handle);
        return;
    }

    // Apply the compiled filter
    if (pcap_setfilter(handle, &fp) == -1) {
        std::cout << "Error setting filter: " << pcap_geterr(handle) << std::endl;
        pcap_freecode(&fp);
        pcap_close(handle);
        return;
    }

    int numberOfCapturedPackets = 0;

    // Start capturing packets
    struct pcap_pkthdr* header;
    const u_char* packet;
    int returnValue;
    while ((returnValue = pcap_next_ex(handle, &header, &packet)) >= 0) {
        if (returnValue == 0) {
            continue;  // Timeout elapsed, no packets received
        }

        // Create a new PacketRecord and populate its fields
        PacketRecord packetRecord;
        packetRecord.seconds = header->ts.tv_sec;
        packetRecord.microseconds = header->ts.tv_usec;
        packetRecord.capturedPacketLength = header->caplen;
        packetRecord.originalPacketLength = header->len;
        packetRecord.packetContent.resize(packetRecord.capturedPacketLength);
        std::copy(packet, packet + packetRecord.capturedPacketLength, packetRecord.packetContent.begin());

        // Store the PacketRecord in the vector
        capturedPackets.push_back(packetRecord);

        numberOfCapturedPackets++;
        if(numberOfCapturedPackets >= MAX_PACKETS)
        {
            return;
        }

        // Print the packet data

        // std::cout << "Packet captured. Length: " << header->len << std::endl;
        // for (int i = 0; i < header->len; i++) {
        //     std::cout << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(packet[i]) << " ";
        //     if ((i + 1) % 16 == 0)
        //         std::cout << std::endl;
        // }
        // std::cout << std::dec << std::endl;

        // Process the captured packet here
        // ...
    }

    // Close the capture handle
    pcap_close(handle);
}



void LiveCapture::printInterfaces()
{
    std::cout<<"Size: "<<this->interfaceNames.size()<<'\n';
    for(unsigned i=0;i<this->interfaceNames.size();i++)
    {
        std::cout<<this->interfaceNames[i]<<'\n';
    }
    std::cout<<'\n';
}

LiveCapture::LiveCapture()
{

}

LiveCapture::~LiveCapture()
{

}