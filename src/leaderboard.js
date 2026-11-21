// Shared top-10 board on Supabase, via its REST API (no SDK needed for two calls).
// shortcut: scores are sent by the client, so a determined player can fake one; fine for a friends game, add server-side order replay if it goes public.
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_KEY

export const boardReady = Boolean(URL && KEY)

async function call(path, init = {}) {
  if (!boardReady) throw new Error('The leaderboard is not connected yet.')
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Leaderboard error (${res.status}). Try again in a moment.`)
  return res.status === 204 ? null : res.json()
}

export const getTop = () => call('scores?select=id,name,score,created_at&order=score.desc,created_at.asc&limit=10')

export const submitScore = (name, score) =>
  call('rpc/submit_score', { method: 'POST', body: JSON.stringify({ p_name: name, p_score: score }) })

// A score makes the board if there are fewer than 10 entries or it beats the 10th.
export const qualifies = (top, score) => score > 0 && (top.length < 10 || score > top[top.length - 1].score)
