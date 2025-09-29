"use client";

import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function UsefulLinks() {
  return (
    <section className="text-center">
      <div className="flex justify-center gap-8 ml-2 -mt-4">
        {/* Facebook */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook de la Plantilla Restaurante"
          className="text-blue-600 hover:text-blue-800 text-3xl p-3"
        >
          <FaFacebook />
        </a>

        {/* Instagram */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de la Plantilla Restaurante"
          className="text-pink-600 hover:text-pink-800 text-3xl p-3"
        >
          <FaInstagram />
        </a>
      </div>
    </section>
  );
}
