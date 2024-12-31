"use client";

import Sidebar from "@/components/dashboard/sidebar";

import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import HeroForm from "@/components/dashboard/HeroForm";
import ProductForm from "@/components/dashboard/ProductForm";
import AboutForm from "@/components/dashboard/AboutForm";

export default function Admin() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [activeContent, setActiveContent] = useState("hero"); // Default content is Hero

  if (isLoading) return <div>Loading...</div>;

  const renderContent = () => {
    switch (activeContent) {
      case "hero":
        return <HeroForm />;
      case "product":
        return <ProductForm />;
      case "about":
        return <AboutForm />;
      default:
        return <div>Select a content type from the sidebar</div>;
    }
  };

  return isAuthenticated ? (
    <div className="flex h-screen">
      <Sidebar onChangeContent={setActiveContent} />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{renderContent()}</main>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <div className="p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">Welcome to Admin Panel</h1>
        <p className="text-lg text-gray-700 mb-6">Please log in to manage your content</p>
        <LoginLink>
          <button className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition duration-300">
            Login
          </button>
        </LoginLink>
      </div>
    </div>
  );
}
