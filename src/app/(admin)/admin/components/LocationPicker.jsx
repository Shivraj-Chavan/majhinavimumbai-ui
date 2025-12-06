import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { pincodeGeoCenters as geoCenters} from "@/data/geocodeGeocenters";
import { toast } from "react-toastify";

// Fix default Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function LocationPicker({ onSelect, defaultLocation, pincode, role = "user" , geoCenters = {}}) {
  // console.log({defaultLocation})
  const [position, setPosition] = useState(defaultLocation || null);
  const [mapCenter, setMapCenter] = useState(defaultLocation || [19.033, 73.0297]);
  const geoFetched = useRef(false);
  const mapRef = useRef(null);

  // Auto-fetch user location on mount
  useEffect(() => {
    if (role !== "user" || !navigator.geolocation) return;
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
  
        setPosition(coords);
        setMapCenter(coords);
        onSelect?.({ lat: coords[0], lng: coords[1] });
  
        if (mapRef.current) {
          mapRef.current.setView(coords, 12);
        }
      },
      (err) => console.warn("Geolocation error:", err)
    );
  }, [role]);
  

  // Watch for pincode change → auto pan & zoom
  useEffect(() => {
    if ((role === "admin" || role === "subadmin" || role === "user") && pincode && geoCenters?.[pincode]) {
      const center = geoCenters[pincode];
      setPosition(center);
      setMapCenter(center);
      onSelect?.({ lat: center[0], lng: center[1] });

      if (mapRef.current) {
        mapRef.current.flyTo(center, 14, { duration: 1.0 }); // smooth fly to pincode
      }
    }
  }, [role, pincode, onSelect]);

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setPosition(coords);
        setMapCenter(coords);
        onSelect?.(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  // Recenter component (optional for user / dynamic zoom)
  const Recenter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, zoom);
      }
    }, [center, zoom, map]);
    return null;
  };
  useEffect(() => {
    if (
      defaultLocation &&
      Array.isArray(defaultLocation) &&
      !isNaN(defaultLocation[0]) &&
      !isNaN(defaultLocation[1])
    ) {
      const center = defaultLocation.map(Number);
  
      setPosition(center);
      setMapCenter(center);
  
      if (mapRef.current) {
        mapRef.current.setView(center, 14);
      }
    }
  }, [defaultLocation]);
  

  // Button to get current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          setMapCenter(coords);
          onSelect?.({ lat: coords[0], lng: coords[1] });

          if (mapRef.current) {
            mapRef.current.flyTo(coords, 12, { duration: 1.0 }); 
          }
        },
        (err) => toast.error("Failed to fetch location: " + err.message)
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow">
      <MapContainer
        center={mapCenter}
        zoom={role === "user" ? 12 : 14}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Recenter center={mapCenter} zoom={role === "user" ? 12 : 14} />
        <MapClickHandler />
      </MapContainer>
      
      {role === "user" && (
        <button
          onClick={handleCurrentLocation}
          className="absolute bottom-3 right-3 bg-white border px-3 py-1.5 rounded-lg shadow-md text-sm font-medium hover:bg-gray-100"
        >
          📍 Get Current Location
        </button>
      )}
    </div>
  );
}
