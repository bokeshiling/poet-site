import { useState, useCallback, useEffect } from 'react'
import { poems } from './data/poems'
import './App.css'

const FAVORITES_KEY = 'poem-favorites'

function getRandomIndex(current: number, total: number): number {
  if (total <= 1) return 0
  let next = Math.floor(Math.random() * total)
  while (next === current) {
    next = Math.floor(Math.random() * total)
  }
  return next
}

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveFavorites(ids: number[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

function App() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * poems.length))
  const [fading, setFading] = useState(false)
  const [favorites, setFavorites] = useState<number[]>(loadFavorites)
  const [showHint, setShowHint] = useState(true)

  const poem = poems[index]
  if (!poem) {
    return <div className="poem-page" style={{ color: '#fff' }}>加载中…</div>
  }
  const isFavorited = favorites.includes(poem.id)

  // hide hint after first interaction
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 4000)
      return () => clearTimeout(t)
    }
  }, [showHint])

  const switchPoem = useCallback(() => {
    if (fading) return
    setFading(true)
    setShowHint(false)
    setTimeout(() => {
      setIndex((prev) => getRandomIndex(prev, poems.length))
      setFading(false)
    }, 500)
  }, [fading])

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const next = prev.includes(poem.id)
        ? prev.filter((id) => id !== poem.id)
        : [...prev, poem.id]
      saveFavorites(next)
      return next
    })
  }, [poem.id])

  return (
    <div className="poem-page" onClick={switchPoem}>
      {/* ambient background glow */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <main className="poem-container">
        <div className={`poem-card ${fading ? 'fade-out' : 'fade-in'}`}>
          <div className="poem-dynasty">{poem.dynasty}</div>
          <h1 className="poem-content">{poem.content}</h1>
          <div className="poem-author">— {poem.author}</div>

          <button
            className={`favorite-btn ${isFavorited ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorited ? '取消收藏' : '收藏'}
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className={`hint ${showHint ? 'visible' : ''}`}>
          点击页面切换诗句
        </div>
      </main>

      <footer className="page-footer">
        {favorites.length > 0 && (
          <span className="fav-count">已收藏 {favorites.length} 首</span>
        )}
      </footer>
    </div>
  )
}

export default App
