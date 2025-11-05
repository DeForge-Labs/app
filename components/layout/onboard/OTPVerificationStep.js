"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import OTPInput from "./OTPInput";
import UsernameInput from "./UsernameInput";
import ReferralCodeInput from "./ReferralCodeInput";

export default function OTPVerificationStep({
  email,
  username,
  setUsername,
  otp,
  setOtp,
  referralCode,
  setReferralCode,
  timeout,
  isSignUp,
  onBack,
  onSubmit,
  onResend,
  isVerifying,
  isResending,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const truncatedEmail = email.length < 30 ? email : `${email.slice(0, 27)}...`;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col rounded-lg border mt-6 border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10"
    >
      {isSignUp && (
        <UsernameInput username={username} setUsername={setUsername} />
      )}

      <p className="mt-5 text-xs dark:text-foreground px-4">
        We sent a code to {truncatedEmail}
      </p>

      <OTPInput otp={otp} setOtp={setOtp} />

      <div className="mt-2 w-full px-4 text-black/60 text-xs dark:text-foreground">
        Check spam folder if you don't receive the code.
        <br />
        <span
          tabIndex={0}
          role="button"
          onClick={onBack}
          className="hover:underline cursor-pointer text-info"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onBack();
            }
          }}
        >
          Not you?
        </span>
      </div>

      {isSignUp && (
        <ReferralCodeInput
          referralCode={referralCode}
          setReferralCode={setReferralCode}
        />
      )}

      <div className="mt-4 flex w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onResend}
          disabled={isResending || isVerifying || timeout > 0}
          className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:border-white/10 border-l-0 border-b-0 rounded-br-none rounded-t-none text-destructive"
        >
          {timeout > 0 ? (
            `Resend in ${timeout}`
          ) : isResending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Resend"
          )}
        </Button>

        <Button
          type="submit"
          variant="outline"
          disabled={isVerifying || isResending}
          className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:border-white/10 border-x-0 border-b-0 rounded-bl-none rounded-t-none text-info"
        >
          {isVerifying ? <Loader2 className="animate-spin" /> : "Verify"}
        </Button>
      </div>
    </form>
  );
}
