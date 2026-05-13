import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapShowcase from "./MapShowcase"

export default function LandingPage({ onStart, onLogin, onRegister }) {
  return (
    <div className="landing-page">
      <div className="landing-navbar">
        <strong>JourneyPins</strong>

        <div className="landing-tabs">
          <button onClick={onRegister}>Regisztráció</button>
          <button onClick={onLogin}>Bejelentkezés</button>
        </div>
      </div>

      <section className="landing-hero">
        <h1>Fedezd fel. Jelöld meg. Oszd meg</h1>
        <p>
          Jelöld meg a helyeket, tölts fel képeket, és oszd meg az élményeidet
          egy interaktív térképen.
        </p>
         <button className="start-btn" onClick={onStart}>
          Kezdjük el
        </button>

        <div className="landing-map">
          <MapShowcase />
        </div>
      </section>
    </div>
  )
}