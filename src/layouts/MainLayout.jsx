import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  const handleVerify = (phone) => {
    console.log("Verified phone:", phone);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Right section: header + main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Fixed header */}
        <div className="sticky top-0 z-20">
          <Header />
        </div>

        {/* Scrollable main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
