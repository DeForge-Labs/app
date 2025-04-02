"use client";

import React, { useEffect } from "react";
import { HeroUIProvider } from "@heroui/react";

const UiProvider = ({ children }) => {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default UiProvider;
