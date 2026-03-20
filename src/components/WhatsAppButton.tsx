"use client"

import { FaWhatsapp } from "react-icons/fa"; // Run 'npm install react-icons' if you haven't

export default function WhatsAppButton() {
  const phoneNumber = "254675749001"; // Using the account number from your flyer
  const message = encodeURIComponent("Hello DAPC! I'm on the Visibility Tracker and I have a question about the subscription plans.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
      {/* Tooltip that shows on hover */}
      <span className="absolute right-16 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
        Need help? Chat with us!
      </span>
    </a>
  );
}