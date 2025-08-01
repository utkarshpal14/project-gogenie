import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass } from "lucide-react";

// Fix for missing marker icons in Leaflet builds
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Create and set default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ startLocation, destination, className = "" }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coordinates, setCoordinates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.current);

    // Force Leaflet to re-measure container size
    setTimeout(() => {
      map.current.invalidateSize();
    }, 0);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Fetch coordinates
  useEffect(() => {
    if (!startLocation && !destination) return;

    setIsLoading(true);
    setError("");

    const fetchLocations = async () => {
      const newCoordinates = { ...coordinates };

      if (
        startLocation &&
        (!coordinates.start || coordinates.startQuery !== startLocation)
      ) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              startLocation
            )}`
          );
          const data = await response.json();
          if (data.length > 0) {
            newCoordinates.start = [
              parseFloat(data[0].lat),
              parseFloat(data[0].lon),
            ];
            newCoordinates.startQuery = startLocation;
          } else {
            setError("Start location not found.");
          }
        } catch (err) {
          console.error(err);
          setError("Error fetching start location.");
        }
      }

      if (
        destination &&
        (!coordinates.end || coordinates.endQuery !== destination)
      ) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              destination
            )}`
          );
          const data = await response.json();
          if (data.length > 0) {
            newCoordinates.end = [
              parseFloat(data[0].lat),
              parseFloat(data[0].lon),
            ];
            newCoordinates.endQuery = destination;
          } else {
            setError("Destination not found.");
          }
        } catch (err) {
          console.error(err);
          setError("Error fetching destination.");
        }
      }

      setCoordinates(newCoordinates);
      setIsLoading(false);
    };

    fetchLocations();
  }, [startLocation, destination]);

  // Render markers and polyline
  useEffect(() => {
    if (!map.current) return;

    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.current.removeLayer(layer);
      }
    });

    if (coordinates.start) {
      L.marker(coordinates.start)
        .addTo(map.current)
        .bindPopup(`Start: ${startLocation}`);
    }

    if (coordinates.end) {
      L.marker(coordinates.end)
        .addTo(map.current)
        .bindPopup(`Destination: ${destination}`);
    }

    if (coordinates.start && coordinates.end) {
      const bounds = L.latLngBounds(coordinates.start, coordinates.end);
      map.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 12 });

      L.polyline([coordinates.start, coordinates.end], {
        color: "#3887be",
        weight: 5,
        opacity: 0.75,
      }).addTo(map.current);
    } else if (coordinates.start || coordinates.end) {
      const point = coordinates.start || coordinates.end;
      if (point) {
        map.current.setView(point, 8);
      }
    }

    // Invalidate size after updating
    setTimeout(() => {
      map.current.invalidateSize();
    }, 0);
  }, [coordinates, startLocation, destination]);

  return (
    <div className="flex flex-col">
      {isLoading && (
        <div className="text-center text-sm text-muted-foreground pb-2">
          Loading map data...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-red-500 pb-2">{error}</div>
      )}

      {!coordinates.end && !isLoading && (
        <div className="flex items-center justify-center bg-gray-100 h-[300px] rounded-lg border">
          <div className="text-center text-muted-foreground">
            <Compass className="h-10 w-10 mb-2 mx-auto" />
            <p>Select a destination to view on the map</p>
          </div>
        </div>
      )}

      {/* ✅ Map always visible, with size and debug border */}
      <div
        ref={mapContainer}
        className={`h-[300px] rounded-lg border ${className}`}
        style={{ backgroundColor: "#f0f0f0" }}
      />
    </div>
  );
};

export default Map;
