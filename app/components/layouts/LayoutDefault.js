import { useRouter } from "next/router";
import { Header } from "../modules/header/Header";
import { Sidebar } from "../modules/sidebar/Sidebar";
import { Fragment } from "react";

export default function LayoutDefault({ children }) {
  const router = useRouter();
  const showHeader = router.pathname !== "/login";

  return (
    <div className="flex h-screen">
      {showHeader ? (
        <Fragment>
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary-100 p-10 h-screen relative">
              <div className="mx-auto p-2 text-primary">{children}</div>
            </main>
          </div>
        </Fragment>
      ) : (
        <Fragment>{children}</Fragment>
      )}
    </div>
  );
}
