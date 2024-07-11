import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./Header";

const Layout = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <Header />
      {<Outlet />}
      <footer
        className="landing-footer"
        style={{ position: "fixed", bottom: "0" }}
      >
        <p>&copy; {year} Bespoke Video Platform. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
