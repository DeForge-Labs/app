import UserTeamsProvider from "@/providers/UserTeamsProvider";

export default function TemplatesLayout({ children }) {
  return <UserTeamsProvider>{children}</UserTeamsProvider>;
}
