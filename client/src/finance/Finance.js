import React from "react";
import Navbar from "./Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Finance = () => {

  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default Finance;