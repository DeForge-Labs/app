"use client";

import { Input } from "@/components/ui/input";

const MAX_REFERRAL_CODE_LENGTH = 20;

export default function ReferralCodeInput({ referralCode, setReferralCode }) {
  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_REFERRAL_CODE_LENGTH) {
      setReferralCode(value);
    }
  };

  return (
    <>
      <p className="text-xs dark:text-foreground px-4 mt-2">
        Have a referral code?
      </p>

      <Input
        type="text"
        variant="outline"
        value={referralCode}
        onChange={handleChange}
        maxLength={MAX_REFERRAL_CODE_LENGTH}
        placeholder="Referral Code (Optional)"
        className="border border-black/10 py-1 before:rounded-sm mt-2 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%] mx-auto rounded-sm"
      />
    </>
  );
}
