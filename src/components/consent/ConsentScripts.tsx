"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export default function ConsentScripts() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setAccepted(consent === "accepted");
  }, []);

  if (!accepted) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
