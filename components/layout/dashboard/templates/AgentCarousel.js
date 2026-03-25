"use client";

import { motion } from "framer-motion";

export default function AgentCarousel() {
  const categories = [
    "AI Tutor",
    "Customer Support Agent",
    "Automated Job Finder",
    "Daily News Tweeter",
    "Meeting Scheduler Assistant",
    "Email Summarizer",
    "LinkedIn Content Poster",
    "Product Availability Checker",
    "Talk to your Database",
  ];

  return (
    <div
      className="w-full max-w-4xl overflow-hidden relative"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-4 pr-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: 50,
          repeat: Infinity,
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {categories.map((category, index) => (
              <div
                key={`${i}-${index}`}
                /* Removed backdrop-blur-sm and changed bg-white/50 to bg-white */
                className="px-6 py-2 rounded-sm text-sm bg-background border border-foreground/15 whitespace-nowrap"
              >
                {category}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
