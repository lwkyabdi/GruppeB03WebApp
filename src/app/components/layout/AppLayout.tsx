import { requestInfo } from "rwsdk/worker";
import { Header } from "./Header";

export function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header user={requestInfo.ctx.user ?? null} />
      {children}
    </>
  );
}