"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// Validation schemas
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters");
const emailSchema = z.string().email("Please enter a valid email");
const otpSchema = z.string().length(6, "Please enter a valid 6-digit OTP");

// API endpoints
const API_ENDPOINTS = {
  REQUEST_LOGIN: {
    url: `${process.env.NEXT_PUBLIC_API_URL}/request/login`,
    requiresCredentials: false,
  },
  VERIFY_LOGIN: {
    url: `${process.env.NEXT_PUBLIC_API_URL}/verify/login`,
    requiresCredentials: true,
  },
  VERIFY_SIGNUP: {
    url: `${process.env.NEXT_PUBLIC_API_URL}/verify/signup`,
    requiresCredentials: true,
  },
};

// Default navigation routes
const ROUTES = {
  DASHBOARD: "/dashboard",
  CREATE_TEAM: "/team/create",
};

export default function useOnboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Makes an API request with standardized error handling
   */
  const makeApiRequest = useCallback(
    async (endpointConfig, body, customOptions = {}) => {
      try {
        const url =
          typeof endpointConfig === "string"
            ? endpointConfig
            : endpointConfig.url;
        const requiresCredentials =
          typeof endpointConfig === "object" &&
          endpointConfig.requiresCredentials;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          ...(requiresCredentials && { credentials: "include" }),
          ...customOptions,
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    []
  );
  /**
   * Handles post-authentication navigation
   */
  const handlePostAuthNavigation = useCallback(
    (lastTeamId, embedded) => {
      const prompt = searchParams.get("prompt");
      const destination = lastTeamId ? ROUTES.DASHBOARD : ROUTES.CREATE_TEAM;
      if (embedded && lastTeamId) {
        router.refresh();
      } else {
        router.push(destination + (prompt ? `?prompt=${prompt}` : ""));
      }
    },
    [router, searchParams]
  );

  /**
   * Validates input with Zod schema
   */
  const validateInput = (schema, value, errorMessage) => {
    const result = schema.safeParse(value);

    if (!result.success) {
      const message = result.error.errors[0]?.message || errorMessage;
      toast.error(message);

      return false;
    }

    return true;
  };

  /**
   * Request login/signup OTP
   */
  const requestLogin = useCallback(
    async (email, setIsOTPWindow, setIsRequestingLogin, setIsSignUp) => {
      if (!validateInput(emailSchema, email, "Please enter a valid email")) {
        return;
      }

      setIsRequestingLogin(true);

      try {
        const data = await makeApiRequest(API_ENDPOINTS.REQUEST_LOGIN, {
          email,
        });

        if (data.success) {
          setIsOTPWindow(true);
          setIsSignUp(data.isSignup);

          toast.success("OTP sent successfully");
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsRequestingLogin(false);
      }
    },
    [makeApiRequest]
  );

  /**
   * Verify login OTP
   */
  const verifyLogin = useCallback(
    async (email, otp, setIsVerifying, embedded = false) => {
      if (!validateInput(otpSchema, otp, "Please enter a valid 6-digit OTP")) {
        return;
      }

      setIsVerifying(true);

      try {
        const data = await makeApiRequest(API_ENDPOINTS.VERIFY_LOGIN, {
          email,
          code: otp,
        });

        if (data.success) {
          toast.success("Login successful");

          handlePostAuthNavigation(data.lastTeamId, embedded);
        } else {
          toast.error(data.message || "Verification failed");
        }
      } catch (error) {
        toast.error("Failed to verify OTP. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [makeApiRequest, handlePostAuthNavigation]
  );

  /**
   * Verify signup OTP
   */
  const verifySignUp = useCallback(
    async (
      email,
      otp,
      username,
      setIsVerifying,
      referralCode = "",
      embedded = false
    ) => {
      // Validate username
      if (
        !validateInput(
          usernameSchema,
          username,
          "Please enter a valid username"
        )
      ) {
        return;
      }

      // Validate OTP
      if (!validateInput(otpSchema, otp, "Please enter a valid 6-digit OTP")) {
        return;
      }

      setIsVerifying(true);

      try {
        const data = await makeApiRequest(API_ENDPOINTS.VERIFY_SIGNUP, {
          email,
          code: otp,
          username,
          referralCode,
        });

        if (data.success) {
          toast.success("Sign up successful");
          handlePostAuthNavigation(data.lastTeamId, embedded);
        } else {
          toast.error(data.message || "Sign up failed");
        }
      } catch (error) {
        toast.error("Failed to verify OTP. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [makeApiRequest, handlePostAuthNavigation]
  );

  /**
   * Resend OTP
   */
  const resend = useCallback(
    async (email, setIsResending, setTimeout) => {
      setIsResending(true);

      try {
        const data = await makeApiRequest(API_ENDPOINTS.REQUEST_LOGIN, {
          email,
        });

        if (data.success) {
          toast.success("OTP sent successfully");
          setTimeout(20);
        } else {
          toast.error(data.message || "Failed to resend OTP");
        }
      } catch (error) {
        toast.error("Failed to resend OTP. Please try again.");
      } finally {
        setIsResending(false);
      }
    },
    [makeApiRequest]
  );

  return {
    requestLogin,
    verifyLogin,
    verifySignUp,
    resend,
  };
}
