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
import MarkerClusterGroup from "react-leaflet-cluster"
import markerIcon from "../assets/map-marker-svgrepo-com-green.svg"

const pinkIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
})

const createEmojiIcon = (emoji) =>
  L.divIcon({
    html: `<div class="emoji-marker">${emoji}</div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

const getMarkerIcon = (emoji) => {
  if (!emoji || emoji === "default") {
    return pinkIcon
  }

  return createEmojiIcon(emoji)
}

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

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni a helyadatokat.")
  }

  const data = await response.json()

  return {
    displayName: data.display_name || "",
    address: data.address || {},
  }
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    },
  })

  return null
}

function FlyToSelectedPoint({ selectedPoint }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPoint) return

    const lat = selectedPoint.lat
    const lng = selectedPoint.lng

    if (!lat || !lng) return

    const zoom = Math.max(map.getZoom(), 15)

    // Eredeti marker pozíció pixel koordinátában
    const point = map.project([lat, lng], zoom)

    // Bal oldali panelek miatt jobbra toljuk a térkép középpontját
    // Minél nagyobb ez az érték, annál jobban jobbra kerül a marker
    const offsetX = window.innerWidth < 1100 ? 220 : 430

    const shiftedPoint = point.subtract([offsetX, 0])
    const shiftedLatLng = map.unproject(shiftedPoint, zoom)

    map.flyTo(shiftedLatLng, zoom, {
      animate: true,
      duration: 0.8,
    })
  }, [selectedPoint, map])

  return null
}

export default function Map({
  points,
  setPoints,
  selectedPoint,
  setSelectedPoint,
  setActivePanel,
}) {
  const [selectedLatLng, setSelectedLatLng] = useState(null)
  const [tempMarker, setTempMarker] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loadingPlace, setLoadingPlace] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    category: "",
    markerEmoji: "default",
    description: "",
    image: null,
  })

  const handleMapClick = async (latlng) => {
    setSelectedLatLng(latlng)
    setTempMarker(latlng)
    setShowForm(true)
    setLoadingPlace(true)

    setFormData((prev) => ({
      ...prev,
      markerEmoji: "default",
    }))

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
        country: address.country || "",
      }))
    } catch {
      setFormData((prev) => ({
        ...prev,
        title: "",
        country: "",
      }))
    } finally {
      setLoadingPlace(false)
    }
  }

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

  const resetForm = () => {
    setFormData({
      title: "",
      country: "",
      category: "",
      markerEmoji: "default",
      description: "",
      image: null,
    })

    setSelectedLatLng(null)
    setTempMarker(null)
    setShowForm(false)
  }

 const handleSave = () => {
  if (!selectedLatLng) return

  if (!formData.title.trim()) {
    alert("Adj meg helynevet.")
    return
  }

  if (!formData.category.trim()) {
    alert("Adj meg kategóriát.")
    return
  }

  if (!formData.image) {
    alert("Tölts fel képet.")
    return
  }

  const newPoint = {
    id: Date.now(),
    lat: selectedLatLng.lat,
    lng: selectedLatLng.lng,
    title: formData.title,
    location: formData.title,
    country: formData.country,
    category: formData.category,
    description: formData.description,
    imagePreview: URL.createObjectURL(formData.image),
    markerEmoji: formData.markerEmoji,
  }

  setPoints((prev) => [...prev, newPoint])

  resetForm()
}


  return (
    <div className="map-wrapper">
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

          <input
            type="text"
            name="category"
            list="category-options"
            placeholder="Minek mented el? pl. Kedvenc"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <datalist id="category-options">
            <option value="Étterem" />
            <option value="Látnivaló" />
            <option value="Élmény" />
            <option value="Szállás" />
            <option value="Kedvenc" />
            <option value="Egyéb" />
          </datalist>

          <div className="emoji-picker">
            {[
              "default",
              "⭐",
              "❤️",
              "🍽️",
              "🏨",
              "☕",
              "🌊",
              "🚗",
              "✈️",
              "🎥",
              "🏠",
            ].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={
                  formData.markerEmoji === emoji
                    ? "emoji-btn active"
                    : "emoji-btn"
                }
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    markerEmoji: emoji,
                  }))
                }
              >
                {emoji === "default" ? "📍" : emoji}
              </button>
            ))}
          </div>

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
            required
          />

          {selectedLatLng && (
            <p>
              Lat: {selectedLatLng.lat.toFixed(5)}, Lng:{" "}
              {selectedLatLng.lng.toFixed(5)}
            </p>
          )}

          <div className="new-point-buttons">
            <button onClick={handleSave} disabled={loadingPlace}>
              Mentés
            </button>
            <button type="button" onClick={resetForm}>
              Mégse
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={[47.4979, 19.0402]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FlyToSelectedPoint selectedPoint={selectedPoint} />

        <MapClickHandler onMapClick={handleMapClick} />

        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={getMarkerIcon(formData.markerEmoji)}
          >
            <Popup>Új pont helye</Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount()

            return L.divIcon({
              html: `<div class="custom-cluster">${count}</div>`,
              className: "cluster-wrapper",
              iconSize: [50, 50],
            })
          }}
        >
          {points.map((point) => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={getMarkerIcon(point.markerEmoji)}
              eventHandlers={{
                click: () => {
                  setSelectedPoint(point)
                  setActivePanel("home")
                },
              }}
            >
              <Popup>
                <div>
                  <strong>{point.title}</strong>
                  <br />

                  {point.category && (
                    <>
                      <small>{point.category}</small>
                      <br />
                    </>
                  )}

                  {point.country && <small>{point.country}</small>}

                  {point.description && <p>{point.description}</p>}

                  {point.imagePreview && (
                    <img
                      src={point.imagePreview}
                      alt={point.title}
                      style={{
                        width: "180px",
                        borderRadius: "30px",
                        marginTop: "8px",
                      }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}