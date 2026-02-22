"use client";

import { useEffect, useState } from "react";

import useOnboard from "@/hooks/useOnboard";

import EmailInputStep from "./EmailInputStep";
import OTPVerificationStep from "./OTPVerificationStep";

const LoginForm = ({ onLoadingChange = () => {}, embedded = false }) => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [timeout, setTimeout] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [isOTPWindow, setIsOTPWindow] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRequestingLogin, setIsRequestingLogin] = useState(false);

  const {
    requestLogin,
    verifyLogin,
    verifySignUp,
    resend,
    verifyOrgLogin,
    verifyOrgSignUp,
  } = useOnboard();

  // Notify parent component of loading state changes
  useEffect(() => {
    const isLoading = isRequestingLogin || isVerifying || isResending;
    onLoadingChange(isLoading);
  }, [isRequestingLogin, isVerifying, isResending, onLoadingChange]);

  // Handle countdown timer
  useEffect(() => {
    if (timeout > 0) {
      const interval = setInterval(() => {
        setTimeout((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeout]);

  const handleEmailSubmit = (emailValue) => {
    requestLogin(emailValue, setIsOTPWindow, setIsRequestingLogin, setIsSignUp);
  };

  const handleOTPSubmit = () => {
    if (isSignUp) {
      verifySignUp(
        email,
        otp,
        username,
        setIsVerifying,
        referralCode,
        embedded,
      );
    } else {
      verifyLogin(email, otp, setIsVerifying, embedded);
    }
  };

  const handlePasswordSubmit = () => {
    if (isSignUp) {
      verifyOrgSignUp(email, password, username, setIsVerifying, embedded);
    } else {
      verifyOrgLogin(email, password, setIsVerifying, embedded);
    }
  };

  const handleResend = () => {
    if (process.env.NEXT_PUBLIC_DEPLOYMENT_TYPE === "ORG") {
      handleBackToEmail();
      return;
    }

    resend(email, setIsResending, setTimeout);
  };

  const handleBackToEmail = () => {
    setIsOTPWindow(false);
  };

  if (isOTPWindow) {
    return (
      <OTPVerificationStep
        otp={otp}
        setOtp={setOtp}
        email={email}
        password={password}
        setPassword={setPassword}
        isSignUp={isSignUp}
        username={username}
        setUsername={setUsername}
        referralCode={referralCode}
        setReferralCode={setReferralCode}
        timeout={timeout}
        isVerifying={isVerifying}
        isResending={isResending}
        onResend={handleResend}
        onSubmit={handleOTPSubmit}
        onBack={handleBackToEmail}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  return (
    <EmailInputStep
      email={email}
      setEmail={setEmail}
      onSubmit={handleEmailSubmit}
      isRequestingLogin={isRequestingLogin}
    />
  );
};

export default LoginForm;
