import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'; // 📊 NEW CHART IMPORTS

// 📍 CONSTANTS
const VIT_MAIN_GATE = [12.8406, 80.1534]; 

// 🎨 CUSTOM ICONS
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
// 🔧 FIX: A helper component that forces the map to resize correctly
function MapFix() {
  const map = useMap();
  useEffect(() => {
    // Wait 500ms for the CSS to finish loading, then tell map to resize
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map]);
  return null;
}
function App() {
  const [bins, setBins] = useState([])
  const [routePath, setRoutePath] = useState([]) 
  const [routeInfo, setRouteInfo] = useState("") 

  const fetchBinData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data')
      setBins(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchBinData()
    const interval = setInterval(fetchBinData, 2000)
    return () => clearInterval(interval)
  }, [])

  const generateRoute = () => {
    const fullBins = bins.filter(bin => bin.fillLevel > 80);

    if (fullBins.length === 0) {
      alert("No bins need pickup right now! ✅");
      setRoutePath([]);
      setRouteInfo("All Clean");
      return;
    }

    const path = [VIT_MAIN_GATE]; 
    fullBins.forEach(bin => {
      path.push([bin.lat, bin.lng]);
    });
    path.push(VIT_MAIN_GATE); 

    setRoutePath(path);
    setRouteInfo(`Route for ${fullBins.length} bins`);
  }

  // 📊 CALCULATE STATS
  const criticalBins = bins.filter(b => b.fillLevel > 80).length;
  const healthyBins = bins.length - criticalBins;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ padding: '15px 30px', background: '#1a252f', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center' }}>
          ♻️ Smart Waste Management <span style={{fontSize:'12px', marginLeft:'10px', opacity: 0.7}}>| Team 7</span>
        </h1>
        
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
           {routeInfo && <span style={{ background:'#fff', color:'#333', padding:'5px 10px', borderRadius:'15px', fontSize:'14px', fontWeight:'bold' }}>🚛 {routeInfo}</span>}
           <button 
             onClick={generateRoute}
             style={{
               padding: '8px 20px',
               fontSize: '14px',
               fontWeight: 'bold',
               backgroundColor: '#e74c3c', // Red color for action
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               cursor: 'pointer',
               boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
             }}
           >
             OPTIMIZE ROUTE
           </button>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div style={{ flex: 1, display: 'flex', background:'#ecf0f1' }}>
        
        {/* 🗺️ LEFT: MAP (66%) */}
        <div style={{ flex: 2, borderRight: '2px solid #bdc3c7', position: 'relative' }}>
            <MapContainer center={VIT_MAIN_GATE} zoom={16} style={{ height: '100%', width: '100%' }}><MapFix />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
              {routePath.length > 0 && <Polyline positions={routePath} color="#3498db" weight={6} dashArray="10, 10" />}
              
              {bins.map((bin) => (
                <Marker key={bin.binId} position={[bin.lat, bin.lng]} icon={bin.fillLevel > 80 ? redIcon : greenIcon}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{bin.binId}</strong><br/>
                      Fill: {bin.fillLevel}%
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Marker position={VIT_MAIN_GATE} icon={greenIcon}><Popup>🏁 Depot</Popup></Marker>
            </MapContainer>
        </div>

        {/* 📊 RIGHT: ANALYTICS PANEL (33%) */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            
            {/* STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #2ecc71' }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase' }}>Healthy Bins</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>{healthyBins}</div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '5px solid #e74c3c' }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase' }}>Critical Bins</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>{criticalBins}</div>
                </div>
            </div>

            {/* LIVE CHART */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flex: 1, minHeight: '300px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#34495e', fontSize: '16px' }}>📊 Live Fill Levels</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={bins}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="binId" tick={{fontSize: 10}} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="fillLevel" radius={[5, 5, 0, 0]}>
                            {
                                bins.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fillLevel > 80 ? '#e74c3c' : '#2ecc71'} />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ALERTS LIST */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '16px' }}>📢 Recent Alerts</h3>
                {criticalBins === 0 ? (
                    <div style={{ color: '#95a5a6', fontStyle: 'italic' }}>No active alerts. System nominal.</div>
                ) : (
                    bins.filter(b => b.fillLevel > 80).map(b => (
                        <div key={b.binId} style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#c0392b', fontSize: '14px' }}>
                            ⚠️ <strong>{b.binId}</strong> is at {b.fillLevel}% capacity!
                        </div>
                    ))
                )}
            </div>

        </div>

      </div>
    </div>
  )
}

export default App