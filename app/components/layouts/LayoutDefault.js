import { Header } from "../modules/header/Header";
import { Sidebar } from "../modules/sidebar/Sidebar";

export default function LayoutDefault({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary-100 p-10">
          <div className="mx-auto p-2 text-primary">{children}</div>
        </main>
      </div>
    </div>
  );
}