import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import type { User } from "../types/auth";

const currentUser: User = {
  id: "1",
  name: "Admin User",
  role: "ADMIN",
};

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
      <Sidebar isOpen={isOpen} role={currentUser.role} />

      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={() => setIsOpen((v) => !v)} />
        <main className=" flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
