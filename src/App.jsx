import { useState } from "react"
import Map from "./components/Map"
import Sidebar from "./components/Sidebar"
import SavedPointsPanel from "./components/SavedPointsPanel"
import SettingsPanel from "./components/SettingsPanel"

function App() {
  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [activePanel, setActivePanel] = useState(null)

  const [user, setUser] = useState({
    name: "Kovács Dorina",
    email: "dorina@example.com",
    username: "dorina",
  })

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {activePanel === "home" && (
        <SavedPointsPanel
          points={points}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
          onBack={() => setSelectedPoint(null)}
        />
      )}

      {activePanel === "settings" && (
        <SettingsPanel user={user} setUser={setUser} />
      )}

    <div className="profile-button" onClick={() => setActivePanel("settings")}>
      {user.name.charAt(0).toUpperCase()}
    </div>
    
      <Map
        points={points}
        setPoints={setPoints}
        selectedPoint={selectedPoint}
      />
    </div>
  )
}

export default App