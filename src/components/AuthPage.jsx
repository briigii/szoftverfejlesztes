import { useState } from "react"

export default function AuthPage({ onLogin, initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode)
  const handleSubmit = (e) => {
    e.preventDefault()

    onLogin({
      name: "Kovács Dorina",
      email: "dorina@example.com",
      username: "dorina",
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-navbar">
        <strong>JourneyPins</strong>

        <div className="auth-tabs">
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Regisztráció
          </button>

          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Bejelentkezés
          </button>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>{mode === "register" ? "Regisztráció" : "Bejelentkezés"}</h1>

        {mode === "register" ? (
          <>
            <div className="auth-grid">
              <input placeholder="Felhasználónév" />
              <input placeholder="Email cím" />
              <input type="password" placeholder="Jelszó" />
              <input type="password" placeholder="Jelszó ellenőrzés" />
            </div>

            <label className="privacy-row">
              <input type="checkbox" />
              <span>
                Elolvastam és elfogadom az <b>adatkezelési nyilatkozatot*</b>
              </span>
            </label>
          </>
        ) : (
          <div className="login-fields">
            <input placeholder="Felhasználónév / email cím" />
            <input type="password" placeholder="Jelszó" />
          </div>
        )}

        <button className="auth-submit" type="submit">
          {mode === "register" ? "Regisztráció" : "Bejelentkezés"}
        </button>

        <p className="auth-switch">
          {mode === "register" ? (
            <>
              Van már fiókod?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Jelentkezz be itt!
              </button>
            </>
          ) : (
            <>
              Nincs még fiókod?{" "}
              <button type="button" onClick={() => setMode("register")}>
                Regisztrálj most!
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}