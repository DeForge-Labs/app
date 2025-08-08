import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function useTeamPlan() {
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeamPlan = useCallback(async (teamId) => {
    if (!teamId) {
      console.warn("Team ID is required to fetch plan");
      return;
    }

    try {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/team/plan/${teamId}`,
        { headers }
      );

      if (response.data.success) {
        setPlanData(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch plan");
      }
    } catch (error) {
      console.error("Error fetching team plan:", error);
      toast.error("Failed to fetch team plan");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlanCredits = () => {
    if (!planData) return "N/A";
    
    switch (planData.plan) {
      case "free":
        return "500";
      case "pro":
        return "10000";
      case "enterprise":
        return "Custom";
      default:
        return "N/A";
    }
  };

  const getPlanPrice = () => {
    if (!planData) return "N/A";
    
    switch (planData.plan) {
      case "free":
        return "$0";
      case "pro":
        return "$29";
      case "enterprise":
        return "Custom";
      default:
        return "N/A";
    }
  };

  const getPlanName = () => {
    if (!planData) return "Loading...";
    
    switch (planData.plan) {
      case "free":
        return "Free";
      case "pro":
        return "Pro";
      case "enterprise":
        return "Enterprise";
      default:
        return "Unknown";
    }
  };

  const getRenewalDate = () => {
    if (!planData) return "-";
    
    if (planData.plan === "free" || !planData.renewal) {
      return "-";
    }
    
    const renewalDate = new Date(planData.renewal);
    return renewalDate.toLocaleDateString();
  };

  return {
    planData,
    isLoading,
    fetchTeamPlan,
    getPlanCredits,
    getPlanPrice,
    getPlanName,
    getRenewalDate,
  };
}
