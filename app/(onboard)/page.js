import Logo from "@/components/ui/Logo";
import StartContainer from "@/components/ui/StartContainer";

import LoginForm from "@/components/layout/onboard/LoginForm";

const OnboardPage = () => {
  return (
    <StartContainer>
      <div className="flex flex-col w-sm">
        <Logo size={50} />

        <LoginForm />
      </div>
    </StartContainer>
  );
};

export default OnboardPage;
