import TemplateNavbar from "@/components/layout/template/TemplateNavbar";
import UserTeamsProvider from "@/providers/UserTeamsProvider";

export default function TemplatesLayout({ children }) {
  return (
    <UserTeamsProvider>
      <TemplateNavbar />
      {children}
    </UserTeamsProvider>
  );
}
