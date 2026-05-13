import { useState } from "react"

export default function CountryGroupsPanel({
  points,
  setSelectedPoint,
  setActivePanel,
}) {
  const [openedCountry, setOpenedCountry] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const groupedByCountry = points.reduce((acc, point) => {
    const country = point.country || "Ismeretlen ország"

    if (!acc[country]) {
      acc[country] = []
    }

    acc[country].push(point)
    return acc
  }, {})

  const getCategoryCounts = (countryPoints) => {
    return countryPoints.reduce((acc, point) => {
      const category = point.category || "Nincs kategória"

      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
  }

  const handlePointClick = (point) => {
    setSelectedPoint(point)
    setActivePanel("home")
  }

  const countries = Object.entries(groupedByCountry)

  return (
    <div className="country-panel">
      <h2>Helyek ország szerint</h2>

      {countries.length === 0 && (
        <p className="empty-text">Még nincs mentett hely.</p>
      )}

      {countries.map(([country, countryPoints]) => {
        const categoryCounts = getCategoryCounts(countryPoints)
        const isOpen = openedCountry === country

        const visiblePoints = selectedCategory
          ? countryPoints.filter(
              (point) =>
                (point.category || "Nincs kategória") === selectedCategory
            )
          : countryPoints

        return (
          <div key={country} className="country-card">
            <button
              className="country-header"
              onClick={() => {
                setOpenedCountry(isOpen ? null : country)
                setSelectedCategory(null)
              }}
            >
              <div>
                <h3>{country}</h3>
                <span>{countryPoints.length} mentett hely</span>
              </div>

              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="country-content">
                <div className="category-counts">
                  <button
                    className={
                      selectedCategory === null
                        ? "category-chip active"
                        : "category-chip"
                    }
                    onClick={() => setSelectedCategory(null)}
                  >
                    Összes ({countryPoints.length})
                  </button>

                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <button
                      key={category}
                      className={
                        selectedCategory === category
                          ? "category-chip active"
                          : "category-chip"
                      }
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category} ({count})
                    </button>
                  ))}
                </div>

                <div className="country-point-list">
                  {visiblePoints.map((point) => (
                    <button
                      key={point.id}
                      className="country-point-card"
                      onClick={() => handlePointClick(point)}
                    >
                      <div>
                        <h4>{point.title}</h4>

                        {point.category && (
                          <span className="saved-point-category">
                            {point.category}
                          </span>
                        )}

                        {point.description && <p>{point.description}</p>}
                      </div>

                      <span className="point-arrow">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}