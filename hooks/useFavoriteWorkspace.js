"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useFavoriteWorkspace() {
  const router = useRouter();
  const handleFavoriteWorkflow = async (workflowId, isFavorite) => {
    try {
      axios.defaults.withCredentials = true;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workspace/favorite/${workflowId}`,
        { isFavorite }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      router.refresh();

      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return {
    handleFavoriteWorkflow,
  };
}
