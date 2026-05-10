
import { useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import searchIcon from "../assets/Search_Magnifying_Glass.png"

export default function SavedPointsPanel({
  points,
  selectedPoint,
  onSelectPoint,
  onBack,
  onDeletePoint,
  onUpdatePoint,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(selectedPoint || {})
  const [isImageOpen, setIsImageOpen] = useState(false)

  useEffect(() => {
    if (selectedPoint) {
      setFormData(selectedPoint)
      setIsEditing(false)
    }
  }, [selectedPoint])

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

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onUpdatePoint(formData)
    setIsEditing(false)
  }

  if (selectedPoint) {
    return (
      <div className="saved-panel">
        <button className="back-btn" onClick={onBack}>
          ← Vissza
        </button>

        <div className="detail-images">
          {selectedPoint.imagePreview ? (
            <img
              src={selectedPoint.imagePreview}
              alt={selectedPoint.title}
              onClick={() => setIsImageOpen(true)}
              className="detail-image"
            />
          ) : (
            <div className="detail-placeholder"></div>
          )}
        </div>

        <div className="detail-content">
          {!isEditing ? (
  <>
    <h2 className="detail-title">{formData.title}</h2>

    <div className="detail-meta">
      {formData.country && (
        <span className="country-tag">{formData.country}</span>
      )}

      {formData.category && (
        <span className="detail-tag">{formData.category}</span>
      )}
    </div>

    <div className="detail-location">
      📍 {formData.location || formData.title}
    </div>

    {formData.description && (
      <p className="detail-description">{formData.description}</p>
    )}
  </>
) : (
  <>
    <textarea
      className="edit-title"
      name="title"
      value={formData.title || ""}
      onChange={handleChange}
    />

    <div className="detail-meta">
      {formData.country && (
        <span className="country-tag">{formData.country}</span>
      )}

      {formData.category && (
        <span className="detail-tag">{formData.category}</span>
      )}
    </div>

    <div className="detail-location">
      📍 {formData.location || formData.title}
    </div>

    <textarea
      className="edit-description"
      name="description"
      value={formData.description || ""}
      onChange={handleChange}
      placeholder="Leírás"
    />
  </>
)}

          <div className="detail-actions">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Szerkesztés
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}>
                  Mentés
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setFormData(selectedPoint)
                    setIsEditing(false)
                  }}
                >
                  Mégse
                </button>
              </>
            )}

            <button
              className="delete-btn"
              onClick={() => onDeletePoint(selectedPoint.id)}
            >
              Törlés
            </button>
          </div>
        </div>

        {isImageOpen && (
          <div className="image-modal" onClick={() => setIsImageOpen(false)}>
            <img
              src={selectedPoint.imagePreview}
              alt={selectedPoint.title}
              className="fullscreen-image"
            />
          </div>
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
