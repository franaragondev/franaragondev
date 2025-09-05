"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

type JsonLdItem = { id: string; data: unknown };

export default function ConsentScripts({
  jsonLd = [],
  analyticsId,
}: {
  jsonLd?: JsonLdItem[];
  analyticsId?: string;
}) {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setAccepted(consent === "accepted");
  }, []);

  if (accepted === null) {
    return (
      <>
        {jsonLd.map((item) => (
          <Script
            key={item.id}
            id={item.id}
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item.data) }}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {jsonLd.map((item) => (
        <Script
          key={item.id}
          id={item.id}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item.data) }}
        />
      ))}

      {accepted && (
        <>
          <SpeedInsights />
          <Analytics />

          {analyticsId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${analyticsId}');
                `}
              </Script>
            </>
          )}
        </>
      )}
    </>
  );
}
