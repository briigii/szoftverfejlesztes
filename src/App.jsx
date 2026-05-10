import { useState } from "react"
import LandingPage from "./components/LandingPage"
import AuthPage from "./components/AuthPage"
import Map from "./components/Map"
import Sidebar from "./components/Sidebar"
import SavedPointsPanel from "./components/SavedPointsPanel"
import SettingsPanel from "./components/SettingsPanel"
import CountryGroupsPanel from "./components/CountryGroupsPanel"

function App() {
  const [page, setPage] = useState("landing")
  const [authMode, setAuthMode] = useState("register")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [activePanel, setActivePanel] = useState(null)

  const [user, setUser] = useState(null)

  const handleDeletePoint = (id) => {
    setPoints((prev) => prev.filter((point) => point.id !== id))
    setSelectedPoint(null)
  }

  const handleUpdatePoint = (updatedPoint) => {
    setPoints((prev) =>
      prev.map((point) =>
        point.id === updatedPoint.id ? updatedPoint : point
      )
    )

    setSelectedPoint(updatedPoint)
  }

  if (page === "landing") {
    return (
      <LandingPage
        onStart={() => {
          setAuthMode("register")
          setPage("auth")
        }}
        onRegister={() => {
          setAuthMode("register")
          setPage("auth")
        }}
        onLogin={() => {
          setAuthMode("login")
          setPage("auth")
        }}
      />
    )
  }

  if (!isAuthenticated) {
    return (
      <AuthPage
        initialMode={authMode}
        onLogin={(loggedInUser) => {
          setUser(loggedInUser)
          setIsAuthenticated(true)
          setPage("app")
        }}
      />
    )
  }

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {activePanel === "home" && (
        <SavedPointsPanel
          points={points}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
          onBack={() => setSelectedPoint(null)}
          onDeletePoint={handleDeletePoint}
          onUpdatePoint={handleUpdatePoint}
        />
      )}

      {activePanel === "files" && (
        <CountryGroupsPanel
          points={points}
          setSelectedPoint={setSelectedPoint}
          setActivePanel={setActivePanel}
        />
      )}

      {activePanel === "settings" && (
        <SettingsPanel user={user} setUser={setUser} />
      )}

      <Map
        points={points}
        setPoints={setPoints}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
        setActivePanel={setActivePanel}
      />

      <div
        className="profile-button"
        onClick={() => setActivePanel("settings")}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    </div>
  )
}

export default App