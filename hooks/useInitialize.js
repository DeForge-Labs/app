import { setIsInitializing, setUser } from "@/redux/slice/UserSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

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

  return { loadUser };
}
