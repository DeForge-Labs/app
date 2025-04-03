"use client";

import { useState } from "react";
import { Button, Input, InputOtp } from "@heroui/react";
import { Mail, User } from "lucide-react";

export default function LoginForm() {
  const [isOTPWindow, setIsOTPWindow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  if (isOTPWindow) {
    return (
      <>
        {isSignUp && (
          <>
            <p className="mt-5 text-sm">What should we call you?</p>

            <Input
              type="text"
              placeholder="Enter your username"
              className="border border-black/40 rounded-xl mt-3 shadow-none"
              size="lg"
              variant="outline"
              startContent={<User className="text-black/40" />}
              isClearable
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </>
        )}

        <p className="mt-5 text-sm">We sent a code to {email}</p>

        <InputOtp
          className="rounded-xl mt-1 shadow-none text-black items-center"
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
        />

        <div className="mt-1 flex w-full gap-2">
          <Button className="w-full rounded-full p-7">Verify</Button>
          <Button
            className="w-full rounded-full p-7 border border-black/40 "
            variant="outline"
          >
            Resend
          </Button>
        </div>

        <div
          className="mt-3 ml-1 flex w-full text-black/60 hover:text-black/80 hover:underline cursor-pointer text-xs"
          onClick={() => setIsOTPWindow(false)}
        >
          Not you?
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className="mt-5 text-sm">Enter your email to access your account</p>

        <Input
          type="text"
          placeholder="Enter your email"
          className="border border-black/40 rounded-xl mt-3 shadow-none"
          size="lg"
          variant="outline"
          startContent={<Mail className="text-black/40" />}
          isClearable
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-3 flex w-full gap-2">
          <Button
            className="w-full rounded-full p-7"
            onPress={() => {
              setIsOTPWindow(true);
              setIsSignUp(false);
            }}
          >
            Login
          </Button>
          <Button
            className="w-full rounded-full p-7 border border-black/40 "
            variant="outline"
            onPress={() => {
              setIsSignUp(true);
              setIsOTPWindow(true);
            }}
          >
            Sign Up
          </Button>
        </div>
      </>
    );
  }
}
