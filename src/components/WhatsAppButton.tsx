"use client" // <--- MUST BE THE FIRST LINE

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "254675749001";
  const message = encodeURIComponent("Hello DAPC! I have a question about the plans.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}