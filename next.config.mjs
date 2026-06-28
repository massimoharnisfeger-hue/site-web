import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Photos de démo
      { protocol: "https", hostname: "images.unsplash.com" },
      // Images uploadées dans Payload et stockées sur Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

// withPayload branche le back-office Payload sur Next.js
export default withPayload(nextConfig);
