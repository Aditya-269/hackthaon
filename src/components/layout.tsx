import React from "react";
import Header from "./Header"; // Ensure correct path
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <main className="mt-[70px] p-4"> 
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
