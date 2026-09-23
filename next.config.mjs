/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const globalSecurityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://challenges.cloudflare.com; worker-src 'self' blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net https://api.github.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com" },
    ]
    return [{ source: '/:path*', headers: globalSecurityHeaders }, { source: '/ide/:path*', headers: [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
    ] }, { source: '/ide/python-worker.js', headers: [
      { key: 'Content-Security-Policy', value: "default-src 'none'; script-src https://cdn.jsdelivr.net 'unsafe-eval'; connect-src https://cdn.jsdelivr.net" },
    ] }]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
