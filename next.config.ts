/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 🟢 ข้ามการตรวจ Type ตอน Build บน Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🟢 ข้ามการตรวจ Linting ตอน Build บน Vercel
    ignoreDuringBuilds: true,
  },
};