import { useState } from "react"

export default function SettingsPanel({ user, setUser }) {
  const [formData, setFormData] = useState(user)
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setUser(formData)
    setIsEditing(false)
    alert("Felhasználói adatok mentve.")
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható."
    )

    if (!confirmed) return

    alert("A fiók törlése elindítva.")
  }

  return (
    <div className="settings-panel">
      <h2>Beállítások</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {formData.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">

          <label>Felhasználónév</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="settings-actions">
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
                setFormData(user)
                setIsEditing(false)
              }}
            >
              Mégse
            </button>
          </>
        )}
      </div>

      <div className="danger-zone">
        <h3>Fiók törlése</h3>
        <p>
          A fiók törlése végleges művelet, amely után az adatok nem állíthatók
          vissza.
        </p>

        <button className="delete-btn" onClick={handleDeleteAccount}>
          Fiók végleges törlése
        </button>
      </div>
    </div>
  )
}