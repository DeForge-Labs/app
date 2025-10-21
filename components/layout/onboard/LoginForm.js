"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Code, Loader2, User } from "lucide-react";
import useOnboard from "@/hooks/useOnboard";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/InputOTP";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function LoginForm({
  onLoadingChange = () => {},
  embedded = false,
}) {
  const [isOTPWindow, setIsOTPWindow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [otp, setOtp] = useState("");

  const [isRequestingLogin, setIsRequestingLogin] = useState(false);

  const [timeout, setTimeout] = useState(0);

  const { requestLogin, verifyLogin, verifySignUp, resend } = useOnboard();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Notify parent component of loading state changes
  useEffect(() => {
    const isLoading = isRequestingLogin || isVerifying || isResending;
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isRequestingLogin, isVerifying, isResending, onLoadingChange]);

  useEffect(() => {
    if (timeout > 0) {
      const interval = setInterval(() => {
        setTimeout((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeout]);

  if (isOTPWindow) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isSignUp) {
            verifySignUp(
              email,
              otp,
              username,
              setIsVerifying,
              referralCode,
              embedded
            );
          } else {
            verifyLogin(email, otp, setIsVerifying, embedded);
          }
        }}
      >
        {isSignUp && (
          <>
            <p className="mt-5 text-xs dark:text-foreground">
              What should we call you?
            </p>

            <Input
              type="text"
              placeholder="Enter your username"
              className="border border-black/40 py-1 rounded-sm mt-2 shadow-none dark:border-foreground dark:text-foreground"
              variant="outline"
              value={username}
              onChange={(e) => {
                if (e.target.value.length > 20) {
                  return;
                }
                setUsername(e.target.value);
              }}
            />
          </>
        )}

        <p className="mt-5 text-xs dark:text-foreground">
          We sent a code to{" "}
          {email.length < 30 ? email : email.slice(0, 27) + "..."}
        </p>

        <div className="mt-2 mb-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(e) => setOtp(e)}
          >
            <InputOTPGroup className="w-full">
              <InputOTPSlot
                index={0}
                className="h-14 border-black/40 bg-background rounded-l-sm dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1"
              />
              <InputOTPSlot
                index={1}
                className="h-14 border-black/40 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1"
              />
              <InputOTPSlot
                index={2}
                className="h-14 border-black/40 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1"
              />

              <InputOTPSlot
                index={3}
                className="h-14 border-black/40 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1"
              />
              <InputOTPSlot
                index={4}
                className="h-14 border-black/40 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1"
              />
              <InputOTPSlot
                index={5}
                className="h-14 border-black/40 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1 rounded-r-sm"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {isSignUp && (
          <>
            <p className="text-xs dark:text-foreground">
              Have a referral code?
            </p>

            <Input
              type="text"
              placeholder="Referral Code (Optional)"
              className="border border-black/40 py-1 mb-4 rounded-sm mt-2 shadow-none dark:border-foreground dark:text-foreground"
              variant="outline"
              value={referralCode}
              onChange={(e) => {
                if (e.target.value.length > 20) {
                  return;
                }
                setReferralCode(e.target.value);
              }}
            />
          </>
        )}

        <div className="mt-1 flex w-full gap-2">
          <Button
            className="h-11 flex-1 dark:bg-background dark:text-foreground border border-black/40 dark:border-foreground text-black rounded-sm text-xs"
            variant="outline"
            type="button"
            onClick={() => {
              resend(email, setIsResending, setTimeout);
            }}
            disabled={isResending || isVerifying || timeout > 0}
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
            className="h-11 flex-1 dark:bg-foreground dark:text-black bg-black/80 text-white rounded-sm text-xs"
            type="submit"
            disabled={isVerifying || isResending}
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>
        </div>

        <div
          className="mt-2 ml-1 flex w-full text-black/60 hover:text-black/80 hover:underline cursor-pointer text-xs dark:text-foreground"
          onClick={() => {
            if (isVerifying || isResending) return;

            setIsOTPWindow(false);
          }}
        >
          Not you?
        </div>
      </form>
    );
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestLogin(
            email,
            setIsOTPWindow,
            setIsRequestingLogin,
            setIsSignUp
          );
        }}
      >
        <p className="mt-5 text-xs dark:text-foreground">
          Enter your email to access your account
        </p>

        <Input
          type="text"
          placeholder="Enter your email"
          className="border border-black/40 py-1 rounded-sm mt-3 shadow-none dark:border-foreground dark:text-foreground"
          size="lg"
          variant="outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-3 flex w-full gap-2">
          <Button
            className="w-full h-11 dark:bg-foreground dark:text-black text-background bg-black/80"
            type="submit"
            disabled={isRequestingLogin}
          >
            {isRequestingLogin ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
        <p className="mt-3 text-xs dark:text-foreground">
          By pressing "Continue", you agree to our{" "}
          <a
            href="/ToS"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    );
  }
}
