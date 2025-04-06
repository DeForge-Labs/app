import UserProvider from "@/providers/UserProvider";

export default function Layout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
