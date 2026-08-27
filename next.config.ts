import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 1. ป้องกัน Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 2. ป้องกัน MIME-sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 3. ควบคุมการส่ง Referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 4. ปิดการเข้าถึงเซนเซอร์/ฮาร์ดแวร์ที่ไม่จำเป็น
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // 5. Content Security Policy (CSP) สำหรับ Next.js + Supabase
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://obhvuxvtsfihdelqjzmo.supabase.co https://*.supabase.co https://images.unsplash.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://obhvuxvtsfihdelqjzmo.supabase.co https://*.supabase.co wss://*.supabase.co https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;