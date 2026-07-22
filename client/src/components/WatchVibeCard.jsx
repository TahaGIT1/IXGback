// WatchVibeCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import highlightVideo from "../assets/hero-highlight.mp4";

export default function WatchVibeCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex h-full w-full flex-col items-center justify-items-center gap-4 rounded-[20px] border border-gray-100 bg-gradient-to-br from-orange-50 via-white to-white p-8 text-center shadow-sm shadow-gray-200/50 transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-100"
      >
       <motion.span
  whileHover={{
    scale: 1.1,
    rotate: 5,
  }}
  whileTap={{
    scale: 0.9,
  }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 15,
  }}
  className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/40"
>
  <motion.svg
    className="ml-0.5 h-8 w-8"
    fill="currentColor"
    viewBox="0 0 24 24"
    whileTap={{
      scale: 1.2,
    }}
    transition={{
      type: "spring",
      stiffness: 500,
      damping: 12,
    }}
  >
    <path d="M8 5v14l11-7z" />
  </motion.svg>
</motion.span>

        <div>
          <p className="text-base font-bold text-gray-900 sm:text-lg">
            Watch our last run video
          </p>
          <p className="mt-1 text-sm text-gray-500">
            See what a Sunday morning with IXG Run Club feels like.
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close video"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <video
                src={highlightVideo}
                controls
                autoPlay
                className="aspect-video w-full bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}