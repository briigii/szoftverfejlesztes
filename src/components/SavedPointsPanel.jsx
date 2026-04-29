import { useState } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import searchIcon from "../assets/Search_Magnifying_Glass.png"

export default function SavedPointsPanel({
  points,
  selectedPoint,
  onSelectPoint,
  onBack,
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPoints = points.filter((point) => {
    const search = searchTerm.toLowerCase()

    return (
      point.title?.toLowerCase().includes(search) ||
      point.category?.toLowerCase().includes(search) ||
      point.country?.toLowerCase().includes(search) ||
      point.location?.toLowerCase().includes(search) ||
      point.description?.toLowerCase().includes(search)
    )
  })

  if (selectedPoint) {
    return (
      <div className="saved-panel">
        <button className="back-btn" onClick={onBack}>
          ← Vissza
        </button>

        <div className="detail-images">
          {selectedPoint.imagePreview ? (
            <img src={selectedPoint.imagePreview} alt={selectedPoint.title} />
          ) : (
            <div className="detail-placeholder"></div>
          )}
        </div>

        <h2 className="detail-title">{selectedPoint.title}</h2>

        <div className="detail-location">
          📍 {selectedPoint.location || selectedPoint.title}
        </div>

        <div className="point-tags">
          {selectedPoint.category && (
            <span className="tag">{selectedPoint.category}</span>
          )}

          {selectedPoint.country && (
            <span className="country-tag">{selectedPoint.country}</span>
          )}
        </div>

        {selectedPoint.description && (
          <p className="detail-description">{selectedPoint.description}</p>
        )}
      </div>
    )
  }

  return (
    <div className="saved-panel">
      <div className="panel-header">
        <TextField
          placeholder="Keresés név, tag vagy ország alapján..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img className="search-icon" src={searchIcon} alt="Keresés" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="points-list">
        {filteredPoints.length === 0 && (
          <p className="empty-message">Nincs találat.</p>
        )}

        {filteredPoints.map((point) => (
          <div
            className="point-card"
            key={point.id}
            onClick={() => onSelectPoint(point)}
          >
            <div className="point-image">
              {point.imagePreview ? (
                <img src={point.imagePreview} alt={point.title} />
              ) : (
                <div className="placeholder"></div>
              )}
            </div>

            <div className="point-info">
              <h3>{point.title}</h3>

              <div className="point-location">
                📍 {point.location || point.title}
              </div>

              <div className="point-tags">
                {point.category && <span className="tag">{point.category}</span>}
                {point.country && (
                  <span className="country-tag">{point.country}</span>
                )}
              </div>

              {point.description && <p>{point.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}