import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pn_destacadas_likes'

function leerLikes() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch {}
  }
  return {}
}

export default function useLikes() {
  const [likes, setLikes] = useState(leerLikes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes))
  }, [likes])

  const getLikes = useCallback(
    (id, base = 0) => likes[id]?.count ?? base,
    [likes]
  )

  const isLikedByMe = useCallback((id) => Boolean(likes[id]?.likedByMe), [likes])

  const toggleLike = useCallback((id, base = 0) => {
    setLikes((prev) => {
      const actual = prev[id] ?? { count: base, likedByMe: false }
      const likedByMe = !actual.likedByMe
      const count = Math.max(0, actual.count + (likedByMe ? 1 : -1))
      return { ...prev, [id]: { count, likedByMe } }
    })
  }, [])

  return { getLikes, isLikedByMe, toggleLike }
}
