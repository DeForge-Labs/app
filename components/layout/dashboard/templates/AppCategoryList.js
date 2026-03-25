// components/layout/dashboard/templates/DashboardCategoryList.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { generateCategorySlug } from "@/lib/utils";
import {
  LayoutGrid,
  Headset,
  Briefcase,
  Share2,
  Zap,
  PenTool,
  ShoppingCart,
  Megaphone,
  Wrench,
  Mic,
  Box,
  Code,
  ChevronDown,
} from "lucide-react";

const categoryList = [
  { label: "General", value: "General", icon: LayoutGrid },
  { label: "Customer Support", value: "Customer Support", icon: Headset },
  {
    label: "Career & Job Search",
    value: "Career & Job Search",
    icon: Briefcase,
  },
  {
    label: "Social Media Automation",
    value: "Social Media Automation",
    icon: Share2,
  },
  { label: "Productivity", value: "Productivity", icon: Zap },
  { label: "Content Creation", value: "Content Creation", icon: PenTool },
  { label: "Ecommerce", value: "Ecommerce", icon: ShoppingCart },
  {
    label: "Social Media & Marketing",
    value: "Social Media & Marketing",
    icon: Megaphone,
  },
  { label: "Utilities", value: "Utilities", icon: Wrench },
  {
    label: "Audio & Content Creation",
    value: "Audio & Content Creation",
    icon: Mic,
  },
  { label: "Misc", value: "Misc", icon: Box },
  { label: "Programming", value: "Programming", icon: Code },
];

export default function AppCategoryList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();

  const currentCategorySlug = params?.category
    ? decodeURIComponent(params.category)
    : "";

  const currentCategoryObj = categoryList.find(
    (c) => generateCategorySlug(c.value) === currentCategorySlug,
  );
  const currentCategory = currentCategoryObj ? currentCategoryObj.value : "";

  const initialCount = 3;
  const visibleCategories = isExpanded
    ? categoryList
    : categoryList.slice(0, initialCount);

  return (
    <div className="w-full max-w-4xl mt-4 flex flex-col items-center">
      <motion.div
        layout
        className="flex flex-wrap justify-center gap-2.5 w-full"
      >
        <AnimatePresence>
          {visibleCategories.map((cat, index) => (
            <Link
              key={cat.value}
              href={
                currentCategory === cat.value
                  ? `/templates`
                  : `/templates/categories/${generateCategorySlug(cat.value)}`
              }
            >
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-sm border text-sm transition-colors whitespace-nowrap ${
                  currentCategory === cat.value
                    ? "bg-foreground/90 text-background border-foreground"
                    : "bg-background border-foreground/15 hover:bg-foreground/5 hover:border-foreground/30"
                } ${!isExpanded && index === 2 ? "hidden md:flex" : ""} ${
                  !isExpanded && index === 1 ? "hidden sm:flex" : ""
                }`}
              >
                <cat.icon
                  className={`w-4 h-4 ${
                    currentCategory === cat.value
                      ? "text-background"
                      : "text-muted-foreground"
                  }`}
                />
                <span>{cat.label}</span>
              </motion.button>
            </Link>
          ))}
        </AnimatePresence>

        <motion.button
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-sm bg-background border border-foreground/15 text-sm hover:bg-foreground/5 hover:border-foreground/30 transition-colors whitespace-nowrap"
        >
          <span>{isExpanded ? "View Less" : "View More"}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
