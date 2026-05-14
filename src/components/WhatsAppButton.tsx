// src/components/WhatsAppButton.tsx
"use client";

import { useState, useEffect } from "react";

interface WhatsAppButtonProps {
  phoneNumber: string; // WhatsApp number with country code (e.g., "254722973020")
  position?: "left" | "right";
  bottomOffset?: number; // in pixels
  message?: string; // Pre-filled message for the user
  showTooltip?: boolean;
  tooltipText?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  position = "right",
  bottomOffset = 20,
  message = "Hello! I need assistance with your services.",
  showTooltip = true,
  tooltipText = "Need help? Chat with us on WhatsApp",
}: WhatsAppButtonProps) {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Format the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  // Handle button visibility on scroll (optional)
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine position classes
  const positionClass = position === "right" ? "right-6" : "left-6";

  return (
    <>
      {isVisible && (
        <div
          className={`fixed ${positionClass} z-50 transition-all duration-300 hover:scale-105 group`}
          style={{ bottom: `${bottomOffset}px` }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {/* Tooltip */}
          {showTooltip && show && (
            <div
              className={`absolute ${position === "right" ? "right-full mr-3" : "left-full ml-3"} bottom-1/2 translate-y-1/2 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none transition-all duration-200`}
            >
              {tooltipText}
              <div
                className={`absolute ${position === "right" ? "right-0 translate-x-full" : "left-0 -translate-x-full"} top-1/2 -translate-y-1/2 border-8 border-transparent ${position === "right" ? "border-l-gray-800" : "border-r-gray-800"}`}
              ></div>
            </div>
          )}

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200"
            style={{
              width: "60px",
              height: "60px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            aria-label="Chat on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12c0 1.89.47 3.66 1.28 5.23L2 22l4.77-1.28A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.71 0-3.34-.46-4.77-1.28l-3.23.86.86-3.23A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M16.64 13.77c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.44.1-.13.2-.51.65-.63.78-.12.13-.24.15-.44.05-1.12-.48-1.86-.86-2.6-1.78-.17-.21-.1-.33.08-.44.2-.13.3-.22.44-.37.1-.13.05-.24-.03-.34-.08-.1-.69-1.66-.94-2.28-.12-.3-.24-.26-.33-.27-.09-.01-.19-.01-.29-.01s-.27.04-.41.2-.54.53-.54 1.29.55 1.5.63 1.6c.08.1 1.09 1.66 2.63 2.33.37.16.65.26.87.33.37.12.7.1.97.06.3-.04.95-.39 1.08-.77.13-.38.13-.71.09-.78-.04-.07-.15-.11-.35-.21z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}