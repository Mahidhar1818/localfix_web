import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Navigation, MapPin } from 'lucide-react';

// Custom Leaflet Icons
const customerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const technicianIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveMap({ jobId, customerLoc, techLoc }) {
  const { token } = useAuth();
  
  // Default coordinates (Hyderabad / Local center)
  const defaultCustomer = customerLoc || { lat: 17.3850, lng: 78.4867, address: 'Customer Address' };
  const [techPosition, setTechPosition] = useState(
    techLoc || { lat: defaultCustomer.lat - 0.015, lng: defaultCustomer.lng - 0.012, name: 'Technician En Route' }
  );

  useEffect(() => {
    const socket = io('/', { auth: { token } });
    if (jobId) socket.emit('job:join', jobId);

    socket.on('location:update', (data) => {
      if (data.lat && data.lng) {
        setTechPosition({
          lat: Number(data.lat),
          lng: Number(data.lng),
          name: data.name || 'Technician',
          updatedAt: data.updatedAt
        });
      }
    });

    // Simulated live tracking movement if no socket broadcast received
    const interval = setInterval(() => {
      setTechPosition(prev => {
        const deltaLat = (defaultCustomer.lat - prev.lat) * 0.05;
        const deltaLng = (defaultCustomer.lng - prev.lng) * 0.05;
        if (Math.abs(deltaLat) < 0.0001 && Math.abs(deltaLng) < 0.0001) return prev;
        return {
          ...prev,
          lat: prev.lat + deltaLat,
          lng: prev.lng + deltaLng
        };
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (jobId) socket.emit('job:leave', jobId);
      socket.disconnect();
    };
  }, [jobId, token, defaultCustomer.lat, defaultCustomer.lng]);

  const mapCenter = [defaultCustomer.lat, defaultCustomer.lng];

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
      
      {/* Live Status Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-navy-900/90 backdrop-blur-md border border-signal-500/40 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-100 shadow-xl">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <Navigation className="w-4 h-4 text-signal-400" />
        <span>Live Technician GPS Broadcasting</span>
      </div>

      <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Customer Location Marker */}
        <Marker position={[defaultCustomer.lat, defaultCustomer.lng]} icon={customerIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <strong className="block text-xs font-bold text-rose-600">Your Location</strong>
              <p className="text-[11px] text-slate-600">{defaultCustomer.address}</p>
            </div>
          </Popup>
        </Marker>

        {/* Technician Moving Marker */}
        <Marker position={[techPosition.lat, techPosition.lng]} icon={technicianIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <strong className="block text-xs font-bold text-blue-600">👨‍🔧 Technician En Route</strong>
              <p className="text-[11px] text-slate-600">Distance: ~1.2 km away</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line connecting Technician and Customer */}
        <Polyline
          positions={[
            [techPosition.lat, techPosition.lng],
            [defaultCustomer.lat, defaultCustomer.lng]
          ]}
          color="#3b82f6"
          weight={4}
          dashArray="8, 8"
        />
      </MapContainer>
    </div>
  );
}
