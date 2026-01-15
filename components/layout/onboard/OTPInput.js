"use client";

import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/InputOTP";

import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function OTPInput({ otp, setOtp }) {
  const slotClassName =
    "h-11 border-black/10 bg-background dark:border-foreground dark:data-[active=true]:ring-foreground/40 flex-1";

  return (
    <div className="mt-2 px-4">
      <InputOTP
        value={otp}
        maxLength={6}
        onChange={setOtp}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup className="w-full">
          <InputOTPSlot index={0} className={`${slotClassName} rounded-l-sm`} />
          <InputOTPSlot index={1} className={slotClassName} />
          <InputOTPSlot index={2} className={slotClassName} />
          <InputOTPSlot index={3} className={slotClassName} />
          <InputOTPSlot index={4} className={slotClassName} />
          <InputOTPSlot index={5} className={`${slotClassName} rounded-r-sm`} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
