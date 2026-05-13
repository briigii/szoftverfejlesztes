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

const API_URL = "http://127.0.0.1:8000/api"

const pinkIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
})

const createEmojiIcon = (emoji, isSelected = false) =>
  L.divIcon({
    html: `
      <div class="${isSelected ? "emoji-marker selected-marker" : "emoji-marker"}">
        ${emoji}
      </div>
    `,
    className: "",
    iconSize: isSelected ? [52, 52] : [40, 40],
    iconAnchor: isSelected ? [26, 52] : [20, 40],
    popupAnchor: [0, -40],
  })

const getMarkerIcon = (emoji, isSelected = false) => {
  if (!emoji || emoji === "default") {
    return isSelected
      ? L.divIcon({
          html: `<div class="selected-default-marker">📍</div>`,
          className: "",
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          popupAnchor: [0, -52],
        })
      : pinkIcon
  }

  return createEmojiIcon(emoji, isSelected)
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
    const point = map.project([lat, lng], zoom)

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

  useEffect(() => {
    fetch(`${API_URL}/points`)
      .then((response) => response.json())
      .then((data) => {
        const formattedPoints = data.map((point) => ({
          id: point.id,
          lat: Number(point.lat),
          lng: Number(point.lng),
          title: point.title,
          location: point.title,
          country: point.country || "",
          city: point.city || "",
          category: point.category || "",
          markerEmoji: point.markerEmoji || "default",
          description: point.description || "",
          imagePreview: point.image_url || null,
        }))

        setPoints(formattedPoints)
      })
      .catch((error) => {
        console.error("Pontok betöltési hiba:", error)
      })
  }, [setPoints])

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

  const handleSave = async () => {
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

    try {
      const uploadData = new FormData()

      uploadData.append("title", formData.title)
      uploadData.append("description", formData.description)
      uploadData.append("lat", selectedLatLng.lat)
      uploadData.append("lng", selectedLatLng.lng)
      uploadData.append("country", formData.country)
      uploadData.append("city", "")
      uploadData.append("category", formData.category)
      uploadData.append("markerEmoji", formData.markerEmoji)

      if (formData.image) {
        uploadData.append("image", formData.image)
      }

      const response = await fetch(`${API_URL}/points`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: uploadData,
      })

      const savedPoint = await response.json()

      if (!response.ok) {
        console.error(savedPoint)
        alert("Nem sikerült elmenteni a pontot.")
        return
      }

      const newPoint = {
        id: savedPoint.id,
        lat: Number(savedPoint.lat),
        lng: Number(savedPoint.lng),
        title: savedPoint.title,
        location: savedPoint.title,
        country: savedPoint.country || "",
        city: savedPoint.city || "",
        category: savedPoint.category || formData.category,
        markerEmoji: savedPoint.markerEmoji || formData.markerEmoji,
        description: savedPoint.description || "",
        imagePreview: savedPoint.image_url || null,
      }

      setPoints((prev) => [...prev, newPoint])
      resetForm()
    } catch (error) {
      console.error("Mentési hiba:", error)
      alert("Nem sikerült kapcsolódni a backendhez.")
    }
  }

  const handleDelete = async (pointId) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a pontot?")) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/points/${pointId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        alert("Nem sikerült törölni a pontot.")
        return
      }

      setPoints((prev) => prev.filter((point) => point.id !== pointId))

      if (selectedPoint?.id === pointId) {
        setSelectedPoint(null)
      }
    } catch (error) {
      console.error("Törlési hiba:", error)
      alert("Nem sikerült kapcsolódni a backendhez.")
    }
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
          {points.map((point) => {
            const isSelected = selectedPoint?.id === point.id

            return (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={getMarkerIcon(point.markerEmoji, isSelected)}
                zIndexOffset={isSelected ? 1000 : 0}
                eventHandlers={{
                  click: () => {
                    setSelectedPoint(point)
                    setActivePanel("home")
                  },
                }}
              >
                <Popup className="custom-map-popup">
                  <div className="popup-card">
                    {point.imagePreview && (
                      <div className="popup-image-wrap">
                        <img
                          src={point.imagePreview}
                          alt={point.title}
                          className="popup-image"
                        />
                      </div>
                    )}

                    <div className="popup-content">
                      <div className="popup-header">
                        <h3>{point.title}</h3>
                      </div>

                      <div className="popup-tags">
                        {point.category && (
                          <span className="popup-tag">{point.category}</span>
                        )}

                        {point.country && (
                          <span className="popup-country">{point.country}</span>
                        )}
                      </div>

                      <p className="popup-location">
                        📍 {point.location || point.title}
                      </p>

                      {point.description && (
                        <p className="popup-description">
                          {point.description}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(point.id)}
                        className="popup-delete-btn"
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}