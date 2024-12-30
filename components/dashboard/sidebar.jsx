"use client";

import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const Sidebar = ({ onChangeContent }) => {
  const { isLoading, logout } = useKindeBrowserClient();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen w-64 bg-green-800 text-white flex-col justify-between">
      {/* Sidebar Content */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-center py-4 border-b border-green-700">Admin Panel</h2>
        <nav className="flex flex-col mt-4 space-y-2">
          <button
            className="px-4 py-2 rounded-xl hover:bg-green-700 text-left"
            onClick={() => onChangeContent("hero")}
          >
            Hero
          </button>
          <button
            className="px-4 py-2 rounded-xl hover:bg-green-700 text-left"
            onClick={() => onChangeContent("product")}
          >
            Product
          </button>
          <button
            className="px-4 py-2 rounded-xl hover:bg-green-700 text-left"
            onClick={() => onChangeContent("about")}
          >
            About
          </button>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-3 text-lg border-t border-green-700">
      <LogoutLink>
        <button className="px-6 py-3 w-full text-lg font-semibold bg-green-600 hover:bg-red-600 text-white rounded-xl shadow-md transition duration-300">
          Sign out
        </button>
        </LogoutLink>
      </div>
    </div>
  );
};

export default Sidebar;
