"use client";

import {
  setIsNodeRegistryInitializing,
  setNodeRegistry,
} from "@/redux/slice/librarySlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function useLibrary() {
  const dispatch = useDispatch();
  const router = useRouter();

  const loadNodeRegistry = async () => {
    try {
      dispatch(setIsNodeRegistryInitializing(true));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/node/list`
      );

      if (response.data.success) {
        dispatch(setNodeRegistry(response.data.nodes));
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error loading node registry:", error);
    } finally {
      dispatch(setIsNodeRegistryInitializing(false));
    }
  };

  return { loadNodeRegistry };
}
