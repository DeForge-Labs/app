import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export default function useOnboard() {
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
        setIsSignUp(false);
      } else {
        toast(response.data.message);
        setIsRequestingLogin(false);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  const requestSignUp = async (
    email,
    setIsOTPWindow,
    setIsRequestingSignUp,
    setIsSignUp
  ) => {
    try {
      setIsRequestingSignUp(true);

      const emailSchema = z.string().email();
      const result = emailSchema.safeParse(email);

      if (!result.success) {
        toast("Please enter a valid email");
        setIsRequestingSignUp(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/request/signup`,
        { email }
      );
      if (response.data.success) {
        setIsOTPWindow(true);
        setIsRequestingSignUp(false);
        setIsSignUp(true);
      } else {
        toast.error(response.data.message);
        setIsRequestingSignUp(false);
      }
    } catch (error) {
      toast("Failed to send OTP");
      setIsRequestingSignUp(false);
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

        // TODO : redirect to dashboard

        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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

        // TODO : redirect to dashboard

        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    requestLogin,
    requestSignUp,
    verifyLogin,
    verifySignUp,
  };
}
