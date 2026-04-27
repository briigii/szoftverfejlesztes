export default function Sidebar({ activePanel, setActivePanel }) {
  const togglePanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName)
  }

  return (
    <div className="sidebar">
      <button
        className={activePanel === "home" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => togglePanel("home")}
      >
        <img src="/src/assets/House_02.svg" alt="" />
      </button>

      <button
        className={activePanel === "files" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => togglePanel("files")}
      >
        <img src="/src/assets/Bookmark.svg" alt="" />
      </button>

      <button
        className={activePanel === "settings" ? "sidebar-btn active" : "sidebar-btn"}
        onClick={() => togglePanel("settings")}
      >
        <img src="/src/assets/Settings.svg" alt="" />
      </button>
    </div>
  )
}