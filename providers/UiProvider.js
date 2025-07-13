"use client";

import React from "react";
import { HeroUIProvider } from "@heroui/react";

const UiProvider = ({ children }) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default UiProvider;
