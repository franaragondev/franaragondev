"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const goldIcon = new L.Icon({
  iconUrl: "/marker-gold.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Map({ t }: { t: any }) {
  return (
    <MapContainer
      center={[36.4279, -5.1459]}
      zoom={20}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[36.4279, -5.1459]} icon={goldIcon}>
        <Popup>📍 {t("location")}</Popup>
      </Marker>
    </MapContainer>
  );
}
