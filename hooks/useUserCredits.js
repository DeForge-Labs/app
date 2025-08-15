import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function useUserCredits() {
  const [credits, setCredits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCredits = useCallback(async (teamId) => {
    if (!teamId) {
      console.warn("Team ID is required to fetch credits");
      return;
    }

    try {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        { headers }
      );

      if (response.data.success) {
        setCredits(response.data.credits);
        return response.data.credits;
      } else {
        throw new Error(response.data.message || "Failed to fetch credits");
      }
    } catch (error) {
      console.error("Error fetching team credits:", error);
      toast.error("Failed to fetch team credits");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCredits = useCallback(async (teamId) => {
    const updatedCredits = await fetchUserCredits(teamId);
    if (updatedCredits !== null) {
      toast.success("Credits refreshed successfully");
    }
    return updatedCredits;
  }, [fetchUserCredits]);

  return {
    credits,
    isLoading,
    fetchUserCredits,
    refreshCredits,
  };
}
