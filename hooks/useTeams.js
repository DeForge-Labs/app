import axios from "axios";

export default function useTeams() {
  const getTeams = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
      {},
      { headers }
    );

    return response.data.teams;
  };

  const createTeam = async (name) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/create`,
      { name },
      { headers }
    );

    return response.data;
  };

  const skipTeam = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
      {},
      { headers }
    );

    if (!response.data.success) {
      return false;
    }

    const teams = response.data.teams;

    if (teams.length === 0) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/create`,
        { name: "My Team" },
        { headers }
      );

      if (!response.data.success) {
        return false;
      }

      return response.data;
    }

    return teams[0];
  };

  return {
    getTeams,
    createTeam,
    skipTeam,
  };
}
