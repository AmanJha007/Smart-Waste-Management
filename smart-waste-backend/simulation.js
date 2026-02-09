// simulation.js
// This script pretends to be 4 physical bins sending data to your server.

const SERVER_URL = 'http://localhost:3000/api/data';

// 📍 REAL VIT CHENNAI LOCATIONS
const bins = [
    { binId: "BIN-001", location: "Main Gate", lat: 12.8406, lng: 80.1534, fillLevel: 10 },
    { binId: "BIN-002", location: "AB Block", lat: 12.8430, lng: 80.1550, fillLevel: 25 },
    { binId: "BIN-003", location: "Boys Hostel", lat: 12.8445, lng: 80.1520, fillLevel: 50 },
    { binId: "BIN-004", location: "Food Court", lat: 12.8415, lng: 80.1545, fillLevel: 5 }
];

// Function to send data to your Server
async function sendData(bin) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                binId: bin.binId,
                fillLevel: bin.fillLevel,
                lat: bin.lat,
                lng: bin.lng
            })
        });
        console.log(`📡 Sent: ${bin.binId} (${bin.location}) is ${bin.fillLevel}% full`);
    } catch (error) {
        console.error("❌ Error sending data. Is your server running?");
    }
}

// The Loop: Runs every 5 seconds
console.log("🚀 Simulation Started! Bins are filling up...");

setInterval(() => {
    // Pick a random bin to add trash to
    const randomBinIndex = Math.floor(Math.random() * bins.length);
    const selectedBin = bins[randomBinIndex];

    // Add random trash (5% to 15%)
    const trashAmount = Math.floor(Math.random() * 10) + 5;
    selectedBin.fillLevel += trashAmount;

    // If bin is overflowing (>100%), empty it! (Simulate pickup)
    if (selectedBin.fillLevel > 100) {
        console.log(`♻️ TRUCK ARRIVED! Emptying ${selectedBin.binId}...`);
        selectedBin.fillLevel = 0;
    }

    // Send the new status to the server
    sendData(selectedBin);

}, 5000); // 5000 milliseconds = 5 seconds