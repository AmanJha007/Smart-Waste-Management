// 1. Import libraries
const express = require('express');
const cors = require('cors');

// 2. Initialize app
const app = express();
const PORT = 3000;

// 3. Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Allow reading JSON data

// 4. IN-MEMORY DATABASE (Our temporary "brain")
let bins = [
    // Bin 1: Placed roughly near the Main Entrance
    { binId: "BIN-001", fillLevel: 45, lat: 12.8406, lng: 80.1534 },
    
    // Bin 2: Placed roughly near the Academic Blocks/Hostels
    { binId: "BIN-002", fillLevel: 92, lat: 12.8430, lng: 80.1550 } 
];
// 5. ROUTES

// GET Route: Send data to Dashboard
app.get('/api/data', (req, res) => {
    res.json(bins); 
});

// POST Route: Receive data from Sensors
app.post('/api/data', (req, res) => {
    const newData = req.body;
    
    console.log("📩 Received Data:", newData); 

    const existingBinIndex = bins.findIndex(b => b.binId === newData.binId);
    
    if (existingBinIndex > -1) {
        bins[existingBinIndex] = newData;
    } else {
        bins.push(newData);
    }

    res.json({ message: "Data received successfully!", currentStatus: bins });
});

// 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Smart Waste Server running on http://localhost:${PORT}`);
});