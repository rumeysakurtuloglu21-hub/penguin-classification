import { useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SPECIES_NOTE = {
  Adelie: 'Küçük gövde, kısa gaga — Adelie pengueni.',
  Chinstrap: 'Orta boy, belirgin çene bandı — Chinstrap pengueni.',
  Gentoo: 'Daha uzun palet ve yüksek kütle — Gentoo pengueni.',
}

const EMPTY = {
  culmen_length_mm: '',
  culmen_depth_mm: '',
  flipper_length_mm: '',
  body_mass_g: '',
  island: 'Biscoe',
  sex: 'FEMALE',
}

function App() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const isValid = useMemo(() => {
    const numbers = [
      form.culmen_length_mm,
      form.culmen_depth_mm,
      form.flipper_length_mm,
      form.body_mass_g,
    ]
    return numbers.every((value) => {
      const n = Number(value)
      return value !== '' && Number.isFinite(n) && n > 0
    })
  }, [form])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (!isValid || loading) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          culmen_length_mm: Number(form.culmen_length_mm),
          culmen_depth_mm: Number(form.culmen_depth_mm),
          flipper_length_mm: Number(form.flipper_length_mm),
          body_mass_g: Number(form.body_mass_g),
          island: form.island,
          sex: form.sex,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = data?.detail
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).join(' ')
          : detail || 'Tahmin isteği başarısız oldu.'
        throw new Error(message)
      }
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sunucuya bağlanılamadı. Backend çalışıyor mu?',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container app-container">
      <header className="hero">
        <div className="badge">Penguins</div>
        <h1>Penguin Species Classifier</h1>
        <p>Penguenin özelliklerini girerek tür tahmini yap.</p>
      </header>

      <main className="layout">
        <section className="card">
          <form className="form" onSubmit={onSubmit}>
            <div className="grid-2">
              <label>
                <span>Culmen length (mm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  placeholder="ör. 39.1"
                  value={form.culmen_length_mm}
                  onChange={(e) => update('culmen_length_mm', e.target.value)}
                  required
                />
                <small>Gaga uzunluğu</small>
              </label>
              <label>
                <span>Culmen depth (mm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="50"
                  placeholder="ör. 18.7"
                  value={form.culmen_depth_mm}
                  onChange={(e) => update('culmen_depth_mm', e.target.value)}
                  required
                />
                <small>Gaga derinliği</small>
              </label>
              <label>
                <span>Flipper length (mm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="400"
                  placeholder="ör. 181"
                  value={form.flipper_length_mm}
                  onChange={(e) => update('flipper_length_mm', e.target.value)}
                  required
                />
                <small>Palet uzunluğu</small>
              </label>
              <label>
                <span>Body mass (g)</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="15000"
                  placeholder="ör. 3750"
                  value={form.body_mass_g}
                  onChange={(e) => update('body_mass_g', e.target.value)}
                  required
                />
                <small>Vücut ağırlığı</small>
              </label>
            </div>

            <label>
              <span>Island</span>
              <div className="choices">
                {['Biscoe', 'Dream', 'Torgersen'].map((island) => (
                  <button
                    key={island}
                    type="button"
                    className={`choice ${form.island === island ? 'active' : ''}`}
                    onClick={() => update('island', island)}
                  >
                    {island}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span>Sex</span>
              <div className="choices">
                {[
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'MALE', label: 'Male' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`choice ${form.sex === option.value ? 'active' : ''}`}
                    onClick={() => update('sex', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>

            <button className="submit" type="submit" disabled={!isValid || loading}>
              {loading ? 'Tahmin ediliyor…' : 'Predict'}
            </button>
          </form>
        </section>

        <aside className="card">
          {error ? <p className="error">{error}</p> : null}
          {!result && !error ? (
            <div className="placeholder">
              Özellikleri girip Predict’e basın. Tahmin burada görünecek.
            </div>
          ) : null}
          {result ? (
            <div className={`result species-${result.species.toLowerCase()}`}>
              <div className="result-kind">Tahmin edilen tür</div>
              <h2>{result.species}</h2>
              <p>{SPECIES_NOTE[result.species]}</p>
              <div className="bars">
                {Object.entries(result.probabilities).map(([name, value]) => (
                  <div className="bar-row" key={name}>
                    <div className="bar-meta">
                      <span>{name}</span>
                      <span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <div className="track">
                      <div
                        className={`fill ${name.toLowerCase()}`}
                        style={{ width: `${Math.max(value * 100, 1.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </main>
    </div>
  )
}

export default App
