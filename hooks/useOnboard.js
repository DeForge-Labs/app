"use client";

import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

export default function useOnboard() {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/request/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsOTPWindow(true);
        setIsRequestingLogin(false);
        setIsSignUp(data.isSignup);
      } else {
        toast(data.message);
        setIsRequestingLogin(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  const verifyLogin = async (email, otp, setIsVerifying, embedded) => {
    try {
      setIsVerifying(true);

      if (otp.length !== 6) {
        toast("Please enter a valid OTP");
        setIsVerifying(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, code: otp }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful");

        if (!data.lastTeamId) {
          router.push("/team/create");
          return;
        }

        router.push(`/dashboard/${data.lastTeamId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const verifySignUp = async (
    email,
    otp,
    username,
    setIsVerifying,
    referralCode,
    embedded
  ) => {
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: otp, username, referralCode }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Sign up successful");

        if (!data.lastTeamId) {
          router.push("/team/create");
          return;
        }

        router.push(`/dashboard/${data.lastTeamId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async (email, setIsResending, setTimeout) => {
    try {
      setIsResending(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/request/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("OTP sent successfully");
        setTimeout(20);
      } else {
        toast.error(data.message);
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
