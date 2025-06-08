import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import useTeams from "./useTeams";
import { useRouter } from "next/navigation";

export default function useOnboard() {
  const { getTeams } = useTeams();
  const router = useRouter();

  const requestLogin = async (
    email,
    setIsOTPWindow,
    setIsRequestingLogin,
    setIsSignUp
  ) => {
    try {
      setIsRequestingLogin(true);

      const emailSchema = z.string().email();
      const result = emailSchema.safeParse(email);

      if (!result.success) {
        toast("Please enter a valid email");
        setIsRequestingLogin(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/request/login`,
        { email }
      );
      if (response.data.success) {
        setIsOTPWindow(true);
        setIsRequestingLogin(false);
        setIsSignUp(response.data.isSignup);
      } else {
        toast(response.data.message);
        setIsRequestingLogin(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  const verifyLogin = async (email, otp, setIsVerifying) => {
    try {
      setIsVerifying(true);

      if (otp.length !== 6) {
        toast("Please enter a valid OTP");
        setIsVerifying(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/login`,
        { email, code: otp }
      );
      if (response.data.success) {
        toast.success("Login successful");

        localStorage.setItem("token", response.data.token);

        try {
          const teams = await getTeams();
          if (teams.length === 0) {
            router.push("/team/create");
          } else {
            router.push("/team");
          }
        } catch (error) {
          toast.error("Failed to get teams");
          router.push("/team");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const verifySignUp = async (email, otp, username, setIsVerifying) => {
    try {
      setIsVerifying(true);

      const usernameSchema = z.string().min(3).max(20);
      const result = usernameSchema.safeParse(username);

      if (!result.success) {
        toast("Please enter a valid username");
        setIsVerifying(false);
        return;
      }

      if (otp.length !== 6) {
        toast("Please enter a valid OTP");
        setIsVerifying(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/signup`,
        { email, code: otp, username }
      );
      if (response.data.success) {
        toast.success("Sign up successful");

        localStorage.setItem("token", response.data.token);

        router.push("/team/create");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async (email, setIsResending, isSignUp, setTimeout) => {
    try {
      setIsResending(true);

      if (isSignUp) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/request/signup`,
          { email }
        );
        if (response.data.success) {
          toast.success("OTP sent successfully");
          setTimeout(20);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/request/login`,
          { email }
        );
        if (response.data.success) {
          toast.success("OTP sent successfully");
          setTimeout(20);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsResending(false);
    }
  };

  return {
    requestLogin,

    verifyLogin,
    verifySignUp,
    resend,
  };
}
