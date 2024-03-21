// Get the user's private IP address using WebRTC
function getPrivateIPAddress() {
  return new Promise((resolve, reject) => {
    // Create a new RTCPeerConnection
    const pc = new RTCPeerConnection({
      iceServers: [], // No STUN/TURN servers needed for local connections
    });

    // When a candidate is found, check if it's a private IP address
    const handleCandidate = async (event) => {
      const candidate = event.candidate;
      if (candidate) {
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/; // Regular expression to match IPv4 address
        const match = ipRegex.exec(candidate.candidate);
        if (match && isPrivateIP(match[1])) {
          resolve(match[1]); // Resolve with the private IP address
          pc.onicecandidate = null; // Stop listening for candidates
        }
      }
    };

    // Listen for candidate events
    pc.onicecandidate = handleCandidate;

    // Create a dummy data channel to trigger candidate gathering
    pc.createDataChannel("");

    // Start the candidate gathering process
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(reject);
  });
}

// Helper function to check if an IP address is private
function isPrivateIP(ip) {
  // List of private IP address ranges
  const privateRanges = [
    "10.0.0.0/8", // 10.0.0.0 - 10.255.255.255
    "172.16.0.0/12", // 172.16.0.0 - 172.31.255.255
    "192.168.0.0/16", // 192.168.0.0 - 192.168.255.255
  ];

  // Check if the IP address falls within any of the private ranges
  return privateRanges.some((range) => isIPInRange(ip, range));
}

// Helper function to check if an IP address is within a given range
function isIPInRange(ip, range) {
  const [rangeIP, mask] = range.split("/");
  const rangeIPParts = rangeIP.split(".").map(Number);
  const ipParts = ip.split(".").map(Number);

  for (let i = 0; i < mask; i++) {
    const maskPart = Math.floor(i / 8);
    const maskBits = Math.pow(2, 8 - (i % 8));
    if (
      (ipParts[maskPart] & maskBits) !==
      (rangeIPParts[maskPart] & maskBits)
    ) {
      return false;
    }
  }

  return true;
}

function getIP() {
  // Usage
  console.log("Get IP Called");
  getPrivateIPAddress()
    .then((privateIP) => {
      console.log(`Private IP Address: ${privateIP}`);
    })
    .catch((error) => {
      console.error("Error getting private IP address:", error);
    });
}
