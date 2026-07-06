import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaFacebookMessenger, FaYoutube } from 'react-icons/fa';

const FloatingContact = () => {
  return (
    <div className="fixed left-0 top-1/3 -translate-y-1/2 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20your%20herbal%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 md:w-20 h-12 rounded-l rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative group"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={26} />
        {/* Tooltip */}
        <span className="absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow">
          WhatsApp Us
        </span>
      </a>

      {/* Phone Call Button */}
      <a
        href="tel:+919876543210"
        className="w-12 md:w-20 h-12 rounded-l rounded-lg bg-[#0084FF] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative group"
        aria-label="Call Us"
      >
        <FaPhoneAlt size={22} />
        {/* Tooltip */}
        <span className="absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow">
          Call Us
        </span>
      </a>

      <a
        href="https://www.youtube.com/@admin_thamizhoviyaa"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 md:w-20 h-12 rounded-l rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative group"
        aria-label="Explore Youtube"
      >
        <FaYoutube size={26} />
        {/* Tooltip */}
        <span className="absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow">
          Youtube
        </span>
      </a>
    </div>
  );
};

export default FloatingContact;
