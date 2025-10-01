import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const LocationPicker = ({ onSelect, defaultLocation }) => {
  const [position, setPosition] = useState(defaultLocation || null);
  const [mapCenter, setMapCenter] = useState(defaultLocation || [19.033, 73.0297]);
  useEffect(() => {
    if (defaultLocation) {
      setPosition(defaultLocation);
      setMapCenter(defaultLocation);
      onSelect({ lat: defaultLocation[0], lng: defaultLocation[1] });
    }
  }, [defaultLocation]);
 

  useEffect(() => {
    if (!defaultLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setMapCenter(coords);
          setPosition(coords);
          onSelect({ lat: coords[0], lng: coords[1] });
        },
        (err) => {
          console.warn("Geolocation error:", err);
        }
      );
    }
  }, [defaultLocation]);

 
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onSelect(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };


  const Recenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 14);
    }, [center, map]);
    return null;
  };
  return (
    <div className="w-full h-80 rounded-lg overflow-hidden shadow">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Recenter center={mapCenter} />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
