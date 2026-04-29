import { useState, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet"
import L from "leaflet"

// 🔥 SAJÁT MARKER IKON
const pinkIcon = L.icon({
  iconUrl: "src/assets/map-marker-svgrepo-com.svg",
  iconRetinaUrl: "src/assets/map-marker-svgrepo-com.svg",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
})

// 🔁 REVERSE GEOCODING
async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    addressdetails: "1",
    "accept-language": "hu",
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
  )

  const data = await response.json()

  return {
    displayName: data.display_name || "",
    address: data.address || {},
  }
}

// 🖱️ TÉRKÉP KATTINTÁS
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    },
  })
  return null
}

// ✈️ FLY TO
function FlyToPoint({ point }) {
  const map = useMap()

  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], 15, {
        duration: 1.5,
      })
    }
  }, [point])

  return null
}

export default function Map({ points, setPoints, selectedPoint }) {
  const [selectedLatLng, setSelectedLatLng] = useState(null)
  const [tempMarker, setTempMarker] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loadingPlace, setLoadingPlace] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  })

  // 📍 TÉRKÉP KATTINTÁS
  const handleMapClick = async (latlng) => {
    setSelectedLatLng(latlng)
    setTempMarker(latlng)
    setShowForm(true)
    setLoadingPlace(true)

    try {
      const result = await reverseGeocode(latlng.lat, latlng.lng)
      const address = result.address || {}

      const autoTitle =
        address.attraction ||
        address.tourism ||
        address.amenity ||
        address.building ||
        address.road ||
        address.city ||
        result.displayName ||
        ""

      setFormData((prev) => ({
        ...prev,
        title: autoTitle,
      }))
    } catch {
      setFormData((prev) => ({
        ...prev,
        title: "",
      }))
    } finally {
      setLoadingPlace(false)
    }
  }

  // ✏️ FORM CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 🔄 RESET
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      image: null,
    })

    setSelectedLatLng(null)
    setTempMarker(null)
    setShowForm(false)
  }

  // 💾 SAVE
  const handleSave = () => {
    if (!selectedLatLng) return

    if (!formData.title.trim()) {
      alert("Adj meg helynevet.")
      return
    }

    const newPoint = {
      id: Date.now(),
      lat: selectedLatLng.lat,
      lng: selectedLatLng.lng,
      title: formData.title,
      location: formData.title,
      category: formData.category,
      description: formData.description,
      imagePreview: formData.image
        ? URL.createObjectURL(formData.image)
        : null,
    }

    setPoints((prev) => [...prev, newPoint])
    resetForm()
  }

  return (
    <div className="map-wrapper">
      {/* 📝 FORM */}
      {showForm && (
        <div className="point-form">
          <h3>Új pont felvétele</h3>

          <input
            type="text"
            name="title"
            placeholder={loadingPlace ? "Hely keresése..." : "Hely neve"}
            value={formData.title}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Minek mented el?</option>
            <option value="Étterem">Étterem</option>
            <option value="Látnivaló">Látnivaló</option>
            <option value="Élmény">Élmény</option>
            <option value="Szállás">Szállás</option>
            <option value="Egyéb">Egyéb</option>
          </select>

          <textarea
            name="description"
            placeholder="Leírás"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          {selectedLatLng && (
            <p>
              Lat: {selectedLatLng.lat.toFixed(5)}, Lng:{" "}
              {selectedLatLng.lng.toFixed(5)}
            </p>
          )}

          <div>
            <button onClick={handleSave}>Mentés</button>
            <button onClick={resetForm}>Mégse</button>
          </div>
        </div>
      )}

      {/* 🗺️ MAP */}
      <MapContainer
        center={[47.4979, 19.0402]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {selectedPoint && <FlyToPoint point={selectedPoint} />}

        <MapClickHandler onMapClick={handleMapClick} />

        {/* TEMP MARKER */}
        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={pinkIcon}
          >
            <Popup>Új pont helye</Popup>
          </Marker>
        )}

        {/* SAVED POINTS */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={pinkIcon}
          >
            <Popup>
              <div>
                <strong>{point.title}</strong>
                <br />
                {point.category && <small>{point.category}</small>}
                {point.description && <p>{point.description}</p>}
                {point.imagePreview && (
                  <img
                    src={point.imagePreview}
                    alt={point.title}
                    style={{
                      width: "180px",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}