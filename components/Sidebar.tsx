"use client";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LuLayoutDashboard />, path: "/dashboard" },
  { label: "Income", icon: <BsGraphUpArrow />, path: "/income" },
  { label: "Expenses", icon: <BsGraphDownArrow />, path: "/expenses" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <>
      <div
        className={`fixed inset-0 lg:hidden z-30 transition-opacity duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "opacity-30" : "opacity-0"
          }`}
          onClick={closeSidebar}
          style={{ zIndex: 35 }}
        />
      </div>

      <div
        className={`fixed h-screen bg-white shadow-sm flex flex-col z-30 transition-all duration-300 ease-in-out top-0 pt-12
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          w-56 md:w-64 lg:w-56 lg:translate-x-0`}
      >
        <div className="flex flex-col items-center justify-center px-3 py-3">
          {session?.user?.image ? (
            <Image
              className="rounded-full border-2 border-[#8B1E3F]"
              src={session.user.image}
              width={80}
              height={80}
              alt="Avatar"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-3xl">
              {session?.user?.name ? session.user.name.charAt(0) : ""}
            </div>
          )}
          <h1 className="text-base mt-2 text-gray-900">
            {session?.user?.name?.split(" ")[0] ?? "Guest User"}
          </h1>
        </div>

        <div className="mt-4 flex-1">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li
                key={item.label}
                className={`p-5 cursor-pointer rounded-md flex items-center gap-5 transition-colors duration-200 text-sm tracking-tight ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  router.push(item.path);
                  closeSidebar()
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </li>
            ))}
            <li
              onClick={handleLogout}
              className="p-5 cursor-pointer flex items-center gap-5 hover:bg-gray-200 rounded-md transition-colors duration-200 text-gray-700 mt-6 text-sm tracking-tight"
            >
              <LuLogOut className="text-xl" />
              Logout
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
