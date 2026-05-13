import { useState, useEffect } from "react"
import LandingPage from "./components/LandingPage"
import AuthPage from "./components/AuthPage"
import Map from "./components/Map"
import Sidebar from "./components/Sidebar"
import SavedPointsPanel from "./components/SavedPointsPanel"
import SettingsPanel from "./components/SettingsPanel"
import CountryGroupsPanel from "./components/CountryGroupsPanel"

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "app" : "landing"
  )

  const [authMode, setAuthMode] = useState("register")

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  )

  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [activePanel, setActivePanel] = useState(null)

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend válasz:", data.message)
      })
      .catch((error) => {
        console.error("Backend kapcsolat hiba:", error)
      })
  }, [])

  const handleDeletePoint = async (id) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a pontot?")) {
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/points/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        alert("Nem sikerült törölni a pontot.")
        return
      }

      setPoints((prev) => prev.filter((point) => point.id !== id))
      setSelectedPoint(null)
    } catch (error) {
      console.error("Törlési hiba:", error)
      alert("Nem sikerült kapcsolódni a backendhez.")
    }
  }

  const handleUpdatePoint = (updatedPoint) => {
    setPoints((prev) =>
      prev.map((point) =>
        point.id === updatedPoint.id ? updatedPoint : point
      )
    )

    setSelectedPoint(updatedPoint)
  }

  if (page === "landing" && !isAuthenticated) {
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
        onLogin={(loginData) => {
          localStorage.setItem("token", loginData.token)
          localStorage.setItem("user", JSON.stringify(loginData.user))

          setUser(loginData.user)
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