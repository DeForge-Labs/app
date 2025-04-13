import { setIsTeamInitializing, setTeam } from "@/redux/slice/TeamSlice";
import { setIsInitializing, setUser } from "@/redux/slice/UserSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function useInitialize() {
  const dispatch = useDispatch();
  const router = useRouter();

  const loadUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/get`,
        {},
        { headers }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    } finally {
      dispatch(setIsInitializing(false));
    }
  };

  const loadTeam = async (teamId) => {
    try {
      dispatch(setIsTeamInitializing(true));
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/team/get/${teamId}`,
        { headers }
      );

      if (response.data.success) {
        dispatch(setTeam(response.data.team));
      } else {
        toast.error(response.data.message);
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    } finally {
      dispatch(setIsTeamInitializing(false));
    }
  };

  return { loadUser, loadTeam };
}
