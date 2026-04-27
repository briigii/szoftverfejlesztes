import { useState } from "react"
import Map from "./components/Map"
import SavedPointsPanel from "./components/SavedPointsPanel"
import Sidebar from "./components/Sidebar.jsx"

function App() {
  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [activePanel, setActivePanel] = useState(null)

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {activePanel === "home" && (
        <SavedPointsPanel
          points={points}
          onSelectPoint={setSelectedPoint}
        />
      )}

      <Map
        points={points}
        setPoints={setPoints}
        selectedPoint={selectedPoint}
      />
    </div>
  )
}

export default App