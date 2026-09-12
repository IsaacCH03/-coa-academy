/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/ide/:path*', headers: [
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
