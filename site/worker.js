// Freebuff Sites entry: serve the prebuilt static dashboard.
// Add /api/* handlers here when a real backend is introduced.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
}
