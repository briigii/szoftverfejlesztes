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
  const [isMobilePanelView, setIsMobilePanelView] = useState(false)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  useEffect(() => {
    if (selectedPoint) {
      setFormData(selectedPoint)
      setIsEditing(false)
    }
  }, [selectedPoint])

  useEffect(() => {
    const checkSize = () => {
      setIsMobilePanelView(window.innerWidth <= 1100)
    }

    checkSize()
    window.addEventListener("resize", checkSize)

    return () => window.removeEventListener("resize", checkSize)
  }, [])

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

  const showListPanel = !isMobilePanelView || !mobileDetailOpen
  const showDetailPanel =
    selectedPoint && (!isMobilePanelView || mobileDetailOpen)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (onUpdatePoint) {
      onUpdatePoint(formData)
    }

    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!selectedPoint) return

    if (window.confirm("Biztosan törölni szeretnéd ezt a pontot?")) {
      onDeletePoint(selectedPoint.id)
    }
  }

  const handleBack = () => {
    if (isMobilePanelView) {
      setMobileDetailOpen(false)
    } else {
      onBack()
    }
  }

  return (
    <>
      {showListPanel && (
        <div className="saved-panel list-panel">
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
                    <img
                      className="search-icon"
                      src={searchIcon}
                      alt="Keresés"
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="list-title-row">
            <h3>Mentett helyek</h3>
            <span>{filteredPoints.length} hely</span>
          </div>

          <div className="points-list">
            {filteredPoints.length === 0 && (
              <p className="empty-message">Nincs találat.</p>
            )}

            {filteredPoints.map((point) => (
              <div
                className={
                  selectedPoint?.id === point.id
                    ? "point-card active"
                    : "point-card"
                }
                key={point.id}
                onClick={() => {
                  onSelectPoint(point)

                  if (isMobilePanelView) {
                    setMobileDetailOpen(true)
                  }
                }}
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
                    {point.country && (
                      <span className="country-tag">{point.country}</span>
                    )}

                    {point.category && (
                      <span className="tag">{point.category}</span>
                    )}
                  </div>

                  {point.description && <p>{point.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDetailPanel && (
        <div className="place-detail-panel">
          <div className="detail-topbar">
            <button className="back-btn" onClick={handleBack}>
              ← Vissza
            </button>

            <div className="image-actions">
              {!isEditing ? (
                <button
                  className="image-action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✎
                </button>
              ) : (
                <>
                  <button
                    className="image-action-btn save"
                    onClick={handleSave}
                  >
                    ✓
                  </button>

                  <button
                    className="image-action-btn"
                    onClick={() => {
                      setFormData(selectedPoint)
                      setIsEditing(false)
                    }}
                  >
                    ✕
                  </button>
                </>
              )}

              <button className="image-action-btn delete" onClick={handleDelete}>
                Törlés
              </button>
            </div>
          </div>

          <div className="detail-image-card">
            {selectedPoint.imagePreview ? (
              <img
                src={selectedPoint.imagePreview}
                alt={selectedPoint.title}
                className="detail-image"
                onClick={() => setIsImageOpen(true)}
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
                  <div className="description-card">
                    <span className="description-title">Leírás</span>
                    <p>{formData.description}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <textarea
                  className="edit-title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  placeholder="Hely neve"
                />

                <input
                  className="edit-category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  placeholder="Kategória"
                />

                <textarea
                  className="edit-description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Leírás"
                />
              </>
            )}
          </div>
        </div>
      )}

      {isImageOpen && selectedPoint?.imagePreview && (
        <div
          className="photo-viewer-overlay"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="photo-viewer" onClick={(e) => e.stopPropagation()}>
            <button
              className="photo-viewer-close"
              onClick={() => setIsImageOpen(false)}
            >
              ✕
            </button>

            <div className="photo-viewer-image-wrap">
              <img
                src={selectedPoint.imagePreview}
                alt={selectedPoint.title}
                className="photo-viewer-image"
              />
            </div>

            <div className="photo-viewer-info">
              <div>
                <h3>{selectedPoint.title}</h3>
                <p>📍 {selectedPoint.location || selectedPoint.title}</p>
              </div>

              {selectedPoint.category && (
                <span className="detail-tag">{selectedPoint.category}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}