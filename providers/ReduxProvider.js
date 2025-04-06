"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { useState, useEffect } from "react";

export const ReduxProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
