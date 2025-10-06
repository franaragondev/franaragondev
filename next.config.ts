import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "homestocker.app",
      "www.cdesteponafans.com",
      "www.sportsteamtemplate.com",
      "businesstemplate.franaragondev.com",
      "restaurant-template.franaragondev.com",
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
