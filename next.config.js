const allowedOrigins = (process.env.EMBED_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    if (allowedOrigins.length === 0) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${allowedOrigins.join(" ")};`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
