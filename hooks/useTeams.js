import axios from "axios";

export default function useTeams() {
  const getTeams = async () => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
      {}
    );

    return response.data.teams;
  };

  const createTeam = async (name) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/create`,
      { name }
    );

    return response.data;
  };

  const skipTeam = async () => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
      {}
    );

    if (!response.data.success) {
      return false;
    }

    const teams = response.data.teams;

    if (teams.length === 0) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/create`,
        { name: "My Team" }
      );

      if (!response.data.success) {
        return false;
      }

      return response.data;
    }

    return teams[0];
  };

  const joinTeam = async (invitationCode) => {
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/join/${invitationCode}`,
      {}
    );

    return response.data;
  };

  return {
    getTeams,
    createTeam,
    skipTeam,
    joinTeam,
  };
}
