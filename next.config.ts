import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Разрешает доступ к dev-серверу с устройств в локальной сети.
  allowedDevOrigins: ["192.168.88.243"],
};

export default nextConfig;
