import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"


const iconPoints = [
  { icon: "🍽️", position: [47.4979, 19.0402], label: "Étterem" },
  { icon: "🛍️", position: [47.503, 19.055], label: "Shopping" },
  { icon: "⭐", position: [47.51, 19.03], label: "Kedvenc hely" },
  { icon: "🏨", position: [47.495, 19.06], label: "Szállás" },
]

function createEmojiIcon(emoji) {
  return L.divIcon({
    html: `<div class="emoji-marker">${emoji}</div>`,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  })
}

export default function MapShowcase() {
  return (
    <div className="map-showcase">
      <div className="showcase-card large">
        <span className="card-label">ACTIVE USERS</span>
        <h3>2,847</h3>

        <MapContainer
          center={[35, -10]}
          zoom={2}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <CircleMarker center={[47.5, 19]} radius={12} />
          <CircleMarker center={[40.7, -74]} radius={10} />
          <CircleMarker center={[35.6, 139.6]} radius={9} />
          <CircleMarker center={[-33.8, 151]} radius={8} />
        </MapContainer>
      </div>

      <div className="showcase-card">
  <span className="card-label">CATEGORIES</span>

  <MapContainer
    center={[47.503, 19.045]}
    zoom={13}
    zoomControl={false}
    attributionControl={false}
    
    scrollWheelZoom={false}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {iconPoints.map((point, index) => (
      <Marker
        key={index}
        position={point.position}
        icon={createEmojiIcon(point.icon)}
      >
        <Popup>{point.label}</Popup>
      </Marker>
    ))}
  </MapContainer>
</div> 
    </div>
  )
}