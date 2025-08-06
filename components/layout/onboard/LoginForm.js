"use client";

import { useEffect, useState } from "react";
import { Button, Input, InputOtp } from "@heroui/react";
import { Loader2, Mail, User } from "lucide-react";
import useOnboard from "@/hooks/useOnboard";

export default function LoginForm({
  onLoadingChange = () => {},
  embedded = false,
}) {
  const [isOTPWindow, setIsOTPWindow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
            verifySignUp(email, otp, username, setIsVerifying, embedded);
          } else {
            verifyLogin(email, otp, setIsVerifying, embedded);
          }
        }}
      >
        {isSignUp && (
          <>
            <p className="mt-5 text-sm dark:text-background">
              What should we call you?
            </p>

            <Input
              type="text"
              placeholder="Enter your username"
              className="border border-black/40 rounded-xl mt-3 shadow-none dark:border-background dark:text-background"
              size="lg"
              variant="outline"
              startContent={
                <User className="text-black/40 dark:text-background" />
              }
              isClearable
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onClear={() => setUsername("")}
            />
          </>
        )}

        <p className="mt-5 text-sm dark:text-background">
          We sent a code to {email}
        </p>

        <InputOtp
          className="rounded-xl mt-1 shadow-none text-black items-center dark:text-background"
          size="lg"
          variant="bordered"
          length={"6"}
          color="black"
          errorMessage="Enter a valid code"
          fullWidth
          classNames={{
            segmentWrapper: "gap-x-3",
            segment: [
              "relative",
              "h-10",
              "w-10",
              "border-y",
              "border-l",
              "border-r",
              "border-default-200",
              "data-[active=true]:border",
              "data-[active=true]:border-black",
              "data-[active=true]:z-20",
              "data-[active=true]:ring-2",
              "data-[active=true]:ring-offset-2",
              "data-[active=true]:ring-offset-background",
              "data-[active=true]:ring-foreground",
              "data-[active=true]:ring-black/40",
            ],
          }}
          radius="lg"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="mt-1 flex w-full gap-2">
          <Button
            className="w-full rounded-full p-7 dark:bg-background dark:text-black bg-black/80 text-background"
            type="submit"
            isDisabled={isVerifying || isResending}
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>
          <Button
            className="w-full rounded-full p-7 border border-black/40 dark:border-background dark:text-background"
            variant="outline"
            type="button"
            onPress={() => {
              resend(email, setIsResending, setTimeout);
            }}
            isDisabled={isResending || isVerifying || timeout > 0}
          >
            {timeout > 0 ? (
              `Resend in ${timeout}`
            ) : isResending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Resend"
            )}
          </Button>
        </div>

        <div
          className="mt-3 ml-1 flex w-full text-black/60 hover:text-black/80 hover:underline cursor-pointer text-xs dark:text-background"
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
        <p className="mt-5 text-sm dark:text-background">
          Enter your email to access your account
        </p>

        <Input
          type="text"
          placeholder="Enter your email"
          className="border border-black/40 rounded-xl mt-3 shadow-none dark:border-background dark:text-background"
          size="lg"
          variant="outline"
          startContent={<Mail className="text-black/40 dark:text-background" />}
          isClearable
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClear={() => setEmail("")}
        />

        <div className="mt-3 flex w-full gap-2">
          <Button
            className="w-full rounded-full p-7 dark:bg-background dark:text-black bg-black/80 text-background"
            type="submit"
            isDisabled={isRequestingLogin}
          >
            {isRequestingLogin ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
        <p className="mt-5 text-sm dark:text-background">
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
