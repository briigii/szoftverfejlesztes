import { useState } from "react"

export default function AuthPage({ onLogin, initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (mode === "register") {
      if (!acceptedPrivacy) {
        setError("El kell fogadnod az adatkezelési nyilatkozatot.")
        return
      }

      if (password !== passwordConfirm) {
        setError("A két jelszó nem egyezik.")
        return
      }
    }

    const url =
      mode === "register"
        ? "http://127.0.0.1:8000/api/register"
        : "http://127.0.0.1:8000/api/login"

    const body =
      mode === "register"
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Hiba történt.")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      onLogin(data)
    } catch (err) {
      console.error(err)
      setError("Nem sikerült kapcsolódni a backendhez.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-navbar">
        <strong>JourneyPins</strong>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register")
              setError("")
            }}
          >
            Regisztráció
          </button>

          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login")
              setError("")
            }}
          >
            Bejelentkezés
          </button>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>{mode === "register" ? "Regisztráció" : "Bejelentkezés"}</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {mode === "register" ? (
          <>
            <div className="auth-grid">
              <input
                placeholder="Felhasználónév"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Email cím"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Jelszó ellenőrzés"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <label className="privacy-row">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              />
              <span>
                Elolvastam és elfogadom az <b>adatkezelési nyilatkozatot*</b>
              </span>
            </label>
          </>
        ) : (
          <div className="login-fields">
            <input
              placeholder="Email cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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